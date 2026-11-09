const path = require('node:path');
module.exports = {
  testDir: __dirname,
  testMatch: 'browser.spec.cjs',
  outputDir: path.join(__dirname, '.results'),
  workers: 1,
  retries: 0,
  reporter: 'list',
  use: {
    browserName: 'chromium',
    baseURL: 'http://127.0.0.1:8173',
    viewport: { width: 1440, height: 1000 },
    trace: 'retain-on-failure'
  },
  webServer: {
    command: 'node scripts/serve.cjs 8173',
    cwd: path.resolve(__dirname, '..'),
    url: 'http://127.0.0.1:8173',
    reuseExistingServer: false
  }
};
