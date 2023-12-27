const ApiError = require('./error')

module.exports = function (err,req,res,next){
    console.log(err)
    if(err instanceof ApiError){
        return res.status(err.status).json({message:err.message,errors:err.errors})
    }
    if(err instanceof SyntaxError){
        return res.status(400).json({message:'Неверное тело запроса'})
    }
    return res.status(500).json({message:"Ошибка"})
}