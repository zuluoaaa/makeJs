const childprocess = require('child_process');
const fs = require('fs');

const tests = 12;

const stat = fs.stat;
function readFileList(path) {
    let list = [];
    let files = fs.readdirSync(path);
    files.forEach(function (itm, index) {
        let p = path+"/"+itm;
        list.push(p);
    })
    return list;
}

function run(list) {
    for(let i=0;i<list.length;i++){
        let line = `node src/index.js -i ${list[i]}`;
        childprocess.exec(line,(error, stdout, stderr)=> {
            if (error !== null) {
                console.log(`test${i+1} test failed`);
                throw error;
            }
            console.log(`test${i+1} test success`);
        });
    }
}

function main() {
    let list = readFileList("test/tests");
    run(list);
}
main();

