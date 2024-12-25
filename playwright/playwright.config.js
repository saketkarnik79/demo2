const {defineConfig} = require('@playwright/test');
module.exports = defineConfig({
    testDir: './tests',
    use: {
        browserName: 'firefox',
        headless: false,
        viewport: {width:1280, height:720},
    },
});

const config = {
    timeout: 120000,
    reporter: [
        ['list'],
        ['html', { outputFolder: 'playwright-report', open: 'never' }]
    ],
    // pengaturan lain
};
module.exports = config;