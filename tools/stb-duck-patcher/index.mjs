import fs from 'fs/promises'
import UglifyJS from 'uglify-js'

const reminify = false;

const duck = await fs.readFile("./duck.js", {encoding: 'utf-8'})

const ast = UglifyJS.parse(duck)

let susOut = ast.print_to_string({ beautify: true }).split('\n');

susOut.splice(0, 0, "window.exportedEnv = {}")
susOut.splice(
    susOut.indexOf("    }, _commands = {};")+1,
    0, "window.exportedEnv._commands = _commands"
) // commands
susOut.splice(
    susOut.indexOf('        transports: [ "websocket", "polling" ],')+3,
    0, "window.exportedEnv.socket = socket\nwindow.exportedEnv.users = new Proxy(users, {})"); // socket

susOut.splice(
    susOut.length-1,
    0, "window.exportEnv.inContextEval = function(c) { return eval(c); }"); // unlock the keys to the mansion

susOut.splice(
    susOut.indexOf('            for (var t in e.classList.add("helpcmd"), _commands) {')+1,
    0, "if (commands[t].hidden) continue;"
) // quality of life patching(TM)
/*susOut[
    susOut.indexOf('        return body;')
] = "return domp.parseFromString(o, \"text/html\").body;"*/
await fs.writeFile("../../web/strollbox.js", 
    // reminify it
    reminify ? UglifyJS.minify(susOut.join('\n')).code : susOut.join('\n')
);
