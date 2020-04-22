const {init} = require("./init/init")
const {scan} = require("./core/scanner");
const {statement} = require("./core/parse");
const {interpretAST} = require("./core/interpreter");
const {gData,ASTNodeTypes} = require("./core/token");
function main(){

   console.log("start compiling");

   init();
   scan();
   let astNodeTree = statement();
   console.log(astNodeTree,"astNodeTree");
   interpretAST(astNodeTree,null,gData.gScope);

   //gData.gScope.set("log",console.log,ASTNodeTypes.T_NATIVE_FUN);

   console.log(gData.gScope)
   debugger;
   console.log("compiled finished");
}

main();
