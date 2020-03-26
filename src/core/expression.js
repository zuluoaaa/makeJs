const {gData,tokenTypes,precedenceList,ASTNodeTypes} = require("./token");
const {errPrint} = require("../init/commons");
const {match,scan,putBackToken,semicolon,rightPt} = require("./scanner");
const {ASTNode} = require("./ASTnode");

const prefixParserMap = {
    [tokenTypes.T_IDENT]:identifier,
    [tokenTypes.T_INT]:int,
    [tokenTypes.T_LPT]:group,
    [tokenTypes.T_ADD]:prefix,
    [tokenTypes.T_SUB]:prefix,
};

const infixParserMap = {
    [tokenTypes.T_LPT]:{parser:funCall,precedence:precedenceList.call},
    [tokenTypes.T_QST]:{parser:condition,precedence:precedenceList.condition},
    [tokenTypes.T_ASSIGN]:{parser:assign,precedence:precedenceList.assign},

    [tokenTypes.T_ADD]:{parser:infix.bind(null,precedenceList.sum),precedence:precedenceList.sum},
    [tokenTypes.T_SUB]:{parser:infix.bind(null,precedenceList.sum),precedence:precedenceList.sum},
    [tokenTypes.T_MUL]:{parser:infix.bind(null,precedenceList.product),precedence:precedenceList.product},
    [tokenTypes.T_DIV]:{parser:infix.bind(null,precedenceList.product),precedence:precedenceList.product},

    [tokenTypes.T_GT]:{parser:infix.bind(null,precedenceList.compare),precedence:precedenceList.compare},
    [tokenTypes.T_GE]:{parser:infix.bind(null,precedenceList.compare),precedence:precedenceList.compare},
    [tokenTypes.T_LT]:{parser:infix.bind(null,precedenceList.compare),precedence:precedenceList.compare},
    [tokenTypes.T_LE]:{parser:infix.bind(null,precedenceList.compare),precedence:precedenceList.compare},
    [tokenTypes.T_EQ]:{parser:infix.bind(null,precedenceList.compare),precedence:precedenceList.compare},
    [tokenTypes.T_NEQ]:{parser:infix.bind(null,precedenceList.compare),precedence:precedenceList.compare},
};

function getPrecedence(){
    let {token} = gData;
    console.log(token.type,"getttttttttttttt")
    let infix = infixParserMap[token.type];
    return infix.precedence;
}

function parseExpression(precedenceValue) {
    let {token} = gData;

    let prefixParser = prefixParserMap[token.type];
    if(!prefixParser){
        errPrint(`unknown token : ${token.value}（${token.type}）`)
    }
    let left = prefixParser();
    scan();
    if(token.type === tokenTypes.T_SEMI
        || token.type === tokenTypes.T_RPT
        || token.type === tokenTypes.T_EOF
        || token.type === tokenTypes.T_COMMA
    ){
        return left;
    }
    let value = getPrecedence();
    while (value>precedenceValue){
        let type = token.type;
        if(token.type === tokenTypes.T_SEMI
            || token.type === tokenTypes.T_RPT
            || token.type === tokenTypes.T_EOF
            || token.type === tokenTypes.T_COMMA
        ){
            return left;
        }
        let infix = infixParserMap[type];
        scan();
        left = infix.parser(left,type);
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
function funCallStatement(){
    let {token}  = gData;
    let tree = parseExpression(0);
    rightPt();
    return tree;
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


function identifier(){
    let {token} = gData;
    return new ASTNode().initLeafNode(ASTNodeTypes.T_IDENT,token.value);
}
function int() {
    let {token} = gData;
    return new ASTNode().initLeafNode(ASTNodeTypes.T_INT,token.value);
}

function assign(left){
    let right = parseExpression(0);
    left.op = ASTNodeTypes.T_LVALUE;
    return new ASTNode().initTwoNode(ASTNodeTypes.T_ASSIGN,right,left,null);
}

function condition(left){
    let  trueBody = parseExpression(0);
    match(tokenTypes.T_COL,":");
    let  falseBody = parseExpression(precedenceList.condition-1);
    return new ASTNode().initThreeNode(ASTNodeTypes.T_IF,left,trueBody,falseBody,null);
}

function group(){
    scan();
    return parseExpression(0);
}

function funCall(left,type){
    let { token } = gData;
    let args = [];
    let astNode = new ASTNode().initLeafNode(ASTNodeTypes.T_FUNARGS,args);
    while (token.type !== tokenTypes.T_RPT){
        let tree = parseExpression(0);
        args.push(tree);

        if(token.type !== tokenTypes.T_COMMA && token.type !== tokenTypes.T_RPT){
            errPrint(`unknown Syntax token : ${token.type} : value : ${token.value}`);
        }
        if(token.type === tokenTypes.T_RPT){
            scan();
            break;
        }else{
            scan();
        }
    }
    //match(tokenTypes.T_RPT,")");
    return new ASTNode().initUnaryNode(ASTNodeTypes.T_FUNCALL,astNode,left.value);
}

function prefix(type){
    let right = parseExpression(precedenceList.prefix);
    return new ASTNode().initUnaryNode(type,right,null);
}


function infix(precedence,left,type){
    let right = parseExpression(precedence);
    return new ASTNode().initTwoNode(type,left,right,null);
}



module.exports = {
    parseExpression,
    prefixParserMap
}