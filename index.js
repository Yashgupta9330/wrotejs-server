const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const cors = require('cors');

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
    socket.on("beginPath", ({ x, y , room}) => {
      console.log("beginPath - room:", room);
      io.to(room).emit("beginPath", { x, y });
    });
  
    socket.on("drawPath", ({ x, y,room}) => {
      console.log("drawLine - room:", room);
      io.to(room).emit("drawPath", { x, y });
    });
  
      socket.on('changeConfig', (arg) => {
        io.to(roomid).emit('changeConfig',arg)
      });

      socket.on('changeactiveitem', (arg) => {
        io.to(roomid).emit('changeactiveitem', arg)
      });

      socket.on('changeactionitem', (arg) => {
        io.to(roomid).emit('changeactionitem', arg)
      });

      socket.on("joinroom", (data) => {
        try {
          if (!data || typeof data !== 'object') {
            throw new Error('Invalid data structure received');
          }
      
          const { roomId, userId } = data;
      
          if (!roomId || !userId) {
            throw new Error('Missing roomId or userId in data');
          }
      
          console.log('Received joinroom data:', data);
          console.log('User joined room:', roomId);
          roomid=roomId;
          socket.join(roomId);
          io.to(roomId).emit('userJoined', { userId: userId });
        } catch (error) {
          console.error('Error handling joinroom event:', error.message);
        }
      })
});

app.get('/', (req, res) => {
    res.send('hello world')
});
httpServer.listen(4000, () => {
    console.log("server is running at port 4000");
});