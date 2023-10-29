import dotenv from 'dotenv'
dotenv.config()


const searching = (browser, keyword) => new Promise(async (resolve, reject) => {
    try {
        let page = await browser.newPage()
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36');
        await page.goto('https://www.google.com/')
        await page.waitForSelector('#APjFqb')
        await page.keyboard.sendCharacter(keyword);
        await page.keyboard.press('Enter')
        await page.waitForSelector('#search')
        const links = await page.$$eval('#rso > div', (els) => {
            els.length = 4 // () => els.length = Number(process.env.NUMBER_OF_LINKS)
            links = els.map( el => {
                return {
                    name: el.querySelector('div > span > a > h3')?.innerText,
                    link: el.querySelector('div > span > a')?.href
                }
            })
            return links
        })
        await page.close()
        resolve(links)
    } catch (error) {
        console.log('Error in searching: ' + error)
        reject(error)
    }
})

//const solvingReCaptCha 

const scarpeCorePortal = (browser) => new Promise(async (resolve, reject) => {
    try {
        let page = await browser.newPage()
        await page.goto(process.env.CORE_PORTAL_LINK, { waitUntil: 'load' })
        await page.waitForSelector('#search')
        await page.click('input[value="Search"]')
        // get year
        const year = (await page.$eval('select[name="source"]', (el) => {
            return el.querySelector('option[selected="selected"]').innerText.replace(/^\s+|\s+$/gm, '')
        })).substring(4)
        // get amount of table's page
        const texts = await page.$$eval('a', (els) => {
            texts = els.map(el => el.innerText)
            return texts
        })
        let lastPage = Number(texts[texts.length - 1])
        let conferenceArr = []

        for (let curPage = 1; curPage <= lastPage; curPage++) {
            const arr = await page.$$eval('tbody > tr', (rows) => {
                return Array.from(rows, row => {
                    const columns = row.querySelectorAll('td');
                    return Array.from(columns, column => column.innerText)
                })
            })
            arr.shift()
            conferenceArr = conferenceArr.concat(arr)
            if (lastPage === curPage){
                break
            } else if (curPage >= 10) {
                await page.goto(page.url().slice(0, -2) + (curPage + 1))
            } else {
                await page.goto(page.url().slice(0, -1) + (curPage + 1))
            }
        }
        
        let conferenceObjs = []
        for (let i = 0; i < conferenceArr.length; i++) {
            console.log(i)
            let conferenceObj = {
                name: conferenceArr[i][0],
                acronym: conferenceArr[i][1],
                rank: conferenceArr[i][3],
                primaryFoR: conferenceArr[i][6],
                coments: conferenceArr[i][7],
                avgRating: conferenceArr[i][8],
                links: await searching(browser, conferenceArr[i][0] + year),

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
        
        for (let i = 0; i < conferenceObjs.length; i++){
            conferenceObjs[i].print()
        }  

        await page.close()
        resolve(conferenceObjs)
    } catch (error) {
        console.log('Error in scrape core portal page: ' + error)
        reject(error)
    }
})

export default {
    searching,
    scarpeCorePortal
}