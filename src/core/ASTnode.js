

class ASTNode{

    constructor() {
        this.left = null;
        this.right = null;
        this.mid = null;
        this.op = null;
        this.value = null;
        this.option = null;
    }

    initLeafNode(op,value){
        this.op = op;
        this.value = value;
        return this;
    }

    initUnaryNode(op,left,value){
        this.left = left;
        return this.initLeafNode(op,value);
    }

    initTwoNode(op,left,right,value){
        this.right = right;
        return this.initUnaryNode(op,left,value);
    }

    initThreeNode(op,left,mid,right,value){
        this.mid = mid;
        return this.initTwoNode(op,left,right,value);
    }
}


module.exports = {
    ASTNode
};