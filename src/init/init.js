const {readFileToStr} = require("../utils/readFile")
const {gData} = require("../core/token");

function init() {
    let arguments = process.argv.splice(2);
    if(arguments[0] !== "-i" || !arguments[1] ){
        throw new Error("must specify a input file")
    }
    let data = readFileToStr(arguments[1]);
    gData.content = data;
}

module.exports = {
    init
}



