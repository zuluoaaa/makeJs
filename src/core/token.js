
const T_ADD = "+";
const T_SUB = "-";
const T_MUL = "*";
const T_DIV = "/";
const T_ASSIGN = "=";
const T_EOF = "";
const T_INT = "int";
const T_VAR = "var";
const T_IDENT = "identifier";
const T_SEMI = ";"

const precedenceList = {
    "":0,
    "+":10, "-":10,
    "*":20,"/":20,
};

const tokenTypes = {
    T_ADD,
    T_SUB,
    T_MUL,
    T_DIV,
    T_ASSIGN,
    T_EOF,
    T_INT,
    T_VAR,
    T_IDENT,
    T_SEMI
};

class Token{
    constructor(tokenType,initValue) {
        this.type = tokenType;
        this.value = initValue;
    }
}


/**
 *
 * @type {{
 * content: buffer,
 * putBack: String,
 * line: Number,
 * index: Number
 * token: Token
 * }}
 */
const gData = {
    line:1,
    index:-1,
    putBack:null,
    content:null,
    token:new Token(null,null),

    KEYWORD_MAX_LENGTH:512,

    gVarMap:{}
};



module.exports = {
    tokenTypes,
    gData,
    Token,
    precedenceList
};

