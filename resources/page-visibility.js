const initPageVisibility = (callback) => {
    const visibilityChange = () => {
        if (document.hidden) {
            console.log('Page is hidden');
            callback && callback(false);
        } else {
            console.log('Page is visible');
            callback && callback(true);
        }
    }

    document.addEventListener('visibilitychange', visibilityChange, false);
}