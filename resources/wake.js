const initWakeLock = async () => {
    if ("wakeLock" in navigator) {
        console.log("Screen Wake Lock API supported!");

        let wakeLock = null;

        // create an async function to request a wake lock
        try {
            wakeLock = await navigator.wakeLock.request("screen");
            console.log("Wake Lock is active!");
        } catch (err) {
            console.error(err);
        }
    } else {
        console.log("Wake lock is not supported by this browser.");
    }
}