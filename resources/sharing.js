const shareTicket = async (ticketUrl) => {
    const shareData = {
        title: "Пивная подписка - купи и ты!",
        text: "Подписку на пиво купили, а ты не купил? Купи!",
        url: ticketUrl,
    };
    try {
        if (typeof navigator.share !== 'function' ||
            (typeof navigator.canShare === 'function' && !navigator.canShare(shareData))) {
            debugConsole("Your browser doesn't support sharing this ticket.");
            return 'unavailable';
        }
        await navigator.share(shareData);
        return 'shared';
    } catch (error) {
        if (error?.name === 'AbortError') return 'cancelled';
        debugConsole(`Sharing failed: ${error}`);
        return 'failed';
    }
};
