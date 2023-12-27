const Router = require("express").Router;
const axios = require('axios')
const {Op} = require('sequelize')
const Downloader = require("nodejs-file-downloader");
const {version,users} = require('./models/index').models
const md5File = require('md5-file')
var fs = require('fs');

let router = Router();
const server = `http://${process.env.HOST}:${process.env.PORT}`
const author = process.env.AUTHOR;
const repository = process.env.REPOSITORY;
const token = process.env.TOKEN;

const $axios = axios.create({
    headers:{
        Authorization:`Bearer ${token}`
    }
})

let update_version =async ()=>{
    let response = (await $axios.get(`https://api.github.com/repos/${author}/${repository}/releases`)).data
    let current = (await $axios.get(`https://api.github.com/repos/${author}/${repository}/releases/latest`)).data
    let regex = /v[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+-(stable|alfa|beta)/;
    let list = []
    response.forEach(async (item)=>{
        if(regex.test(item.tag_name)){
            list.push(item.tag_name.split('-')[0])
            let update = await version.findOne({where:{version:item.tag_name.split('-')[0]}});
            if(update == null){
                await version.create({
                    name:item.name,
                    version:item.tag_name.split('-')[0],
                    type:item.tag_name.split('-')[1],
                    description:item.body,
                    url:item.zipball_url,
                    last:current.tag_name == item.tag_name,
                })
            }else{
                await version.update({
                    name:item.name,
                    version:item.tag_name.split('-')[0],
                    type:item.tag_name.split('-')[1],
                    description:item.body,
                    url:item.zipball_url,
                    last:current.tag_name == item.tag_name,
                },{where:{id:update.id}})
            }
        }
    });
    let result = await version.findAll({where:{version: {[Op.notIn]:list}}})
    result.forEach(async item=>await version.destroy({where:{id:item.id}}))
    result = await version.findAll({where:{type:'stable'}})
    fs.rmSync('./downloads', { recursive: true, force: true });
    result.forEach(async item=>{
        const downloader = new Downloader({
            url: item.url,
            directory: `./downloads/${item.version+'-'+item.type}`,
            headers: {
                "User-Agent": "MyBestApi",
                "Authorization": `Bearer ${token}`
            },
            cloneFiles: false,
        });
        try {
            const {filePath,downloadStatus} = await downloader.download();
            var obj = {
                version:item.version,
                type:item.type,
                file:filePath.split('/').pop(),
                hash:await md5File(filePath),
            };
            var json = JSON.stringify(obj);
            fs.writeFile(`./downloads/${item.version+'-'+item.type}/info.json`, json, 'utf8', ()=>{});
            console.log(`Загружен файл ${filePath} ${downloadStatus}`);
        } catch (error) {
            console.log("Ошибка при загрузке", error);
        }
    })
}

router.get('/version/commands/',async (req,res)=>{
    res.json({
        start:process.env.COMMAND_BEFORE_START,
        end:process.env.COMMAND_AFTER_END
    });
})

router.get('/version/list',async (req,res)=>{
    let result = await version.findAll({where:{type:"stable"}});
    result = result.map(item => {
        item.dataValues.author = author
        item.dataValues.repository = repository
        item.dataValues.server = server
        return item;
    });
    res.json(result)
})

router.get('/version/update',async (req,res)=>{
    try{
        await update_version()
        res.json({message:"Успешно обновлено"})
    }catch (ex){
        res.json(ex)
    }
})

router.get('/version/current',async (req,res)=>{
    let result = await version.findOne({where:{last:true}});
    result.dataValues.author = author
    result.dataValues.repository = repository
    result.dataValues.server = server
    res.json(result)
})

router.get('/version/:version',async (req,res)=>{
    try{
        let result = await version.findOne({where:{version:req.params.version}});
        if(result != null){
            result.dataValues.author = author
            result.dataValues.repository = repository
            result.dataValues.server = server
            res.json(result)
        }else{
            res.json({message:"Версия отсутствует"})
        }
    }catch{
        res.json({message:"Версия отсутствует"})
    }
})

router.get('/version/compare/:version1/:version2',async (req,res)=>{
    try{
        let regex = /v[0-9]+\.[0-9]+\.[0-9]+\.[0-9]/;
        if(!(regex.test(req.params.version1) && regex.test(req.params.version2))) return res.json({message:"Версия отсутствует"})
        if(req.params.version1>req.params.version2) return res.json({message:"Первая версия не может быть больше второй"})
        let result = (await $axios .get(`https://api.github.com/repos/${author}/${repository}/compare/${req.params.version1}-stable...${req.params.version2}-stable`)).data
        let list = []
        result.files.forEach(item=>{
            list.push({
                filename:'/'+item.filename,
                status:item.status,
                contents_url:item.contents_url,
            })
        })
        res.json(list)


    }catch{
        res.json({message:"Версия отсутствует"})
    }
})

router.get('/check',async (req,res)=>{
    res.json({status:1});
})

router.get('/user/list',async (req,res)=>{
    res.json(await users.findAll({}));
})

router.post('/user/data',async (req,res)=>{
    const {ram,processor,manufacturer,description,video_card,video_processor,video_ram,driver_version,hard_drive,size} = req.body;
    await users.create({ram,processor,manufacturer,description,video_card,video_processor,video_ram,driver_version,hard_drive,size});
    res.json({message:"Успешно"});
})

module.exports = router;