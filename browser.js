import puppeteer from 'puppeteer-extra'
import StealthPlugin from 'puppeteer-extra-plugin-stealth'
puppeteer.use(StealthPlugin())


const startBrowser = async () => {
    let browser
    try {
        browser = await puppeteer.launch ({
            headless: true, 
            // headless: 'new',
            defaultViewport: false,
            executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
            args: ["--disable-setuid-sandbox"],
            'ignoreHTTPSErrors': true
        })
    } catch (error) {
        console.log('Can not create browser: ' + error)
    }
    return browser
}


export default startBrowser