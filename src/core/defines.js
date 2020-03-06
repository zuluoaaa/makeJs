/**
 * value of token types also is index of Operator Precedence List
 */



const M_ADD = 3;
const M_SUB = 4;

const M_MUL = 5;
const M_DIV = 6;

const M_ASSIGN = 7;

const M_EOF = 1;
const V_VAR = 200;
const V_INT = 201;
const V_IDENT = 202;


const tokenTypes = {
    M_EOF,// end
    V_INT,// number
    M_ADD,// +
    M_SUB,// -
    M_MUL,// *
    M_DIV,// /
    V_VAR,// var | let | const
    V_IDENT,
    M_ASSIGN
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
    Token
};

