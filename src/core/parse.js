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
const {Scope} = require("./scope");

function varDeclaration() {
    let {token}  = gData;
    match(tokenTypes.T_VAR,"var");
    do{
        if(token.type === tokenTypes.T_IDENT){
            addVar(token.value);
            scan();
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


function funStatement(parentScope){

    let {token}  = gData;
    let scope = new Scope(parentScope);
    gData.currentScope = scope;

    match(tokenTypes.T_FUN,"function");
    let funName = token.value;
    match(tokenTypes.T_IDENT,"identifier");

    token.type = tokenTypes.T_VAR;
    statement(scope);
    rightPt();

    leftBrace();

    let funBody = statement();
    rightBrace();
    console.log( gData.currentScope,"?????????????????????")
    gData.currentScope = parentScope;
    let astNode = new ASTNode().initUnaryNode(ASTNodeTypes.T_FUN,funBody,null);
    addVar(funName);
    assignVal(funName,astNode,ASTNodeTypes.T_FUN);

}

function returnStatement(){
    let {token}  = gData;
    match(tokenTypes.T_RETURN,"return");
    let returnTree = statement();
    semicolon();
    return returnTree;
}


function statement(scope){
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
            case tokenTypes.T_WHILE:
                left = whileStatement();
                break;
            case tokenTypes.T_FUN:
                funStatement(scope);
                left = null;
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