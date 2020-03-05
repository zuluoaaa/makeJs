/**
 * value of token types  is Operator Precedence
 */

const M_EOF = 0;
const M_INT = 1;

const M_ADD = 10;
const M_SUB = 10;

const M_MUL = 20;
const M_DIV = 20;



const tokenTypes = {
    M_EOF,
    M_INT,
    M_ADD,
    M_SUB,
    M_MUL,
    M_DIV
};

class Token{
    constructor(token,initValue) {
        this.token = token;
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
    line:0,
    index:0,
    putBack:null,
    content:null,
    token:null
};



module.exports = {
    tokenTypes,
    gData,
    Token
};

