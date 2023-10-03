const express = require('express')
const app = express()
const http = require("http")
require("dotenv").config();
const cors = require("cors")
const dbConfig=require('./config/dbConfig')
app.use(express.json())
const { Server } = require('socket.io');
app.use(cors());
const user_route =require('./routes/user_route')
const admin_route = require('./routes/admin_route');
const { upload } = require('./config/multer');
const messageController = require("./controller/messageController")
app.use('/api/user',user_route)
app.use('/api/admin',admin_route)
app.use('/upload',express.static("./uploads"))   
const server = http.createServer(app)

const io = new Server(server,{
    cors:{
        origin:"http://localhost:3000",
        methods:["GET","POST"]
    }
}) 

io.on("connection", (socket) =>{
 console.log(`User Connected:${socket.id}`)

 socket.on("join_room",(data)=>{
   
    socket.join(data)
    console.log(`User with ID:${socket.id} joined room:${data}`);
    console.log(socket.rooms)
 })

 socket.on("send_message",async(data)=>{
   
    console.log(data)

    socket.to(data.room).emit("receive_message",data.message);
    console.log(data.room);
    await messageController.saveChat(data)
  
 })
socket.on("disconnect",() =>{   
    console.log("User Disconnected",socket.id);
})

})



const port =process.env.PORT || 5000
server.listen(port,()=>{console.log(`server started on port: ${port}`);}) 