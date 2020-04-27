const {init} = require("./init/init")
const {scan} = require("./core/scanner");
const {statement} = require("./core/parse");
const {interpretAST} = require("./core/interpreter");
const {gData,ASTNodeTypes} = require("./core/token");
const {addBuildInMethod} = require("./init/buildInFn");
function main(){
   addBuildInMethod("log",console.log);

   console.log("start compiling");

   init();
   scan();
   let astNodeTree = statement();
   interpretAST(astNodeTree,null,gData.gScope);

   console.log("compiled finished");
}

main();
