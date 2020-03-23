const {gData,tokenTypes} = require("./token");
const {errPrint} = require("../init/commons");




function addVar(name) {
    const {currentScope} = gData;
    currentScope.add(name,{
        type:null,
        value:undefined,
    })

}

function assignVal(name,val,type) {
    const {currentScope} = gData;
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
    const {currentScope} = gData;
    console.log(currentScope.get(name),name,"ccccc")
    return currentScope.get(name);
}

function deleteVar(name){
    const {currentScope} = gData;
    delete  currentScope[name];
}

module.exports = {
    addVar,
    assignVal,
    findVar,
    deleteVar,

}