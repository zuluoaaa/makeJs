/**
 * check a char is valid var
 * @param char
 * @returns {boolean}
 */
function validVar(char) {
    let reg = /[a-z]|[A-Z]|_/;
    return reg.test(char);
}

function validNumber(char){
    let reg = /[0-9]/;
    return reg.test(char)
}

function validBlank(char){
    switch (char) {
        case "%0A":
        case "%20":
        case "%0D":
            return true;
        default:
            return false;
    }
}

module.exports = {
    validVar,
    validNumber,
    validBlank
}