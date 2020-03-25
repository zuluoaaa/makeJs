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
const {parseExpression} = require("./expression");
const {primary,genAST} = require("./genAST");
const {ASTNode} = require("./ASTnode");

function varDeclaration() {
    let {token}  = gData;
    let tree=null,left=null;
    match(tokenTypes.T_VAR,"var");
    do{
        if(token.type === tokenTypes.T_IDENT){
            left = new ASTNode().initLeafNode(ASTNodeTypes.T_VAR,token.value);
            scan();
            if(tree === null){
                tree = left;
            }else{
                tree = new ASTNode().initTwoNode(ASTNodeTypes.T_GLUE,tree,left,null);
            }
            if(token.type === tokenTypes.T_SEMI){
                break;
            }
        }else {
            errPrint(`unknown error : token type: ${token.type}`);
        }
    }while (token.type === tokenTypes.T_COMMA && scan());
    if(token.type === tokenTypes.T_SEMI){
        semicolon();
    }
    return tree;
    //semicolon();
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
    let left = parseExpression(0);
    semicolon();
    return left;
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

function whileStatement() {
    let condition=null,body=null;
    match(tokenTypes.T_WHILE,"while");
    leftPt();
    condition = parseExpression(0);
    rightPt();
    leftBrace();
    body = statement();
    rightBrace();
    return new ASTNode().initTwoNode(ASTNodeTypes.T_WHILE,condition,body,null);
}


function funStatement(){
    let {token}  = gData;
    match(tokenTypes.T_FUN,"function");
    let funName = token.value;
    match(tokenTypes.T_IDENT,"identifier");
    token.type = tokenTypes.T_VAR;
    let left = statement();
    rightPt();
    leftBrace();
    let funBody = statement();
    rightBrace();
    return new ASTNode().initTwoNode(ASTNodeTypes.T_FUN,left,funBody,funName);
}

function returnStatement(){
    let {token}  = gData;
    match(tokenTypes.T_RETURN,"return");
    let returnTree = parseExpression(0);
    semicolon();
    return new ASTNode().initUnaryNode(ASTNodeTypes.T_RETURN,returnTree,null);
}


function statement(){
    let tree = null,left = null;
    while (true){
        let {token}  = gData;
        switch (token.type) {
            case tokenTypes.T_VAR:
                left = varDeclaration();
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
            case tokenTypes.T_WHILE:
                left = whileStatement();
                break;
            case tokenTypes.T_FUN:
                left = funStatement();
                break;
            case tokenTypes.T_RETURN:
                left = returnStatement();
                break;
            case tokenTypes.T_EOF:
            case tokenTypes.T_RBR:
            case tokenTypes.T_RPT:
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
    statement,
}