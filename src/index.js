const {init} = require("./init/init")
const {scan} = require("./core/scanner");
const {statement} = require("./core/parse");
const {genAST} = require("./core/genAST");

function main(){

   console.log("start compiling");

   init();
   scan();
   let astNodeTree = statement();
   console.log(JSON.stringify(astNodeTree))
   let result = genAST(astNodeTree);
   console.log(result);
   console.log("compiled finished");
}

main();
