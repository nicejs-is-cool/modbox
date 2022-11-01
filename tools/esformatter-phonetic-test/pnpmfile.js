const readPackage = function(pkg, context){
    console.log(pkg)
    process.exit(0)
    return pkg;
}

module.exports = { hooks: { readPackage } }