const {gData,tokenTypes} = require("./token");
const {errPrint} = require("../init/commons");




function addVar(name,scope) {
    scope.add(name,{
        type:null,
        value:undefined,
    })

}

function assignVal(name,val,scope) {
    scope.set(name,val);
    return val;
}

function findVar(name,scope){
    return scope.get(name);
}

function deleteVar(name,scope){
    //todo
}

module.exports = {
    addVar,
    assignVal,
    findVar,
    deleteVar,

}