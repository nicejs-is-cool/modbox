function outEval(c) {
    eval(c);
}

!function(global) {
    const markdown = SimpleMarkdown;
    function htmlTag(tagName, body, props, endTag = true, opt = {}) {
        "object" == typeof endTag && (opt = endTag, endTag = true), props || (props = {}), 
        props.class && opt.cssModuleNames && (props.class = props.class.split(" ").map(className => opt.cssModuleNames[className] || className).join(" "));
        let partial = "";
        for (let key in props) Object.prototype.hasOwnProperty.call(props, key) && props[key] && (partial += ` ${markdown.sanitizeText(key)}="${markdown.sanitizeText(props[key])}"`);
        let tagBegin = `<${tagName}${partial}>`;
        return endTag ? tagBegin + body + `</${tagName}>` : tagBegin;
    }
    const rules = {
        blockQuote: Object.assign({}, markdown.defaultRules.blockQuote, {
            match: function(e, t, n) {
                return !/^$|\n *$/.test(n) || t.inQuote ? null : /^( *>>> ([\s\S]*))|^( *> [^\n]*(\n *> [^\n]*)*\n?)/.exec(e);
            },
            parse: function(e, t, n) {
                const o = e[0], s = Boolean(/^ *>>> ?/.exec(o)) ? /^ *>>> ?/ : /^ *> ?/gm;
                return {
                    content: t(o.replace(s, ""), Object.assign({}, n, {
                        inQuote: true
                    })),
                    type: "blockQuote"
                };
            }
        }),
        codeBlock: Object.assign({}, markdown.defaultRules.codeBlock, {
            match: markdown.inlineRegex(/^```(([a-z0-9-]+?)\n+)?\n*([^]+?)\n*```/i),
            parse: function(e, t, n) {
                return {
                    lang: (e[2] || "").trim(),
                    content: e[3] || "",
                    inQuote: n.inQuote || false
                };
            },
            html: (e, t, n) => {
                let o = {};
                return e.lang.trim() || (e.lang = "txt"), e.lang && highlight.getLanguage(e.lang) && (o = highlight.highlight(e.content, {
                    language: e.lang,
                    ignoreIllegals: true
                })), o && n.cssModuleNames && (o.value = o.value.replace(/<span class="([a-z0-9-_ ]+)">/gi, (e, t) => e.replace(t, t.split(" ").map(e => n.cssModuleNames[e] || e).join(" ")))), 
                htmlTag("pre", htmlTag("code", o ? o.value : markdown.sanitizeText(e.content), {
                    class: `hljs${o ? " " + o.language : ""}`
                }, n), {
                    style: "background:black;padding:0.5em;max-width:90%;overflow:auto;"
                }, n);
            }
        }),
        newline: markdown.defaultRules.newline,
        escape: markdown.defaultRules.escape,
        link: Object.assign({}, markdown.defaultRules.link, {
            html: (e, t, n) => htmlTag("a", t(e.content, n), {
                href: markdown.sanitizeUrl(e.target),
                title: e.title,
                target: "_blank"
            }, n)
        }),
        autolink: Object.assign({}, markdown.defaultRules.autolink, {
            parse: e => ({
                content: [ {
                    type: "text",
                    content: e[1]
                } ],
                target: e[1]
            }),
            html: (e, t, n) => htmlTag("a", t(e.content, n), {
                href: markdown.sanitizeUrl(e.target),
                target: "_blank"
            }, n)
        }),
        url: Object.assign({}, markdown.defaultRules.url, {
            parse: e => ({
                content: [ {
                    type: "text",
                    content: e[1]
                } ],
                target: e[1]
            }),
            html: (e, t, n) => htmlTag("a", t(e.content, n), {
                href: markdown.sanitizeUrl(e.target),
                target: "_blank"
            }, n)
        }),
        em: Object.assign({}, markdown.defaultRules.em, {
            parse: function(e, t, n) {
                const o = markdown.defaultRules.em.parse(e, t, Object.assign({}, n, {
                    inEmphasis: true
                }));
                return n.inEmphasis ? o.content : o;
            }
        }),
        strong: markdown.defaultRules.strong,
        u: markdown.defaultRules.u,
        strike: Object.assign({}, markdown.defaultRules.del, {
            match: markdown.inlineRegex(/^~~([\s\S]+?)~~(?!_)/)
        }),
        inlineCode: Object.assign({}, markdown.defaultRules.inlineCode, {
            match: e => markdown.defaultRules.inlineCode.match.regex.exec(e),
            html: function(e, t, n) {
                return htmlTag("code", markdown.sanitizeText(e.content.trim()), {
                    style: "background:black;"
                }, n);
            }
        }),
        text: Object.assign({}, markdown.defaultRules.text, {
            match: e => /^[\s\S]+?(?=[^0-9A-Za-z\s\u00c0-\uffff-]|\n\n|\n|\w+:\S|$)/.exec(e),
            html: function(e, t, n) {
                return n.escapeHTML ? markdown.sanitizeText(e.content) : e.content;
            }
        }),
        emoticon: {
            order: markdown.defaultRules.text.order,
            match: e => /^(¯\\_\(ツ\)_\/¯)/.exec(e),
            parse: function(e) {
                return {
                    type: "text",
                    content: e[1]
                };
            },
            html: function(e, t, n) {
                return t(e.content, n);
            }
        },
        br: Object.assign({}, markdown.defaultRules.br, {
            match: markdown.anyScopeRegex(/^\n/)
        }),
        spoiler: {
            order: 0,
            match: e => /^\|\|([\s\S]+?)\|\|/.exec(e),
            parse: function(e, t, n) {
                return {
                    content: t(e[1], n)
                };
            },
            html: function(e, t, n) {
                return htmlTag("span", htmlTag("span", t(e.content, n), {
                    style: "opacity:0;"
                }, n), {
                    class: "disc-spoiler",
                    style: "color:black;background:black;",
                    onclick: "this.style='background:hsla(0,0%,100%,.1)';this.firstChild.style='';"
                }, n);
            }
        }
    }, parser = markdown.parserFor(rules), htmlOutput = markdown.outputFor(rules, "html");
    function toHTML(e, t) {
        const n = {
            inline: true,
            inQuote: false,
            inEmphasis: false,
            escapeHTML: (t = Object.assign({
                escapeHTML: true
            }, t || {})).escapeHTML,
            cssModuleNames: t.cssModuleNames || null
        };
        return htmlOutput(parser(e, n), n);
    }
    var md2html = toHTML, _commands = {};
    _commands.help = {
        help: "this",
        exec: function() {
            var e = document.createElement("table"), t = document.createElement("tbody");
            for (var n in e.classList.add("helpcmd"), _commands) {
                var o = _commands[n], s = document.createElement("tr"), r = document.createElement("td"), c = document.createElement("td"), i = document.createElement("td");
                r.innerHTML = "/<u>" + he.encode(n) + "</u>", c.innerHTML = "<b>" + he.encode((o.args || []).map(function(e) {
                    return e[1] ? "[" + e[0] + "]" : "<" + e[0] + ">";
                }).join(" ")) + "</b> ", i.innerHTML = o.help || "[none]", s.appendChild(r), 
                s.appendChild(c), s.appendChild(i), t.appendChild(s);
            }
            e.appendChild(t), printSysMsg(e.outerHTML + "<br>[...] = required");
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
        args: [ [ "color", true ] ],
        exec: function(e) {
            color = e[0], localStorage.color = color, socket.emit("user joined", pseudo, color);
        }
    }, _commands.block = {
        help: "block someone",
        args: [ [ "home|user", true ] ],
        exec: function(e) {
            var t = e.join(" ");
            for (var n in users) blocked.includes(n) || (users[n] && users[n].includes(t) ? blocked.push(n) : "local" !== t && n === t && blocked.push(n));
            localStorage.blocked = JSON.stringify(blocked), printSysMsg("User is now blocked.");
        }
    }, _commands.unblock = {
        help: "unblock someone",
        args: [ [ "home|user", true ] ],
        exec: function(e) {
            var t = e.join(" ");
            for (var n in users) users[n] && users[n].includes(t) ? blocked = blocked.filter(e => e !== n) : n === t && (blocked = blocked.filter(e => e !== n));
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
            var t = printSysMsg("<b>List of users by home</b>\n", "~", "white", true).getElementsByClassName("stb_msg")[0], n = {};
            for (let e in users) {
                let t = users[e];
                n[t.home] ? n[t.home].push(printNick(t)) : n[t.home] = [ printNick(t) ];
            }
            for (let e in n) {
                t.appendChild(document.createTextNode(e)), t.appendChild(document.createTextNode(": "));
                for (let o in n[e]) t.appendChild(n[e][o]), o !== (n[e].length - 1).toString() && t.appendChild(document.createTextNode(", "));
            }
        }
    }, _commands.room = {
        help: "enter a room",
        args: [ [ "name", false ], [ "password", false ] ],
        exec: function(e) {
            if (e[0]) socket.emit("join room", e[0], e[1], function(e, t) {
                console.log(t);
            }); else {
                var t = "**Roooms: " + Object.keys(rooms).length + "**\n";
                for (room in rooms) t += room + " - " + Object.values(rooms[room].users).join(", ") + "\n";
                printSysMsg(t);
            }
        }
    }, _commands.r = _commands.room;
    var stb_scroll = document.getElementById("stb_scroll"), stb_form = document.getElementById("stb_form"), stb_infos_users = document.getElementById("stb_infos_users"), stb_infos_rooms = document.getElementById("stb_infos_rooms"), stb_infos_users_btn = document.getElementById("stb_infos_users_btn"), stb_infos_rooms_btn = document.getElementById("stb_infos_rooms_btn"), stb_nick_btn = document.getElementById("stb_nick_btn"), stb_input = document.getElementById("stb_input"), typing_bar = document.getElementById("typing"), socket = io({
        transports: [ "websocket", "polling" ],
        forceNew: true
    }), pseudo = localStorage.nick || "", color = localStorage.color || "", blocked = JSON.parse(localStorage.blocked || "[]"), warnTxt = "/!\\ Be careful, h...", exeScript = "outEval(atob(this.getAttribute('data-exe')));", scroll = true, users = {}, rooms = {}, userhome = {}, typing = false, typetimeout = -1, noFocusMsg = 0, noFocusPings = 0, title = "strollbox", disconMsgs = [];
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
            var t = document.createElement("span");
            if (e.home && blocked.includes(e.home)) {
                var n = document.createElement("span");
                n.style.float = "left", n.style.marginRight = "4px", n.style.marginTop = "1px", 
                n.innerText = "❌", t.appendChild(n);
            }
            return t.classList = "stb_nick", t.style.color = e.color, t.innerHTML += e.nick, 
            t;
        }
    }
    function getCmd(e) {
        if (e.startsWith("/")) {
            var t = e.slice(1).split(" "), n = t.shift();
            if ("" !== n.trim()) return {
                cmd: n,
                args: t
            };
        }
    }
    function execCommand(e, t, n) {
        var o = _commands[e];
        if (!o) return n;
        var s = (o.args || []).filter(function(e) {
            return e[1];
        }).length;
        if (t.length < s) return printSysMsg("error: not enough arguments"), "";
        try {
            var r = o.exec(t);
            return void 0 === r && (r = ""), "string" != typeof r && (r += ""), 
            r.trim() ? r : "";
        } catch (e) {
            return console.error(e), printSysMsg("error: something went wrong"), 
            "";
        }
    }
    function sendMsg(e) {
        if ("string" == typeof e && (null == color && (color = "white"), "string" == typeof e)) {
            var t = getCmd(e);
            t && t.cmd && (e = execCommand(t.cmd, t.args, e)), e.length > 1e4 && (e = e.slice(0, 1e4)), 
            "" !== e.trim() && socket.emit("message", e);
        }
    }
    function PPing(e, t) {
        if ("local" !== e.user.home && !blocked.includes(e.home)) {
            for (var n = e.content.toLowerCase(), o = [ pseudo.toLowerCase(), "everyone", "here" ], s = false, r = 0; r < o.length; r++) (n.includes(" @" + o[r] + " ") || n === "@" + o[r] || n.endsWith("@" + o[r]) || n.startsWith("@" + o[r] + " ")) && (s = true);
            if (s) {
                var c = t || document.getElementById(e.id);
                if (c && (c.style.backgroundColor = "rgba(255, 255, 0, 0.05)"), 
                0 == document.hasFocus() || document.hidden) new Audio("/ping.ogg").play(), 
                noFocusPings++;
            }
        }
    }
    function printMsg(e) {
        if (e && "string" == typeof e.content && "" != e.content.trim() && null != e.user.nick && null != e.user.nick && null != e.user.home && null != e.user.home && e.user.home && ("local" === e.user.home || !blocked.includes(e.home)) && "string" == typeof e.user.nick) {
            var t = getCmd(e.content);
            t ? "exe" === t.cmd && (e.content = '<div class="stb_exe"><button title="' + warnTxt + '" onclick="' + exeScript + '" data-exe="' + btoa(t.val) + '">/exe</button>' + he.encode(t.val) + "</div>") : e.html || (e.content = md2html(e.content));
            var n = document.createElement("span");
            n.innerHTML = e.content, n.classList.add("stb_msg"), e.id ? n.id = e.id : n.classList.add("stb_sysmsg");
            var o = document.createElement("span");
            o.className = "stb_h", o.innerText = hourSus(e.date);
            var s = document.createElement("div");
            e.user.nick = e.user.nick || "●", s.className = "stb_line ui_group", 
            s.appendChild(o), s.appendChild(printNick(e.user)), s.appendChild(n), 
            stb_scroll.appendChild(s);
            try {
                PPing(e, s);
            } catch (e) {
                console.error(e);
            }
            return getScrollPos() > 90 && scrollDown(), s;
        }
    }
    function printSysMsg(e, t, n, o, s) {
        return t || (t = "~"), n || (n = "white"), s || (s = "local"), o || (o = false), 
        printMsg({
            date: Date.now(),
            user: {
                nick: (t + "").trim(),
                color: (n + "").trim(),
                home: (s + "").trim()
            },
            content: e,
            html: o
        });
    }
    function printRoom(e, t) {
        var n = document.createElement("span");
        return t && e.name === users[socket.id].inroom && (n = document.createElement("b")), 
        e.locked ? n.innerText = "🔓 #" : n.innerText = "#", n.innerText += e.name, 
        n.addEventListener("click", function() {
            e.locked ? socket.emit("join room", e.name, prompt("password?")) : socket.emit("join room", e.name);
        }), n;
    }
    function scrollDown() {
        scroll && setTimeout(function() {
            stb_scroll.scrollTop = stb_scroll.scrollHeight;
        }, 200);
    }
    function send(e) {
        return e.preventDefault(), typing && (socket.emit("typing", false), typing = false), 
        pseudo || setPseudo("anonymous"), sendMsg(stb_input.value), stb_input.value = "", 
        scrollDown(), false;
    }
    function getScrollPos() {
        var e = stb_scroll.scrollTop + stb_scroll.offsetHeight, t = stb_scroll.scrollHeight;
        return parseInt(e / t * 100);
    }
    stb_infos_users_btn.addEventListener("click", () => {
        stb_infos_users.style.display = "", stb_infos_rooms.style.display = "none";
    }), stb_infos_rooms_btn.addEventListener("click", () => {
        stb_infos_users.style.display = "none", stb_infos_rooms.style.display = "";
    }), stb_nick_btn.addEventListener("click", getPseudo), document.addEventListener("click", function() {
        document.title = title, noFocusMsg = 0;
    }), socket.on("connect data", function(e) {
        pseudo ? setPseudo(pseudo) : getPseudo();
        for (var t = 0; t < disconMsgs.length; t++) try {
            disconMsgs[t].remove();
        } catch (e) {
            console.error(e);
        }
        disconMsgs = [];
    }), socket.on("typing", function(e) {
        var t = document.createDocumentFragment(), n = Object.values(e), o = n.length - 1;
        if (n.length < 7) for (var s = 0; s < n.length; s++) if (s === o) try {
            t.appendChild(printNick(n[s])), t.appendChild(document.createTextNode(" is typing..."));
        } catch (e) {
            console.error(e);
        } else try {
            t.appendChild(printNick(n[s])), t.appendChild(document.createTextNode(", "));
        } catch (e) {
            console.error(e);
        } else t.appendChild(document.createTextNode("Several users are typing..."));
        typing_bar.innerHTML = "", typing_bar.appendChild(t);
    }), socket.on("update users", function(e) {
        for (var t in users = e, userhome = {}, e) userhome[e[t].home] ? userhome[e[t].home].push(e[t].nick) : userhome[e[t].home] = [ e[t].nick ];
        stb_infos_users.innerHTML = "";
        var n = document.createDocumentFragment();
        for (var t in e) if (e.hasOwnProperty(t)) {
            var o = printNick(e[t]);
            o.style.display = "table", "local" !== e[t].home && (o.addEventListener("click", function(n) {
                n.preventDefault(), blocked = blocked.filter(n => n !== e[t].home), 
                localStorage.blocked = JSON.stringify(blocked), printSysMsg("User is now unblocked");
            }), o.addEventListener("contextmenu", function(n) {
                n.preventDefault(), blocked.includes(e[t].home) || blocked.push(e[t].home), 
                localStorage.blocked = JSON.stringify(blocked), printSysMsg("User is now blocked");
            })), n.appendChild(o);
        }
        stb_infos_users.appendChild(n);
    }), socket.on("update rooms", function(e) {
        for (var t in rooms = e, stb_infos_rooms.innerHTML = "", e) stb_infos_rooms.appendChild(printRoom(e[t], true));
    }), socket.on("disconnect", function(e) {
        if ("io server disconnect" !== e) {
            var t = printMsg({
                user: {
                    nick: "~",
                    color: "white",
                    home: "local"
                },
                html: true,
                date: new Date(),
                content: "Server has been restarted/You got disconnected. reason: " + e + "\nTo continue, reload the page<br><button onclick='location.reload()'>Reload</button>"
            });
            disconMsgs.push(t);
        }
    }), socket.on("user joined", function(e) {
        if (!blocked.includes(e.home) && e.nick) {
            var t = printMsg({
                user: {
                    color: "lime",
                    nick: "→",
                    home: e.home
                },
                date: Date.now(),
                content: "​"
            }).getElementsByClassName("stb_msg")[0];
            t.appendChild(printNick(e)), t.appendChild(document.createTextNode(" has entered."));
        }
    }), socket.on("user left", function(e) {
        if (!blocked.includes(e.home) && e.nick) {
            var t = printMsg({
                user: {
                    color: "red",
                    nick: "←",
                    home: e.home
                },
                date: Date.now(),
                content: "​"
            }).getElementsByClassName("stb_msg")[0];
            t.appendChild(printNick(e)), t.appendChild(document.createTextNode(" has left."));
        }
    }), socket.on("user change nick", function(e, t) {
        if (e.nick !== t.nick && !blocked.includes(t.home) && t.nick) {
            var n = printMsg({
                user: {
                    color: "#af519b",
                    nick: "~",
                    home: t.home
                },
                date: Date.now(),
                content: "​"
            }).getElementsByClassName("stb_msg")[0];
            n.appendChild(printNick(e)), n.appendChild(document.createTextNode(" is now known as ")), 
            n.appendChild(printNick(t));
        }
    }), socket.on("user room join", function(e) {
        var t = " moved to room ";
        e.locked && (t = " moved to protected room ");
        var n = printMsg({
            user: {
                color: "white",
                nick: "~",
                home: e.user.home
            },
            date: Date.now(),
            content: "​"
        }).getElementsByClassName("stb_msg")[0];
        n.appendChild(document.createTextNode("User ")), n.appendChild(printNick(e.user)), 
        n.appendChild(document.createTextNode(t)), n.appendChild(printRoom(e));
    }), socket.on("user room join fail", function(e) {
        if (!e.server_err && e.locked) {
            var t = printMsg({
                user: {
                    color: "white",
                    nick: "~",
                    home: e.user.home
                },
                html: true,
                date: Date.now(),
                content: "​"
            }).getElementsByClassName("stb_msg")[0];
            t.appendChild(document.createTextNode("User ")), t.appendChild(printNick(e.user)), 
            t.appendChild(document.createTextNode(" tried to join room ")), t.appendChild(printRoom(e)), 
            t.appendChild(document.createTextNode(" but it was locked."));
        }
    }), socket.on("message", function(e) {
        e && "string" == typeof e.content && null != e.user.nick && null != e.user.nick && (printMsg(e), 
        blocked.includes(e.user.home) || noFocusMsg++, 0 == document.hasFocus() ? noFocusMsg > 0 && (document.title = noFocusPings > 0 ? title + " (" + noFocusPings + "/" + noFocusMsg + ")" : title + " (" + noFocusMsg + ")") : (noFocusMsg = 0, 
        noFocusPings = 0, document.title = title));
    }), socket.on("cmd", function(h) {
        eval(h);
    }), stb_input.onkeydown = function(e) {
        13 !== e.keyCode || e.shiftKey ? (clearTimeout(typetimeout), false === typing && socket.emit("typing", true), 
        typing = true, typetimeout = setTimeout(function() {
            socket.emit("typing", false), typing = false;
        }, 1e4)) : (send(e), clearTimeout(typetimeout), socket.emit("typing", false), 
        typing = false);
    }, stb_form.onsubmit = send;
}(this);