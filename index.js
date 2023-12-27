require("dotenv").config()
const express = require("express")
const router = require("./router")
const errorMiddleWare = require('./error-middleware')
const {sequelize} = require('./models/index')
let PORT = process.env.PORT || 5000

let app = express()

app.use(express.static(__dirname + '/downloads'));
app.use(express.json())
app.use("/api", router)
app.use(errorMiddleWare)

let start = async () => {
    try{
        await sequelize.authenticate()
        app.listen(PORT, () => console.log(`Запуск на ${PORT}`))
    }catch(e){
        console.log(e)
    }
}
start()