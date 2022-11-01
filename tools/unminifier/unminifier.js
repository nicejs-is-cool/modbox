const fs = require('fs');
const UglifyJS = require('uglify-js')
const JSON5 = require('json5');

const duck = fs.readFileSync("./duck.js", "utf-8");

const mapping = JSON5.parse(fs.readFileSync("./duck-mapping.json5", "utf-8"))

const ast = UglifyJS.parse(duck)

let identifiersIn = 0;

const transformer = new UglifyJS.TreeTransformer(function (node, descend) {
    //console.log(node)
    if (
        node instanceof UglifyJS.AST_VarDef ||
        node instanceof UglifyJS.AST_Defun
    ) {
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

fs.writeFileSync("./duck-unm.js", ast.print_to_string({ beautify: true }), {encoding: 'utf-8'});
