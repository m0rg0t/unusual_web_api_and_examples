# Странные АПИ браузера - вдруг да пригодятся?

В этом репозитории можно найти и саму презентацию,
и примеры на которые мы ссылались во время презентации чтобы можно было поэксперементировать и потыкать во всякие штуки.

## Презентация

https://docs.google.com/presentation/d/10rgKpLIkD5DIg2lSysfQNCV2kwqqV7_1U3rvcuNgEuU/edit?usp=sharing

Основной пример презентации доступен по адресу - https://m0rg0t.github.io/unusual_web_api_and_examples/

## Battery status API

https://developer.mozilla.org/en-US/docs/Web/API/Battery_Status_API

**Примеры:**

* [Battery status](https://googlechrome.github.io/samples/battery-status/)

## Web Sharing API

https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share

**Примеры:**

* [Web Share API](https://googlechrome.github.io/samples/web-share/)

## Page Visibility API

https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API

**Примеры:**

* [Page Visibility API](https://googlechrome.github.io/samples/page-visibility/)

## Screen Wake Lock API

https://developer.mozilla.org/en-US/docs/Web/API/Screen_Wake_Lock_API

**Примеры:**

* [Screen Wake Lock API](https://googlechrome.github.io/samples/screen-wake-lock/)

## Vibration API

https://developer.mozilla.org/en-US/docs/Web/API/Vibration_API

**Примеры:**

* [Vibration API](https://googlechrome.github.io/samples/vibration/)

## 

## Проверки

Node.js 24: `npm ci --ignore-scripts && npm test`.
Для браузерных проверок: `npx playwright install chromium webkit && npm run test:browser`.
Playwright используется только для разработки; у страницы нет runtime-зависимостей.
Тесты подменяют battery/share/vibration/wake-lock API и блокируют все запросы вне localhost.
WebKit здесь является симуляцией движка, а не проверкой на устройстве с Safari.
Реальные разрешения и поведение устройств требуют отдельной ручной проверки.
`initWakeLock()` возвращает идемпотентную функцию очистки; навигация/возврат
из back-forward cache освобождают и повторно запрашивают блокировку экрана.
