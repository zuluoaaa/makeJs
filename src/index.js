const {init} = require("./init/init")
const {scan} = require("./core/scanner");
const {statement} = require("./core/parse");
const {genAST} = require("./core/genAST");
const {gData,ASTNodeTypes} = require("./core/token");
function main(){

   console.log("start compiling");

   init();
   scan();
   let astNodeTree = statement();
   console.log(JSON.stringify(astNodeTree),"astNodeTree");
   //genAST(astNodeTree,null,gData.gScope);

   gData.gScope.set("log",console.log,ASTNodeTypes.T_NATIVE_FUN);

   console.log(gData.gScope)

   console.log("compiled finished");
}

main();
