
const A_ADD = "+";
const A_SUB = "-";
const A_MUL = "*";
const A_DIV = "/";
const A_ASSIGN = "=";
const A_INT = "int";
const A_VAR = "var";
const A_IDENT = "identifier";

const ASTTypes = {

};

class ASTNode{

    left = null;
    right = null;

    op = null;
    type = null;
    value = null;

    initLeafNode(op,value){
        this.op = op;
        this.value = value;
    }

    initUnaryNode(op,left,value){
        this.op = op;
        this.left = left;
        this.value = value;
    }
}


module.exports = {
    ASTNode
};