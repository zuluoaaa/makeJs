const {gData,tokenTypes} = require("./token");
const {errPrint} = require("../init/commons");
const {validVar,validNumber,validBlank} = require("../utils/utils");
const { defineKeywords } = require("./define");


function scanKeyword(str) {
    if(defineKeywords[str]){
        return defineKeywords[str];
    }
  /*  scan();
    let nextToken = gData.token;

    if(nextToken.type === tokenTypes.T_LPT){
        return tokenTypes.T_FUNCALL;
    }
    putBackToken(nextToken);*/
    return tokenTypes.T_IDENT;
}


function scanIdent(s) {
    let str = s;
    let c = nextChar();
    while (typeof c !== "undefined" && !validBlank(c) &&
    (validNumber(c) || validVar((c)))){
        if(str.length > gData.KEYWORD_MAX_LENGTH){
            errPrint(`Identifier too long : ${str}`);
            return;
        }
        str += c;
        c = nextChar();
    }
    putBack(c);
    return str;
}

function scanInt(s) {
    let n = Number(s);
    let c = nextChar();
    while (validNumber(c)){
        n = n*10 + Number(c);
        c = nextChar();
    }
    putBack(c);
    return n;
}

function skipBlank() {
    while (true){
        let value = nextChar();
       if(value === null){
           return;
       }
        if(value !== " " &&
            value.indexOf("\r\n") === -1 &&
            value.indexOf("\n") === -1 &&
            value.indexOf("\r") === -1
        ){
            putBack(value);
            return;
        }
    }
}

function scan(){
    skipBlank();
    let {
        content,
        index,
        token,
        nextToken
    } = gData;
    token.value = null;

    if(nextToken !== null){
        let token = nextToken;
        gData.nextToken = null;
        return token;
    }
    if(index === content.length){
        token.type = tokenTypes.T_EOF;
        return;
    }
    let value = nextChar();
    let next;

    switch (value) {
        case "+":
            token.type = tokenTypes.T_ADD;
            break;
        case "-":
            token.type = tokenTypes.T_SUB;
            break;
        case "*":
            token.type = tokenTypes.T_MUL;
            break;
        case "/":
            token.type = tokenTypes.T_DIV;
            break;
        case ",":
            token.type = tokenTypes.T_COMMA;
            break;
        case "=":
            next = nextChar();
            if(next === "="){
                token.type = tokenTypes.T_EQ;
                next = nextChar();
                if(next !== "="){
                    putBack(next);
                }
            }else{
                token.type = tokenTypes.T_ASSIGN;
                putBack(next);
            }
            break;
        case ";":
            token.type = tokenTypes.T_SEMI;
            break;
        case "!":
            next = nextChar();
            if(next === "="){
                token.type = tokenTypes.T_NEQ;
            }
            errPrint(`Unrecognised char : ${value}${next}`);
            break;
        case ">":
             next = nextChar();
            if(next === "="){
                token.type = tokenTypes.T_GE;
            }else {
                token.type = tokenTypes.T_GT;
                putBack(next);
            }
            break;
        case "<":
             next = nextChar();
            if(next === "="){
                token.type = tokenTypes.T_LE;
            }else {
                token.type = tokenTypes.T_LT;
                putBack(next);
            }
            break;
        case "(":
            token.type = tokenTypes.T_LPT;
            break;
        case ")":
            token.type = tokenTypes.T_RPT;
            break;
        case "{":
            token.type = tokenTypes.T_LBR;
            break;
        case "}":
            token.type = tokenTypes.T_RBR;
            break;
            //todo

        default:
            if(validNumber(value)){
                token.value = scanInt(value);
                token.type = tokenTypes.T_INT;
                break;
            }
            else if(validVar(value)){
                value = scanIdent(value);
                token.type = scanKeyword(value);
                token.value = value;
                break;
            }
            errPrint(`Unrecognised char : (${value})`)
        }
        console.log("token type :"+token.type);
    return true;
}

function match(type,text){
    console.log(gData.token.type,gData.token.value,type)
    if(gData.token.type === type){
        scan();
        return true
    }else{
        errPrint(`Exception : ${gData.token.type} !== ${type} : ${text}`);
    }
}

function nextChar(){
    let {
        content,
        putBack,
        nextToken
    } = gData;


    if(putBack !== null){
        let c = putBack;
        gData.putBack = null;
        return c;
    }
    gData.index +=1;
    if(gData.index <= content.length-1){
        let value = content[gData.index];
        if(value.indexOf("\r\n")>-1 || value.indexOf("\n")>-1){
            gData.line+=1;
        }
        return value;
    }
    return null;
}

function putBackToken(token) {
    gData.nextToken = JSON.parse(JSON.stringify(token));
}
function putBack(char){
    gData.putBack = char;
}

function leftBrace(){
    return match(tokenTypes.T_LBR,"{");
}

function rightBrace(){
    return match(tokenTypes.T_RBR,"}");
}

function leftPt(){
    return match(tokenTypes.T_LPT,"(");
}

function rightPt(){
    return match(tokenTypes.T_RPT,")");
}

function semicolon(){
    return match(tokenTypes.T_SEMI,";");
}

module.exports = {
    scan,
    match,
    leftBrace,
    rightBrace,
    leftPt,
    rightPt,
    semicolon,
    putBackToken
}