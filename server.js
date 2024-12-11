const mongoose = require("mongoose")
const next = require("next");
const dotenv = require("dotenv");

const dev = process.env.NODE_ENV != "production";
const nextServer = next({dev});
const handle = nextServer.getRequestHandler();

dotenv.config({path:"./config.env"});
const app = require("./app");



mongoose.connect(process.env.DATABASE,{
    useNewUrlParser:true,
    useCreateIndex:true,
    useFindAndModify:false,

}).then(()=>console.log("DB connecton successful"));


const port = 5000;

let server;
nextServer.prepare().then(()=>{
    app.get("*",(req,res)=>{
        return handle(req,res);
    });

    app.listen(port,()=>{
        console.log(`App running on the port ${port}...`);
    })
})