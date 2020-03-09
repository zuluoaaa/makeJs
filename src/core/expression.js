const {gData,tokenTypes,precedenceList} = require("./token");
const {errPrint} = require("../init/commons");
const {match,scan} = require("./scaner");
const {addVar, assignVal} = require("./data");
const {primary} = require("./genAST");
const {ASTNode} = require("./ASTnode");

function parseExpression(precedenceValue) {
    let {token} = gData;
    let left = primary();

    if(token.type === tokenTypes.T_SEMI){
        return left;
    }

    while (precedenceList[token.type]>precedenceValue){
        let type = token.type;
        scan();
        let right = parseExpression(precedenceList[type]);

        let lead = new ASTNode().initTwoNode(type,left,right,token.value);

        if(token.type === tokenTypes.T_SEMI){
            return  lead;
        }

        left = lead;
    }
    return left;
}




module.exports = {
    parseExpression
}