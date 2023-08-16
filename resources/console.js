const debugConsole = (...args) => {
    console.log(...args);
    const out = args.reduce((acc, arg) => {
        return acc + " " + arg;
    }, "");
    document.getElementById("console").innerHTML = document.getElementById("console").innerHTML + "\n" + out;
}