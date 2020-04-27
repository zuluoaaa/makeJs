/**
 * check a char is valid var
 * @param char
 * @returns {boolean}
 */
function validVar(char) {
    if(char !== null && typeof char !== "undefined"){
        let reg = /[a-z]|[A-Z]|_|\$/;
        return reg.test(char);
    }
}

function validNumber(char){
    let reg = /[0-9]/;
    return reg.test(char)
}

function validBlank(value){
    if(value !== " " &&
        value.indexOf("\r\n") === -1 &&
        value.indexOf("\n") === -1 &&
        value.indexOf("\r") === -1
    ){
        return false;
    }else{
        return true;
    }
}

module.exports = {
    validVar,
    validNumber,
    validBlank
}