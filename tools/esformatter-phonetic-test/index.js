const esprima = require('esprima');
var ecmaVariableScope = require('ecma-variable-scope');
const escode  = require('escodegen');

const scrip = `(function() {
    const give = "you up"
    let you = "down"
})`
const ast = esprima.parseScript(scrip)
ecmaVariableScope(ast)
console.log(
    ast.body[0].expression
)
