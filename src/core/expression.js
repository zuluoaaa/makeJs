const {gData,tokenTypes,precedenceList,ASTNodeTypes} = require("./token");
const {errPrint} = require("../init/commons");
const {match,scan,putBackToken,semicolon,rightPt} = require("./scanner");
const {addVar, assignVal} = require("./data");

const {ASTNode} = require("./ASTnode");


function funCallStatement(){
    let {token}  = gData;
    let tree = parseExpression(0);
    console.log("ccccccccc",tree)
    rightPt();

    return tree;
}


function parseExpression(precedenceValue) {
    let {token} = gData;

    let left = primary();

    if(token.type === tokenTypes.T_SEMI
        || token.type === tokenTypes.T_RPT
        || token.type === tokenTypes.T_COMMA){
        return left;
    }

    let value = precedenceList[token.type];

    while (value>precedenceValue){

        let type = token.type;

        scan();
        let right = parseExpression(precedenceList[type]);

        let lead = new ASTNode().initTwoNode(type,left,right,token.value);

        if(token.type === tokenTypes.T_COMMA){
            return  lead;
        }
        if(token.type === tokenTypes.T_RPT){
            return  lead;
        }
        if(token.type === tokenTypes.T_SEMI){
            return  lead;
        }
        left = lead;
    }
    return left;
}

function primary() {
    let asTnode = new ASTNode();
    let {token} = gData;

    switch (token.type) {
        case ASTNodeTypes.T_INT:
            asTnode.initLeafNode(token.type,token.value);
            break;
        case ASTNodeTypes.T_IDENT:
            let name = token.value;
            let originToken = JSON.parse(JSON.stringify(token));
            scan();
            if(token.type === tokenTypes.T_LPT){
                token.type = tokenTypes.T_FUNCALL;
                token.value = name;
                return funCallStatement();
            }
            putBackToken(token);
            asTnode.initLeafNode(originToken.type,originToken.value);
            break;
        case ASTNodeTypes.T_FUNCALL:
            let funName = token.value;
            return asTnode.initUnaryNode(token.type,funArgs(),funName);
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
        if(token.type !== tokenTypes.T_COMMA && token.type !== tokenTypes.T_RPT){
            errPrint(`unknown Syntax token : ${token.type} : value : ${token.value}`);
        }
        if(token.type === tokenTypes.T_RPT){
            break;
        }
        scan();
    }
    //match(tokenTypes.T_RPT,")");
    return astNode;
}




module.exports = {
    parseExpression
}