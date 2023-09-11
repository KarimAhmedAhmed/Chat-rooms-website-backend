// const http = require('http');
// const socketio = require('socket.io');
// const express = require('express');
// const app = express();
// const server = http.createServer(app);
// const io = socketio(server);
const Token = require('../models/Token');
const { addUser, removeUser, getUser, getUsersInRoom } = require('./users');
const mysocket =  (io) => {
    var chat_room
    var message_user
    io.on('connection', (socket) => {
        // console.log("User had joined");
        socket.on('join', async ({ token, room }, callback) => {
          console.log('joinnnnnnnnnnnnnnnnnnn')
          const tokenUser  = await Token.findOne({token: token}).select("user").populate('user').exec();
          
          if(!tokenUser){
            return callback('error');
          }
          const user = tokenUser.user
          message_user = user
          console.log(`user ${user.displayName} chatting in ${room}`);
          chat_room = room
         
          socket.join(room);
      
          socket.emit('message', { user: 'admin', text: `welcome to room: ${room} ` });
          socket.broadcast.to(room).emit('message', { user: 'admin', text: `${user.displayName} has joined!` });
      
          // io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });
      
          callback();
        });
      
        socket.on('sendMessage', (message, callback) => {
          // const user = getUser(socket.id);
          console.log(message.message)
          io.to(chat_room).emit('message', { user: message.username, text: message.message });
          if(callback){
            callback();
          }
          
        });
        socket.on('disconnect', () => {
      
          console.log("User had left");
        })
      });

}



module.exports = mysocket;