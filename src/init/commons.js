const {gData,tokenTypes} = require("../core/token");


function errPrint(msg){
    throw new Error(msg)
}

module.exports = {
    errPrint
}