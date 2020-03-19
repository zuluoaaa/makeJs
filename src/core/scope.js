
let scopeId = 0;

class Scope {
    constructor(parent=null) {
        this.scope = {};
        this.parent = parent;
        this.scopeId = scopeId++;
    }

    add(name,obj){
        this.scope[name] = obj;
    }

    get(name){
        let scope = this.scope;
        let parent = this.parent;
        while (scope !== null){
            if(scope[name]){
                return scope[name]
            }
            scope = parent;
            if(parent){
                parent = parent.parent;
            }
        }
        return null;
    }
}

module.exports = {
    Scope
}