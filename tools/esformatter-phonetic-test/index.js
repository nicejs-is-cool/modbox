const esprima = require('esprima');
var ecmaVariableScope = require('./ecma-variable-scope');
const escode  = require('escodegen');
const rocambole = require('rocambole')
const estraverse = require('estraverse');
const JSON5 = require('json5');
const fs = require('fs')

const identifiers = JSON5.parse(fs.readFileSync("./mappings/stb.json5", {encoding: 'utf-8'})).reverse()

let nameIndex;
let nameMap;
let globalIndentifierCounter = 0;

console.log(identifiers)

const phoneticOptions = {
    renamePerScope: true
}

// totally not stolen from https://github.com/twolfson/esformatter-phonetic/blob/master/lib/esformatter-phonetic.js
const getPhoneticName = function (identifier) {
    // If we are using a name map on a per-scope basis, use it
    var scopedNameMap = nameMap;
    if (phoneticOptions.renamePerScope === true) {
      // If we have a scope, use the map from there
      var scope = identifier.scope;
      if (scope) {
        scopedNameMap = scope.identifierMap = scope.identifierMap || {};
      // Otherwise, use the global scope
      } else {
        scopedNameMap = nameMap;
      }
    }
  
    // If the name is not defined, create one
    var name = identifier.name;
    if (!scopedNameMap[name]) {
        const duc = identifiers[globalIndentifierCounter++];
        if (duc) {
            scopedNameMap[name] = duc;
        }
    }
    /*if (scopedNameMap[name] === undefined) {
      // If there was a base seed provided, calculate the current value
      var seed = null;
      if (phoneticOptions.baseSeed !== undefined) {
        seed = phoneticOptions.baseSeed + nameIndex;
        nameIndex += 1;
      }
  
      // Generate and save the new name
      scopedNameMap[name] = phonetic.generate(extend({
        capFirst: false, // Lower case first letter (e.g. `esemsep` over `Esemsep`)
        seed: seed
      }, phoneticOptions));
    }*/
  
    // Return the name
    return scopedNameMap[name] || name;
};

const transform = function (ast) {
    // Mark up the AST with scope information
    ast = ecmaVariableScope(ast);
  
    // Skip over the custom node properties
    rocambole.BYPASS_RECURSION._insideWith = true;
    rocambole.BYPASS_RECURSION._nearestScope = true;
    rocambole.BYPASS_RECURSION._scopeType = true;
    rocambole.BYPASS_RECURSION._usedInAWith = true;
    rocambole.BYPASS_RECURSION.scopeInfo = true;
    rocambole.BYPASS_RECURSION.scope = true;
  
    // Walk over the identifiers
    rocambole.moonwalk(ast, function updateIdentifiers (node) {
      // If the node is an identifier and a variable
      //if (!uniqnodes.includes(node.type)) {console.log(node.type); uniqnodes.push(node.type)}
      
      if (node.type === 'Identifier' && node.scopeInfo) {
        // DEV: Logic taken from `uglifyjs2` (linked from `beautify-with-words`)
        // https://github.com/mishoo/UglifyJS2/blob/v2.4.11/lib/scope.js#L59-L63
        // If the identifier is top level and we aren't touching top level items, do nothing
        var isTopLevel = node.scopeInfo.topLevel === ecmaVariableScope.SCOPE_INFO_TOP_LEVEL.YES;
        if (isTopLevel && phoneticOptions.renameTopLevel !== true) {
          return;
        }
  
        // If the identifier has not been declared, do nothing
        if (node.scopeInfo.type === ecmaVariableScope.SCOPE_INFO_TYPES.UNDECLARED) {
          return;
        }
  
        // If the identifier has ever been used in a with, do nothing
        if (node.scopeInfo.usedInAWith !== ecmaVariableScope.SCOPE_INFO_USED_IN_A_WITH.NO) {
          return;
        }
        //console.log(node.name || node.startToken.value)
        // Rename our identifier (update in both node and token tree)
        node.name = node.startToken.value = getPhoneticName(node);
      }
    });
  
    // Clean up custom iteration skips
    delete rocambole.BYPASS_RECURSION._insideWith;
    delete rocambole.BYPASS_RECURSION._nearestScope;
    delete rocambole.BYPASS_RECURSION._scopeType;
    delete rocambole.BYPASS_RECURSION._usedInAWith;
    delete rocambole.BYPASS_RECURSION.scopeInfo;
    delete rocambole.BYPASS_RECURSION.scope;
  
    // Walk over all nodes and clean up our properties
    // DEV: Without this, we would have infinite recursion on other traversals
    // DEV: We use `estraverse` over `rocambole` to prevent possible misses due to missing references
    estraverse.traverse(ast, {
      enter: function cleanupProperties (node) {
        delete node._insideWith;
        delete node._nearestScope;
        delete node._scopeType;
        delete node._usedInAWith;
        delete node.scopeInfo;
        delete node.scope;
      }
    });
  
    // Return the modified AST
    return ast;
  };

const scrip = fs.readFileSync("./duckb.js", {encoding: 'utf-8'})
const ast = rocambole.parse(scrip);
/*const ast = esprima.parseScript(scrip)
ecmaVariableScope(ast)
console.log(
    ast.body[0].expression
)
*/
transform(ast);
fs.writeFileSync("./duck-demin.js", ast.toString())