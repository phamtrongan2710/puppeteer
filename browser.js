const puppeteer = require('puppeteer')


const startBrowser = async () => {
    let browser
    try {
        browser = await puppeteer.launch ({
            // headless: false, // true - false: don't open - open the browser ui
            headless: 'new',
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


module.exports = startBrowser