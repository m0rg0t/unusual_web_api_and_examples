const initPageVisibility = (callback) => {
    const visibilityChange = () => {
        if (document.hidden) {
            debugConsole('Page is hidden');
            callback && callback(false);
        } else {
            debugConsole('Page is visible');
            callback && callback(true);
        }
    }

    document.addEventListener('visibilitychange', visibilityChange, false);
}