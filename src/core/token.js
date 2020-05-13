const {Scope} = require("./scope");

const T_ADD = "+";
const T_SUB = "-";
const T_MUL = "*";
const T_DIV = "/";

const T_QST = "?";
const T_COL = ":";
const T_LCMT = "/*";
const T_RCMT = "*/";
const T_LINE_CMT = "//";

const T_GT = ">";
const T_GE = ">=";
const T_LT = "<";
const T_LE = "<=";
const T_EQ = "==";
const T_NEQ = "!=";

const T_AND = "&&";
const T_OR = "||";


const T_EOF = "";
const T_SEMI = ";";
const T_COMMA = ",";

const T_ASSIGN = "=";

const T_VAR = "var";
const T_IDENT = "identifier";
const T_LVALUE = "leftValue";

const T_LPT = "(";
const T_RPT = ")";
const T_LBR = "{";
const T_RBR = "}";
const T_LMBR = "[";
const T_RMBR = "]";


const T_OBJECT = "[object object]";
const T_ARRAY = "array";
const T_VISIT = "visit key";

const T_STRING = "string";
const T_NULL = "null";
const T_UNDEFINED = "undefined";
const T_BOOL = "BOOL";

const T_INT = "number";
const T_FUN = "function";
const T_NATIVE_FUN = "native function";
const T_FUNCALL = "execute function";
const T_FUNARGS = "args";
const T_ARGUMENT = "argument";
const T_RETURN = "return";

const T_IF = "if";
const T_ELSE = "else";
const T_WHILE = "while_loop";
const T_FOR = "for_loop";


const T_GLUE = "_glue";

const precedenceList = {
    "":0,
    assign:1,
    condition:2,
    and:2.5,
    compare:3,
    sum:4,
    product:5,
    prefix:6,
    postfix:7,
    call:8,
};



const tokenTypes = {
    T_ADD, T_SUB, T_MUL, T_DIV,T_RCMT,T_LCMT,T_LINE_CMT,
    T_QST,T_COL,
    T_ASSIGN, T_VAR, T_IDENT,
    T_EOF, T_SEMI,T_COMMA,T_AND,T_OR,
    T_GT, T_GE, T_LT, T_LE, T_EQ, T_NEQ,
    T_IF, T_ELSE,T_LPT, T_RPT, T_LBR, T_RBR,T_LMBR,T_RMBR,
    T_WHILE,T_FOR,
    T_FUN,T_FUNCALL,T_RETURN,T_ARGUMENT,
    T_INT,T_STRING,T_NULL,T_UNDEFINED,T_BOOL,T_OBJECT,T_ARRAY
};

const ASTNodeTypes = {
    T_ADD, T_SUB, T_MUL, T_DIV,
    T_VAR,T_ASSIGN,T_INT,T_IDENT,T_STRING,T_NULL,T_UNDEFINED,T_BOOL,T_OBJECT,
    T_LVALUE,
    T_GT, T_GE, T_LT, T_LE, T_EQ, T_NEQ,T_AND,T_OR,
    T_IF,T_ELSE, T_LPT, T_RPT, T_LBR, T_RBR,
    T_GLUE,T_WHILE,T_FOR,
    T_FUN,T_FUNCALL,T_FUNARGS,T_RETURN,T_NATIVE_FUN,T_ARGUMENT,T_ARRAY,T_VISIT
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
    nextToken:null,
    token:new Token(null,null),

    KEYWORD_MAX_LENGTH:512,

    gScope:new Scope(),
};


module.exports = {
    tokenTypes,
    gData,
    Token,
    precedenceList,
    ASTNodeTypes
};

