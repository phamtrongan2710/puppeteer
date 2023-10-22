const scrapers = require('./scraper')


const scrapeController = async (browserInstance) => {
    const url = 'http://portal.core.edu.au/conf-ranks/' // the website's link
    
    try {
        let browser = await browserInstance
        
        // call scraping functions

        // ----- scraping a specific page testing -----
        const linkList = await scrapers.searching(browser, 'ACM SIGKDD Conference on Knowledge Discovery and Data Mining (KDD)')
        

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

    } catch (error) {
        console.log('Error in scrape controller: ' + error)
    }

    process.exit(0)
}


module.exports = scrapeController