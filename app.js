var express = require('express');
var app = express();
var path = require('path');
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var _ = require('underscore');

var users = [{
  id: 'all',
  name: '群聊'
}];

app.set('view engine', 'jade');
app.set('views', path.join(__dirname, 'views'));

app.use('/js/', express.static(path.join(__dirname, 'static/javascripts')));
app.use('/css/', express.static(path.join(__dirname, 'static/styleSheets')));
app.use('/img/', express.static(path.join(__dirname, 'static/images')));

app.get('/', function(req,res){
  res.render('chat', {title:'聊天室'});
});

io.on('connection', function(socket){
  socket.on('login', function(data){
    data.id = socket.id;
    user = data;
    users.push(user);
    socket.emit('user', user);
    io.emit('users', users);
  });
  socket.on('sendMessage', function(data){
    io.emit('sendMessage', data);
  });
  socket.on('sendToOne', function(data){
    socket.emit('sendToOne', data);
    if(data.userId != data.receiveUserId){
      io.emit(data.receiveUserId, data);
    }
  });
  socket.on('disconnect', function(){
    var user = _.findWhere(users,{id:socket.id});
    if(user){
      users = _.without(users,user);
      socket.emit('users', users);
    }
  });
});

server.listen(3000);