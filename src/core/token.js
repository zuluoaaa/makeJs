
const T_ADD = "+";
const T_SUB = "-";
const T_MUL = "*";
const T_DIV = "/";

const T_GT = ">";
const T_GE = ">=";
const T_LT = "<";
const T_LE = "<=";
const T_EQ = "==";
const T_NEQ = "!=";

const T_EOF = "";
const T_SEMI = ";";

const T_ASSIGN = "=";
const T_INT = "int";
const T_VAR = "var";
const T_IDENT = "identifier";
const T_LVALUE = "leftValue";

const T_LPT = "(";
const T_RPT = ")";
const T_LBR = "{";
const T_RBR = "}";

const T_IF = "if";
const T_ELSE = "else";
const T_WHILE = "while_loop";
const T_FOR = "for_loop";

const T_GLUE = "_glue";

const precedenceList = {
    "":0,
    ">":5,">=":5,"<":5,"<=":5,"==":5,"!=":5,
    "+":10, "-":10,
    "*":20,"/":20,
};


const tokenTypes = {
    T_ADD, T_SUB, T_MUL, T_DIV,
    T_ASSIGN, T_INT, T_VAR, T_IDENT,
    T_EOF, T_SEMI,
    T_GT, T_GE, T_LT, T_LE, T_EQ, T_NEQ,
    T_IF, T_ELSE,T_LPT, T_RPT, T_LBR, T_RBR,
    T_WHILE,T_FOR
};

const ASTNodeTypes = {
    T_ADD, T_SUB, T_MUL, T_DIV,
    T_ASSIGN,T_INT,T_IDENT,
    T_LVALUE,
    T_GT, T_GE, T_LT, T_LE, T_EQ, T_NEQ,
    T_IF,T_ELSE, T_LPT, T_RPT, T_LBR, T_RBR,
    T_GLUE,T_WHILE,T_FOR
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

    gVarMap:{},
    gSymbols:[]
};



module.exports = {
    tokenTypes,
    gData,
    Token,
    precedenceList,
    ASTNodeTypes
};

