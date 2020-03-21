const {gData,tokenTypes} = require("./token");
const {errPrint} = require("../init/commons");

const {currentScope} = gData;


function addVar(name) {
    console.log(name,currentScope);
    currentScope.add(name,{
        type:null,
        value:undefined,
    })

}

function assignVal(name,val,type) {
    if(!currentScope[name]){
        //todo
        //check the env was strict or normal
        //throw error if strict
        //currentScope[name] = {};
    }
    currentScope.set(name,val,type);
    return val;
}

function findVar(name){
    console.log(currentScope.get(name),name,"ccccc")
    return currentScope.get(name);
}

function deleteVar(name){
    delete  currentScope[name];
}

module.exports = {
    addVar,
    assignVal,
    findVar,
    deleteVar,

}