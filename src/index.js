const {init} = require("./init/init")
const {scan} = require("./core/scanner");
const {statement} = require("./core/parse");

function main(){

   console.log("start compiling");

   init();
   scan();
   statement();

   console.log("compiled finished");
}

main();
