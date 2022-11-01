import fs from 'fs/promises'
import UglifyJS from 'uglify-js'

const reminify = true;

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
    0, "window.exportedEnv.socket = socket\nwindow.exportedEnv.users = users"); // socket
/*susOut[
    susOut.indexOf('        return body;')
] = "return domp.parseFromString(o, \"text/html\").body;"*/
await fs.writeFile("../../web/strollbox.js", 
    // reminify it
    reminify ? UglifyJS.minify(susOut.join('\n')).code : susOut.join('\n')
);
