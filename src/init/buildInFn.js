
const buildInMethods = {}

function addBuildInMethod(name,fn) {
    buildInMethods[name] = fn;
}


module.exports = {
    addBuildInMethod,
    buildInMethods
}