const {test, expect} = require('@playwright/test');
test('synthetic capabilities preserve page interactions without device access', async ({page}) => {
  await page.route('**/*', route => new URL(route.request().url()).origin === 'http://127.0.0.1:4173' ? route.continue() : route.abort());
  await page.addInitScript(() => {
    window.deviceCalls = {shares: 0, wakes: 0};
    for (const [key, value] of Object.entries({
      getBattery: async () => Object.assign(new EventTarget(), {charging: true, level: 1}),
      vibrate: () => true,
      canShare: () => true,
      share: async () => { window.deviceCalls.shares++; throw new DOMException('Synthetic cancellation', 'AbortError'); },
      wakeLock: {request: async () => {
        window.deviceCalls.wakes++;
        const lock = new EventTarget(); lock.released = false;
        lock.release = async () => { lock.released = true; lock.dispatchEvent(new Event('release')); };
        return lock;
      }}
    })) Object.defineProperty(navigator, key, {configurable: true, value});
    window.alert = () => {};
  });
  const errors = []; page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  await expect(page.locator('#price')).toHaveText('1000');
  await page.locator('#buyButton').click();
  await expect.poll(() => page.evaluate(() => window.deviceCalls.shares)).toBe(1);
  await page.evaluate(() => debugConsole('<img src="https://example.invalid/tracker">'));
  await expect(page.locator('#console img')).toHaveCount(0);
  await expect(page.locator('#console')).toContainText('<img');
  await page.screenshot({path: test.info().outputPath('synthetic-demo.png'), fullPage: true});
  expect(errors).toEqual([]);
});
