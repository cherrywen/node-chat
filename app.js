var express = require('express');
var app = express();
var path = require('path');
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var _ = require('underscore');

var users = [];

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
    console.log(data);
    io.emit('sendMessage',data);
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


// express = require 'express'
// app = express()
// timeout = require 'connect-timeout'
// bodyParser = require 'body-parser'
// multer = require 'multer'
// _ = require 'underscore'
// mongoose = require 'mongoose'
// session = require 'express-session'
// cookieParser = require 'cookie-parser'
// path = require 'path'
// littleUtil = require 'little-util'
// littleUtil.requireModules [],true

// mongoose.connect 'mongodb://koala:47017/test'

// app.set 'view engine', 'jade'
// app.set 'views', path.join(__dirname, 'views')

// app.use bodyParser.json()
// app.use bodyParser.urlencoded({ extended: true })
// app.use multer({dest:'./uploads/'})
// app.use session {secret: 'littleframework', key: 'littleframework', cookie: {maxAge: 1000*60*30}}
// app.use cookieParser()
// app.use '/js/', express.static require('path').join(__dirname, 'static/javascripts')
// app.use '/css/', express.static require('path').join(__dirname, 'static/stylesheets')
// app.use '/img/', express.static require('path').join(__dirname, 'static/images')

// routers = require './routers'

// initRouters = (routers)->
//     routers.forEach (routeInfo)->
//         _.defaults routeInfo,{middleware: [],type: 'get'}
//         if routeInfo.timeout
//             routeInfo.middleware.push timeout routeInfo.timeout
//         app[routeInfo.type] routeInfo.url,routeInfo.middleware,routeInfo.handler
// initRouters routers

// app.listen 3100