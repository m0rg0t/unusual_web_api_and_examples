document.getElementById("buyButton").addEventListener("click", (e) => {
    e.preventDefault();

    shareTicket("https://m0rg0t.github.io/unusual_web_api_and_examples/");
});

initBatteryWork(DEFAULT_TICKET_PRICE);
initPageVisibility((isVisible) => {
    if (PREVIOUS_PAGE_VISIBILITY_STATE === null) {
        PREVIOUS_PAGE_VISIBILITY_STATE = isVisible;
    }

    if (PREVIOUS_PAGE_VISIBILITY_STATE === false && isVisible === true) {
        alert("Пока ты ходил по другим вкладкам, билеты начинают кончаться!");
    }

    PREVIOUS_PAGE_VISIBILITY_STATE = isVisible;
});
initWakeLock();

initUpdateHowMuchPeoplesWatchingSubscription();

