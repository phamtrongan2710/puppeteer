const startBrowser = require('./browser')
const scrapeController = require('./scrapeController')


// idea: 
// 1. get and store csv file from core portal
// 2. using compre csv web tool (own app ?) -> check if there are new conferences
// 3. scrape the new conference ?


let browser = startBrowser()
scrapeController(browser)