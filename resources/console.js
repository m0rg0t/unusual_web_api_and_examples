const debugConsole = (...args) => {
    console.log(...args);
    const out = args.reduce((acc, arg) => {
        return acc + " " + arg;
    }, "");
    const output = document.getElementById("console");
    if (output) output.textContent += "\n" + out;
}
