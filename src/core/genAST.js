const {ASTNode} = require("./ASTnode");
const {gData,tokenTypes,ASTNodeTypes} = require("./token");
const {match,scan,rightPt} = require("./scanner");
const {errPrint} = require("../init/commons");
const {addVar, assignVal,findVar} = require("./data");
const { parseExpression } = require("./expression");

function primary() {
    let asTnode = new ASTNode();
    let {token} = gData;

    switch (token.type) {
        case ASTNodeTypes.T_INT:
            asTnode.initLeafNode(token.type,token.value);
            break;
        case ASTNodeTypes.T_IDENT:
            asTnode.initLeafNode(token.type,token.value);
            break;
        case ASTNodeTypes.T_FUNCALL:
            asTnode.initUnaryNode(token.type,funArgs(),token.value);
            break;
        default:
            errPrint(`unknown Syntax token : ${token.type} : value : ${token.value}`)
    }
    scan();
    return asTnode;
}

function funArgs() {
    let {token} = gData;
    let args = [];
    let astNode = new ASTNode().initLeafNode(ASTNodeTypes.T_FUNARGS,args);
    scan();
    while (token.type !== tokenTypes.T_RPT){
        let tree = parseExpression(0);
        args.push(tree);
        scan();
        if(token.type !== tokenTypes.T_COMMA && token.type !== tokenTypes.T_RPT){
           errPrint(`unknown Syntax token : ${token.type} : value : ${token.value}`);
        }
    }
    match(tokenTypes.T_RPT,")");
    return astNode;
}


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
            //todo
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
    primary,
    genAST
}