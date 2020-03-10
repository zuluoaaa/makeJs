const {gData,tokenTypes} = require("./token");
const {errPrint} = require("../init/commons");
const {validVar,validNumber,validBlank} = require("../utils/utils");

function scanKeyword(str) {
    switch (str) {
        case "let":
        case "var":
        case "const":
            return tokenTypes.T_VAR;
    }
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
        switch (value) {
            case "%0A":
            case "%20":
            case "%0D":
            //case ";":
                break;
            default:

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
        token
    } = gData;
    token.value = null;
    if(index === content.length){
        token.type = tokenTypes.T_EOF;
        return;
    }
    let value = nextChar();
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
        case "=":
            token.type = tokenTypes.T_ASSIGN;
            break;
        case ";":
            token.type = tokenTypes.T_SEMI;
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
            errPrint(`Unrecognised char : ${value}`)
        }
}

function match(type,text){
    if(gData.token.type === type){
        scan();
        return true
    }else{
        errPrint(`Exception : ${text}`);
    }
}

function nextChar(){
    let {
        content,
        putBack
    } = gData;

    if(putBack !== null){
        let c = putBack;
        gData.putBack = null;
        return c;
    }
    gData.index +=1;
    if(gData.index <= content.length-1){
        let value = encodeURI(content[gData.index]);
        if(value === "%0A"){
            gData.line+=1;
        }
        return value;
    }
    return null;
}

function putBack(char){
    gData.putBack = char;
}

module.exports = {
    scan,
    match
}