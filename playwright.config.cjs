const {defineConfig} = require('@playwright/test');
module.exports = defineConfig({
  testDir: './tests/browser', retries: 0,
  use: {baseURL: 'http://127.0.0.1:4173', serviceWorkers: 'block', screenshot: 'on', trace: 'retain-on-failure'},
  projects: [{name: 'chromium', use: {browserName: 'chromium'}}, {name: 'webkit', use: {browserName: 'webkit'}}],
  webServer: {command: 'python3 -m http.server 4173 --bind 127.0.0.1', url: 'http://127.0.0.1:4173', reuseExistingServer: false}
});
