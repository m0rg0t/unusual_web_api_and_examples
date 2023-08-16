const shareTicket = async (ticketUrl) => {
    const shareData = {
        title: "Пивная подписка - купи и ты!",
        text: "Подписку на пиво купили, а ты не купил? Купи!",
        url: ticketUrl,
    };

    if (navigator.canShare) {
        try {
            await navigator.share(shareData);
        } catch (err) {
            debugConsole(`Error: ${err}`);
        }
    } else {
        debugConsole(`Your browser doesn't support the Web Share API.`);
    }
}