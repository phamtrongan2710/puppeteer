const puppeteer = require('puppeteer')

const startBrowser = async () => {
    let browser
    try {
        browser = await puppeteer.launch ({
            headless: false, // true/ false: don't open/ open the browser ui
            args: ["--disable-setuid-sandbox"],
            'ignoreHTTPSErrors': true // skip error which is related to HTTP secure
        })

    } catch (error) {
        console.log('Can not create browser: ' + error)
    }

    return browser
}

module.exports = startBrowser