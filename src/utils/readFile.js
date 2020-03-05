const fs = require("fs");

function readFileToStr(src) {
    let data = fs.readFileSync(src).toString();
    return data;
}

module.exports = {
    readFileToStr
}