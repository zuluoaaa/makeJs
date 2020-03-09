

class ASTNode{

    constructor() {
        this.left = null;
        this.right = null;
        this.op = null;
        this.value = null;
    }

    initLeafNode(op,value){
        this.op = op;
        this.value = value;
        return this;
    }

    initUnaryNode(op,left,value){
        this.op = op;
        this.left = left;
        this.value = value;
    }

    initTwoNode(op,left,right,value){
        this.op = op;
        this.left = left;
        this.right = right;
        this.value = value;
        return this;
    }
}


module.exports = {
    ASTNode
};