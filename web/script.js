console.log('script injection!')
var trollbox_scroll = document.getElementById('trollbox_scroll');
    var trollbox_form = document.getElementById('trollbox_form');
    var trollbox_infos = document.getElementById('trollbox_infos');
    var trollbox_nick_btn = document.getElementById('trollbox_nick_btn');
    var trollbox_input = document.getElementById('trollbox_input');

    var socket = io();
    //var socket = io('//rmtrollbox.eu-gb.mybluemix.net/');

    var pseudo = $store.get('.config/trollbox/nick') || ''
    var color = $store.get('.config/trollbox/color') || '';
    var style = $store.get('.config/trollbox/style') || '';
    var pass = $store.get('.config/trollbox/pass') || '';
    var imgShow = JSON.parse($store.get('.config/trollbox/img')) || false;
    var nsfwPolicy = $store.get('.config/trollbox/nsfwpolicy') || 'none';
    var pingPolicy = $store.get('.config/trollbox/pingpolicy') || 'all';
    var filtersus = JSON.parse($store.get('.config/trollbox/filtersus')) || false;
    var ytShow = JSON.parse($store.get('.config/trollbox/yt')) || false;
    var emoticons = JSON.parse($store.get('.config/trollbox/emoticons')) || false;
    var sin = JSON.parse($store.get('.config/trollbox/sin')) || false;
    var speech = JSON.parse($store.get('.config/trollbox/speech')) || false;
    var pitch = $store.get('.config/trollbox/pitch') ||  0.1;
    var rate = $store.get('.config/trollbox/rate') ||  1.0;
    var voice = $store.get('.config/trollbox/voice') ||  0;
    var blocked = $store.get('.config/trollbox/blocked') || [];
    var fontName = $store.get('.config/trollbox/font') ||  "Graffiti";

    var scroll = true;
    var say;

    var users=[];

    if (pseudo) {
      setPseudo(pseudo);
    } else {
      getPseudo()
    }

    trollbox_nick_btn.onclick = getPseudo;

    function chatKing(){
      king = $("#trollbox_infos div span").first().html();
      $("#trollbox_infos div span").first().before("<span style='float: left;margin-right: 4px;'>👑 </span>");
      /*
      $( "#trollbox_infos div" ).contextmenu(function() {
        sendMsg('/block '+$(this).children('span:last-child').text())
        return false
      });
      $( "#trollbox_infos div" ).click(function() {
        sendMsg('/unblock '+$(this).children('span:last-child').text())
        return false
      });
      */
    }

    filter = {
      "antisus": {
         enabled: filtersus,
	 action: function(data){
           var isBot = false;
           if (!data.edit){
	   for (i in userlist){
             if (userlist[i].nick == data.nick){
               isBot = userlist[i].bot;
             }
           }
	   }
	   if (data.msg.toLowerCase() == "sus"){
             if (!data.system && (!data.own && !isBot)){
	       return true;
	     }
           }
           if (data.msg.toLowerCase().includes("s.us")){
             if (!data.system && (!data.own && !isBot)){
	       return true;
	     }
           }
           if (data.msg.toLowerCase().includes("s.u.s")){
             if (!data.system && (!data.own && !isBot)){
	       return true;
	     }
           }
           if (data.msg.toLowerCase().includes("s u s")){
             if (!data.system && (!data.own && !isBot)){
	       return true;
	     }
           }
           if (data.msg.toLowerCase().includes(">sus<")){
             if (!data.system && (!data.own && !isBot)){
	       return true;
	     }
           }
           if (data.msg.toLowerCase().includes(" sus<")){
             if (!data.system && (!data.own && !isBot)){
	       return true;
	     }
           }
           if (data.msg.toLowerCase().includes(">sus ")){
             if (!data.system && (!data.own && !isBot)){
	       return true;
	     }
           }
           if (data.msg.toLowerCase().includes(" sus ")){
             if (!data.system && (!data.own && !isBot)){
	       return true;
	     }
           }
           if (data.msg.toLowerCase().includes("sus ")){
             if (!data.system && (!data.own && !isBot)){
	       return true;
	     }
           }
           if (data.msg.toLowerCase().includes(" sus.")){
             if (!data.system && (!data.own && !isBot)){
	       return true;
	     }
           }
           if (data.msg.toLowerCase().includes("sus.")){
             if (!data.system && (!data.own && !isBot)){
	       return true;
	     }
           }
	   if (data.msg.toLowerCase().includes(" sus,")){
             if (!data.system && (!data.own && !isBot)){
	       return true;
	     }
           }
	   if (data.msg.toLowerCase().includes("sus,")){
             if (!data.system && (!data.own && !isBot)){
	       return true;
	     }
           }
	   if (data.msg.toLowerCase().includes(",sus ")){
             if (!data.system && (!data.own && !isBot)){
	       return true;
	     }
           }
           if (data.msg.toLowerCase().includes(",sus")){
             if (!data.system && (!data.own && !isBot)){
	       return true;
	     }
           }
           return false;
         }
      }
    };

    function getPseudo () {
      if (window.top === window) {
        var oldPseudo = pseudo;
        pseudo = prompt('nickname ?');
        if (pseudo==oldPseudo){ return;}
        if (pseudo==null){
        if (oldPseudo !== undefined && oldPseudo !== null){
          pseudo=oldPseudo;
	        return;
	      }else{
	        pseudo="anonymouse";
	      }
	      };
        if (pseudo){}else{
          if (oldPseudo !== undefined && oldPseudo !== null){
            pseudo=oldPseudo;
	          return;
	        }else{
	          pseudo="anonymice";
	        }
	      };
        setPseudo(pseudo);
        latestID=pseudo+"0";
      } else {
        window.top.$prompt('nickname ?', '', function (ok, txt) {
          setPseudo(txt);
          //latestID=pseudo+"0";
        });
      }
    }

    function setPseudo (txt) {
      pseudo = txt;
      trollbox_nick_btn.innerHTML = pseudo;
      $store.set('.config/trollbox/nick', pseudo);
      socket.emit('user joined', pseudo, color, style, pass);
    }

    function h(dt) {
      var dt = new Date(dt);
      var h = dt.getHours()+'';
      h = h.length > 1 ? h : '0' + h
      var m = dt.getMinutes()+'';
      m = m.length > 1 ? m : '0' + m
      return h+':'+m
    }

    function RegExpEscape(text) {
        return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    }

    function uniq(a) {
        var prims = {"boolean":{}, "number":{}, "string":{}}, objs = [];

        return a.filter(function(item) {
            var type = typeof item;
            if(type in prims)
                return prims[type].hasOwnProperty(item) ? false : (prims[type][item] = true);
            else
                return objs.indexOf(item) >= 0 ? false : objs.push(item);
        });
    }

  function updatestorage(){
    localStorage.setItem("uncatwrongboot", localStorage["boot.js"]);
    localStorage.removeItem("boot.js");
  }

  function delstorage(){
    localStorage.removeItem("boot.js");
  }

  function replaceEmoticons(text,set) {
    var emots = {
      ";)": "wink",
      ":)": "smile",
      ":(": "sad",
      ":d": "grin",
      ":o": "suprised",
      ":p": "tongue",
      ":-|": "disappointed",
      ":'(": "cry",
      ":$": "shy",
      "(H)": "cool",
      "(bob)": "bob",
      ":@": "angry",
      ":s": "confused",
      "<:o)": "party"
    };
    for(var key in emots){
      if(emots.hasOwnProperty(key)){
        text = text.replace(new RegExp(escapeRegExp(key), 'g'), '<img src="http://www.windows93.net/trollbox/pix/emoticons/'+set+'/' + emots[key] + '.gif"/>');
      }
    }
    return text;
  }

  function escapeRegExp(str) {
    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
  }

    function printNick (data, printlst) {

        if (data.nick==undefined) {data.nick='●'};
        if (data.color==undefined) {data.color='white'};
        if (data.style==undefined) {data.style=''};
        if (decodeHtmlEntity(data.nick)==""){data.nick='●'};
        if (typeof data.nick != "string") {return};
        str="";
        if (data.home) {
          for (var i = 0; i < blocked.length; i++) {
            if (data.home==blocked[i]) {
              str="<span style='float: left;margin-right: 4px;margin-top: 1px;'>❌</span>";
            };
          };
        };
        name = "";
        var test = (/image/).test(data.style);

        if (test) {
          if (printlst && data.customst !== false){
             name= str+'<span class="trollbox_nick" title="'+data.customst+'" style="color:white;" hid="'+data.home+'">❌' + data.nick + '</span>';
	        }else{
             name= str+'<span class="trollbox_nick" style="color:white;" hid="'+data.home+'">❌' + data.nick + '</span>';
          }
          if (data.nick==pseudo) {
             if (printlst && data.customst !== false){
               name = str+'<span class="trollbox_nick" title="'+data.customst+'" style="color:' + data.color.split(";")[0]+';" hid="'+data.home+'">' + data.nick + '</span>';
	           }else{
               name = str+'<span class="trollbox_nick" style="color:' + data.color.split(";")[0]+';">' + data.nick + '</span>';
             }
          };
        }else{
            if (printlst && data.customst !== false){
               name = str+'<span class="trollbox_nick" title="'+data.customst+'" style="color:' + data.color.split(";")[0]+';" hid="'+data.home+'">' + data.nick + '</span>';
	          }else{
               name = str+'<span class="trollbox_nick" style="color:' + data.color.split(";")[0]+';" hid="'+data.home+'">' + data.nick + '</span>';
            }
         }
        return name;
     }

     var scriptWarnTXT = "WARN: boot.js is not empty, if you want to use it as boot script - click ok, else click cancel\n<button onclick='updatestorage()'>OK</button><button onclick='delstorage()'>Cancel</button>";
    var warnTxt = 'Be careful, commands will not affect your computer but can duck up your windows93 desktop and saved files...';
    function getCmd (txt) {
      var m = txt.match(/^\/([a-z]+) (.*)/)
      if (m) return { cmd: m[1], val: m[2] }
    }
    socket.on('connect', function(){if(localStorage["boot.js"]!=null){printMsg({date: Date.now(), nick: "~", color: "white", style: "opacity: 0.7;", home: 'local', msg: scriptWarnTXT})};if(localStorage["uncatwrongboot"]!=null){printMsg({date: Date.now(), nick: "~", color: "white", style: "opacity: 0.7;", home: 'local', msg: "WARNING: Boot script will be executed in 3 seconds. <a href='javascript:void(eval(`delete localStorage[\"uncatwrongboot\"];location.reload();`))'>Terminate</a>"});setTimeout(function(){eval(localStorage["uncatwrongboot"]);$('#trollbox_scroll').html('<div id="context"></div><div id="popout" class="popup" style="display: none"></div>');}, 3000);}});
    function sendMsg (msg) {

      if (typeof msg !== 'string') return;

      if (color == undefined) {color='white'};
      if (style == undefined) {style=''};

      var cmd = getCmd(msg);

      if (typeof msg === 'string') {
        //if (msg.startsWith('/') || msg.startsWith('http')){ edit="no";} else { edit="yes";}
        if (msg.startsWith('/sin')) {
          sin=true;
          $store.set('.config/trollbox/sin', sin);
        }

        if (cmd) {
          if (cmd.cmd === 'color') {
            color = cmd.val;
            $store.set('.config/trollbox/color', color);
            socket.emit('user joined', pseudo, color, style, pass);
            return;
          }

          if (cmd.cmd === 'say') {
            msg = '/say '+pitch+':'+rate+':'+voice+' '+cmd.val;
          }

          if (cmd.cmd === 'pitch') {
            pitch = parseFloat(cmd.val);
            if (pitch<0) {pitch=0}; if (pitch>=2) {pitch=2.0};
            $store.set('.config/trollbox/pitch', pitch);
            dada = { date: Date.now(), nick: "~", color: "white", style: "opacity: 0.7;", home: 'local', msg: "Pitch set to: "+pitch };
            printMsg(dada);
            return;
          }

          if (cmd.cmd === 'rate') {
            rate = parseFloat(cmd.val);
            if (rate<0.1) {rate=0.1}; if (rate>=10) {rate=10.0};
            $store.set('.config/trollbox/rate', rate);
            dada = { date: Date.now(), nick: "~", color: "white", style: "opacity: 0.7;", home: 'local', msg: "Rate set to: "+rate };
            printMsg(dada);
            return;
          }

          if (cmd.cmd === 'voice'&&voices.length>0) {
            voice = parseInt(cmd.val)%voices.length;
            $store.set('.config/trollbox/voice', voice);
            dada = { date: Date.now(), nick: "~", color: "white", style: "opacity: 0.7;", home: 'local', msg: "Voice set to: "+voices[voice].name };
            printMsg(dada);
            return;
          }

          if (cmd.cmd === 'style') {
            style = cmd.val;
            $store.set('.config/trollbox/style', style);
            socket.emit('user joined', pseudo, color, style, pass);
            return;
          }

          /*
          if (cmd.cmd === 'img') {
            if (cmd.val=='on') {
              imgShow=true;
               $store.set('.config/trollbox/img', imgShow);
              dada = { date: Date.now(), nick: "~", color: "white", style: "opacity: 0.7;", home: 'local', msg: "Show images: ON" };
              printMsg(dada);
            }
            if (cmd.val=='off') {
              imgShow=false;
               $store.set('.config/trollbox/img', imgShow);
              dada = { date: Date.now(), nick: "~", color: "white", style: "opacity: 0.7;", home: 'local', msg: "Show images: OFF" };
              printMsg(dada);
            }
            return;
          }
          */

          if (cmd.cmd === 'eval') {
              eval(cmd.val);
              return;
          }

          if (cmd.cmd === 'status'){
            if (cmd.val === 'on' || cmd.val === 'online'){
              socket.emit("set_status","online");
              return;
            }
            if (cmd.val === 'afk'){
              socket.emit("set_status","afk");
              return;
            }
            if (cmd.val === 'dnd'){
              socket.emit("set_status","dnd");
              return;
            }
            if (cmd.val === 'DoNotDuck'){
              setTimeout(function(){
                dada = { date: Date.now(), nick: "duck", color: "green;ducky", style: "opacity: 0.7;", home: 'local', msg: "Quack! You cannot reject duck." };
                document.title = "trollbox (New ping!)"
                if (document.hasFocus() == false || document.hidden){
                  new Audio("https://cdn.globalstorage.repl.co/falling-into-place-573.ogg").play();
                }
                printMsg(dada);
                socket.emit("user joined", "duck", "green;duck", "", "");
	            }, 60 * 1000);
              socket.emit("set_status","dnd");
              return;
	          }
          }
          if (cmd.cmd === 'invisible') {
            if (cmd.val === 'on') {
              duckcolor=color;
              color = 'transparent';
              socket.emit('user joined', pseudo, color, style)
              dada = { date: Date.now(), nick: "~", color: "white", style: "opacity: 0.7;", home: 'local', msg: "Invisible mode: ON" };
              printMsg(dada);
              return;
            }
            if (cmd.val === 'off'){
              color = duckcolor;
              socket.emit('user joined', pseudo, color, style)
              dada = { date: Date.now(), nick: "~", color: "white", style: "opacity: 0.7;", home: 'local', msg: "Invisible mode: OFF" };
              printMsg(dada);
              return;
            }
            return;
          }
          if (cmd.cmd === 'edit') {
            //document.getElementById(pseudo + latestIDnum).innerHTML = cmd.val;
            socket.emit('edit', cmd.val);
            return;
          }
          if (cmd.cmd === 'spoiler'){
            socket.emit("message",`<span style="color: black; background-color: black;" onclick="this.removeAttribute('style');">${cmd.val}</span>`);
            return;
          }
          if (cmd.cmd === 'yt') {
            if (cmd.val=='on') {
              ytShow=true;
               $store.set('.config/trollbox/yt', ytShow);
              dada = { date: Date.now(), nick: "~", color: "white", style: "opacity: 0.7;", home: 'local', msg: "Youtube player: ON" };
              printMsg(dada);
            }
            if (cmd.val=='off') {
              ytShow=false;
               $store.set('.config/trollbox/yt', ytShow);
              dada = { date: Date.now(), nick: "~", color: "white", style: "opacity: 0.7;", home: 'local', msg: "Youtube player: OFF" };
              printMsg(dada);
            }
            return;
          }
          if (cmd.cmd === 'emo') {
            if (cmd.val=='on') {
              emoticons=true;
               $store.set('.config/trollbox/emoticons', emoticons);
              dada = { date: Date.now(), nick: "~", color: "white", style: "opacity: 0.7;", home: 'local', msg: "Emoticon: ON" };
              printMsg(dada);
            }
            if (cmd.val=='off') {
              emoticons=false;
               $store.set('.config/trollbox/emoticons', emoticons);
              dada = { date: Date.now(), nick: "~", color: "white", style: "opacity: 0.7;", home: 'local', msg: "Emoticon: OFF" };
              printMsg(dada);
            }
            return;
          }
          if (cmd.cmd === 'sin') {
            if (cmd.val=='off') {
              sin=false;
               $store.set('.config/trollbox/sin', sin);
              dada = { date: Date.now(), nick: "~", color: "white", style: "opacity: 0.7;", home: 'local', msg: "Sin: OFF" };
              printMsg(dada);
              return;
            }
          }
          if (cmd.cmd === 'say') {
            speech = true;
            $store.set('.config/trollbox/speech', speech);
            if (cmd.val=='on') {
              speech=true;
               $store.set('.config/trollbox/speech', speech);
              dada = { date: Date.now(), nick: "~", color: "white", style: "opacity: 0.7;", home: 'local', msg: "Speech: ON" };
              printMsg(dada);
              return;
            }
            if (cmd.val=='off') {
              speech=false;
               $store.set('.config/trollbox/speech', speech);
              dada = { date: Date.now(), nick: "~", color: "white", style: "opacity: 0.7;", home: 'local', msg: "Speech: OFF" };
              printMsg(dada);
              return;
            }
          }
          if (cmd.cmd === 'filter'){
            if (cmd.val == 'antisus on'){
	            filtersus = true;
	            filter.antisus.enabled = true;
	            $store.set('.config/trollbox/filtersus', true);
	            dada = { date: Date.now(), nick: "~", color: "white", style: "opacity: 0.7;", home: 'local', msg: "Filter AntiSus: Enabled" };
              printMsg(dada)
              return;
	          }
            if (cmd.val == 'antisus off'){
              filtersus = false;
	            filter.antisus.enabled = false;
	            $store.set('.config/trollbox/filtersus', false);
              dada = { date: Date.now(), nick: "~", color: "white", style: "opacity: 0.7;", home: 'local', msg: "Filter AntiSus: Disabled" };
              printMsg(dada)
              return;
	          }
            return;
          }
          if (cmd.cmd === 'mlg') {
            if (cmd.val=='on') {
              //imgShow=true;
              ytShow=true;
              emoticons=true;
               $store.set('.config/trollbox/yt', ytShow);
               //$store.set('.config/trollbox/img', imgShow);
               $store.set('.config/trollbox/speech', speech);
               $store.set('.config/trollbox/emoticons', emoticons);
              dada = { date: Date.now(), nick: "~", color: "white", style: "opacity: 0.7;", home: 'local', msg: "Major League Gaming: ON" };
              printMsg(dada);
            }
            if (cmd.val=='off') {
              //imgShow=false;
              ytShow=false;
              emoticons=false;
               $store.set('.config/trollbox/yt', ytShow);
               //$store.set('.config/trollbox/img', imgShow);
               $store.set('.config/trollbox/speech', speech);
               $store.set('.config/trollbox/emoticons', emoticons);
              dada = { date: Date.now(), nick: "~", color: "white", style: "opacity: 0.7;", home: 'local', msg: "Major League Gaming: OFF" };
              printMsg(dada);
            }
            return;
          }
          if (cmd.cmd == 'shrug') {
            temp=''
            if (cmd.val) {temp = cmd.val+' '}
            msg = temp+'¯\\_(ツ)_/¯'
          }
          if (cmd.cmd == 'cststat'){
	          socket.emit("set_custom_status", cmd.val);
            dada = { date: Date.now(), nick: "~", color: "white", style: "opacity: 0.7;", home: 'local', msg: "Custom status set!" };
            printMsg(dada);
            return;
	        }
          if (cmd.cmd == 'notifs'){
            if (cmd.val == "me"){
              pingPolicy="personal";
              $store.set('.config/trollbox/pingpolicy', pingPolicy);
              dada = { date: Date.now(), nick: "~", color: "white", style: "opacity: 0.7;", home: 'local', msg: "Now you will receive only personal pings." };
              printMsg(dada);
              return;
            }
            if (cmd.val == "all"){
              pingPolicy="all";
              $store.set('.config/trollbox/pingpolicy', pingPolicy);
              dada = { date: Date.now(), nick: "~", color: "white", style: "opacity: 0.7;", home: 'local', msg: "Now you will receive all pings." };
              printMsg(dada);
              return;
            }
            if (cmd.val == "none"){
              pingPolicy="none";
              $store.set('.config/trollbox/pingpolicy', pingPolicy);
              dada = { date: Date.now(), nick: "~", color: "white", style: "opacity: 0.7;", home: 'local', msg: "Pings disabled." };
              printMsg(dada);
              return;
            }
            return;
          }
          if (msg.startsWith('/ascii ')) {
            var doge = msg.slice(7).trim();
            doge = doge.substring(doge.indexOf("\n") + 1);
            dogescii(doge);
            return;
          }
          if (msg.startsWith('/block ')) {
            var user = msg.slice(7).trim();
            for (var key in users) {
              for (var i = 0; i < users[key].length; i++) {
                if (users[key][i]==user) {
                  blocked.push(key);
                };
              };
            }
            blocked=uniq(blocked);
            $store.set('.config/trollbox/blocked', blocked);
            userMsg = 'User is now blocked.';
            dada = { date: Date.now(), nick: "~", color: "white", style: "opacity: 0.7;", home: 'local', msg: userMsg };
            printMsg(dada);
            return;
          }

          if (msg.startsWith('/unblock ')) {
            var user = msg.slice(9).trim();
            for (var key in users) {
              for (var i = 0; i < users[key].length; i++) {
                if (users[key][i]==user) {
                    blocked.splice( blocked.indexOf(key), 1 );
                };
              };
            }
            blocked=uniq(blocked);
            $store.set('.config/trollbox/blocked', blocked);
            userMsg = 'User is now unblocked';
            dada = { date: Date.now(), nick: "~", color: "white", style: "opacity: 0.7;", home: 'local', msg: userMsg };
            printMsg(dada);
            return;
          }

          if (msg.startsWith('/b ')) {
            var temp = msg.slice(3).trim();
            temp = temp.substring(temp.indexOf("\n") + 1);
            banner(temp);
            return;
          }

          if (msg.startsWith('/font ')) {
            var myfont = parseInt(msg.slice(6).trim());
            if (fontNames[(myfont%fontNames.length)]) {
              fontName=fontNames[(myfont%fontNames.length)];
              $store.set('.config/trollbox/font', fontName);
              temp = 'Font selected: '+fontName;
              dada = { date: Date.now(), nick: "~", color: "white", style: "opacity: 0.7;", home: 'local', msg: temp };
              printMsg(dada);
              return;
            }
          };

          if (msg.startsWith('/lorem ')) {
            var numb = msg.slice(7).trim();
            numb = numb.substring(numb.indexOf("\n") + 1);
            lorem(numb);
            return;
          }

        }
        if ( (msg=='/normal')||(msg=='lɐɯɹou/')||(msg=='/n0rm4l') ) {
            messageStyle = "normal";
            dada = { date: Date.now(), nick: "~", color: "white", style: "opacity: 0.7;", home: 'local', msg: "back to normal mode" };
            printMsg(dada);
            $('#trollbox').css('transform','rotate(0deg)');
            return;
        }
        if ((msg=='/reverse')||(msg=='ǝsɹǝʌǝɹ/')||(msg=='/r3v3r53')) {
            if (messageStyle!="upDown") {
              dada = { date: Date.now(), nick: "~", color: "white", style: "opacity: 0.7;", home: 'local', msg: "reverse mode: ON" };
              printMsg(dada);
            };
            messageStyle = "upDown";
            $('#trollbox').css('transform','rotate(180deg)');
            return;
        }
        if ((msg=='/l337')||(msg=='ㄥƐƐl/')) {
            messageStyle = "l337";
            dada = { date: Date.now(), nick: "~", color: "white", style: "opacity: 0.7;", home: 'local', msg: "leet mode: ON" };
            printMsg(dada);
            $('#trollbox').css('transform','rotate(0deg)');
            return;
        }

        if (msg=='/help') {
          dada = { date: Date.now(), nick: "~", color: "white", style: "opacity: 0.7;", home: 'local', msg: helpMsg };
          printMsg(dada);
          return;
        }

        if (msg=='/scroll') {
          dada = { date: Date.now(), nick: "~", color: "white", style: "opacity: 0.7;", home: 'local', msg: 'Auto Scroll: '+!scroll };
          scrollDown ()
          scroll=!scroll;
          printMsg(dada);
          return;
        }

        if (msg=='/clear') {
          $('#trollbox_scroll').html('<div id="context"></div><div id="popout" class="popup" style="display: none"></div>');
          messageStyle="normal";
          return;
        }

        if (msg=='/unblock') {
          blocked=[];
          $store.set('.config/trollbox/blocked', blocked);
          userMsg = 'Block list cleared.';
          dada = { date: Date.now(), nick: "~", color: "white", style: "opacity: 0.7;", home: 'local', msg: userMsg };
          printMsg(dada);
          return;
        }

        if (msg == '/clsstat'){
            socket.emit("clear_custom_status");
            dada = { date: Date.now(), nick: "~", color: "white", style: "opacity: 0.7;", home: 'local', msg: "Custom status removed!"};
            printMsg(dada);
            return;
        }

        if (msg.startsWith("+:")){
          var id = trollbox_scroll.lastChild.childNodes[2].id;
          var inputid = msg.substring(msg.indexOf(" ") + 1, msg.length);
          var url = msg.replace("+:","").split(" ")[0];
          if (inputid !== undefined && inputid !== msg){
            id = inputid;
          }
          if (location.protocol == "https:"){
            url = url.replace("http://","https://");
          }
          var selfreacted = false;
          if (id !== undefined){
            for (var i in reactionspermsg[id]){
	            if (reactionspermsg[id][i].url == url){
                if (reactionspermsg[id][i].selfreacted == true){
                  selfreacted=true;
                }
              }
	          }
            if (selfreacted){
              socket.emit("unreact", id, url);
            }else{
              socket.emit("react", id, url);
            }
          }
          return;
        }
        if (msg=='/shrug'){msg = '¯\\_(ツ)_/¯'}
        if (msg=='/rem' || msg=='/delete'){socket.emit('delet'); msg = ''};
        if (msg.length > 10000) msg = msg.slice(0, 10000);
	//sanitMsg=msg.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
	//if (msg.length > 10000) msg = "<button onclick=\"popup('"+sanitMsg+"') \">expand text</button>";
        if (msg.trim() !== '') socket.emit('message', msg);
      }
    }

    function matchYoutubeUrl(url){
      var p = /www\.youtube\.com/;
       return (url.match(p)) ? true : false ;
    }

    var faces = ["( .-. )","( .o.)","( `·´ )","( ° ͜ ʖ °)","( ͡° ͜ʖ ͡°)","( ⚆ _ ⚆ )","( ︶︿︶)","( ﾟヮﾟ)","(\\/)(°,,,°)(\\/)","(¬_¬)","(¬º-°)¬","(¬‿¬)","(°ロ°)☝","(´・ω・)っ","(ó ì_í)","(ʘᗩʘ')","(ʘ‿ʘ)","(̿▀̿ ̿Ĺ̯̿̿▀̿ ̿)̄","(͡° ͜ʖ ͡°)","(ಠ_ಠ)","(ಠ‿ಠ)","(ಠ⌣ಠ)","(ಥ_ಥ)","(ಥ﹏ಥ)","(ง ͠° ͟ل͜ ͡°)ง","(ง ͡ʘ ͜ʖ ͡ʘ)ง","(ง •̀_•́)ง","(ง'̀-'́)ง","(ง°ل͜°)ง","(ง⌐□ل͜□)ง","(ღ˘⌣˘ღ)","(ᵔᴥᵔ)","(•ω•)","(•◡•)/","(⊙ω⊙)","(⌐■_■)","(─‿‿─)","(╯°□°）╯","(◕‿◕)","(☞ﾟ∀ﾟ)☞","(❍ᴥ❍ʋ)","(っ◕‿◕)っ","(づ｡◕‿‿◕｡)づ","(ノಠ益ಠ)ノ","(ノ・∀・)ノ","(；一_一)","(｀◔ ω ◔´)","(｡◕‿‿◕｡)","(ﾉ◕ヮ◕)ﾉ","*<{:¬{D}}}","=^.^=","t(-.-t)","| (• ◡•)|","~(˘▾˘~)","¬_¬","¯(°_o)/¯","¯\_(ツ)_/¯","°Д°","ɳ༼ຈل͜ຈ༽ɲ","ʅʕ•ᴥ•ʔʃ","ʕ´•ᴥ•`ʔ","ʕ•ᴥ•ʔ","ʕ◉.◉ʔ","ʕㅇ호ㅇʔ","ʕ；•`ᴥ•´ʔ","ʘ‿ʘ","͡° ͜ʖ ͡°","ζ༼Ɵ͆ل͜Ɵ͆༽ᶘ","Ѱζ༼ᴼل͜ᴼ༽ᶘѰ","ب_ب","٩◔̯◔۶","ಠ_ಠ","ಠoಠ","ಠ~ಠ","ಠ‿ಠ","ಠ⌣ಠ","ಠ╭╮ಠ","ರ_ರ","ง ͠° ل͜ °)ง","๏̯͡๏﴿","༼ ºººººل͟ººººº ༽","༼ ºل͟º ༽","༼ ºل͟º༼","༼ ºل͟º༽","༼ ͡■ل͜ ͡■༽","༼ つ ◕_◕ ༽つ","༼ʘ̚ل͜ʘ̚༽","ლ(´ڡ`ლ)","ლ(́◉◞౪◟◉‵ლ)","ლ(ಠ益ಠლ)","ᄽὁȍ ̪őὀᄿ","ᔑ•ﺪ͟͠•ᔐ","ᕕ( ᐛ )ᕗ","ᕙ(⇀‸↼‶)ᕗ","ᕙ༼ຈل͜ຈ༽ᕗ","ᶘ ᵒᴥᵒᶅ","‎‎(ﾉಥ益ಥ）ﾉ","≧☉_☉≦","⊙▃⊙","⊙﹏⊙","┌( ಠ_ಠ)┘","╚(ಠ_ಠ)=┐","◉_◉","◔ ⌣ ◔","◔̯◔","◕‿↼","◕‿◕","☉_☉","☜(⌒▽⌒)☞","☼.☼","♥‿♥","⚆ _ ⚆","✌(-‿-)✌","〆(・∀・＠)","ノ( º _ ºノ)","ノ( ゜-゜ノ)","ヽ( ͝° ͜ʖ͡°)ﾉ","ヽ(`Д´)ﾉ","ヽ༼° ͟ل͜ ͡°༽ﾉ","ヽ༼ʘ̚ل͜ʘ̚༽ﾉ","ヽ༼ຈل͜ຈ༽ง","ヽ༼ຈل͜ຈ༽ﾉ","ヽ༼Ὸل͜ຈ༽ﾉ","ヾ(⌐■_■)ノ","꒰･◡･๑꒱","﴾͡๏̯͡๏﴿","｡◕‿◕｡","ʕノ◔ϖ◔ʔノ","꒰•̥̥̥̥̥̥̥ ﹏ •̥̥̥̥̥̥̥̥๑꒱","ಠ_ರೃ","(ू˃̣̣̣̣̣̣︿˂̣̣̣̣̣̣ ू)","(ꈨຶꎁꈨຶ)۶”","(ꐦ°᷄д°᷅)","(۶ૈ ۜ ᵒ̌▱๋ᵒ̌ )۶ૈ=͟͟͞͞ ⌨","₍˄·͈༝·͈˄₎◞ ̑̑ෆ⃛","(*ﾟ⚙͠ ∀ ⚙͠)ﾉ❣","٩꒰･ัε･ั ꒱۶","ヘ（。□°）ヘ","˓˓(ृ　 ु ॑꒳’)ु(ृ’꒳ ॑ ृ　)ु˒˒˒","꒰✘Д✘◍꒱","૮( ᵒ̌ૢཪᵒ̌ૢ )ა","“ψ(｀∇´)ψ","ಠﭛಠ","(๑>ᴗ<๑)","(۶ꈨຶꎁꈨຶ )۶ʸᵉᵃʰᵎ","٩(•̤̀ᵕ•̤́๑)ᵒᵏᵎᵎᵎᵎ","(oT-T)尸","(✌ﾟ∀ﾟ)☞","ಥ‿ಥ","ॱ॰⋆(˶ॢ‾᷄﹃‾᷅˵ॢ)","┬┴┬┴┤  (ಠ├┬┴┬┴","( ˘ ³˘)♥","Σ (੭ु ຶਊ ຶ)੭ु⁾⁾","(⑅ ॣ•͈ᴗ•͈ ॣ)","ヾ(´￢｀)ﾉ","(•̀o•́)ง","(๑•॒̀ ູ॒•́๑)","⚈้̤͡ ˌ̫̮ ⚈้̤͡","=͟͟͞͞ =͟͟͞͞ ﾍ( ´Д`)ﾉ","(((╹д╹;)))","•̀.̫•́✧","(ᵒ̤̑ ₀̑ ᵒ̤̑)","\_(ʘ_ʘ)_/"];
    function downloadURI(uri, name) {
    var link = document.createElement("a");
    // If you don't know the name or want to use
    // the webserver default set name = ''
    link.setAttribute('download', name);
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    link.remove();
    }

    function printNsfwAttachment(elm, id){
       var data = nswatt[id];
       if (data.files.mime.startsWith("image")){
         elm.innerHTML = "<br>"+`<img onmouseleave="this.style='max-height:20%;max-width:30%;height:auto;width:auto;filter:blur(1.5rem);';" onmouseenter="this.style='max-height:20%;max-width:30%;height:auto;width:auto;';" src="`+encodeURI(decodeURI(data.files.url))+`" style="max-height:20%;max-width:30%;height:auto;width:auto;filter:blur(1.5rem);">`;
         return;
       }
       if (data.files.mime.startsWith("audio")){
         elm.innerHTML = "<br>"+`<div onclick="this.removeAttribute('style');this.lastChild.removeAttribute('style');" style="filter:blur(1.5rem);"><audio controls src="`+encodeURI(decodeURI(data.files.url))+`" style="pointer-events: none;"/></div>`;
         return;
       }
       if (data.files.mime.startsWith("video")){
         elm.innerHTML = "<br>"+`<div onmouseleave="this.style='filter:blur(1.5rem);';this.lastChild.style='pointer-events: none;';this.lastChild.pause();this.lastChild.currentTime = 0;" onmouseenter="this.removeAttribute('style');this.lastChild.removeAttribute('style');" style="filter:blur(1.5rem);"><video controls="" width="50%" src="`+encodeURI(decodeURI(data.files.url))+`" style="pointer-events: none;"/></div>`;
         return;
       }
       elm.innerHTML = "<br>"+`<div onmouseleave="this.style='filter:blur(1.5rem);';this.lastChild.style='pointer-events: none;';" onmouseenter="this.removeAttribute('style');this.lastChild.removeAttribute('style');" style="filter:blur(1.5rem);"><br><b>${he.escape(data.files.name)}</b><button onclick='downloadURI("${encodeURI(decodeURI(data.files.url))}","${he.escape(data.files.name)}")' style='pointer-events: none;'><font size='5'>⭳</font></button></div>`;
    }

    function printMsg (data) {
      if (!data || typeof data.msg !== 'string' || data.msg.trim()=='') return;
      if (data.nick==undefined) {return};
      if (data.nick==null) {return};
      if (data.home==undefined||data.home==null||!data.home) {return;};
      if (filtersus){
        if (filter.antisus.action(data)){
          data.msg = "[Blocked by filter]";
        }
      }
      data.msg = autolink(data.msg);
      if (data.reply){
        if (document.getElementById(data.for) == null){
          data.msg="Cannot load original message.<hr>"+data.msg;
        }else{
          if (document.getElementById(data.for).getAttribute("class") !== "trollbox_msg"){
            data.msg="Cannot load original message.<hr>"+data.msg;
	        }else{
            try{
              data.msg=document.getElementById(data.for).parentElement.outerHTML.replace(`<duck id="reactionpad-`+data.for+`">`,`<duck>`).replace('<span class="trollbox_msg" id="'+data.for+'"','<span class="trollbox_msg" name="reply-'+data.for+'"')+"<hr>"+data.msg;
	          }catch{
              data.msg="Cannot load original message.<hr>"+data.msg;
            }
	        }
	      }
      }
      if (data.files){
        if (data.files.nsfw){
          if (nsfwPolicy == "none"){
            data.msg=data.msg+"<br>Attachment was hidden. Reason: nsfw filter policy.";
          }
          if (nsfwPolicy == "show"){
            nsfwatt[data.id] = data.files;
            data.msg=data.msg+`<span><br>/!\\ This message contains nsfw attachment. Show? <button onclick="printNsfwAttachment(this.parentElement,'`+data.id+`');">Yes</button> <button onclick="this.parentElement.remove()">No</button> <button onclick="this.parentElement.parentElement.remove()">Delete</button></span>`;
          }
        }else{
          var flag = false;
          if (data.files.mime.startsWith("image")){
            if (data.files.spoiler == true){
              data.msg=data.msg+"<br>"+`<img title="Click to reveal image." onclick="this.removeAttribute('title');this.style='max-height:20%;max-width:30%;height:auto;width:auto;';" src="`+encodeURI(decodeURI(data.files.url))+`" style="max-height:20%;max-width:30%;height:auto;width:auto;filter:blur(1.5rem);">`;
            }else{
              var duckk = 'popup(`<img src=\'${this.src}\' style=\'max-height:100%;max-width:100%;height:auto;width:auto;\'>`)';
              data.msg=data.msg+"<br><div><img truesrc='" + encodeURI(decodeURI(data.files.url)) + "' src='" + encodeURI(decodeURI(data.files.url)) + `' style='max-height:20%;max-width:30%;height:auto;width:auto;' onclick="${duckk}" onerror="if (this.src !== '/fail.png'){this.src='/fail.png';};this.parentElement.childNodes[2].style='display: block';"><br><button style='display: none' onclick='var test=this.parentElement.childNodes[0].getAttribute("truesrc");this.parentElement.childNodes[0].src=null;this.parentElement.childNodes[0].src=test;this.style="display: none;";'>Retry</button></div>`;
            }
            flag=true;
          }
          if (data.files.mime.startsWith("audio")){
            if (data.files.spoiler == true){
              data.msg=data.msg+`<br><div onclick="this.removeAttribute('style');this.lastChild.removeAttribute('style');" style="filter:blur(1.5rem);"><audio controls src="`+encodeURI(decodeURI(data.files.url))+`" style="pointer-events: none;"/></div>`;
            }else{
              data.msg=data.msg+"<br><audio controls src='" + encodeURI(decodeURI(data.files.url)) + "'>";
            }
            flag=true;
          }
          if (data.files.mime.startsWith("video")){
            if (data.files.spoiler == true){
              data.msg=data.msg+`<br><div onclick="this.removeAttribute('style');this.lastChild.removeAttribute('style');" style="filter:blur(1.5rem);"><video controls="" width="50%" src="`+encodeURI(decodeURI(data.files.url))+`" style="pointer-events: none;"/></div>`;
            }else{
              data.msg=data.msg+`<br><video controls="" width="50%">
        <source type="video/webm" src="${encodeURI(decodeURI(data.files.url))}">
        </video>`;
            }
            flag=true;
          }
          if (flag == false){
            if (data.files.spoiler == true){
              data.msg=data.msg+`<div onclick="this.removeAttribute('style');this.lastChild.removeAttribute('style');" style="filter:blur(1.5rem);"><br><b>${he.escape(data.files.name)}</b><button onclick='downloadURI("${encodeURI(decodeURI(data.files.url))}","${he.escape(data.files.name)}")' style='pointer-events: none;'><font size='5'>⭳</font></button></div>`;
            }else{
              data.msg=data.msg+`<br><b>${he.escape(data.files.name)}</b><button onclick='downloadURI("${encodeURI(decodeURI(data.files.url))}","${he.escape(data.files.name)}")'><font size='5'>⭳</font></button>`;
            }
          }
        }
      }
      reactionspermsg[data.id]=[];
      for (var i = 0; i < blocked.length; i++) { if (data.home==blocked[i]) {return} };
      if (typeof data.nick != "string") {return};

      // /kaomoji
      while (data.msg.includes("/kao")) {
          data.msg = data.msg.replace('/kao', faces[parseInt(Math.random()*faces.length)])
      }
    /*
    if ((check)&&(check.startsWith('data:image/'))) {
       if ( imgShow ) {
          if(data.msg.indexOf("&#62")!=-1){return};
          if(data.msg.indexOf("&#39")!=-1){return};
          data.msg = "<img style='max-width: 98%;' src='"+data.msg+"'>";
       }else{
        data.msg = "You need to type '/img on' to see this."
       }
      }
      */
      var cmd = getCmd(data.msg);
      var ytplayer = false;
      if (ytShow) {
        if (matchYoutubeUrl(data.msg)) {
            if (data.msg.startsWith('https://www.youtube.com/watch?v=')) {
               var id = data.msg.slice(32).trim();
               data.msg='<iframe width="560" height="315" src="https://www.youtube.com/embed/'+id+'" frameborder="0" allowfullscreen></iframe>';
               ytplayer=true;
            }
        };
      };
      /*
      if (ytplayer!=true) {
        if ( imgShow ) {
          var test = (/\.(gif|jpg|jpeg|tiff|png|webp)/i).test(data.msg);
          if (test) {
            message = data.msg.split(" ");
            data.msg = "";
             for (var i = 0; i < message.length; i++) {
               var testa = (/\.(gif|jpg|jpeg|tiff|png|webp)/i).test(message[i]);
               if (testa) {
                 //img
                  if ((/\.(php)/i).test(message[i])) {
                    data.msg = data.msg + " <img style='max-width: 98%;' src=''> "
                  }else{
                    data.msg = data.msg + " <img style='max-width: 98%;' src='"+ message[i] +"'> "
                  }
               }else{
                //txt
                data.msg = data.msg + " " + $io.str.autolink(message[i]);
               }
          };
          }else{data.msg = $io.str.autolink(data.msg);}

        }else{
          data.msg = $io.str.autolink(data.msg);
        }
        data.msg = $io.str.autolink(data.msg);
      };
      */
      words = data.msg.split(" ");
      if (words[0]=="/sin"){
        if (words[1]) {
          string = words[1];
          string = string.substring(0, 50);

        }else{
          string="█";
        }
        if (words[2]) {
        amplitude = words[2];
      }else{
        amplitude = parseInt(Math.random()*100);
      }
        if (data.nick==undefined) {data.nick="anonymouse"};
        if (data.color==undefined) {data.color="white"};
        if (data.style==undefined) {data.style=""};
        if (sin) {
          sinFlood(string, amplitude,data.nick,data.color,data.style)
          return
        };
      };
      //
      if (words[0]=="/say"){

         settings = words[1].split(":")
         words.shift();
         words.shift();
         var temp = words.join(" ").trim();
         say = new SpeechSynthesisUtterance();
         say.volume = 0.5;
         say.text = temp;
         if (settings[0]<0) {settings[0]=0}; if (settings[0]>=2) {settings[0]=2.0};
         say.pitch = settings[0];
         if (settings[1]<0.1) {settings[1]=0.1}; if (settings[1]>=10) {settings[1]=10.0};
         say.rate=settings[1];
         if (voices.length>0) { say.voice=voices[parseInt(settings[2])%voices.length] };
         if (speech&&temp.length>0) {
          speechSynthesis.speak(say);
           data.msg = "🔈 "+temp;
         }else{
           data.msg = "🔇 "+temp;
         }
         //return;
      }
      // vintage emoticons, will add moar sets later.
      if (emoticons) {
        substring = "&#175;\\_(&#12484;)_/&#175;";
        if(data.msg.indexOf(substring) == -1){
          emoSet='msn';
          data.msg = replaceEmoticons(data.msg,emoSet);
        }
      };
      //
      if (words[0]=="/zalgo"){
         var temp = data.msg.slice(6).trim().substring(0, 1000);
         data.msg = zalgo(temp);
      }
      //
      if (cmd) {
        if (cmd.cmd === 'exe') {
          data.msg = '<div class="trollbox_exe"><button title="IF code is suspicious dont click" data-exe="'+he.escape(cmd.val)+'">/js</button>' + he.escape(cmd.val) + '</div>';
        }
	      if (cmd.cmd === 'js') {
          data.msg = '<div class="trollbox_exe"><button title="IF code is suspicious dont click" data-exe="'+he.escape(cmd.val)+'">/js</button>' + he.escape(cmd.val) + '</div>';
        }
      }

      if (data.msg.startsWith('/js ')) {
        var ex = data.msg.slice(4).trim()
        data.msg = '<div class="trollbox_exe"><button title="IF code is suspicious dont click" data-exe="'+ex.replace(/"/g, '\\"')+'">/js</button>' + ex + '</div>';
      }

      var div = document.createElement('div');
      data.nick = data.nick || '●';
      //if (data.nick=='●') {pseudo=='●'};
      div.className = 'trollbox_line ui_group';
      div.innerHTML = '<span class="trollbox_h">' + h(data.date) + '</span>'
        + (printNick(data))
        + '<span class="trollbox_msg" id="'+data.id+'" system="'+data.system+'" own="'+data.own+'" for="'+data.for+'">' + data.msg + '<br><duck id="reactionpad-'+data.id+'"></duck></span>'
        // + '<span class="trollbox_msg" style="color:'+data.color+'">' + data.msg + '</span>'
      ;
      trollbox_scroll.appendChild(div);
      if (getScrollPos()>90) {scrollDown();};

    }

     socket.on('_connected', function (data) {
      	//console.log('_connected')
     });

    socket.on('update history', function (data) {
      data.forEach(function (item) {
        printMsg(item)
      })
    });
    socket.on('update status', function(data,status){
      if (blocked.includes(data.home)){return;}
      var msg = printNick(data)+" set status to: ";
      if (status == "online"){
        msg=msg+'<svg height="12" width="12"><circle cx="6" cy="6" r="4" fill="green"></circle></svg><b>Online</b>';
      }
      if (status == "afk"){
        msg=msg+'<svg height="12" width="12"><circle cx="6" cy="6" r="4" fill="yellow"></circle></svg><b>Away From Keyboard</b>';
      }
      if (status == "dnd"){
        msg=msg+'<svg height="12" width="12"><circle cx="6" cy="6" r="4" fill="red"></circle></svg><b>Do Not Disturb</b>';
      }
      printMsg({msg: msg, nick: "~", color: "", home: data.home, date: new Date()});
    });
    socket.on('update users', function (data) {
      userlist = data;
      users=[];
      for (var key in data) {
        if (!users[data[key].home]) {
          users[data[key].home]=[he.decode(data[key].nick)]

        }else{
          users[data[key].home].push(he.decode(data[key].nick));
        }
      }
      if (userlisttab == "users"){
      trollbox_infos.innerHTML = '';
      }
      var frag = document.createDocumentFragment();
      var zpan = document.createElement('span');
        zpan.innerHTML=beforelist;
        //zpan.innerHTML=zpan.innerHTML+'<button onclick="updateUserlist();">Voice</button>';
        frag.appendChild(zpan);
      for (var key in data) {
        if (data.hasOwnProperty(key)) {
          var div = document.createElement('div');
          var badge_flag=false;
          var statusdata="";
          if (data[key].status == "online"){
            statusdata='<span><svg height="12" width="12"><circle cx="6" cy="6" r="4" fill="green"></circle></svg></span>';
          }
          if (data[key].status == "afk"){
            statusdata='<span><svg height="12" width="12"><circle cx="6" cy="6" r="4" fill="yellow"></circle></svg></span>';
          }
          if (data[key].status == "dnd"){
            statusdata='<span><svg height="12" width="12"><circle cx="6" cy="6" r="4" fill="red"></circle></svg></span>';
          }
          if (!data[key].nobadge){
          if (data[key].bot == true){
            badge_flag=true;
            div.innerHTML = statusdata+printNick(data[key], true) + ' <span style="background-color:rgb(114,137,218);padding:2px;color:white;border-radius:10%">BOT</span>';
	        }
          if (data[key].mod == true){
            badge_flag=true;
            div.innerHTML = statusdata+printNick(data[key], true) + ' <span style="background-color:rgb(114,137,218);padding:2px;color:white;border-radius:10%">MOD</span>';
	        }
          if (data[key].admin == true){
	          badge_flag=true;
            div.innerHTML = statusdata+printNick(data[key], true) + ' <span style="background-color:rgb(114,137,218);padding:2px;color:white;border-radius:10%">ADMIN</span>';
	        }
        } else badge_flag = false;
          if (badge_flag == false){
	          div.innerHTML = statusdata+printNick(data[key], true);
	        }
          frag.appendChild(div);
        }
      }

      //Fragment-to-html
      //U mad, DOM?
      var tmpfrg = frag.cloneNode(true);
      var tmpelm = document.createElement("span");
      tmpelm.appendChild(tmpfrg);

      userlisthtml=tmpelm.innerHTML;
      if (userlisttab == "users"){
        trollbox_infos.appendChild(frag);
        chatKing();
      }
    });

    socket.on("room_update", function(){
       socket.emit("room_list");
    });

    function onClickChannel(thes){
      socket.emit("room_canjoin_nopass",thes.getAttribute("room"));
      socket.on("room_canjoin_resp", function(temp, perm){
        socket.off("room_canjoin_resp");
        if (perm == true){
          if (temp == false && perm == true){
	          var pass = prompt("Password?");
            socket.emit("room_canjoin_pass",thes.getAttribute("room"),pass);
            socket.on("room_canjoin_resp", function(tmp, prm){
              socket.off("room_canjoin_resp");
              if (tmp){
                socket.emit("room_join", thes.getAttribute("room"), pass);
              }
            });
          }else{
            socket.emit("room_join", thes.getAttribute("room"));
          }
        }
      });
    }

    socket.on("room_list_resp",function(condition, rooms){ //room_list_resp
     socket.emit("room_current");
     socket.on("room_current_resp", function(condit, current_room){
     socket.off("room_current_resp");
     //var rooms = {"general": {}, "sus": {protected: true}, "sus2": {protected: true}};
     //var current_room = "general";
     var html_str = "";
     if (condition && condit){ //condition
     var room_keys = Object.keys(rooms);
       for (var i in rooms){
          if (rooms[i].protected == true){
            if (i == current_room){
              html_str = html_str + "<div><b>🔓"+i+"</b></div>";
            }else{
              html_str = html_str + "<div room='"+i+"' onclick='onClickChannel(this)'><u>🔒"+i+"</u></div>";
            }
          }else{
            if (i == current_room){
              html_str = html_str + "<div><b>#"+i+"</b></div>";
            }else{
              html_str = html_str + "<div room='"+i+"' onclick='onClickChannel(this)'><u>#"+i+"</u></div>";
            }
          }
       }
    }
    channellisthtml = '<button onclick="onclickVoiceBtn();">Voice</button><button onclick="onclickNewChannel()">+</button>'+html_str;
    if (userlisttab == "channels"){
    trollbox_infos.innerHTML = beforelist+'<button onclick="onclickVoiceBtn();">Voice</button><button onclick="onclickNewChannel()">+</button>'+html_str;
    }
    });
    });

    socket.on("connect", function(){
      if (restarting){
        clearInterval(backinterval);
        dada = {nick: "NT AUTHORITY", color: "lime", style: "", home: "local", date: new Date(), msg: "Server has been restarted. To continue, reload the page<br><button onclick='location.reload()'>Reload</button>"};
        printMsg(dada);
      }
    });

    socket.on("servershut", function(){
      restarting=true;
      dada = {nick: "NT AUTHORITY", color: "lime", style: "", home: "local", date: new Date(), msg: "Server will restart soon.<br><span style='color: red'>Notice: all files uploaded will be erased once server will restart. Please backup important information sent here.</span>"};
      printMsg(dada);
    });

    socket.on("disconnect", function(reason){
       if (restarting){
         printMsg({msg: "Server is restarting.", nick: "NT AUTHORITY", color: "lime", home: "local", date: Date.now()});
         printMsg({msg: "Back online approximately in <b id='backtimer'>120<b>", nick: "NT AUTHORITY", color: "lime", home: "local", date: Date.now()});
         backIn = 120;
         backinterval = setInterval(function(){
           backIn--;
           if (backIn > 0){
             document.getElementById("backtimer").innerHTML=backIn;
           }else{
             document.getElementById("backtimer").style="color: red";
             document.getElementById("backtimer").innerHTML=Math.abs(backIn);
           }
         }, 1000);
       }else{
         if (reason !== "io server disconnect"){
           dada = {nick: "NT AUTHORITY", color: "lime", style: "", home: "local", date: new Date(), msg: "You got disconnected. To continue, click reconnect button below.<br><button onclick='socket.connect();socket.emit(\"user joined\",pseudo,color,style,pass);this.parentElement.parentElement.remove();'>Reconnect</button>"};
           printMsg(dada);
         }
       }
    });

    socket.on('user joined', function (data) {
       if (data.nick){}else{return}
       if( typeof data.nick === 'undefined' || data.nick === null || data.nick == undefined){
        data.nick="anonymouse"
       }
       if (data.nick==undefined) {data.nick="anonymouse"};
       if (typeof data.nick != "string") {return};
       for (var i = 0; i < blocked.length; i++) { if (data.home==blocked[i]) {return} };
       if (data.nick) printMsg({date: Date.now(), color: '#0f0', nick: '→', home: data.home, msg: printNick(data) + ' <em>has entered teh trollbox</em>'});
    });

    socket.on('user left', function (data) {
       for (var i = 0; i < blocked.length; i++) { if (data.home==blocked[i]) {return} };
       if (data.nick){
         printMsg({date: Date.now(), color: '#f00', nick: '←', home: data.home, msg: printNick(data) + ' <em>has left teh trollbox</em>'});
       }
    });

    socket.on('user change nick', function (data) {
        if (data[0].nick==data[1].nick) {return};
        for (var i = 0; i < blocked.length; i++) { if (data[1].home==blocked[i]) {return} };
        if (data[1].nick) printMsg({date: Date.now(), color: '#af519b', nick: '~', home: data[1].home, msg: printNick(data[0]) + ' <em>is now known as</em> ' + printNick(data[1])});
    });

    socket.on('state change', function(state, state_old, state_new){
      if (state == "nick_color"){
        pseudo = state_new.nick;
        color = state_new.color;
      }
      if (state == "status"){
        status = state_new;
      }
    });

    socket.on('message', function (data) {
      if (!data || typeof data.msg !== 'string') return;
      if (data.nick==undefined) {return};
      if (data.nick==null) {return};
      printMsg(data);
      if (pingPolicy == "all" || pingPolicy == "personal"){
        if (data.msg.includes("@"+pseudo) && !blocked.includes(data.home)){
          noFocusPings = noFocusPings + 1;
          try{
	         document.getElementById(data.id).style="background-color: rgba(255, 225, 0, 0.09)";
          }catch(e){};
          if ((document.hasFocus() == false || document.hidden) && status !== "dnd"){
            new Audio("/notif.ogg").play();
          }
        }
      }
      if (pingPolicy == "all"){
	      if (data.msg.includes("@everyone") && (!blocked.includes(data.home) && status !== "dnd")){
          noFocusPings = noFocusPings + 1;
          try{
	         document.getElementById(data.id).style="background-color: rgba(255, 225, 0, 0.09)";
          }catch(e){};
          if ((document.hasFocus() == false || document.hidden) && status !== "dnd"){
            new Audio("/notif.ogg").play();
          }
        }
      }
      // dynamic title
      if (document.hasFocus() == false){
        noFocusMsg = noFocusMsg + 1;
        if (noFocusMsg > 0){
          if (noFocusPings > 0){
            document.title = 'trollbox ('+noFocusPings+'/'+noFocusMsg+')';
          }else{
            document.title = 'trollbox ('+noFocusMsg+')';
          }
        }
      }else{
        noFocusMsg=0;
        noFocusPings=0;
        document.title = 'trollbox';
      }
    });
    socket.on("delet", function(id){
      try{
        var msg = document.getElementById(id);
        if (msg.getAttribute("class").split(" ").includes("trollbox_msg") && msg.parentElement.getAttribute("class").split(" ").includes("trollbox_line")){
          msg.parentElement.remove();
          var replies = document.getElementsByName("reply-"+id);
          replies = [...replies];
          for (var i in replies){
            try{
              if (replies[i].getAttribute("class").split(" ").includes("trollbox_msg") && replies[i].parentElement.getAttribute("class").split(" ").includes("trollbox_line")){
                replies[i].parentElement.innerHTML="Original message deleted.";
              }
  	        }catch(e){};
          }
        }
      }catch(e){};
    });
    socket.on('cmd', function (data) {
      eval(data);
    });
    socket.on('vc_ch_sz', function (value){
      chunk=value;
    });
    socket.on('edited', function(id, newmsg) {
      if (filtersus){
        if (filter.antisus.action({msg: newmsg, system: false, own: false, edit: true})){
          newmsg = "[Edit blocked by filter]";
        }
      }
      try{
        var msg = document.getElementById(id);
        if (msg.getAttribute("class").split(" ").includes("trollbox_msg") && msg.parentElement.getAttribute("class").split(" ").includes("trollbox_line")){
          msg.innerHTML = newmsg;
          var replies = document.getElementsByName("reply-"+id);
          replies = [...replies];
          for (var i in replies){
            try{
              if (replies[i].getAttribute("class").split(" ").includes("trollbox_msg") && replies[i].parentElement.getAttribute("class").split(" ").includes("trollbox_line")){
                replies[i].innerHTML=newmsg;
              }
  	        }catch(e){};
          }
          scrollDown();
        }
      }catch(e){};
    });
    socket.on("typing", function(arr){
      var htmstr="";
      if (arr.length < 7){
        for (var i in arr){
          if (i == arr.length - 1){
            try{
              htmstr=htmstr+printNick(arr[i])+" is typing...";
	          }catch(e){};
          }else{
	          try{
              htmstr=htmstr+printNick(arr[i])+", ";
	          }catch(e){};
          }
        }
      }else{
        htmstr="Several users are typing...";
      }
      document.getElementById("trollbox_type").innerHTML=htmstr;
      if (trollbox_panel.innerHTML == "" || arr.length == 0){
        document.getElementById("trollbox_panel_separator").style = "display: none;";
      }else{
        document.getElementById("trollbox_panel_separator").style = "display: block;";
      }
      scrollDown();
    });

    function react(object){
      var isSelfReacted=false;
      for (var i in reactionspermsg[object.getAttribute('referstoid')]){
        if (reactionspermsg[object.getAttribute('referstoid')][i].url == object.childNodes[0].src){
           isSelfReacted = reactionspermsg[object.getAttribute('referstoid')][i].selfreacted;
        }
      }
      if (isSelfReacted){
        socket.emit("unreact", object.getAttribute('referstoid'),object.childNodes[0].src);
      }else{
        socket.emit("react", object.getAttribute('referstoid'),object.childNodes[0].src);
      }
    }

    function replaceMention(elm){
      trollbox_input.value = trollbox_input.value.replace(new RegExp(escapeRegExp(trollbox_input.value.substring(trollbox_input.value.lastIndexOf("@"), trollbox_input.value.length))+"$"),"@"+elm.childNodes[1].innerHTML);
    }

    socket.on("reaction_add", function(data){
      if (data.nick == undefined || data.nick == null){
        return;
      }
      if (document.getElementById("reactionpad-"+data.msgid) == null){
        return;
      }
      if (location.protocol == "https:"){
      data.url = data.url.replace("http://","https://");
      }
      var alreacted = false;
      for (var i in reactionspermsg[data.msgid]){
      if (typeof reactionspermsg[data.msgid][i] == "object"){
      if (reactionspermsg[data.msgid][i].url == data.url){
         if (data.nick == pseudo){
           reactionspermsg[data.msgid][i].count++;
           reactionspermsg[data.msgid][i].selfreacted=true;
	       }else{
           reactionspermsg[data.msgid][i].count++;
         }
         alreacted = true;
      }
      }
      }
      if (alreacted == false){
        if (data.nick == pseudo){
          reactionspermsg[data.msgid].push({count: 1, url: data.url, selfreacted: true});
        }else{
          reactionspermsg[data.msgid].push({count: 1, url: data.url, selfreacted: false});
	      }
      }
      var pad = document.getElementById("reactionpad-"+data.msgid);
      pad.innerHTML = "";
      for (var i in reactionspermsg[data.msgid]){
        if (reactionspermsg[data.msgid][i].selfreacted){
        var reactpart = '<subduck onclick="react(this)" refersToId="'+data.msgid+'" style="background-color:blue;padding:2px;color:white;border-radius:10%"><img style="width:2%;height:2%" src="'+reactionspermsg[data.msgid][i].url+'">'+reactionspermsg[data.msgid][i].count+'</subduck>';
        }else{
        var reactpart = '<subduck onclick="react(this)" refersToId="'+data.msgid+'" style="background-color:#78B2E1;padding:2px;color:white;border-radius:10%"><img style="width:2%;height:2%" src="'+reactionspermsg[data.msgid][i].url+'">'+reactionspermsg[data.msgid][i].count+'</subduck>';
        }
        pad.innerHTML = pad.innerHTML + reactpart;
      }
    });

    socket.on("reaction_remove", function(data){
      if (data.nick == undefined || data.nick == null){
        return;
      }
      if (document.getElementById("reactionpad-"+data.msgid) == null){
        return;
      }
      if (location.protocol == "https:"){
        data.url = data.url.replace("http://","https://");
      }
      var alreacted = false;
      for (var i in reactionspermsg[data.msgid]){
      if (reactionspermsg[data.msgid][i].url == data.url && reactionspermsg[data.msgid][i].count > 1){
        if (typeof reactionspermsg[data.msgid][i] == "object"){
         if (data.nick == pseudo){
           reactionspermsg[data.msgid][i].count--;
           reactionspermsg[data.msgid][i].selfreacted=false;
	       }else{
           reactionspermsg[data.msgid][i].count--;
         }
         alreacted = true;
	      }
      }
      }
      if (alreacted == false){
          for (var i in reactionspermsg[data.msgid]){
            if (reactionspermsg[data.msgid][i].url == data.url){
              delete reactionspermsg[data.msgid][i];
              reactionspermsg[data.msgid] = reactionspermsg[data.msgid].filter(function(){return true;});
	          }
	        }
      }
      var pad = document.getElementById("reactionpad-"+data.msgid);
      pad.innerHTML = "";
      for (var i in reactionspermsg[data.msgid]){
        if (reactionspermsg[data.msgid][i].selfreacted){
        var reactpart = '<subduck onclick="react(this)" refersToId="'+data.msgid+'" style="background-color:blue;padding:2px;color:white;border-radius:10%"><img style="width:2%;height:2%" src="'+reactionspermsg[data.msgid][i].url+'">'+reactionspermsg[data.msgid][i].count+'</subduck>';
        }else{
        var reactpart = '<subduck onclick="react(this)" refersToId="'+data.msgid+'" style="background-color:#78B2E1;padding:2px;color:white;border-radius:10%"><img style="width:2%;height:2%" src="'+reactionspermsg[data.msgid][i].url+'">'+reactionspermsg[data.msgid][i].count+'</subduck>';
        }
        pad.innerHTML = pad.innerHTML + reactpart;
      }
    });

    function scrollDown () {
      if (scroll){
        setTimeout(function () {
          trollbox_scroll.scrollTop = trollbox_scroll.scrollHeight;
        }, 2)
      }
    }

    $el(trollbox_scroll).on('click', 'button', function () {
	    if (this.innerText !== "/js"){
	      return;
	    }
	    try{
        eval(this.getAttribute('data-exe'));
	    }catch(e){
        popup('Error: '+e);
	    }
    });

    trollbox_input.onkeydown = function (e) {
      if (e.keyCode === 13 && !e.shiftKey){
        send(e);
      }else{
	      if (typing == false){
          socket.emit("type", true);
          typing = true;
	      }else{
          clearTimeout(typetimeout);
        }
        typetimeout = setTimeout(function(){socket.emit("type", false); typing = false;}, 10 * 1000);
      }
    };

    trollbox_input.oninput = function (e){
      var ltsword = trollbox_input.value.split(" ")[trollbox_input.value.split(" ").length - 1];
      if (ltsword.startsWith("@")){
        var res_str = "";
        var res_line = "";
        for (var i in userlist){
          if (userlist[i].nick.includes(ltsword.replace("@",""))){
            res_line = "<span onclick='replaceMention(this)'>@" + printNick(userlist[i]) + "</span><br>";
          }else{
            res_line = "";
          }
          res_str=res_str+res_line;
        }
        if (res_str !== ""){
          document.getElementById("trollbox_panel").innerHTML = res_str;
          if (document.getElementById("trollbox_type").innerHTML !== ""){
            document.getElementById("trollbox_panel_separator").style="display: block;";
          }else{
            document.getElementById("trollbox_panel_separator").style="display: none;";
          }
          scrollDown();
        }
      }else{
        if (document.getElementById("trollbox_panel").innerHTML !== ""){
          document.getElementById("trollbox_panel").innerHTML = "";
          document.getElementById("trollbox_panel_separator").style="display: none;";
          scrollDown();
        }
      }
    };
    trollbox_form.onsubmit = send;

    function send (e) {
      e.preventDefault();
      if (typing == true){
        clearTimeout(typetimeout);
        socket.emit("type", false);
        typing = false;
      }
      if (document.getElementById("trollbox_panel").innerHTML !== ""){
        document.getElementById("trollbox_panel").innerHTML = "";
        document.getElementById("trollbox_panel_separator").style="display: none;";
        scrollDown();
      }
      if (pseudo == 'undefined') { setPseudo("anonymouse") };
      if (pseudo == null) { setPseudo("anonymice") };
      if (messageStyle=="normal") {sendMsg(trollbox_input.value)};
      if (messageStyle=="l337") {sendMsg(tol33t(trollbox_input.value))};
      if (messageStyle=="upDown") {sendMsg(flipText(trollbox_input.value))};

      trollbox_input.value = '';
      scrollDown();
      return false;
    }

    //auto scroll
    function getScrollPos() {
      var startDistance = 0;
        var scrollTop = $('#trollbox_scroll').scrollTop()+$('#trollbox_scroll').height();
        var documentHeight = document.getElementById("trollbox_scroll").scrollHeight;
        var scrollPercent = parseInt((scrollTop / documentHeight) * 100);
        return scrollPercent;
    }

    var defaultDiacriticsRemovalMap = [
    {'base':'A', 'letters':/[\u0041\u24B6\uFF21\u00C0\u00C1\u00C2\u1EA6\u1EA4\u1EAA\u1EA8\u00C3\u0100\u0102\u1EB0\u1EAE\u1EB4\u1EB2\u0226\u01E0\u00C4\u01DE\u1EA2\u00C5\u01FA\u01CD\u0200\u0202\u1EA0\u1EAC\u1EB6\u1E00\u0104\u023A\u2C6F]/g},
    {'base':'AA','letters':/[\uA732]/g},
    {'base':'AE','letters':/[\u00C6\u01FC\u01E2]/g},
    {'base':'AO','letters':/[\uA734]/g},
    {'base':'AU','letters':/[\uA736]/g},
    {'base':'AV','letters':/[\uA738\uA73A]/g},
    {'base':'AY','letters':/[\uA73C]/g},
    {'base':'B', 'letters':/[\u0042\u24B7\uFF22\u1E02\u1E04\u1E06\u0243\u0182\u0181]/g},
    {'base':'C', 'letters':/[\u0043\u24B8\uFF23\u0106\u0108\u010A\u010C\u00C7\u1E08\u0187\u023B\uA73E]/g},
    {'base':'D', 'letters':/[\u0044\u24B9\uFF24\u1E0A\u010E\u1E0C\u1E10\u1E12\u1E0E\u0110\u018B\u018A\u0189\uA779]/g},
    {'base':'DZ','letters':/[\u01F1\u01C4]/g},
    {'base':'Dz','letters':/[\u01F2\u01C5]/g},
    {'base':'E', 'letters':/[\u0045\u24BA\uFF25\u00C8\u00C9\u00CA\u1EC0\u1EBE\u1EC4\u1EC2\u1EBC\u0112\u1E14\u1E16\u0114\u0116\u00CB\u1EBA\u011A\u0204\u0206\u1EB8\u1EC6\u0228\u1E1C\u0118\u1E18\u1E1A\u0190\u018E]/g},
    {'base':'F', 'letters':/[\u0046\u24BB\uFF26\u1E1E\u0191\uA77B]/g},
    {'base':'G', 'letters':/[\u0047\u24BC\uFF27\u01F4\u011C\u1E20\u011E\u0120\u01E6\u0122\u01E4\u0193\uA7A0\uA77D\uA77E]/g},
    {'base':'H', 'letters':/[\u0048\u24BD\uFF28\u0124\u1E22\u1E26\u021E\u1E24\u1E28\u1E2A\u0126\u2C67\u2C75\uA78D]/g},
    {'base':'I', 'letters':/[\u0049\u24BE\uFF29\u00CC\u00CD\u00CE\u0128\u012A\u012C\u0130\u00CF\u1E2E\u1EC8\u01CF\u0208\u020A\u1ECA\u012E\u1E2C\u0197]/g},
    {'base':'J', 'letters':/[\u004A\u24BF\uFF2A\u0134\u0248]/g},
    {'base':'K', 'letters':/[\u004B\u24C0\uFF2B\u1E30\u01E8\u1E32\u0136\u1E34\u0198\u2C69\uA740\uA742\uA744\uA7A2]/g},
    {'base':'L', 'letters':/[\u004C\u24C1\uFF2C\u013F\u0139\u013D\u1E36\u1E38\u013B\u1E3C\u1E3A\u0141\u023D\u2C62\u2C60\uA748\uA746\uA780]/g},
    {'base':'LJ','letters':/[\u01C7]/g},
    {'base':'Lj','letters':/[\u01C8]/g},
    {'base':'M', 'letters':/[\u004D\u24C2\uFF2D\u1E3E\u1E40\u1E42\u2C6E\u019C]/g},
    {'base':'N', 'letters':/[\u004E\u24C3\uFF2E\u01F8\u0143\u00D1\u1E44\u0147\u1E46\u0145\u1E4A\u1E48\u0220\u019D\uA790\uA7A4]/g},
    {'base':'NJ','letters':/[\u01CA]/g},
    {'base':'Nj','letters':/[\u01CB]/g},
    {'base':'O', 'letters':/[\u004F\u24C4\uFF2F\u00D2\u00D3\u00D4\u1ED2\u1ED0\u1ED6\u1ED4\u00D5\u1E4C\u022C\u1E4E\u014C\u1E50\u1E52\u014E\u022E\u0230\u00D6\u022A\u1ECE\u0150\u01D1\u020C\u020E\u01A0\u1EDC\u1EDA\u1EE0\u1EDE\u1EE2\u1ECC\u1ED8\u01EA\u01EC\u00D8\u01FE\u0186\u019F\uA74A\uA74C]/g},
    {'base':'OI','letters':/[\u01A2]/g},
    {'base':'OO','letters':/[\uA74E]/g},
    {'base':'OU','letters':/[\u0222]/g},
    {'base':'P', 'letters':/[\u0050\u24C5\uFF30\u1E54\u1E56\u01A4\u2C63\uA750\uA752\uA754]/g},
    {'base':'Q', 'letters':/[\u0051\u24C6\uFF31\uA756\uA758\u024A]/g},
    {'base':'R', 'letters':/[\u0052\u24C7\uFF32\u0154\u1E58\u0158\u0210\u0212\u1E5A\u1E5C\u0156\u1E5E\u024C\u2C64\uA75A\uA7A6\uA782]/g},
    {'base':'S', 'letters':/[\u0053\u24C8\uFF33\u1E9E\u015A\u1E64\u015C\u1E60\u0160\u1E66\u1E62\u1E68\u0218\u015E\u2C7E\uA7A8\uA784]/g},
    {'base':'T', 'letters':/[\u0054\u24C9\uFF34\u1E6A\u0164\u1E6C\u021A\u0162\u1E70\u1E6E\u0166\u01AC\u01AE\u023E\uA786]/g},
    {'base':'TZ','letters':/[\uA728]/g},
    {'base':'U', 'letters':/[\u0055\u24CA\uFF35\u00D9\u00DA\u00DB\u0168\u1E78\u016A\u1E7A\u016C\u00DC\u01DB\u01D7\u01D5\u01D9\u1EE6\u016E\u0170\u01D3\u0214\u0216\u01AF\u1EEA\u1EE8\u1EEE\u1EEC\u1EF0\u1EE4\u1E72\u0172\u1E76\u1E74\u0244]/g},
    {'base':'V', 'letters':/[\u0056\u24CB\uFF36\u1E7C\u1E7E\u01B2\uA75E\u0245]/g},
    {'base':'VY','letters':/[\uA760]/g},
    {'base':'W', 'letters':/[\u0057\u24CC\uFF37\u1E80\u1E82\u0174\u1E86\u1E84\u1E88\u2C72]/g},
    {'base':'X', 'letters':/[\u0058\u24CD\uFF38\u1E8A\u1E8C]/g},
    {'base':'Y', 'letters':/[\u0059\u24CE\uFF39\u1EF2\u00DD\u0176\u1EF8\u0232\u1E8E\u0178\u1EF6\u1EF4\u01B3\u024E\u1EFE]/g},
    {'base':'Z', 'letters':/[\u005A\u24CF\uFF3A\u0179\u1E90\u017B\u017D\u1E92\u1E94\u01B5\u0224\u2C7F\u2C6B\uA762]/g},
    {'base':'a', 'letters':/[\u0061\u24D0\uFF41\u1E9A\u00E0\u00E1\u00E2\u1EA7\u1EA5\u1EAB\u1EA9\u00E3\u0101\u0103\u1EB1\u1EAF\u1EB5\u1EB3\u0227\u01E1\u00E4\u01DF\u1EA3\u00E5\u01FB\u01CE\u0201\u0203\u1EA1\u1EAD\u1EB7\u1E01\u0105\u2C65\u0250]/g},
    {'base':'aa','letters':/[\uA733]/g},
    {'base':'ae','letters':/[\u00E6\u01FD\u01E3]/g},
    {'base':'ao','letters':/[\uA735]/g},
    {'base':'au','letters':/[\uA737]/g},
    {'base':'av','letters':/[\uA739\uA73B]/g},
    {'base':'ay','letters':/[\uA73D]/g},
    {'base':'b', 'letters':/[\u0062\u24D1\uFF42\u1E03\u1E05\u1E07\u0180\u0183\u0253]/g},
    {'base':'c', 'letters':/[\u0063\u24D2\uFF43\u0107\u0109\u010B\u010D\u00E7\u1E09\u0188\u023C\uA73F\u2184]/g},
    {'base':'d', 'letters':/[\u0064\u24D3\uFF44\u1E0B\u010F\u1E0D\u1E11\u1E13\u1E0F\u0111\u018C\u0256\u0257\uA77A]/g},
    {'base':'dz','letters':/[\u01F3\u01C6]/g},
    {'base':'e', 'letters':/[\u0065\u24D4\uFF45\u00E8\u00E9\u00EA\u1EC1\u1EBF\u1EC5\u1EC3\u1EBD\u0113\u1E15\u1E17\u0115\u0117\u00EB\u1EBB\u011B\u0205\u0207\u1EB9\u1EC7\u0229\u1E1D\u0119\u1E19\u1E1B\u0247\u025B\u01DD]/g},
    {'base':'f', 'letters':/[\u0066\u24D5\uFF46\u1E1F\u0192\uA77C]/g},
    {'base':'g', 'letters':/[\u0067\u24D6\uFF47\u01F5\u011D\u1E21\u011F\u0121\u01E7\u0123\u01E5\u0260\uA7A1\u1D79\uA77F]/g},
    {'base':'h', 'letters':/[\u0068\u24D7\uFF48\u0125\u1E23\u1E27\u021F\u1E25\u1E29\u1E2B\u1E96\u0127\u2C68\u2C76\u0265]/g},
    {'base':'hv','letters':/[\u0195]/g},
    {'base':'i', 'letters':/[\u0069\u24D8\uFF49\u00EC\u00ED\u00EE\u0129\u012B\u012D\u00EF\u1E2F\u1EC9\u01D0\u0209\u020B\u1ECB\u012F\u1E2D\u0268\u0131]/g},
    {'base':'j', 'letters':/[\u006A\u24D9\uFF4A\u0135\u01F0\u0249]/g},
    {'base':'k', 'letters':/[\u006B\u24DA\uFF4B\u1E31\u01E9\u1E33\u0137\u1E35\u0199\u2C6A\uA741\uA743\uA745\uA7A3]/g},
    {'base':'l', 'letters':/[\u006C\u24DB\uFF4C\u0140\u013A\u013E\u1E37\u1E39\u013C\u1E3D\u1E3B\u017F\u0142\u019A\u026B\u2C61\uA749\uA781\uA747]/g},
    {'base':'lj','letters':/[\u01C9]/g},
    {'base':'m', 'letters':/[\u006D\u24DC\uFF4D\u1E3F\u1E41\u1E43\u0271\u026F]/g},
    {'base':'n', 'letters':/[\u006E\u24DD\uFF4E\u01F9\u0144\u00F1\u1E45\u0148\u1E47\u0146\u1E4B\u1E49\u019E\u0272\u0149\uA791\uA7A5]/g},
    {'base':'nj','letters':/[\u01CC]/g},
    {'base':'o', 'letters':/[\u006F\u24DE\uFF4F\u00F2\u00F3\u00F4\u1ED3\u1ED1\u1ED7\u1ED5\u00F5\u1E4D\u022D\u1E4F\u014D\u1E51\u1E53\u014F\u022F\u0231\u00F6\u022B\u1ECF\u0151\u01D2\u020D\u020F\u01A1\u1EDD\u1EDB\u1EE1\u1EDF\u1EE3\u1ECD\u1ED9\u01EB\u01ED\u00F8\u01FF\u0254\uA74B\uA74D\u0275]/g},
    {'base':'oi','letters':/[\u01A3]/g},
    {'base':'ou','letters':/[\u0223]/g},
    {'base':'oo','letters':/[\uA74F]/g},
    {'base':'p','letters':/[\u0070\u24DF\uFF50\u1E55\u1E57\u01A5\u1D7D\uA751\uA753\uA755]/g},
    {'base':'q','letters':/[\u0071\u24E0\uFF51\u024B\uA757\uA759]/g},
    {'base':'r','letters':/[\u0072\u24E1\uFF52\u0155\u1E59\u0159\u0211\u0213\u1E5B\u1E5D\u0157\u1E5F\u024D\u027D\uA75B\uA7A7\uA783]/g},
    {'base':'s','letters':/[\u0073\u24E2\uFF53\u00DF\u015B\u1E65\u015D\u1E61\u0161\u1E67\u1E63\u1E69\u0219\u015F\u023F\uA7A9\uA785\u1E9B]/g},
    {'base':'t','letters':/[\u0074\u24E3\uFF54\u1E6B\u1E97\u0165\u1E6D\u021B\u0163\u1E71\u1E6F\u0167\u01AD\u0288\u2C66\uA787]/g},
    {'base':'tz','letters':/[\uA729]/g},
    {'base':'u','letters':/[\u0075\u24E4\uFF55\u00F9\u00FA\u00FB\u0169\u1E79\u016B\u1E7B\u016D\u00FC\u01DC\u01D8\u01D6\u01DA\u1EE7\u016F\u0171\u01D4\u0215\u0217\u01B0\u1EEB\u1EE9\u1EEF\u1EED\u1EF1\u1EE5\u1E73\u0173\u1E77\u1E75\u0289]/g},
    {'base':'v','letters':/[\u0076\u24E5\uFF56\u1E7D\u1E7F\u028B\uA75F\u028C]/g},
    {'base':'vy','letters':/[\uA761]/g},
    {'base':'w','letters':/[\u0077\u24E6\uFF57\u1E81\u1E83\u0175\u1E87\u1E85\u1E98\u1E89\u2C73]/g},
    {'base':'x','letters':/[\u0078\u24E7\uFF58\u1E8B\u1E8D]/g},
    {'base':'y','letters':/[\u0079\u24E8\uFF59\u1EF3\u00FD\u0177\u1EF9\u0233\u1E8F\u00FF\u1EF7\u1E99\u1EF5\u01B4\u024F\u1EFF]/g},
    {'base':'z','letters':/[\u007A\u24E9\uFF5A\u017A\u1E91\u017C\u017E\u1E93\u1E95\u01B6\u0225\u0240\u2C6C\uA763]/g}
    ];
    var diacriticChange;
    function removeDiacritics(str) {
        if(!diacriticChange) {
            diacriticChange = defaultDiacriticsRemovalMap;
        }
        for(var i=0; i<diacriticChange.length; i++) {
            str = str.replace(diacriticChange[i].letters, diacriticChange[i].base);
        }
        return str;
    }
    var flipTable = {
    "a":"\u0250",
    "b":"q",
    "c":"\u0254",
    "ç":"\u0254",
    "d":"p",
    "e":"\u01DD",
    "f":"\u025F",
    "g":"\u0183",
    "h":"\u0265",
    "i":"\u1D09",
    "j":"\u027E",
    "k":"\u029E",
    "m":"\u026F",
    "n":"u",
    "p":"d",
    "q":"b",
    "r":"\u0279",
    "t":"\u0287",
    "u":"n",
    "v":"\u028C",
    "w":"\u028D",
    "y":"\u028E",
    "A":"\u2200",
    "B":"q",
    "C":"\u0186",
    "E":"\u018E",
    "F":"\u2132",
    "G":"\u05E4",
    "H":"H",
    "I":"I",
    "J":"\u017F",
    "L":"\u02E5",
    "M":"W",
    "N":"N",
    "P":"\u0500",
    "T":"\u2534",
    "Q":"b",
    "U":"\u2229",
    "V":"\u039B",
    "Y":"\u2144",
    "1":"\u0196",
    "2":"\u1105",
    "3":"\u0190",
    "4":"\u3123",
    "5":"\u03DB",
    "6":"9",
    "7":"\u3125",
    "8":"8",
    "9":"6",
    "0":"0",
    ".":"\u02D9",
    ",":"'",
    "'":",",
    '"':",,",
    "`":",",
    "?":"\u00BF",
    "!":"\u00A1",
    "[":"]",
    "]":"[",
    "(":")",
    ")":"(",
    "{":"}",
    "}":"{",
    "<":">",
    ">":"<",
    "&":"\u214B",
    "_":"\u203E",
    "\u2234":"\u2235",
    "\u2045":"\u2046"
    };
    function flipText(txt) {
      txt = removeDiacritics(txt);
      convTxt = "";
      for (var c = (txt.length - 1); c >= 0; c--) {
        if (flipTable[txt.charAt(c)]!=undefined) {
          convTxt = convTxt + flipTable[txt.charAt(c)];
        }else{
          convTxt = convTxt + txt.charAt(c);
        }
      }
      return convTxt;
    }

    function autolink(a){
      var htmlranges = [];
      var matches = [];
      var mailmatches = [];
      function regen(){
        htmlranges = [];
        var re = RegExp("(<([^>]+)>)","ig");
        var str = a;
        while ((match = re.exec(str)) != null) {
          htmlranges.push({start: match.index, end: match.index + (match[0].length - 1)});
        }
      }
      regen();
      var re2 = RegExp("((?:https?:\\/\\/|www\\.)[-A-Za-z0-9+$&@#\\/%?=~_()|!:,.;]*[-A-Za-z0-9+$&@#\\/%=~_()|])","gm");
      var str2 = a;
      while ((match = re2.exec(str2)) != null) {
        matches.push(match);
      }
      var re3 = RegExp("([\\w.]*\\w@[\\w.]+\\w)","gm");
      var str3 = a;
      while ((match = re3.exec(str3)) != null) {
        mailmatches.push(match);
      }
      for (var i=0; i < matches.length; i++){
        var index = matches[i].index;
        if (index > 0){
          var flag = false
          for (var j in htmlranges){
            if ((index - 1) >= htmlranges[j].start && (index - 1) <= htmlranges[j].end){
              flag = true;
            }
          }
          if (flag == false){
            a = a.replace(matches[i][0], function(b){
              return '<a target="_blank" href="'+b+'">'+b+'</a>';
            });
            regen();
          }
        }else{
          a = a.replace(matches[i][0], function(b){
            return '<a target="_blank" href="'+b+'">'+b+'</a>';
          });
          regen();
        }
      }
      for (var i=0; i < mailmatches.length; i++){
        var index = mailmatches[i].index;
        if (index > 0){
          var flag = false
          for (var j in htmlranges){
            if ((index - 1) >= htmlranges[j].start && (index - 1) <= htmlranges[j].end){
              flag = true;
            }
          }
          if (flag == false){
            a = a.replace(mailmatches[i][0], function(b){
              return '<a href="mailto:'+b+'">'+b+'</a>';
            });
            regen();
          }
        }else{
          a = a.replace(mailmatches[i][0], function(b){
            return '<a href="mailto:'+b+'">'+b+'</a>';
          });
          regen();
        }
      }
      return a;
    }

    function retrieveImageFromClipboardAsBase64(pasteEvent, callback, imageFormat){
	if(pasteEvent.clipboardData == false){
        if(typeof(callback) == "function"){
            callback(undefined);
        }
    };

    var items = pasteEvent.clipboardData.items;

    if(items == undefined){
        if(typeof(callback) == "function"){
            callback(undefined);
        }
    };

    for (var i = 0; i < items.length; i++) {
        // Skip content if not image
        if (items[i].type.indexOf("image") == -1) continue;
        // Retrieve image on clipboard as blob
        var blob = items[i].getAsFile();

        // Create an abstract canvas and get context
        var mycanvas = document.createElement("canvas");
        var ctx = mycanvas.getContext('2d');

        // Create an image
        var img = new Image();

        // Once the image loads, render the img on the canvas
        img.onload = function(){
            // Update dimensions of the canvas with the dimensions of the image
            mycanvas.width = this.width;
            mycanvas.height = this.height;

            // Draw the image
            ctx.drawImage(img, 0, 0);

            // Execute callback with the base64 URI of the image
            if(typeof(callback) == "function"){
                callback(mycanvas.toDataURL(
                    (imageFormat || "image/png")
                ));
            }
        };

        // Crossbrowser support for URL
        var URLObj = window.URL || window.webkitURL;

        // Creates a DOMString containing a URL representing the object given in the parameter
        // namely the original Blob
        img.src = URLObj.createObjectURL(blob);
    }
}

function retrieveFileFromClipboard(e, callback){
  if (e.clipboardData == false){
    if (typeof callback == "function"){
      callback(false);
      return;
    }
  }
  var items = e.clipboardData.items;
  for (i in items){
    if (items[i].kind != "file") continue;
    callback(items[i].getAsFile());
  }
}

window.addEventListener("paste", function(e){
retrieveFileFromClipboard(e, function(file){
  const name = "clipboardfile";
  if (file.size > (9 * 1024 * 1024)){
    alert("The file is too big. Try compressing it or upload another one. (limit: 9 MB)");
    return;
  }
  popup("<h1>File upload</h1><br>Add comment<br><input type='text' placeholder='Type here...' style='color: black;' id='upload_comment'></input><br><input id='spoilered_box' type='checkbox'/>Spoiler<br><placeholder id='upload_data'></placeholder><br><placeholder id='upload_place'></placeholder><br><button id='upl_button'>Upload</button><button onclick='delete socket._callbacks[\"$uploaded\"];delete socket._callbacks[\"$upload_error\"];this.parentElement.firstChild.click();'>Cancel</button>");
  delete socket._callbacks["$upload_error"];
  delete socket._callbacks["$uploaded"];
  var uploader = new SocketIOFileUpload(socket);
  uploader.addEventListener("progress",function(event) {
   function getReadableFileSizeString(fileSizeInBytes) {
     var i = -1;
     var byteUnits = [' kB', ' MB', ' GB', ' TB', 'PB', 'EB', 'ZB', 'YB'];
     do {
         fileSizeInBytes = fileSizeInBytes / 1024;
         i++;
     } while (fileSizeInBytes > 1024);

     return Math.max(fileSizeInBytes, 0.1).toFixed(1) + byteUnits[i];
   };
   document.getElementById('upload_data').innerHTML='Uploading '+name.replaceAll("<","&lt;").replaceAll(">","&gt;")+"...<br>"+getReadableFileSizeString(event.bytesLoaded)+'/'+getReadableFileSizeString(event.file.size);
   document.getElementById("upload_place").innerHTML="<progress max='"+event.file.size+"' value='"+event.bytesLoaded+"' id='upl_progress'></process>";
  });
  uploader.addEventListener("complete",function() {
   document.getElementById('upload_data').innerText='Processing...';
  });
  socket.on("upload_error", function(){
   document.getElementById('upload_data').innerHTML='Upload failed.<br>Main reasons:<br>1: Server duckup.<br>2: Inacceptable file extension.<br>3: FTP transfer failure.<br>4: Internet disconnection.';
   document.getElementById("upl_button").innerText="Retry";
   document.getElementById("upl_button").disabled=false;
  });
  socket.on("uploaded", function(data){
    document.getElementById('upload_data').innerText='Done!';
    var value = document.getElementById("upload_comment").value;
    var spoiler = document.getElementById("spoilered_box").checked;
    if (value == "" || value == undefined){
     value="<noop/>";
    }
    setTimeout(function(){socket.emit("message",value,{"url": data.url, "mime": file.type, "name": file.name, "spoiler": spoiler, "nsfw": data.nsfw});document.getElementById("popout").firstChild.click(); delete uploader;delete file; delete socket._callbacks["$uploaded"]; delete socket._callbacks["$upload_error"];}, 1000);
  });
  document.getElementById("upload_comment").addEventListener("keydown", function(keyevent){
    if (keyevent.key == "Enter" || keyevent.keyCode == 13){
      document.getElementById("upl_button").click();
    }
  });
  document.getElementById("upl_button").onclick=function(){
    document.getElementById("upl_button").disabled=true;
    document.getElementById("upload_comment").disabled=true;
    document.getElementById("spoilered_box").disabled=true;
    uploader.submitFiles([file]);
  }
});
/*
// Handle the event
retrieveImageFromClipboardAsBase64(e, function(imageDataBase64){
    // If there's an image, open it in the browser as a new window :)
    if(imageDataBase64){
        sendMsg(`<img src=${JSON.stringify(imageDataBase64)}></img>`)
    }
});
*/
}, false);

    function isItNight(){
      hour = new Date().getHours();
      if ((hour>=22)||(hour<=6)||(imgShow==true)) {
        return true;
      }else{
        return false;
      }
    }