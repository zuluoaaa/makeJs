const {gData,tokenTypes} = require("./token");
const {errPrint} = require("../init/commons");

const {currentScope} = gData;


function addVar(name) {
    currentScope[name] = {
        type:null,
        value:undefined,
    };
}

function assignVal(name,val,type) {
    if(!currentScope[name]){
        //todo
        //check the env is strict or normal
        //throw error if strict
        currentScope[name] = {};
    }
    currentScope[name].value = val;
    currentScope[name].type = type;
    return val;
}

function findVar(name){
    if(currentScope[name]){
        return currentScope[name].value
    }
    return null;
}

function deleteVar(name){
    delete  currentScope[name];
}

module.exports = {
    addVar,
    assignVal,
    findVar,
    deleteVar,
    gVarMap
}