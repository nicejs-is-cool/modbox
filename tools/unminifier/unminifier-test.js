const fs = require('fs');
const UglifyJS = require('uglify-js')
const JSON5 = require('json5');

const duck = fs.readFileSync("./test.js", "utf-8");

const mapping = JSON5.parse(fs.readFileSync("./test-mapping.json5", "utf-8"))

const ast = UglifyJS.parse(duck)

let identifiersIn = 0;
class Scopes extends Array {
    peek() {
        return this[this.length-1]
    }
    dupl() {
        let tmp = this.pop()
        this.push(tmp)
        this.push(tmp);
        return this.peek()
    }
}
let scopeStackId = 0;
const scopes = new Scopes();
scopes.push([]); // [0] is the global stack

const transformer = new UglifyJS.TreeTransformer(function (node, descend) {
    //console.log(node)
    if (
        node instanceof UglifyJS.AST_VarDef ||
        node instanceof UglifyJS.AST_Defun
    ) {
        /*if (node instanceof UglifyJS.AST_Defun) {
            scopes.peek().push({id: scopeStackId++, name: node?.name?.name});
            let the = scopes.dupl()
            
        }*/
        if (node.name) {
            let mapped = mapping[identifiersIn++];
            if (mapped) node.name.name = mapped;
        }
    }
    if (
        node instanceof UglifyJS.AST_SymbolRef ||
        node instanceof UglifyJS.AST_SymbolFunarg
    ) {
        if (node.name) {
            let mapped = mapping[identifiersIn++];
            if (mapped) node.name = mapped;
        }
    }
    if (node instanceof UglifyJS.AST_UnaryPrefix) return undefined
    if (node.scope) console.log(node)
    node = node.clone();
    descend(node, this);
    return node;
}, function(node) {
    if (node instanceof UglifyJS.AST_UnaryPrefix) {
        if (node.operator === "!" && (node.expression.value === 1 || node.expression.value === 0)) {
            if (node.expression.value === 1) return new UglifyJS.AST_False()
            return new UglifyJS.AST_True()
        }
    }
});
ast.transform(transformer);

fs.writeFileSync("./test-unm.js", ast.print_to_string({ beautify: true }), {encoding: 'utf-8'});
