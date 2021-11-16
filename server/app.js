require('dotenv').config();
const express = require('express');

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server, {
  cors: {
    origin: '*'
  }
});
const PORT = process.env.PORT || 5000;

app.use(express.json());

// db imitating
const chatData = {
  currentRoomId: null,
  currentUserName: null,
  rooms: []
};

app.get('/rooms/:id', (req, res) => {

  res.json({data: chatData.rooms});
});

app.post('/rooms', (req, res) => {
  const { roomId, userName } = req.body;

  chatData.currentRoomId = roomId;
  chatData.currentUserName = userName;
  const roomIndex = chatData.rooms.findIndex((room) => room.roomId === roomId);

  if(roomIndex === -1) {
    chatData.rooms.push({
      roomId,
      users: [{userName, id: null}],
      messages: [],
    })
  } else {
    chatData.rooms[roomIndex].users.push({userName });
  }

  res.send();
});

io.on('connection', (socket) => {
  socket.on('ROOM:JOIN', ({ roomId, userName }) => {
    socket.join(roomId);
    const roomIndex = chatData.rooms.findIndex((room) => room.roomId === roomId);
    const userIndex = chatData.rooms[roomIndex].users.findIndex(user => user.userName === userName);
    
    chatData.currentRoomId = roomId;
    chatData.currentUserName = userName;
    
    if( userIndex !== -1) {
      chatData.rooms[roomIndex].users[userIndex].id = socket.id;
    } else {
      chatData.rooms[roomIndex].users.push({ userName, id: socket.id})
    }
    
    const users = chatData.rooms[roomIndex].users;
    console.log(users);
    socket.to(roomId).emit('ROOM:SET_USERS', { users, roomId });
  });

  socket.on('ROOM:NEW_MESSAGE', ({ roomId, userName, text }) => {
    const obj = {
      userName,
      text,
      date: new Date()
    };
    const roomIndex = chatData.rooms.findIndex((room) => room.roomId === roomId);
    chatData.rooms[roomIndex].messages.push(obj);
    socket.to(roomId).emit('ROOM:NEW_MESSAGE', obj);
  });

  socket.on('disconnect', () => {
    const roomIndex = chatData.rooms.findIndex((room) => room.roomId === chatData.currentRoomId);
    chatData.rooms[roomIndex].users = chatData.rooms[roomIndex].users.filter(user => user.id !== socket.id);
    const users = chatData.rooms[roomIndex].users;
    socket.to(chatData.currentRoomId).emit('ROOM:SET_USERS', users);
    console.log('user disconnected', socket.id);
  });

  console.log('user connected', socket.id);
});

server.listen(PORT, (err) => {
  if (err) {
    throw Error(err);
  }
  console.log(`server started at PORT: ${PORT}`);
});
