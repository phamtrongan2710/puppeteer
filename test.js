import puppeteer from 'puppeteer'
import dotenv from 'dotenv'
dotenv.config()

const browser = await puppeteer.launch({ headless: false, 
    headless: 'new',
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    args: ["--disable-setuid-sandbox"],
    'ignoreHTTPSErrors': true});
const page = await browser.newPage();
await page.setRequestInterception(true);
    page.on('request', (req) => {
        if(req.resourceType() == 'stylesheet' || req.resourceType() == 'font' || req.resourceType() == 'image'){
            req.abort();
        } else {
            req.continue();
        }
    });
await page.goto('https://www.iaria.org/conferences2023/CfPINFOCOMP23.html', { waitUntil: 'load' });
const rawData = await page.content();
console.log(rawData)
console.log('end')
let conf = {}
let pos = rawData.search("Submission")
console.log(pos)
let a = await browser.userAgent()
let b = await Promise.resolve(process.env.USER_AGENT)
if ( a == b) {
    
    console.log('abc')
}else{
    console.log (await browser.userAgent())
}
browser.close()