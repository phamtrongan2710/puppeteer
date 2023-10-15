const scrapers = require('./scraper')

const scrapeController = async (browserInstance) => {
    const url = 'https://phongtro123.com/' // the website's link
    const indexes = [1,2,3,4]
    try {
        let browser = await browserInstance
        
        // call scrape functions
        let categories = await scrapers.scrapeCategory(browser, url)
        const selectedCategories = categories.filter((category, index) => indexes.some(i => i === index))
        console.log(selectedCategories[0])

        await scrapers.scrapeSelectedPage(browser, selectedCategories[0].link)

    } catch (error) {
        console.log('Error in scrape controller: ' + error)
    }

}

module.exports = scrapeController