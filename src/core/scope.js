
let scopeId = 0;

class Scope {
    constructor(parent=null) {
        this.scope = {};
        this.parent = parent;
        this.scopeId = scopeId++;
    }

    add(name,obj){
        this.scope[name] = obj;
        console.log(this.scope)
    }
    set(name,value,type){
        this.scope[name].value = value;
        this.scope[name].type = type;
        console.log(this.scope)
    }

    get(name){
        let scope = this.scope;
        let parent = this.parent;
        while (scope !== null){
            if(scope[name]){
                return scope[name].value;
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