const constants = require('./CONSTANTS')


// this function return links of a specific conference 
const searching = (browser, keyword) => new Promise(async (resolve, reject) => {
    try {
        let page = await browser.newPage()
        await page.goto('https://www.google.com/')
        await page.waitForSelector('#APjFqb')
        await page.keyboard.sendCharacter(keyword);
        await page.keyboard.press('Enter')

        await page.waitForSelector('#search')

        const linkList = await page.$$eval('div.v7W49e > div.MjjYud', (els) => {
            els.length = 4 // Number(constants.NUMBER_OF_LINKS)
            linkList = els.map(el => {
                return {
                    name: el.querySelector('div > div.N54PNb.BToiNc.cvP2Ce > div.kb0PBd.cvP2Ce.jGGQ5e > div.yuRUbf > div > span > a > h3')?.innerText,
                    link: el.querySelector('div > div.N54PNb.BToiNc.cvP2Ce > div.kb0PBd.cvP2Ce.jGGQ5e > div.yuRUbf > div > span > a')?.href
                }
            })
            return linkList
        })

        await page.close()
        resolve(linkList)

    } catch (error) {
        console.log('Error in searching: ' + error)
        reject(error)
    }
})


// this function return conference list reading from table in core portal 
const scarpeCorePortal = (browser) => new Promise(async (resolve, reject) => {
    try {
        let page = await browser.newPage()
        await page.goto(constants.CORE_PORTAL_LINK, {
            waitUntil: 'load'
        })
        await page.waitForSelector('#search')

        const source = await page.$eval('select[name="source"]', (el) => {
            return el.querySelector('option[selected="selected"]').innerText.replace(/^\s+|\s+$/gm, '')
        })

        await page.click('input[value="Search"]')

        // find number of jump page
        const texts = await page.$$eval('a', (els) => {
            texts = els.map(el => el.innerText)
            return texts
        })

        // get table data
        let maxPageNum = texts[texts.length - 1]
        let conferenceList = []
        let pageNum = 1

        do {
            const readList = await page.$$eval('tbody > tr', (rows) => {
                return Array.from(rows, row => {
                    const columns = row.querySelectorAll('td');
                    return Array.from(columns, column => column.innerText)
                })
            })

            readList.shift()
            conferenceList = conferenceList.concat(readList)

            pageNum = pageNum + 1
            let nextPageURL = ''

            if (pageNum < 11)
                nextPageURL = page.url().slice(0, -1) + pageNum
            else {
                nextPageURL = page.url().slice(0, -2) + pageNum
            }

            await page.goto(nextPageURL)

        } while (pageNum <= maxPageNum)

       
        let conferenceObjs = []
        for (let i = 0; i < 3/*conferenceList.length*/; i++) {
            let j = 0
            let conferenceObj = {
                name: conferenceList[i][0],
                acronym: conferenceList[i][1],
                rank: conferenceList[i][3],
                primaryFoR: conferenceList[i][6],
                coments: conferenceList[i][7],
                avgRating: conferenceList[i][8],
                links: await searching(browser, conferenceList[i][0]),

                print: function () {
                    console.log('-----------------------------------------------------------------------')
                    console.log('>> name: ' + this.name)
                    console.log('>> acronym: ' + this.acronym)
                    console.log('>> rank: ' + this.rank)
                    console.log('>> primaryFoR: ' + this.primaryFoR)
                    console.log('>> coments: ' + this.coments)
                    console.log('>> avgRating:' + this.avgRating)
                    for (let i = 0; i < this.links.length; i++) {
                        console.log('>> link ' + (i + 1) + ':')
                        console.log(this.links[i])
                    }
                    console.log('-----------------------------------------------------------------------\n')
                }
            }
            conferenceObjs.push(conferenceObj)
        }

        await page.close()
        resolve(conferenceObjs)

    } catch (error) {
        console.log('Error in scrape core portal page: ' + error)
        reject(error)
    }
})


module.exports = {
    searching,
    scarpeCorePortal
}