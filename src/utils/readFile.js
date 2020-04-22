const fs = require("fs");

function readFileToStr(src) {
    let data = fs.readFileSync(src).toString();
    return data;
}
function writeStrToFile(){

}

module.exports = {
    readFileToStr,
    writeStrToFile
}