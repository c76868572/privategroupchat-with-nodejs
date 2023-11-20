const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

var userinfo = {};

app.get('/', (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  console.log('User connecting: ',ip);
  res.sendFile(__dirname + '/index.html');
});

app.get('/user-uploads/:file?', (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  console.log('User Trying to get the file from /USER-UPLOAD by: ',ip,'Filename:',req.params.file);
  if(!req.params.file || req.params.file === undefined || req.params.file === ""){
    res.json({status: 400, message: "Invalid param"});
  }else{
    try {
      res.sendFile(__dirname + '/user-upload/' + req.params.file);
    } catch (err) {
      res.json({status: 400, message: "ERR: Cannot read the file", error: err});
    }
  }
});
app.get('/download/:file?', (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  console.log('User Trying to get the file from /PATH by: ',ip,'Filename:',req.params.file);
  if(!req.params.file || req.params.file === undefined || req.params.file === ""){
    res.json({status: 400, message: "Invalid param"});
  }else{
    try {
      res.sendFile(__dirname + '/path/' + req.params.file);
    } catch (err) {
      res.json({status: 400, message: "ERR: Cannot read the file", error: err});
    }
  }
});

app.get('/api/jquery.min.js', (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  console.log('User connecting: ',ip)
  res.sendFile(__dirname + '/api/jquery.min.js');
});

// Require the upload middleware
const upload = require('./upload');

// Set up a route for file uploads
app.post('/api/upload', upload.single('file'), (req, res) => {
  // Handle the uploaded file
  res.json({ message: 'File uploaded successfully!' });
});

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.emit('setuserid', `${socket.id}`);
  const userid = socket.id;
  source = {
    [userid]: {
      nickname: userid,
      socketid: userid
    }
  }
  Object.assign(userinfo, source)
  socket.on('setcustomnickname', (nickname) => {
    console.log(`api set customname to: ${nickname}\nby: ${socket.id}`);
    let nk = nickname;
    if(nickname=="") {nk="Unknown"};
    userinfo[userid].nickname = nk;
  });
  socket.on('letupdate', () => {
    console.log('letupdate by',socket.id);
    io.emit('letupdate');
  });
  socket.on('getuserid', () => {
    console.log('api getuserid: ');
    socket.emit('setuserid', `${socket.id}`);
  });
  socket.on('chat message', (msg) => {
    console.log('message: ' + msg);
    io.emit('chat message', {msg: `${msg}`, userinfo: userinfo[userid]});
  });
  socket.on('hello', () => {
    console.log(`${socket.id} Saying Hello!`);
    io.emit('Hello!', userinfo[userid]);
  });
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(80, () => {
  console.log('listening on *:80');
});