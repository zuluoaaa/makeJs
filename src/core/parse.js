const {gData,tokenTypes} = require("./token");
const {errPrint} = require("../init/commons");
const {match,scan} = require("./scaner");
const {addVar, assignVal} = require("./data");
const {parseExpression} = require("./expression");
const {primary} = require("./genAST")


function varDeclaration() {
    let {token}  = gData;
    match(tokenTypes.T_VAR,"var");
    if(token.type === tokenTypes.T_IDENT){
        addVar(token.value);
    }else {
        errPrint(`unknown error : token type: ${token.type}`);
    }

    assignStatement();
}

function assignStatement() {
    let {token}  = gData;
    match(tokenTypes.T_IDENT,"identifier");
    if(token.type !== tokenTypes.T_ASSIGN){
        return;
    }

    let astTree = parseExpression(0);

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
    parseExp,
    statement
}