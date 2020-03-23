const {init} = require("./init/init")
const {scan} = require("./core/scanner");
const {statement} = require("./core/parse");
const {genAST} = require("./core/genAST");
const {gData} = require("./core/token");
function main(){

   console.log("start compiling");

   init();
   scan();
   let astNodeTree = statement(gData.gScope);
   console.log(JSON.stringify(astNodeTree),"astNodeTree");
   console.log(gData.gScope)
   genAST(astNodeTree);
   console.log("compiled finished");
}

main();
