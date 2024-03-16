const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const cors = require('cors');
const { userJoin, getUsers, setMessage, getroommessage } = require("./utils/user");

const app = express();

app.use(cors()); 
const httpServer = createServer(app);
const isDev = app.settings.env === 'development'
const URL = isDev ? 'http://localhost:3000' : 'https://wrote-us.vercel.app'
const io = new Server(httpServer, { 
    cors:{
        origin:URL,
        methods:["GET","POST"],
        credentials:true
    }
}); 

let roomid;
io.on("connection", (socket) => {
    console.log("server connected");
    
    socket.emit('yourUniqueIdEvent',roomid);

    socket.on('beginPath', ({ x, y, room }) => {
      socket.broadcast.to(room).emit('beginPath', { x, y });
    });
    
    socket.on('drawPath', ({ x, y, room }) => {
      socket.broadcast.to(room).emit('drawPath', { x, y });
    });
  
    socket.on('changeConfig', (arg) => {
      socket.broadcast.to(roomid).emit('changeConfig',arg)
    });

    socket.on('changeactiveitem', (arg) => {
      socket.broadcast.to(roomid).emit('changeactiveitem', arg)
    });

    socket.on('changeactionitem', (arg) => {
      socket.broadcast.to(roomid).emit('changeactionitem', arg)
    });
     
    socket.on('pointer',({room}) => {
     console.log("entering");
     console.log(room);
     socket.broadcast.to(room).emit('pointer', {})
    });

    socket.on('roomMessage',(data)=>{
       const {roomId,text,userName,timestamp,user}=data;
       const message=setMessage(roomId,text,userName,user,timestamp);
       console.log(message);
       const roommessages=getroommessage(roomId);
       console.log(roommessages);
       io.to(roomId).emit("chats", roommessages);
    });

      socket.on("joinroom", (data) => {
        try {

          if (!data || typeof data !== 'object') {
            throw new Error('Invalid data structure received');
          }
      
          const { roomId, userId , userName, host} = data;
          const user = userJoin(userId, userName, roomId, host);
          const roomUsers = getUsers(user.room);

          if (!roomId || !userId) {
            throw new Error('Missing roomId or userId in data');
          }
          
          console.log('Received joinroom data:', data);
          console.log('User joined room:', roomId);
          roomid=roomId;
          socket.join(roomId);
          console.log(roomUsers);
          socket.to(user.room).emit('userJoined', {userId: userId, userName:userName});
          io.to(user.room).emit("users", roomUsers);
            
        } 

        catch (error) {
          console.error('Error handling joinroom event:', error.message);
        }

      });
});

app.get('/', (req, res) => {
    res.send('hello world')
});
httpServer.listen(4000, () => {
    console.log("server is running at port 4000");
});