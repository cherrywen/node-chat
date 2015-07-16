var socket = io.connect('/');
var users = [];
var chatInfos = [];
$(function(){
  mainObj = $('body');
  var showUsersObj = $('#showUsers');
  var user = null;

  //login
  $('.setUser').click(function(){
    var nameVal = $('#userName').val();

    if(!nameVal){
      alert('昵称不能为空！！!');
    }else{
      dataObj = {
        name:nameVal
      };
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

  socket.on('user', function(data){
    user = data;
    socket.on(user.id, function(msgObj){
      var chatInfo = chatInfos[msgObj.userId] ? chatInfos[msgObj.userId] : '';
      chatInfo += '<div><span class="chatUser">' + msgObj.name + '@' + msgObj.time + ' : </span><span class="chatMessage">' + msgObj.msg + '</span></div>';
      chatInfos[msgObj.userId] = chatInfo;
      if($('.chatForm').attr('id') == msgObj.userId){
        $('#chatInformation').html('').append(chatInfo);
      }
    });
  });

  socket.on('users', function(data){
    users = data;
    var showUsersHtml = '';
    _.each(users,function(user){
      showUsersHtml += '<div class="showUsers" onclick="changeChatPerson(\''+user.id+'\')">' + user.name + '</div>';
    });
    showUsersObj.html('').append(showUsersHtml);
  });
  socket.on('sendMessage', function(msgObj){
    var chatInfo = chatInfos['all'] ? chatInfos['all'] : '';
    chatInfo += '<div><span class="chatUser">' + msgObj.name + '@' + msgObj.time + ' : </span><span class="chatMessage">' + msgObj.msg + '</span></div>';
    chatInfos['all'] = chatInfo;
    $('#chatInformation').html('').append(chatInfo);
  });
  socket.on('sendToOne', function(msgObj){
    var chatInfo = chatInfos[msgObj.receiveUserId] ? chatInfos[msgObj.receiveUserId] : '';
    chatInfo += '<div><span class="chatUser">' + msgObj.name + '@' + msgObj.time + ' : </span><span class="chatMessage">' + msgObj.msg + '</span></div>';
    chatInfos[msgObj.receiveUserId] = chatInfo;
    $('#chatInformation').html('').append(chatInfo);
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

function changeChatPerson(userId){
  var chatUser = _.findWhere(users,{id:userId});
  var chatNameInfo = userId == 'all' ? '' : 'talk to ';
  chatNameInfo += chatUser.name;
  $('#chatName').html(chatNameInfo);
  $('.chatForm').attr('id',chatUser.id);
  $('#chatInformation').html('').append(chatInfos[chatUser.id]);
}