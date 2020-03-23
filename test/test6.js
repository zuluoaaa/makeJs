
function f(x,y) {
    let a1;
    let b1;
    a1 = 3;
    b1 = x-y;

     function f1() {
        return b1-1;
    }

    return f1()+f1();
}

let a,b;
a = f(1,4);
b = a();
