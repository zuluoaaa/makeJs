
let scopeId = 0;

class Scope {
    constructor(parent=null,type="block") {
        this.scope = {};
        this.parent = parent;
        this.scopeId = scopeId++;
        this.type = type;
        this.returnValue = null;
    }

    add(name){
        this.scope[name] = {
            value:undefined,
            type:undefined
        };
    }
    set(name,value,type){
        if(!this.scope[name]){
            this.scope[name] = {};
        }
        this.scope[name].value = value;
        this.scope[name].type = type;
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