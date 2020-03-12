const {init} = require("./init/init")
const {scan} = require("./core/scanner");
const {statement} = require("./core/parse");
const {genAST} = require("./core/genAST");
const {gVarMap} = require("./core/data");
function main(){

   console.log("start compiling");

   init();
   scan();
   let astNodeTree = statement();
   genAST(astNodeTree);
   
   console.log(gVarMap);

   console.log("compiled finished");
}

main();
