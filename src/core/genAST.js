const {ASTNode} = require("./ASTnode");
const {gData,tokenTypes,ASTNodeTypes} = require("./token");
const {match,scan,rightPt} = require("./scanner");
const {errPrint} = require("../init/commons");
const {addVar, assignVal,findVar} = require("./data");
const {Scope} = require("./scope");

function genIfAST(astNode,scope) {
    let state = genAST(astNode.left,null,scope);
    if(state){
        genAST(astNode.mid,null,scope);
    }else{
        if(astNode.right){
            genAST(astNode.right,null,scope);
        }
    }
}

function genWhileAST(astNode,scope) {
    let condition = astNode.left;
    let body = astNode.right;
    let state = genAST(condition,null,scope);
    if(state){
        genAST(body,null,scope);
        genWhileAST(astNode,scope);
    }
}

function genFunCallAST(astNode,scope) {
    let childScope = new Scope(scope,"block");
    let argument = {};
    if(astNode.left
        && astNode.left.op === ASTNodeTypes.T_FUNARGS
        && astNode.left.value.length>0
    ){
        astNode.left.value.forEach((item,index)=>{
            argument[index] = genAST(item);
        })
    }
    childScope.set("arguments",argument,ASTNodeTypes.T_ARGUMENT);

    let fnAST = scope.get(astNode.value);
    fnAST.option = "run";
    return genAST(fnAST,null,childScope);
}

function genAST(astNode,result=null,scope){
    if(!astNode){
        return;
    }
    if(scope && scope.returnValue !== null){
        return;
    }
    switch (astNode.op) {
        case ASTNodeTypes.T_IF:
            return genIfAST(astNode,scope);
        case ASTNodeTypes.T_GLUE:
            genAST(astNode.left,null,scope);
            genAST(astNode.right,null,scope);
            return;
        case ASTNodeTypes.T_WHILE:
            return genWhileAST(astNode,scope);
        case ASTNodeTypes.T_FUN:
            console.log(astNode.option,"ffffffffccccc")
            if(astNode.option === "run"){
                astNode.option = "";

                break;
            }else{
                scope.add(astNode.value);
                scope.set(astNode.value,astNode,ASTNodeTypes.T_FUN);
                return;
            }
        case ASTNodeTypes.T_FUNCALL:

            return genFunCallAST(astNode,scope);

    }

    let leftResult,rightResult;

    if(astNode.left){
        leftResult = genAST(astNode.left,null,scope);
    }
    if(astNode.right){
        rightResult = genAST(astNode.right,leftResult,scope);
    }


    switch (astNode.op) {
        case ASTNodeTypes.T_VAR:
            scope.add(astNode.value);
            return;
        case ASTNodeTypes.T_ARGUMENT:
            scope.set(astNode.value,scope.get("arguments")[astNode.option],astNode.type);
            return;
        case ASTNodeTypes.T_RETURN:
            scope.returnValue = leftResult;
            return;
        case ASTNodeTypes.T_FUN:
            return scope.returnValue;
        case ASTNodeTypes.T_INT:
            return astNode.value;
        case ASTNodeTypes.T_ADD:
            return leftResult + rightResult;
        case ASTNodeTypes.T_SUB:
            return leftResult - rightResult;
        case ASTNodeTypes.T_MUL:
            return leftResult * rightResult;
        case ASTNodeTypes.T_DIV:
            return leftResult / rightResult;
        case ASTNodeTypes.T_ASSIGN:
            return rightResult;
        case ASTNodeTypes.T_IDENT:
            return findVar(astNode.value,scope);
        case ASTNodeTypes.T_LVALUE:
            return assignVal(astNode.value,result,scope);
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

        default:
            console.log(astNode);
            errPrint(`unknown ASTNode op : ${astNode.op}`);
    }
}


module.exports = {
    genAST
}