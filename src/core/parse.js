const {gData,tokenTypes,ASTNodeTypes} = require("./token");
const {errPrint} = require("../init/commons");
const {match,
    scan,
    leftBrace,
    rightBrace,
    leftPt,
    rightPt,
    semicolon
} = require("./scanner");
const {addVar, assignVal} = require("./data");
const {parseExpression} = require("./expression");
const {primary,genAST} = require("./genAST");
const {ASTNode} = require("./ASTnode");

function varDeclaration() {
    let {token}  = gData;
    match(tokenTypes.T_VAR,"var");
    if(token.type === tokenTypes.T_IDENT){
        addVar(token.value);
        scan();
    }else {
        errPrint(`unknown error : token type: ${token.type}`);
    }
    semicolon();
    //assignStatement();
}

function assignStatement() {
    let {token}  = gData;
    let right = new ASTNode().initLeafNode(ASTNodeTypes.T_LVALUE,token.value);
    match(tokenTypes.T_IDENT,"identifier");
    match(tokenTypes.T_ASSIGN,"assign");
    let left = parseExpression(0);
    let root = new ASTNode().initTwoNode(ASTNodeTypes.T_ASSIGN,left,right,null);
    semicolon();
    return root;
}

function numberStatement() {
    let left = primary();
    //todo
}

function ifStatement() {
    let {token}  = gData;
    let condition=null,trueBody=null,falseBody=null;
    match(tokenTypes.T_IF,"if");
    leftPt();
    condition = parseExpression(0);
    rightPt();
    leftBrace();
    trueBody = statement();
    rightBrace();
    if(token.type === tokenTypes.T_ELSE){
        scan();
        leftBrace();
        falseBody = statement();
        rightBrace();
    }
    return new ASTNode().initThreeNode(ASTNodeTypes.T_IF,condition,trueBody,falseBody,null);
}


function statement(){
    let tree = null,left = null;
    while (true){
        let {token}  = gData;
        switch (token.type) {
            case tokenTypes.T_VAR:
                varDeclaration();
                left = null;
                break;
            case tokenTypes.T_IDENT:
                left = assignStatement();
                break;
            case tokenTypes.T_INT:
                left = numberStatement();
                break;
            case tokenTypes.T_IF:
                left = ifStatement();
                break;
            case tokenTypes.T_EOF:
            case tokenTypes.T_RBR:
                return tree;
            default:
                errPrint(`unknown Syntax:${token.type} , at ${gData.line} line`)
        }
        if(left !== null){
            if(tree === null){
                tree = left;
            }else{
                tree = new ASTNode().initTwoNode(ASTNodeTypes.T_GLUE,tree,left,null);
            }
        }
    }
}

module.exports = {
    statement
}