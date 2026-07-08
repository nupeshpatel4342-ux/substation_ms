const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ userDataDir: './tmp-profile' });
    const page = await browser.newPage();
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
    page.on('requestfailed', request => console.log('REQUEST FAILED:', request.url(), request.failure().errorText));
    
    await page.goto('file:///C:/Users/DELL/66KVReport/index.html');
    await new Promise(r => setTimeout(r, 2000));
    
    const content = await page.evaluate(() => {
        const mc = document.getElementById('main-content');
        return mc ? mc.innerHTML.substring(0, 500) : 'main-content not found';
    });
    console.log('MAIN CONTENT:', content);
    
    await page.evaluate(() => {
        document.querySelector('.nav-menu-item[data-page="substations"]').click();
    });
    await new Promise(r => setTimeout(r, 1000));
    
    await page.screenshot({ path: 'C:/Users/DELL/66KVReport/screenshot_substations.png', fullPage: true });
    console.log('Screenshot saved to screenshot_substations.png');
    
    await browser.close();
})();
