const {gData} = require("./defines");

function scan(){
    let {
        content,
        index
    } = gData;

    if(index === content.length-1){
        //todo
        return;
    }



    while (gData.index<content.length){
        gData.index +=1;
        let value = encodeURI(content[gData.index]);
        switch (value) {
            case "%0A":
                gData.line+=1;
                break;
            case "%20":
            case "%0D":
                break;
            case "l":
                //todo
            case "+":
            case "-":
            case "*":
            case "/":
                //todo

        }
        index++;
    }
}


module.exports = {
    scan
}