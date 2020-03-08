const {ASTNode} = require("ASTnode")
const {gData,tokenTypes} = require("./token");
const {match,scan} = require("./scaner");
const {errPrint} = require("../init/commons");

function primary() {
    let asTnode = new ASTNode();
    let {token} = gData;

    switch (token.type) {
        case tokenTypes.T_INT:
            asTnode.initLeafNode(token.type,token.value);
            break;
        case tokenTypes.T_IDENT:
            //todo
            break;
        default:
            errPrint(`unknown Syntax token : ${token.type} : value : ${token.value}`)
    }
    scan();
    return asTnode;
}

module.exports = {
    primary
}