var socket = io.connect('/');
var users = [];
var chatInfos = [];
$(function(){
  var mainObj = $('body');
  var showUsersObj = $('#showUsers');
  var user = null;
  var chatInfo = null;

  //获得焦点
  $('#userName').focus();
  //login
  $('.setUser').click(function(){
    var nameVal = $('#userName').val();
    if(!nameVal){
      alert('昵称不能为空！！！');
    }else{
      dataObj = {
        name:nameVal
      };
      socket.emit('login',dataObj);
      $('.loginForm').hide();
      $('.fade').hide();
      $('.userName').val('');
      $('#chatMsg').focus();
    }
  });
  //发送信息
  $('#sendMsg').click(function(){
    var chatMsgVal = $('#chatMsg').val();
    if(!chatMsgVal){
      alert('内容不能为空！！！');
    }else{
      var userId = $('.chatForm').attr('id');
      var msgObj = {
        userId: user.id,
        receiveUserId: userId,
        name: user.name,
        msg: chatMsgVal,
        time: getTime()
      };
      if($('.chatForm').attr('id') == 'all'){
        socket.emit('sendMessage', msgObj);
      }else{
        if(_.findWhere(users,{id:userId})){
          socket.emit('sendToOne', msgObj);
        }else{
          alert('该用户已下线，无法向其发送消息');
        }
      }
      $('#chatMsg').val('');
    }
  });
  //登录成功
  socket.on('user', function(data){
    user = data;
    //监听其他用户发送给自己的信息
    socket.on(user.id, function(msgObj){
      chageChatInfo(msgObj.userId, msgObj);
    });
  });
  //监听所有用户数
  socket.on('users', function(data){
    users = data;
    var showUsersHtml = '';
    _.each(users,function(user){
      showUsersHtml += '<div class="showUsers" onclick="changeChatPerson(\''+user.id+'\')">' + user.name + '</div>';
    });
    showUsersObj.html(showUsersHtml);
  });
  //群聊
  socket.on('sendMessage', function(msgObj){
    chageChatInfo('all', msgObj);
  });
  //私聊
  socket.on('sendToOne', function(msgObj){
    chageChatInfo(msgObj.receiveUserId, msgObj);
  });

  function chageChatInfo(userId, msgObj){
    chatInfo = chatInfos[userId] ? chatInfos[userId] : '';
    chatInfo += '<div><span class="chatUser">' + msgObj.name + '@' + msgObj.time + ' : </span><span class="chatMessage">' + msgObj.msg + '</span></div>';
    chatInfos[userId] = chatInfo;
    if(userId == msgObj.receiveUserId || $('.chatForm').attr('id') == userId){
      $('#chatInformation').html(chatInfo);
    }
  }

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

function changeChatPerson(userId){
  var chatUser = _.findWhere(users,{id:userId});
  var chatNameInfo = userId == 'all' ? '' : 'talk to ';
  chatNameInfo += chatUser.name;
  $('#chatName').html(chatNameInfo);
  $('.chatForm').attr('id',chatUser.id);
  $('#chatInformation').html(chatInfos[chatUser.id] || '');
  $('#chatMsg').focus();
}

function keywordsMsg(e){
  var event1 = e || window.event;
  if(event1.keyCode == 13){
    $('#sendMsg').click();
  }
}

function keywordsUserName(e){
  var event1 = e || window.event;
  if(event1.keyCode == 13){
    $('.setUser').click();
  }
}