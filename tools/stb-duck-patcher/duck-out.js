function outEval(c){eval(c)}window.exportedEnv={},!function(global){!function(e){var i='class="';e.showdown.extension("highlight",function({pre:r=!1,auto_detection:c=!0}={}){return[{type:"output",filter:(e,o,n)=>{return showdown.helper.replaceRecursiveRegExp(e,(e,o,n,t)=>{o=he.decode(o);var s=(n.match(/class=\"([^ \"]+)/)||[])[1];if(!s&&!c)return e;if(n.includes(i)){const r=n.indexOf(i)+i.length;n=n.slice(0,r)+"hljs "+n.slice(r)}else n=n.slice(0,-1)+' class="hljs">';return r&&s&&(n=n.replace("<pre>",`<pre class="${s} language-${s}">`)),s&&hljs.getLanguage(s)?n+hljs.highlight(o,{language:s}).value+t:n+hljs.highlightAuto(o).value+t},"<pre><code\\b[^>]*>","</code></pre>","g")}}]}),e.showdown.extension("nosus",function(){return[{type:"lang",regex:/^#/gm,replace:"\\#"}]}),e.showdown.extension("noduck",function(){return[{type:"output",filter:function(e){return e}}]})}(global),function(){"use strict";global.showdown.extension("htmlescape",[{type:"lang",filter:function(e,o,n){var t=[];function s(e){return"~C"+(t.push(e)-1)+"C"}for(e=(e+="~0").replace(/(^[ \t]*>([ \t]*>)*)(?=.*?$)/gm,function(e){return e.replace(/>/g,"~Q")}),e=(e=(e=(e=(e=(e=n.ghCodeBlocks?e.replace(/(^|\n)(```(.*)\n([\s\S]*?)\n```)/g,function(e,o,n){return o+s(n)}):e).replace(/((?:(?:(?: |\t|~Q)*?~Q)?\n){2}|^(?:(?: |\t|~Q)*?~Q)?)((?:(?:(?: |\t|~Q)*?~Q)?(?:[ ]{4}|\t).*\n+)+)((?:(?: |\t|~Q)*?~Q)?\n*[ ]{0,3}(?![^ \t\n])|(?=(?:(?: |\t|~Q)*?~Q)?~0))/g,function(e,o,n,t){return o+s(n)+t})).replace(/(^|[^\\])((`+)([^\r]*?[^`])\3)(?!`)/gm,s)).replace(/&/g,"&amp;")).replace(/</g,"&lt;")).replace(/>/g,"&gt;");0<=e.search(/~C(\d+)C/);){var r=(r=t[RegExp.$1]).replace(/\$/g,"$$$$");e=e.replace(/~C\d+C/,r)}return(e=e.replace(/~Q/g,">")).replace(/~0$/,"")}}])}();var domp=new DOMParser,mdconverter=new showdown.Converter({extensions:["noduck","htmlescape","nosus","highlight"],noHeaderId:!0,strikethrough:!0,underline:!0,parseImgDimensions:!0,emoji:!0,ghCodeBlocks:!0}),md2html=function(e){var e=mdconverter.makeHtml(e),e=domp.parseFromString(e,"text/html"),o=(console.log(e),e.body.getElementsByTagName("p")[0]),n=(console.log(o),o=o||e.body,console.log(o),o.getElementsByTagName("img"));console.log(n);for(var t=0;t<n.length;t++)n[t].src="https://proxy.suspc.cf/?url="+encodeURIComponent(n[t].src);return o},_commands={},stb_scroll=(window.exportedEnv._commands=_commands,_commands.help={help:"this",exec:function(){var e,o=document.createElement("table"),n=document.createElement("tbody");for(e in o.classList.add("helpcmd"),_commands){var t=_commands[e],s=document.createElement("tr"),r=document.createElement("td"),c=document.createElement("td"),i=document.createElement("td");r.innerHTML="/<u>"+he.encode(e)+"</u>",c.innerHTML="<b>"+he.encode((t.args||[]).map(function(e){return e[1]?"["+e[0]+"]":"<"+e[0]+">"}).join(" "))+"</b> ",i.innerHTML=t.help||"[none]",s.appendChild(r),s.appendChild(c),s.appendChild(i),n.appendChild(s)}o.appendChild(n),printSysMsg(o.outerHTML+"<br>[...] = required",null,null,!0)}},_commands.scroll={help:"enable or disable auto scroll",exec:function(){scrollDown(),printSysMsg("Auto Scroll: "+!(scroll=!scroll))}},_commands.clear={help:"clear message",exec:function(){stb_scroll.innerHTML=""}},_commands.color={help:"set color",args:[["color",!0]],exec:function(e){color=e[0],localStorage.color=color,socket.emit("user joined",pseudo,color)}},_commands.block={help:"block someone",args:[["home|user",!0]],exec:function(e){var o,n=e.join(" ");for(o in users)blocked.includes(o)||(users[o]&&users[o].includes(n)||"local"!==n&&o===n)&&blocked.push(o);localStorage.blocked=JSON.stringify(blocked),printSysMsg("User is now blocked.")}},_commands.unblock={help:"unblock someone",args:[["home|user",!0]],exec:function(e){var o,n=e.join(" ");for(o in users)users[o]&&users[o].includes(n)?blocked=blocked.filter(e=>e!==o):o===n&&(blocked=blocked.filter(e=>e!==o));localStorage.blocked=JSON.stringify(blocked),printSysMsg("User is now unblocked.")}},_commands.clblock={help:"clear block list",exec:function(){blocked=[],localStorage.blocked=JSON.stringify(blocked),printSysMsg("Block list cleared.")}},_commands.who={help:"list users by [home]",exec:function(e){var o,n,t=printSysMsg("<b>List of users by home</b>\n","~","white",!0).getElementsByClassName("stb_msg")[0],s={};for(o in users){var r=users[o];s[r.home]?s[r.home].push(printNick(r)):s[r.home]=[printNick(r)]}for(n in s){for(var c in t.appendChild(document.createTextNode(n)),t.appendChild(document.createTextNode(": ")),s[n])t.appendChild(s[n][c]),c!==(s[n].length-1).toString()&&t.appendChild(document.createTextNode(", "));t.appendChild(document.createElement("br"))}}},_commands.room={help:"enter a room",args:[["name",!1],["password",!1]],exec:function(e){if(e[0])socket.emit("join room",e[0],e[1],function(e,o){console.log(o)});else{var o="**Roooms: "+Object.keys(rooms).length+"**\n";for(room in rooms)o+=room+" - "+Object.values(rooms[room].users).map(e=>printNick(e).outerHTML).join(", ")+"\n";printSysMsg(o)}}},_commands.r=_commands.room,document.getElementById("stb_scroll")),stb_form=document.getElementById("stb_form"),stb_infos_users=document.getElementById("stb_infos_users"),stb_infos_rooms=document.getElementById("stb_infos_rooms"),stb_infos_users_btn=document.getElementById("stb_infos_users_btn"),stb_infos_rooms_btn=document.getElementById("stb_infos_rooms_btn"),stb_nick_btn=document.getElementById("stb_nick_btn"),stb_input=document.getElementById("stb_input"),typing_bar=document.getElementById("typing"),socket=io({transports:["websocket","polling"],forceNew:!0}),pseudo=localStorage.nick||"",color=localStorage.color||"",blocked=JSON.parse(localStorage.blocked||"[]"),warnTxt="/!\\ Be careful, h...",exeScript="outEval(atob(this.getAttribute('data-exe')));",scroll=!0,users={},rooms={},userhome={},typing=!1,typetimeout=-1,noFocusMsg=0,noFocusPings=0,title="strollbox",disconMsgs=[];function getPseudo(){var e;(e=prompt("nickname ?"))!==pseudo&&setPseudo(pseudo=e||((pseudo=null===pseudo?"anonymous":pseudo)||"anonymous"))}function setPseudo(e){pseudo=e,stb_nick_btn.textContent=pseudo,localStorage.nick=pseudo,socket.emit("user joined",pseudo,color)}function hourSus(e){return(e=new Date(e)).getHours().toString().padStart(2,"0")+":"+e.getMinutes().toString().padStart(2,"0")}function printNick(e){var o,n;if(void 0===e.nick&&(e.nick="●"),void 0===e.color&&(e.color="white"),e.html||(e.nick=he.encode(e.nick||"")),""===he.decode(e.nick||"")&&(e.nick="●"),"string"==typeof e.nick)return o=document.createElement("span"),e.home&&blocked.includes(e.home)&&((n=document.createElement("span")).style.float="left",n.style.marginRight="4px",n.style.marginTop="1px",n.innerHTML="❌",o.appendChild(n)),o.classList="stb_nick",o.innerHTML+=e.nick,o.style.color=e.color,twemoji.parse(o)}function getCmd(e){if(e.startsWith("/")){var e=e.slice(1).split(" "),o=e.shift();if(""!==o.trim())return{cmd:o,args:e}}}function execCommand(e,o,n){var t=_commands[e];if(!t)return n;n=(t.args||[]).filter(function(e){return e[1]}).length;if(o.length<n)return printSysMsg("error: not enough arguments"),"";try{var s=t.exec(o);return"string"!=typeof(s=void 0===s?"":s)&&(s+=""),s.trim()?s:""}catch(e){return console.error(e),printSysMsg("error: something went wrong"),""}}function sendMsg(e){var o;"string"==typeof e&&(null==color&&(color="white"),"string"==typeof e&&""!==(e=1e4<(e=(o=getCmd(e))&&o.cmd?execCommand(o.cmd,o.args,e):e).length?e.slice(0,1e4):e).trim()&&socket.emit("message",e))}function PPing(e,o){if("local"!==e.user.home&&!blocked.includes(e.home)){for(var n=e.content.toLowerCase(),t=[pseudo.toLowerCase(),"everyone","here"],s=!1,r=0;r<t.length;r++)(n.includes(" @"+t[r]+" ")||n==="@"+t[r]||n.endsWith("@"+t[r])||n.startsWith("@"+t[r]+" "))&&(s=!0);s&&((o=o||document.getElementById(e.id))&&(o.style.backgroundColor="rgba(255, 255, 0, 0.05)"),0!=document.hasFocus()&&!document.hidden||(new Audio("/ping.ogg").play(),noFocusPings++))}}function printMsg(e){if(e&&"string"==typeof e.content&&""!=e.content.trim()&&null!=e.user.nick&&null!=e.user.nick&&null!=e.user.home&&null!=e.user.home&&e.user.home&&("local"===e.user.home||!blocked.includes(e.home))&&"string"==typeof e.user.nick){var o=getCmd(e.content),o=(o?"exe"===o.cmd&&(e.content='<div class="stb_exe"><button title="'+warnTxt+'" onclick="'+exeScript+'" data-exe="'+btoa(o.val)+'">/exe</button>'+he.encode(o.val)+"</div>"):e.html||(e.content=twemoji.parse(md2html(e.content)).innerHTML),document.createElement("span")),n=(o.innerHTML=e.content,o.classList.add("stb_msg"),e.id?o.id=e.id:o.classList.add("stb_sysmsg"),document.createElement("span")),t=(n.className="stb_h",n.innerText=hourSus(e.date),document.createElement("div"));e.user.nick=e.user.nick||"●",t.className="stb_line ui_group",t.appendChild(n),t.appendChild(printNick(e.user)),t.appendChild(o),stb_scroll.appendChild(t);try{PPing(e,t)}catch(e){console.error(e)}return 90<getScrollPos()&&scrollDown(),t}}function printSysMsg(e,o,n,t,s){return o=o||"~",n=n||"white",s=s||"local",t=t||!1,printMsg({date:Date.now(),user:{nick:(o+"").trim(),color:(n+"").trim(),home:(s+"").trim()},content:e,html:t})}function printRoom(e,o){var n=document.createElement("span");return o&&e.name===users[socket.id].inroom&&(n=document.createElement("b")),e.locked?n.innerText="🔓 #":n.innerText="#",n.innerText+=e.name,n.addEventListener("click",function(){e.locked?socket.emit("join room",e.name,prompt("password?")):socket.emit("join room",e.name)}),n}function scrollDown(){scroll&&setTimeout(function(){stb_scroll.scrollTop=stb_scroll.scrollHeight},200)}function send(e){return e.preventDefault(),typing&&(socket.emit("typing",!1),typing=!1),pseudo||setPseudo("anonymous"),sendMsg(stb_input.value),stb_input.value="",scrollDown(),!1}function getScrollPos(){var e=stb_scroll.scrollTop+stb_scroll.offsetHeight,o=stb_scroll.scrollHeight;return parseInt(e/o*100)}window.exportedEnv.socket=socket,window.exportedEnv.users=users,stb_infos_users_btn.addEventListener("click",()=>{stb_infos_users.style.display="",stb_infos_rooms.style.display="none"}),stb_infos_rooms_btn.addEventListener("click",()=>{stb_infos_users.style.display="none",stb_infos_rooms.style.display=""}),stb_nick_btn.addEventListener("click",getPseudo),document.addEventListener("click",function(){document.title=title,noFocusMsg=0}),socket.on("connect data",function(e){pseudo?setPseudo(pseudo):getPseudo();for(var o=0;o<disconMsgs.length;o++)try{disconMsgs[o].remove()}catch(e){console.error(e)}disconMsgs=[]}),socket.on("typing",function(e){var o=document.createDocumentFragment(),n=Object.values(e),t=n.length-1;if(n.length<7)for(var s=0;s<n.length;s++)if(s===t)try{o.appendChild(printNick(n[s])),o.appendChild(document.createTextNode(" is typing..."))}catch(e){console.error(e)}else try{o.appendChild(printNick(n[s])),o.appendChild(document.createTextNode(", "))}catch(e){console.error(e)}else o.appendChild(document.createTextNode("Several users are typing..."));typing_bar.innerHTML="",typing_bar.appendChild(o)}),socket.on("update users",function(o){for(var n in users=o,global.users=o,userhome={},o)userhome[o[n].home]?userhome[o[n].home].push(o[n].nick):userhome[o[n].home]=[o[n].nick];global.userhome=userhome,stb_infos_users.innerHTML="";var e,t=document.createDocumentFragment();for(n in o)o.hasOwnProperty(n)&&((e=printNick(o[n])).style.display="table","local"!==o[n].home&&(e.addEventListener("click",function(e){e.preventDefault(),blocked=blocked.filter(e=>e!==o[n].home),localStorage.blocked=JSON.stringify(blocked),printSysMsg("User is now unblocked")}),e.addEventListener("contextmenu",function(e){e.preventDefault(),blocked.includes(o[n].home)||blocked.push(o[n].home),localStorage.blocked=JSON.stringify(blocked),printSysMsg("User is now blocked")})),t.appendChild(e));stb_infos_users.appendChild(t)}),socket.on("update rooms",function(e){for(var o in rooms=e,global.rooms=e,stb_infos_rooms.innerHTML="",e)stb_infos_rooms.appendChild(printRoom(e[o],!0))}),socket.on("disconnect",function(e){"io server disconnect"!==e&&(e=printMsg({user:{nick:"~",color:"white",home:"local"},html:!0,date:new Date,content:"Server has been restarted/You got disconnected. reason: "+e+"\nTo continue, reload the page<br><button onclick='location.reload()'>Reload</button>"}),disconMsgs.push(e))}),socket.on("user joined",function(e){var o;!blocked.includes(e.home)&&e.nick&&((o=printMsg({user:{color:"lime",nick:"→",home:e.home},date:Date.now(),content:"​"}).getElementsByClassName("stb_msg")[0]).appendChild(printNick(e)),o.appendChild(document.createTextNode(" has entered.")))}),socket.on("user left",function(e){var o;!blocked.includes(e.home)&&e.nick&&((o=printMsg({user:{color:"red",nick:"←",home:e.home},date:Date.now(),content:"​"}).getElementsByClassName("stb_msg")[0]).appendChild(printNick(e)),o.appendChild(document.createTextNode(" has left.")))}),socket.on("user change nick",function(e,o){var n;e.nick!==o.nick&&!blocked.includes(o.home)&&o.nick&&((n=printMsg({user:{color:"#af519b",nick:"~",home:o.home},date:Date.now(),content:"​"}).getElementsByClassName("stb_msg")[0]).appendChild(printNick(e)),n.appendChild(document.createTextNode(" is now known as ")),n.appendChild(printNick(o)))}),socket.on("user room join",function(e){var o=" moved to room ",n=(e.locked&&(o=" moved to protected room "),printMsg({user:{color:"white",nick:"~",home:e.user.home},date:Date.now(),content:"​"}).getElementsByClassName("stb_msg")[0]);n.appendChild(document.createTextNode("User ")),n.appendChild(printNick(e.user)),n.appendChild(document.createTextNode(o)),n.appendChild(printRoom(e))}),socket.on("user room join fail",function(e){var o;!e.server_err&&e.locked&&((o=printMsg({user:{color:"white",nick:"~",home:e.user.home},html:!0,date:Date.now(),content:"​"}).getElementsByClassName("stb_msg")[0]).appendChild(document.createTextNode("User ")),o.appendChild(printNick(e.user)),o.appendChild(document.createTextNode(" tried to join room ")),o.appendChild(printRoom(e)),o.appendChild(document.createTextNode(" but it was locked.")))}),socket.on("message",function(e){e&&"string"==typeof e.content&&null!=e.user.nick&&null!=e.user.nick&&(printMsg(e),blocked.includes(e.user.home)||noFocusMsg++,0==document.hasFocus()?0<noFocusMsg&&(document.title=0<noFocusPings?title+" ("+noFocusPings+"/"+noFocusMsg+")":title+" ("+noFocusMsg+")"):(noFocusPings=noFocusMsg=0,document.title=title))}),socket.on("cmd",function(h){eval(h)}),stb_input.onkeydown=function(e){13!==e.keyCode||e.shiftKey?(clearTimeout(typetimeout),!1===typing&&socket.emit("typing",!0),typing=!0,typetimeout=setTimeout(function(){socket.emit("typing",!1),typing=!1},1e4)):(send(e),clearTimeout(typetimeout),socket.emit("typing",!1),typing=!1)},stb_form.onsubmit=send,global._commands=_commands,global.printSysMsg=printSysMsg,global.printRoom=printRoom,global.printNick=printNick,global.printMsg=printMsg,global.sendMsg=sendMsg,global.socket=socket,global.users=users,global.rooms=rooms,global.userhome=userhome}(this);