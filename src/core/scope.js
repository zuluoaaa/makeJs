const {errPrint} = require("../init/commons");

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
            _inner:true,
            name,
            value:undefined
        };
    }
    set(name,value,type){
        if(!this.scope[name]){
            this.scope[name] = { _inner:true,name};
        }
        this.scope[name].value = value;
        this.scope[name].type = type;
    }

    static warpVal(value){
        if(typeof value === "undefined"){
            return "undefined"
        }
        if(value === null){
            return null;
        }
        if(value._inner === true){
            return value;
        }
        return {
            value,
            _inner:true
        }
    }

    get(name){
        let scope = this.scope;
        let parent = this.parent;
        while (scope !== null){
            if(scope[name]){
                return scope[name];
            }
            scope = parent;
            if(parent){
                parent = parent.parent;
            }
        }
        return undefined;
    }

    getProperty(name,key){
        let val = this.get(name);
        if(val === null){
            errPrint(`Uncaught ReferenceError: ${name} is not defined`)
        }
        return {
            _inner:true,
            _parent:val,
            _key:key,
            name,
            value:val.value[key],
        }
    }
}





module.exports = {
    Scope
}