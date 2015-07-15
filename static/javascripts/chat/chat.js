$(function(){
  //login
  var socket = io.connect('/');
  var showUsersObj = $('#showUsers');
  var users = [];
  var user = null;
  $('.setUser').click(function(){
    var nameVal = $('#userName').val();

    if(!nameVal){
      // $('#username').val('');
      alert('昵称不能为空！！!');
    }else{
      dataObj = {
        name:nameVal
      };
      //send user info to server
      socket.emit('login',dataObj);
      $('.loginForm').hide();
      $('.fade').hide();
      $('.userName').val('');
    }
  });

  $('#sendMsg').click(function(){
    var chatMsgVal = $('#chatMsg').val();
    if(!chatMsgVal){
      alert('内容不能为空！！！');
    }else{
      var msgObj = {
        name: user.name,
        msg: chatMsgVal,
        time: getTime()
      };
      socket.emit('sendMessage',msgObj);
      $('#chatMsg').val('');
    }
  });

  socket.on('user', function(data){
    user = data;
  });

  socket.on('users', function(data){
    users = data;
    var showUsersHtml = '';
    _.each(users,function(user){
      showUsersHtml += '<div class="showUsers">' + user.name + '</div>';
    });
    showUsersObj.html('').append(showUsersHtml);
  });
  socket.on('sendMessage', function(msgObj){
    var chatInfo = '<div><span class="chatUser">' + msgObj.name + '@' + msgObj.time + ' : </span><span class="chatMessage">' + msgObj.msg + '</span></div>';
    $('#chatInformation').append(chatInfo);
  });

  function getTime(){
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
    var day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    var hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
    var minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
    var seconds = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
    return year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;
  }
});