const logBatteryStatus = (battery) => {
    debugConsole("Battery charging: " + battery.charging);
    debugConsole("Battery level: " + battery.level);
}

const updatePriceInDomFromBattery = (price, battery) => {
    logBatteryStatus(battery);
    updatePriceInDom(getPriceFromBatteryLevel({
        price,
        batteryLevel: battery.level,
        isBatteryCharging: battery.charging
    }));
}

const initBatteryWork = (price) => {
    if (navigator.getBattery) {
        navigator.getBattery().then((battery) => {
            updatePriceInDomFromBattery(price, battery);

            battery.addEventListener("chargingchange", () => {
                updatePriceInDomFromBattery(price, battery);
            });

            battery.addEventListener("levelchange", () => {
                updatePriceInDomFromBattery(price, battery);
            });
        });
    } else {
        debugConsole("Battery status API unavailable");
    }
}

const getPriceFromBatteryLevel = ({price, batteryLevel, isBatteryCharging}) => {
    const MIN_LEVEL = 0.1;
    const K = 10;
    let outPrice = price;
    if (isBatteryCharging) return outPrice;
    if (batteryLevel > MIN_LEVEL) {
        outPrice = Math.round(price + price * (1 / batteryLevel / K))
    } else {
        outPrice = Math.round(price + price * (1 / MIN_LEVEL / K));
    }
    return outPrice;
}

const updatePriceInDom = (price) => {
    document.getElementById("price").innerHTML = price;
}