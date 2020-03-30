const {gData,tokenTypes,precedenceList,ASTNodeTypes} = require("./token");
const {errPrint} = require("../init/commons");
const {match,scan,putBackToken,semicolon,rightPt} = require("./scanner");
const {ASTNode} = require("./ASTnode");

const prefixParserMap = {
    [tokenTypes.T_IDENT]:identifier,
    [tokenTypes.T_INT]:int,
    [tokenTypes.T_STRING]:str,
    [tokenTypes.T_LPT]:group,
    [tokenTypes.T_ADD]:prefix.bind(null,tokenTypes.T_ADD),
    [tokenTypes.T_SUB]:prefix.bind(null,tokenTypes.T_SUB),
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
    let infix = infixParserMap[token.type];
    console.log(token)
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
        || token.type === tokenTypes.T_COL
    ){
        return left;
    }
    console.log(left,"?")
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

        if(infixParserMap[token.type]){
            value = getPrecedence();
        }
    }

    return left;
}



function identifier(){
    let {token} = gData;
    return new ASTNode().initLeafNode(ASTNodeTypes.T_IDENT,token.value);
}
function int() {
    let {token} = gData;
    return new ASTNode().initLeafNode(ASTNodeTypes.T_INT,token.value);
}

function str() {
    let {token} = gData;
    return new ASTNode().initLeafNode(ASTNodeTypes.T_STRING,token.value);
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
    return new ASTNode().initUnaryNode(ASTNodeTypes.T_FUNCALL,astNode,left.value);
}

function prefix(type){
    scan();
    let right = parseExpression(precedenceList.prefix);
    putBackToken(gData.token);
    return new ASTNode().initUnaryNode(type,right,null);
}


function infix(precedence,left,type){
    let right = parseExpression(precedence);
    return new ASTNode().initTwoNode(type,left,right,null);
}

function string(){

}

function nul(){

}

function undef(){
    
}

module.exports = {
    parseExpression,
    prefixParserMap
}