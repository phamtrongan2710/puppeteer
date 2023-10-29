import scrapers from './scraper.js'


const scrapeController = async (browserInstance) => {
    try {
        let browser = await browserInstance
        await scrapers.scarpeCorePortal(browser)
        // --------------------------------------------


        // ----- searching testing -----

        // console.log('searching testing 1')
        // await scrapers.searching(browser, 'International Conference on Advanced Communications and Computation,INFOCOMP')
        // console.log('searching testing 2')
        // await scrapers.searching(browser, 'International Conference on Ambient Systems, Networks and Technologies')
        // console.log('searching testing 3')
        // await scrapers.searching(browser, 'AAAI Conference on Human Computation and Crowdsourcing')
        // console.log('searching testing 4')
        // await scrapers.searching(browser, 'ACIS Conference on Software Engineering Research, Management and Applications')

        // -----------------------------
        await browser.close()
    } catch (error) {
        console.log('Error in scrape controller: ' + error)
    }
}


export default scrapeController