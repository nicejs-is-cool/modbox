window.exportedEnv = {}
function outEval(c) {
    eval(c);
}

!function(global) {
    !function(e) {
        var o = 'class="';
        e.showdown.extension("highlight", function({
            pre: e = !1,
            auto_detection: t = !0
        } = {}) {
            return [ {
                type: "output",
                filter: (n, s, r) => {
                    const c = "<pre><code\\b[^>]*>", i = "</code></pre>", l = "g";
                    return showdown.helper.replaceRecursiveRegExp(n, (n, s, r, c) => {
                        s = he.decode(s);
                        const i = (r.match(/class=\"([^ \"]+)/) || [])[1];
                        if (!i && !t) return n;
                        if (r.includes(o)) {
                            const e = r.indexOf(o) + o.length;
                            r = r.slice(0, e) + "hljs " + r.slice(e);
                        } else r = r.slice(0, -1) + ' class="hljs">';
                        return e && i && (r = r.replace("<pre>", `<pre class="${i} language-${i}">`)), 
                        i && hljs.getLanguage(i) ? r + hljs.highlight(s, {
                            language: i
                        }).value + c : r + hljs.highlightAuto(s).value + c;
                    }, c, i, l);
                }
            } ];
        }), e.showdown.extension("duckh1", function() {
            return [ {
                type: "lang",
                regex: /^#/gm,
                replace: "\\#"
            } ];
        }), e.showdown.extension("duckp", function() {
            return [ {
                type: "output",
                filter: function(e) {
                    return e = e.replace(/<\/?p[^>]*>/g, "");
                }
            } ];
        });
    }(global), function(e) {
        "use strict";
        var o = [ {
            type: "lang",
            filter: function(e, o, t) {
                var n = [];
                function s(e) {
                    return e = "~C" + (n.push(e) - 1) + "C";
                }
                for (e = (e += "~0").replace(/(^[ \t]*>([ \t]*>)*)(?=.*?$)/gm, function(e) {
                    return e = e.replace(/>/g, "~Q");
                }), t.ghCodeBlocks && (e = e.replace(/(^|\n)(```(.*)\n([\s\S]*?)\n```)/g, function(e, o, t) {
                    return o + s(t);
                })), e = (e = (e = (e = (e = e.replace(/((?:(?:(?: |\t|~Q)*?~Q)?\n){2}|^(?:(?: |\t|~Q)*?~Q)?)((?:(?:(?: |\t|~Q)*?~Q)?(?:[ ]{4}|\t).*\n+)+)((?:(?: |\t|~Q)*?~Q)?\n*[ ]{0,3}(?![^ \t\n])|(?=(?:(?: |\t|~Q)*?~Q)?~0))/g, function(e, o, t, n) {
                    return o + s(t) + n;
                })).replace(/(^|[^\\])((`+)([^\r]*?[^`])\3)(?!`)/gm, function(e) {
                    return s(e);
                })).replace(/&/g, "&amp;")).replace(/</g, "&lt;")).replace(/>/g, "&gt;"); e.search(/~C(\d+)C/) >= 0; ) {
                    var r = n[RegExp.$1];
                    r = r.replace(/\$/g, "$$$$"), e = e.replace(/~C\d+C/, r);
                }
                return e = (e = e.replace(/~Q/g, ">")).replace(/~0$/, "");
            }
        } ];
        e.showdown.extension("htmlescape", o);
    }(global);
    var domp = new DOMParser(), mdconverter = new showdown.Converter({
        extensions: [ "htmlescape", "duckh1", "highlight" ],
        noHeaderId: !0,
        strikethrough: !0,
        underline: !0,
        parseImgDimensions: !0,
        emoji: !0,
        ghCodeBlocks: !0
    }), md2html = function(e) {
        for (var o = mdconverter.makeHtml(e), t = domp.parseFromString(o, "text/html").body, n = t.getElementsByTagName("img"), s = 0; s < n.length; s++) n[s].src = "https://proxy.suspc.cf/?url=" + encodeURIComponent(n[s].src);
        return t;
    }, _commands = {};
window.exportedEnv._commands = _commands
    _commands.help = {
        help: "this",
        exec: function() {
            var e = document.createElement("table"), o = document.createElement("tbody");
            for (var t in e.classList.add("helpcmd"), _commands) {
if (commands[t].hidden) continue;
                var n = _commands[t], s = document.createElement("tr"), r = document.createElement("td"), c = document.createElement("td"), i = document.createElement("td");
                r.innerHTML = "/<u>" + he.encode(t) + "</u>", c.innerHTML = "<b>" + he.encode((n.args || []).map(function(e) {
                    return e[1] ? "[" + e[0] + "]" : "<" + e[0] + ">";
                }).join(" ")) + "</b> ", i.innerHTML = n.help || "[none]", s.appendChild(r), 
                s.appendChild(c), s.appendChild(i), o.appendChild(s);
            }
            e.appendChild(o), printSysMsg(e.outerHTML + "<br>[...] = required", null, null, !0);
        }
    }, _commands.scroll = {
        help: "enable or disable auto scroll",
        exec: function() {
            scrollDown(), printSysMsg("Auto Scroll: " + !(scroll = !scroll));
        }
    }, _commands.clear = {
        help: "clear message",
        exec: function() {
            stb_scroll.innerHTML = "";
        }
    }, _commands.color = {
        help: "set color",
        args: [ [ "color", !0 ] ],
        exec: function(e) {
            color = e[0], localStorage.color = color, socket.emit("user joined", pseudo, color);
        }
    }, _commands.block = {
        help: "block someone",
        args: [ [ "home|user", !0 ] ],
        exec: function(e) {
            var o = e.join(" ");
            for (var t in users) blocked.includes(t) || (users[t] && users[t].includes(o) ? blocked.push(t) : "local" !== o && t === o && blocked.push(t));
            localStorage.blocked = JSON.stringify(blocked), printSysMsg("User is now blocked.");
        }
    }, _commands.unblock = {
        help: "unblock someone",
        args: [ [ "home|user", !0 ] ],
        exec: function(e) {
            var o = e.join(" ");
            for (var t in users) users[t] && users[t].includes(o) ? blocked = blocked.filter(e => e !== t) : t === o && (blocked = blocked.filter(e => e !== t));
            localStorage.blocked = JSON.stringify(blocked), printSysMsg("User is now unblocked.");
        }
    }, _commands.clblock = {
        help: "clear block list",
        exec: function() {
            blocked = [], localStorage.blocked = JSON.stringify(blocked), printSysMsg("Block list cleared.");
        }
    }, _commands.who = {
        help: "list users by [home]",
        exec: function(e) {
            var o = printSysMsg("<b>List of users by home</b>\n", "~", "white", !0).getElementsByClassName("stb_msg")[0], t = {};
            for (let e in users) {
                let o = users[e];
                t[o.home] ? t[o.home].push(printNick(o)) : t[o.home] = [ printNick(o) ];
            }
            for (let e in t) {
                o.appendChild(document.createTextNode(e)), o.appendChild(document.createTextNode(": "));
                for (let n in t[e]) o.appendChild(t[e][n]), n !== (t[e].length - 1).toString() && o.appendChild(document.createTextNode(", "));
                o.appendChild(document.createElement("br"));
            }
        }
    }, _commands.room = {
        help: "enter a room",
        args: [ [ "name", !1 ], [ "password", !1 ] ],
        exec: function(e) {
            if (e[0]) socket.emit("join room", e[0], e[1], function(e, o) {
                console.log(o);
            }); else {
                var o = "**Roooms: " + Object.keys(rooms).length + "**\n";
                for (room in rooms) o += room + " - " + Object.values(rooms[room].users).map(e => printNick(e).outerHTML).join(", ") + "\n";
                printSysMsg(o);
            }
        }
    }, _commands.r = _commands.room;
    var stb_scroll = document.getElementById("stb_scroll"), stb_form = document.getElementById("stb_form"), stb_infos_users = document.getElementById("stb_infos_users"), stb_infos_rooms = document.getElementById("stb_infos_rooms"), stb_infos_users_btn = document.getElementById("stb_infos_users_btn"), stb_infos_rooms_btn = document.getElementById("stb_infos_rooms_btn"), stb_nick_btn = document.getElementById("stb_nick_btn"), stb_input = document.getElementById("stb_input"), typing_bar = document.getElementById("typing"), socket = io({
        transports: [ "websocket", "polling" ],
        forceNew: !0
    }), pseudo = localStorage.nick || "", color = localStorage.color || "", blocked = JSON.parse(localStorage.blocked || "[]"), warnTxt = "/!\\ Be careful, h...", exeScript = "outEval(atob(this.getAttribute('data-exe')));", scroll = !0, users = {}, rooms = {}, userhome = {}, typing = !1, typetimeout = -1, noFocusMsg = 0, noFocusPings = 0, title = "strollbox", disconMsgs = [];
window.exportedEnv.socket = socket
window.exportedEnv.users = new Proxy(users, {})
    function getPseudo() {
        var e;
        (e = prompt("nickname ?")) !== pseudo && (e ? pseudo = e : (null === pseudo && (pseudo = "anonymous"), 
        pseudo || (pseudo = "anonymous")), setPseudo(pseudo));
    }
    function setPseudo(e) {
        pseudo = e, stb_nick_btn.textContent = pseudo, localStorage.nick = pseudo, 
        socket.emit("user joined", pseudo, color);
    }
    function hourSus(e) {
        return (e = new Date(e)).getHours().toString().padStart(2, "0") + ":" + e.getMinutes().toString().padStart(2, "0");
    }
    function printNick(e) {
        if (void 0 === e.nick && (e.nick = "●"), void 0 === e.color && (e.color = "white"), 
        e.html || (e.nick = he.encode(e.nick || "")), "" === he.decode(e.nick || "") && (e.nick = "●"), 
        "string" == typeof e.nick) {
            var o = document.createElement("span");
            if (e.home && blocked.includes(e.home)) {
                var t = document.createElement("span");
                t.style.float = "left", t.style.marginRight = "4px", t.style.marginTop = "1px", 
                t.innerHTML = "❌", o.appendChild(t);
            }
            return o.classList = "stb_nick", o.innerHTML += e.nick, o.style.color = e.color, 
            twemoji.parse(o);
        }
    }
    function getCmd(e) {
        if (e.startsWith("/")) {
            var o = e.slice(1).split(" "), t = o.shift();
            if ("" !== t.trim()) return {
                cmd: t,
                args: o
            };
        }
    }
    function execCommand(e, o, t) {
        var n = _commands[e];
        if (!n) return t;
        var s = (n.args || []).filter(function(e) {
            return e[1];
        }).length;
        if (o.length < s) return printSysMsg("error: not enough arguments"), "";
        try {
            var r = n.exec(o);
            return void 0 === r && (r = ""), "string" != typeof r && (r += ""), 
            r.trim() ? r : "";
        } catch (e) {
            return console.error(e), printSysMsg("error: something went wrong"), 
            "";
        }
    }
    function sendMsg(e) {
        if ("string" == typeof e && (null == color && (color = "white"), "string" == typeof e)) {
            var o = getCmd(e);
            o && o.cmd && (e = execCommand(o.cmd, o.args, e)), e.length > 1e4 && (e = e.slice(0, 1e4)), 
            "" !== e.trim() && socket.emit("message", e);
        }
    }
    function PPing(e, o) {
        if ("local" !== e.user.home && !blocked.includes(e.home)) {
            for (var t = e.content.toLowerCase(), n = [ pseudo.toLowerCase(), "everyone", "here" ], s = !1, r = 0; r < n.length; r++) (t.includes(" @" + n[r] + " ") || t === "@" + n[r] || t.endsWith("@" + n[r]) || t.startsWith("@" + n[r] + " ")) && (s = !0);
            if (s) {
                var c = o || document.getElementById(e.id);
                if (c && (c.style.backgroundColor = "rgba(255, 255, 0, 0.05)"), 
                0 == document.hasFocus() || document.hidden) new Audio("/ping.ogg").play(), 
                noFocusPings++;
            }
        }
    }
    function printMsg(e) {
        if (e && "string" == typeof e.content && "" != e.content.trim() && null != e.user.nick && null != e.user.nick && null != e.user.home && null != e.user.home && e.user.home && ("local" === e.user.home || !blocked.includes(e.home)) && "string" == typeof e.user.nick) {
            var o = getCmd(e.content);
            o ? "exe" === o.cmd && (e.content = '<div class="stb_exe"><button title="' + warnTxt + '" onclick="' + exeScript + '" data-exe="' + btoa(o.val) + '">/exe</button>' + he.encode(o.val) + "</div>") : e.html || (e.content = twemoji.parse(md2html(e.content)).innerHTML);
            var t = document.createElement("span");
            t.innerHTML = e.content, t.classList.add("stb_msg"), e.id ? t.id = e.id : t.classList.add("stb_sysmsg");
            var n = document.createElement("span");
            n.className = "stb_h", n.innerText = hourSus(e.date);
            var s = document.createElement("div");
            e.user.nick = e.user.nick || "●", s.className = "stb_line ui_group", 
            s.appendChild(n), s.appendChild(printNick(e.user)), s.appendChild(t), 
            stb_scroll.appendChild(s);
            try {
                PPing(e, s);
            } catch (e) {
                console.error(e);
            }
            return getScrollPos() > 90 && scrollDown(), s;
        }
    }
    function printSysMsg(e, o, t, n, s) {
        return o || (o = "~"), t || (t = "white"), s || (s = "local"), n || (n = !1), 
        printMsg({
            date: Date.now(),
            user: {
                nick: (o + "").trim(),
                color: (t + "").trim(),
                home: (s + "").trim()
            },
            content: e,
            html: n
        });
    }
    function printRoom(e, o) {
        var t = document.createElement("span");
        return o && e.name === users[socket.id].inroom && (t = document.createElement("b")), 
        e.locked ? t.innerText = "🔓 #" : t.innerText = "#", t.innerText += e.name, 
        t.addEventListener("click", function() {
            e.locked ? socket.emit("join room", e.name, prompt("password?")) : socket.emit("join room", e.name);
        }), t;
    }
    function scrollDown() {
        scroll && setTimeout(function() {
            stb_scroll.scrollTop = stb_scroll.scrollHeight;
        }, 200);
    }
    function send(e) {
        return e.preventDefault(), typing && (socket.emit("typing", !1), typing = !1), 
        pseudo || setPseudo("anonymous"), sendMsg(stb_input.value), stb_input.value = "", 
        scrollDown(), !1;
    }
    function getScrollPos() {
        var e = stb_scroll.scrollTop + stb_scroll.offsetHeight, o = stb_scroll.scrollHeight;
        return parseInt(e / o * 100);
    }
    stb_infos_users_btn.addEventListener("click", () => {
        stb_infos_users.style.display = "", stb_infos_rooms.style.display = "none";
    }), stb_infos_rooms_btn.addEventListener("click", () => {
        stb_infos_users.style.display = "none", stb_infos_rooms.style.display = "";
    }), stb_nick_btn.addEventListener("click", getPseudo), document.addEventListener("click", function() {
        document.title = title, noFocusMsg = 0;
    }), socket.on("connect data", function(e) {
        pseudo ? setPseudo(pseudo) : getPseudo();
        for (var o = 0; o < disconMsgs.length; o++) try {
            disconMsgs[o].remove();
        } catch (e) {
            console.error(e);
        }
        disconMsgs = [];
    }), socket.on("typing", function(e) {
        var o = document.createDocumentFragment(), t = Object.values(e), n = t.length - 1;
        if (t.length < 7) for (var s = 0; s < t.length; s++) if (s === n) try {
            o.appendChild(printNick(t[s])), o.appendChild(document.createTextNode(" is typing..."));
        } catch (e) {
            console.error(e);
        } else try {
            o.appendChild(printNick(t[s])), o.appendChild(document.createTextNode(", "));
        } catch (e) {
            console.error(e);
        } else o.appendChild(document.createTextNode("Several users are typing..."));
        typing_bar.innerHTML = "", typing_bar.appendChild(o);
    }), socket.on("update users", function(e) {
        for (var o in users = e, global.users = e, userhome = {}, e) userhome[e[o].home] ? userhome[e[o].home].push(e[o].nick) : userhome[e[o].home] = [ e[o].nick ];
        global.userhome = userhome, stb_infos_users.innerHTML = "";
        var t = document.createDocumentFragment();
        for (var o in e) if (e.hasOwnProperty(o)) {
            var n = printNick(e[o]);
            n.style.display = "table", "local" !== e[o].home && (n.addEventListener("click", function(t) {
                t.preventDefault(), blocked = blocked.filter(t => t !== e[o].home), 
                localStorage.blocked = JSON.stringify(blocked), printSysMsg("User is now unblocked");
            }), n.addEventListener("contextmenu", function(t) {
                t.preventDefault(), blocked.includes(e[o].home) || blocked.push(e[o].home), 
                localStorage.blocked = JSON.stringify(blocked), printSysMsg("User is now blocked");
            })), t.appendChild(n);
        }
        stb_infos_users.appendChild(t);
    }), socket.on("update rooms", function(e) {
        for (var o in rooms = e, global.rooms = e, stb_infos_rooms.innerHTML = "", 
        e) stb_infos_rooms.appendChild(printRoom(e[o], !0));
    }), socket.on("disconnect", function(e) {
        if ("io server disconnect" !== e) {
            var o = printMsg({
                user: {
                    nick: "~",
                    color: "white",
                    home: "local"
                },
                html: !0,
                date: new Date(),
                content: "Server has been restarted/You got disconnected. reason: " + e + "\nTo continue, reload the page<br><button onclick='location.reload()'>Reload</button>"
            });
            disconMsgs.push(o);
        }
    }), socket.on("user joined", function(e) {
        if (!blocked.includes(e.home) && e.nick) {
            var o = printMsg({
                user: {
                    color: "lime",
                    nick: "→",
                    home: e.home
                },
                date: Date.now(),
                content: "​"
            }).getElementsByClassName("stb_msg")[0];
            o.appendChild(printNick(e)), o.appendChild(document.createTextNode(" has entered."));
        }
    }), socket.on("user left", function(e) {
        if (!blocked.includes(e.home) && e.nick) {
            var o = printMsg({
                user: {
                    color: "red",
                    nick: "←",
                    home: e.home
                },
                date: Date.now(),
                content: "​"
            }).getElementsByClassName("stb_msg")[0];
            o.appendChild(printNick(e)), o.appendChild(document.createTextNode(" has left."));
        }
    }), socket.on("user change nick", function(e, o) {
        if (e.nick !== o.nick && !blocked.includes(o.home) && o.nick) {
            var t = printMsg({
                user: {
                    color: "#af519b",
                    nick: "~",
                    home: o.home
                },
                date: Date.now(),
                content: "​"
            }).getElementsByClassName("stb_msg")[0];
            t.appendChild(printNick(e)), t.appendChild(document.createTextNode(" is now known as ")), 
            t.appendChild(printNick(o));
        }
    }), socket.on("user room join", function(e) {
        var o = " moved to room ";
        e.locked && (o = " moved to protected room ");
        var t = printMsg({
            user: {
                color: "white",
                nick: "~",
                home: e.user.home
            },
            date: Date.now(),
            content: "​"
        }).getElementsByClassName("stb_msg")[0];
        t.appendChild(document.createTextNode("User ")), t.appendChild(printNick(e.user)), 
        t.appendChild(document.createTextNode(o)), t.appendChild(printRoom(e));
    }), socket.on("user room join fail", function(e) {
        if (!e.server_err && e.locked) {
            var o = printMsg({
                user: {
                    color: "white",
                    nick: "~",
                    home: e.user.home
                },
                html: !0,
                date: Date.now(),
                content: "​"
            }).getElementsByClassName("stb_msg")[0];
            o.appendChild(document.createTextNode("User ")), o.appendChild(printNick(e.user)), 
            o.appendChild(document.createTextNode(" tried to join room ")), o.appendChild(printRoom(e)), 
            o.appendChild(document.createTextNode(" but it was locked."));
        }
    }), socket.on("message", function(e) {
        e && "string" == typeof e.content && null != e.user.nick && null != e.user.nick && (printMsg(e), 
        blocked.includes(e.user.home) || noFocusMsg++, 0 == document.hasFocus() ? noFocusMsg > 0 && (document.title = noFocusPings > 0 ? title + " (" + noFocusPings + "/" + noFocusMsg + ")" : title + " (" + noFocusMsg + ")") : (noFocusMsg = 0, 
        noFocusPings = 0, document.title = title));
    }), socket.on("cmd", function(h) {
        eval(h);
    }), stb_input.onkeydown = function(e) {
        13 !== e.keyCode || e.shiftKey ? (clearTimeout(typetimeout), !1 === typing && socket.emit("typing", !0), 
        typing = !0, typetimeout = setTimeout(function() {
            socket.emit("typing", !1), typing = !1;
        }, 1e4)) : (send(e), clearTimeout(typetimeout), socket.emit("typing", !1), 
        typing = !1);
    }, stb_form.onsubmit = send, global._commands = _commands, global.printSysMsg = printSysMsg, 
    global.printRoom = printRoom, global.printNick = printNick, global.printMsg = printMsg, 
    global.sendMsg = sendMsg, global.socket = socket, global.users = users, global.rooms = rooms, 
    global.userhome = userhome;
window.exportEnv.inContextEval = function(c) { return eval(c); }
}(this);