const {ASTNode} = require("./ASTnode");
const {gData,tokenTypes} = require("./token");
const {match,scan} = require("./scaner");
const {errPrint} = require("../init/commons");
const {addVar, assignVal,findVar} = require("./data");
function primary() {
    let asTnode = new ASTNode();
    let {token} = gData;

    switch (token.type) {
        case tokenTypes.T_INT:
            asTnode.initLeafNode(token.type,token.value);
            break;
        case tokenTypes.T_IDENT:
            asTnode.initLeafNode(token.type,token.value);
            break;
        default:
            errPrint(`unknown Syntax token : ${token.type} : value : ${token.value}`)
    }
    scan();
    return asTnode;
}


function genAST(astNode,result=null){
    let leftResult,rightResult;
    if(astNode.left){
        leftResult = genAST(astNode.left);
    }
    if(astNode.right){
        rightResult = genAST(astNode.right,leftResult);
    }

    switch (astNode.op) {
        case tokenTypes.T_INT:
             return astNode.value;
        case tokenTypes.T_ADD:
            return leftResult + rightResult;
        case tokenTypes.T_SUB:
            return leftResult - rightResult;
        case tokenTypes.T_MUL:
            return leftResult * rightResult;
        case tokenTypes.T_DIV:
            return leftResult / rightResult;
        case tokenTypes.T_ASSIGN:
            return rightResult;
        case tokenTypes.T_IDENT:
            //todo
            return findVar(astNode.value);
        case tokenTypes.T_LVALUE:
            return assignVal(astNode.value,result);


        default:
            errPrint(`unknown ASTNode op : ${astNode.op}`);
    }

}


module.exports = {
    primary,
    genAST
}