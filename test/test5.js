
function f(x,y=5) {
    let a = 1;
    let b = x +5;
    return a+b;
}


let a,b;

f(34);

a = f(1+3*2,1,9)+1;

b = f(1,a);
