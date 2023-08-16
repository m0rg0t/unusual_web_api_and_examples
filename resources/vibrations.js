//https://chromestatus.com/feature/5644273861001216 - dont allow to vibrate without user interaction

const initUpdateHowMuchPeoplesWatchingSubscription = () => {
    let peoplesWatchingCount = 1;

    const vibrate = () => {
        if (window.navigator.vibrate) {
            debugConsole('bzzzzzzz');
            window.navigator.vibrate([100, 100, 100]);
        } else {
            debugConsole("vibrate none available in your browser");
        }
    }

    setInterval(() => {
        vibrate();
        peoplesWatchingCount++;
        document.getElementById(
            "peoplesWatching"
        ).innerText = String(peoplesWatchingCount);
    },  10000);
}