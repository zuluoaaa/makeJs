const {gData,tokenTypes,ASTnode} = require("../core/defines");
const {errPrint} = require("../init/commons");
const {match,scan} = require("./scaner");
const {addVar, assignVal} = require("./data");


function parseExpression(precedenceValue) {
    let {token} = gData;


}

module.exports = {
    parseExpression
}