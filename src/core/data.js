const {gData,tokenTypes} = require("./token");
const {errPrint} = require("../init/commons");

const {gVarMap} = gData;

function addVar(name) {
    gVarMap[name] = null;
}

function assignVal(name,val) {
    //todo
    gVarMap[name] = val;
}

function findVar(name){
    //todo
    if(typeof gVarMap[name] === "undefined"){
        return null;
    }
    return  gVarMap[name];
}

function deleteVar(name){
    delete  gVarMap[name];
}

module.exports = {
    addVar,
    assignVal,
    findVar,
    deleteVar
}