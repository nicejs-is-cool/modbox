import fs from 'fs/promises'
import UglifyJS from 'uglify-js'

const duck = await fs.readFile("./duck.js", {encoding: 'utf-8'})

const ast = UglifyJS.parse(duck)

let susOut = ast.print_to_string({ beautify: true });

await fs.writeFile("./duckb.js", susOut);