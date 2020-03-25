const {gData,tokenTypes} = require("./token");

const defineKeywords = {
    "let":tokenTypes.T_VAR,
    "var":tokenTypes.T_VAR,
    "const":tokenTypes.T_VAR,


    "if":tokenTypes.T_IF,
    "else":tokenTypes.T_ELSE,
    "while":tokenTypes.T_WHILE,

    "function":tokenTypes.T_FUN,
    "return":tokenTypes.T_RETURN,
};





module.exports = {
    defineKeywords
}