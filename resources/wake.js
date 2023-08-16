const initWakeLock = async () => {
    if ("wakeLock" in navigator) {
        debugConsole("Screen Wake Lock API supported!");

        let wakeLock = null;

        // create an async function to request a wake lock
        try {
            wakeLock = await navigator.wakeLock.request("screen");
            debugConsole("Wake Lock is active!");
        } catch (err) {
            console.error(err);
        }
    } else {
        debugConsole("Wake lock is not supported by this browser.");
    }
}