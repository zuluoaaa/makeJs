const {ASTNodeTypes} = require("./token");
const {errPrint} = require("../init/commons");
const {assignVal,findVar,readVal,assignArr} = require("./data");
const {Scope} = require("./scope");
const {buildInMethods} = require("../init/buildInFn");
function interpretIfAST(astNode,scope) {
    let state = interpretAST(astNode.left,null,scope);
    if(state){
        return interpretAST(astNode.mid,null,scope);
    }else{
        if(astNode.right){
            return interpretAST(astNode.right,null,scope);
        }
    }
}

function interpretWhileAST(astNode,scope) {
    let condition = astNode.left;
    let body = astNode.right;
    let state = interpretAST(condition,null,scope);
    if(state){
        interpretAST(body,null,scope);
        interpretWhileAST(astNode,scope);
    }
}

function interpretFunCallAST(astNode,scope) {
    let childScope = new Scope(scope,"block");
    let argument = {};
    if(astNode.left
        && astNode.left.op === ASTNodeTypes.T_FUNARGS
        && astNode.left.value.length>0
    ){
        astNode.left.value.forEach((item,index)=>{
            let result = interpretAST(item,null,scope);
            result = Scope.warpVal(result);
            argument[index] = result;
        })
    }

    if(buildInMethods[astNode.value]){
        let arr = [];
        let i=0;
        while (typeof argument[i] !== "undefined"){
            arr.push(argument[i] ? argument[i].value : argument[i]);
            ++i;
        }
        buildInMethods[astNode.value](...arr);
    }else{
        childScope.set("arguments",argument,ASTNodeTypes.T_ARGUMENT);
        let fnAST = scope.get(astNode.value).value;
        fnAST.option = "run";
        return interpretAST(fnAST,null,childScope);
    }

}

function interpretAST(astNode,result=null,scope){
    if(!astNode){
        return;
    }
    if(scope && scope.returnValue !== null){
        return;
    }
    switch (astNode.op) {
        case ASTNodeTypes.T_IF:
            return interpretIfAST(astNode,scope);
        case ASTNodeTypes.T_GLUE:
            interpretAST(astNode.left,null,scope);
            interpretAST(astNode.right,null,scope);
            return;
        case ASTNodeTypes.T_AND:
            let leftState = interpretAST(astNode.left,null,scope);
            if(leftState){
                let rightState = interpretAST(astNode.right,leftState,scope);
                if(rightState){
                    return true;
                }
            }
            return false;
        case ASTNodeTypes.T_OR:
            let leftState1 = interpretAST(astNode.left,null,scope);
            if(leftState1){
                return true;
            }
            return !!interpretAST(astNode.right, leftState1, scope);
        case ASTNodeTypes.T_WHILE:
            return interpretWhileAST(astNode,scope);
        case ASTNodeTypes.T_FUN:
            if(astNode.option === "run"){
                astNode.option = "";
                break;
            }else{
                scope.add(astNode.value);
                scope.set(astNode.value,astNode,ASTNodeTypes.T_FUN);
                return;
            }
        case ASTNodeTypes.T_FUNCALL:

            return interpretFunCallAST(astNode,scope);

    }

    let leftResult,rightResult;

    if(astNode.left){
        leftResult = interpretAST(astNode.left,null,scope);
    }


    if(astNode.right){
        rightResult = interpretAST(astNode.right,leftResult,scope);
    }


    result = readVal(result);

    switch (astNode.op) {
        case ASTNodeTypes.T_LVALUE:
            if(leftResult && leftResult._inner && leftResult._parent){
                return assignArr(leftResult,result);
            }
            return assignVal(astNode.value,result,scope);
    }


    leftResult = readVal(leftResult);
    rightResult = readVal(rightResult);
    switch (astNode.op) {
        case ASTNodeTypes.T_VAR:
            scope.add(astNode.value);
            return;
        case ASTNodeTypes.T_ARGUMENT:
            scope.set(astNode.value,scope.get("arguments").value[astNode.option].value,astNode.type);
            return;
        case ASTNodeTypes.T_RETURN:
            scope.returnValue = leftResult;
            return;
        case ASTNodeTypes.T_FUN:
            return scope.returnValue;
        case ASTNodeTypes.T_INT:
            return astNode.value;
        case ASTNodeTypes.T_STRING:
            return astNode.value;
        case ASTNodeTypes.T_ARRAY:

            return astNode.value.map(item=>interpretAST(item,null,scope));
        case ASTNodeTypes.T_ADD:
            if(rightResult === null || typeof rightResult === "undefined"){
                return leftResult;
            }
            return leftResult + rightResult;
        case ASTNodeTypes.T_SUB:
            if(rightResult === null || typeof rightResult === "undefined"){
                return -leftResult;
            }
            return leftResult - rightResult;
        case ASTNodeTypes.T_MUL:
            return leftResult * rightResult;
        case ASTNodeTypes.T_DIV:
            return leftResult / rightResult;
        case ASTNodeTypes.T_ASSIGN:
            return rightResult;
        case ASTNodeTypes.T_IDENT:
            return findVar(astNode.value,scope);
        case ASTNodeTypes.T_GE:
            return  leftResult >= rightResult;
        case ASTNodeTypes.T_GT:
            return  leftResult > rightResult;
        case ASTNodeTypes.T_LE:
            return  leftResult <= rightResult;
        case ASTNodeTypes.T_LT:
            return  leftResult < rightResult;
        case ASTNodeTypes.T_EQ:
            return  leftResult === rightResult;
        case ASTNodeTypes.T_NEQ:
            return  leftResult !== rightResult;
        case ASTNodeTypes.T_VISIT:
            return scope.getProperty(astNode.value,leftResult);
        default:
            errPrint(`unknown ASTNode op : ${astNode.op}`);
    }
}


module.exports = {
    interpretAST
}