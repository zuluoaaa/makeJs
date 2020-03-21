const {ASTNode} = require("./ASTnode");
const {gData,tokenTypes,ASTNodeTypes} = require("./token");
const {match,scan,rightPt} = require("./scanner");
const {errPrint} = require("../init/commons");
const {addVar, assignVal,findVar} = require("./data");


function genIfAST(astNode) {
    let state = genAST(astNode.left);
    if(state){
        genAST(astNode.mid);
    }else{
        if(astNode.right){
            genAST(astNode.right);
        }
    }
}

function genWhileAST(astNode) {
    let condition = astNode.left;
    let body = astNode.right;
    let state = genAST(condition);
    if(state){
        genAST(body);
        genWhileAST(astNode);
    }
}

function genAST(astNode,result=null){
    if(!astNode){
        return;
    }
    switch (astNode.op) {
        case ASTNodeTypes.T_IF:
            return genIfAST(astNode);
        case ASTNodeTypes.T_GLUE:
            genAST(astNode.left);
            genAST(astNode.right);
            return;
        case ASTNodeTypes.T_WHILE:
            return genWhileAST(astNode);
    }

    let leftResult,rightResult;
    if(astNode.left){
        leftResult = genAST(astNode.left);
    }
    if(astNode.right){
        rightResult = genAST(astNode.right,leftResult);
    }

    switch (astNode.op) {
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
            return findVar(astNode.value);
        case ASTNodeTypes.T_LVALUE:
            return assignVal(astNode.value,result);
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
            errPrint(`unknown ASTNode op : ${astNode.op}`);
    }
}


module.exports = {
    genAST
}