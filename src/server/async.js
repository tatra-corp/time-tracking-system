
function f(resolve) {
    // obtain heavy object which is 42
    setTimeout(() => resolve(42), 2000);
}

function getHeavyStuff() {
    return new Promise(f);
}

async function doSmthWithHeavyStuff() {
    console.log("2");
    let heavyStuff = await getHeavyStuff();
    console.log(heavyStuff);
}

doSmthWithHeavyStuff();

console.log("1");
