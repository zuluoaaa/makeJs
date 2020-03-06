const {gData,tokenTypes,ASTnode} = require("../core/defines");
const {errPrint} = require("../init/commons");
const {match,scan} = require("./scaner");
const {addVar, assignVal} = require("./data");
const {parseExpression} = require("./expression");



function varDeclaration() {
    let {token}  = gData;
    match(tokenTypes.V_VAR,"var");
    if(token.type === tokenTypes.V_IDENT){
        addVar(token.value);
    }else {
        errPrint(`unknown error : token type: ${token.type}`);
    }
    assignStatement();
}

function assignStatement() {
    let {token}  = gData;
    match(tokenTypes.V_IDENT,"identifier");
    if(token.type !== tokenTypes.M_ASSIGN){
        return;
    }

    let astTree = parseExpression(0);

}



function statement(){
    while (true){
        let {token}  = gData;
        switch (token.type) {
            case tokenTypes.V_VAR:
                varDeclaration();
                break;
            case tokenTypes.V_IDENT:
                assignStatement();
                break;
            case tokenTypes.M_EOF:
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