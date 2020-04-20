const childprocess = require('child_process');


const tests = 12;


function run() {
    for(let i=1;i<=tests;i++){
        let line = `node src/index.js -i ./test/test${i}.js`;
        childprocess.exec(line,(error, stdout, stderr)=> {
            if (error !== null) {
                console.log(`test${i} test failed`);
                throw error;
            }
            console.log(`test${i} test success`);
        });
    }
}
run();