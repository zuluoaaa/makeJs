const {gData,tokenTypes,ASTNodeTypes} = require("./token");
const {errPrint} = require("../init/commons");
const {match,scan} = require("./scanner");
const {addVar, assignVal} = require("./data");
const {parseExpression} = require("./expression");
const {primary,genAST} = require("./genAST");
const {ASTNode} = require("./ASTnode");

function varDeclaration() {
    let {token}  = gData;
    match(tokenTypes.T_VAR,"var");
    if(match(tokenTypes.T_IDENT,"identifier")){
        addVar(token.value);
    }else {
        errPrint(`unknown error : token type: ${token.type}`);
    }
    match(tokenTypes.T_SEMI,";");
    //assignStatement();
}

function assignStatement() {
    let {token}  = gData;
    let right = new ASTNode().initLeafNode(ASTNodeTypes.T_LVALUE,token.value);
    match(tokenTypes.T_IDENT,"identifier");
    match(tokenTypes.T_ASSIGN,"assign");
    let left = parseExpression(0);
    let root = new ASTNode().initTwoNode(ASTNodeTypes.T_ASSIGN,left,right);
    //let result = genAST(root);
    console.log(JSON.stringify(root),"output");
    match(tokenTypes.T_SEMI,";");

}

function numberStatement() {

    let left = primary();

}



function statement(){
    while (true){
        let {token}  = gData;
        switch (token.type) {
            case tokenTypes.T_VAR:
                varDeclaration();
                break;
            case tokenTypes.T_IDENT:
                assignStatement();
                break;
            case tokenTypes.T_INT:
                numberStatement();
                break;
            case tokenTypes.T_EOF:
                return;
            default:
                errPrint(`unknown Syntax:${token.type} , at ${gData.line} line`)
        }
    }
}

module.exports = {
    statement
}