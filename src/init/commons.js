const {gData,tokenTypes} = require("../core/defines");


function errPrint(msg){
    throw new Error(msg)
}

module.exports = {
    errPrint
}