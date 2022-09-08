const express = require('express')
const app = express()
const http = require('http')
const port = process.env.PORT || 3000
const httpserver = http.createServer(app)



const {arbTrade} =require("./bots-scripts/arbitrageBot")
//const {txMonitor}=require("./txMonitor")


console.log(`${port } running`)
  
arbTrade()


try{
  httpserver.listen(port)
}catch(e){
    console.log(e.message)
}

