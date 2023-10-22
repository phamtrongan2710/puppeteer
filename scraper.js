// this file contains scraping functions
// searching: returns sevreral links rely on search results
// 


const scrapeCategory = (browser, url) => new Promise(async (resolve, reject) => {
    try {
        let page = await browser.newPage()
        console.log('>> Open new tab...')
        await page.goto(url)
        console.log('>> Visit to ' + url)
        await page.waitForSelector('#webpage') // the selector contains data we need
        console.log('>> Website is loaded...')

        // chose the selector
        // use > for direct child 
        // use space for indirect child
        const dataCatagory = await page.$$eval('#navbar-menu > ul > li', els => {
            dataCatagory = els.map(el => {
                return {
                    category: el.querySelector('a').innerText,
                    link: el.querySelector('a').href,
                }
            })
            return dataCatagory
        })

        await page.close()
        console.log('>> Tab is closed.')
        resolve(dataCatagory)

    } catch (error) {
        console.log('Error in scrape category: ' + error)
        reject(error)
    }
})


const scrapeSelectedPage = (browser, url) => new Promise(async (resolve, reject) => {
    try {
        let page = await browser.newPage()
        console.log('>> Open new tab...')
        await page.goto(url)
        console.log('>> Visit to ' + url)
        await page.waitForSelector('#main')
        console.log('>> Tag main is loaded')

        const scrapeData = {} // contain all data which is scraped

        // get header
        const headerData = await page.$eval('header', el => {
            return {
                title: el.querySelector('h1').innerText,
                description: el.querySelector('p').innerText
            }
        })

        scrapeData.header = headerData

        // get detail item link
        const detailLinks = await page.$$eval('#left-col > section.section-post-listing > ul > li', (els) => {
            detailLinks = els.map(el => {
                return el.querySelector('.post-meta h3 > a').href
            })
            return detailLinks
        })
        //console.log(detailLinks)


        const scrapeDetail = async (link) => new Promise(async (resolve, reject) => {
            try {
                let detailPage = await browser.newPage()
                await detailPage.goto(link)
                console.log('>> Visit to ' + link)
                await detailPage.waitForSelector('#main')


                const detailData = {}
                // scrape data
                // get img
                const images = await detailPage.$$eval('#left-col > article > div.post-images > div > div.swiper-wrapper > div.swiper-slide', (els) => {
                    images = els.map(el => {
                        if (el.querySelector('img')) {
                            return el.querySelector('img').src // tag img
                        }
                        else if (el.querySelector('iframe')) {
                            return el.querySelector('iframe').src // tag iframe
                        }
                        else return el.querySelector('video > source').src // tag video
                    })
                    return images
                })

                console.log(images)
                //detailData.images = images

                // get header detail
                // const header = await detailPage.$eval('header.page-header', (el) => {
                //     return {
                //         title: el.querySelector('h1 > a').innerText,
                //         star: el.querySelector('h1 > span').className,
                //         class: {
                //             content: el.querySelector('p').innerText,
                //             classType: el.querySelector('p > a > strong').innerText
                //         },
                //         address: el.querySelector('address').innerText,
                //         attributes: {
                //             price: el.querySelector('div.post-attributes > .price > span').innerText,
                //             acreage: el.querySelector()
                //         }
                //     }
                // })

                await detailPage.close()
                console.log('>> Tab ' + link + ' is closed.')
                resolve()

            } catch (error) {
                console.log('Error in scarpe detail data: ' + error)
                reject(error)
            }
        })


        for (let link of detailLinks) {
            await scrapeDetail(link)
        }

        // await page.close()
        // console.log('>> Tab is closed.')
        await browser.close()
        console.log('Browser is closed.')
        resolve()

    } catch (error) {
        console.log('Error in scrape selected page: ' + error)
        reject(error)
    }
})


const scrapeSpecificPage = (browser, url) => new Promise(async (resolve, reject) => {
    try {
        let page = await browser.newPage()
        await page.goto(url, {
            waitUntil: 'load'
        })

        // --- code ---

    } catch (error) {
        console.log('Error in scrape specific page: ' + error)
        reject(error)
    }
})


const searching = (browser, keyword) => new Promise(async (resolve, reject) => {
    try {
        let page = await browser.newPage()
        await page.goto('https://www.google.com/')
        await page.waitForSelector('#APjFqb')
        await page.keyboard.sendCharacter(keyword);
        await page.keyboard.press('Enter')

        await page.waitForSelector('#search')

        const linkList = await page.$$eval('div.v7W49e > div.MjjYud', (els) => {
            els.length = 8 // need a constant here
            linkList = els.map(el => {
                return {
                    name: el.querySelector('div > div.N54PNb.BToiNc.cvP2Ce > div.kb0PBd.cvP2Ce.jGGQ5e > div.yuRUbf > div > span > a > h3')?.innerText,
                    link: el.querySelector('div > div.N54PNb.BToiNc.cvP2Ce > div.kb0PBd.cvP2Ce.jGGQ5e > div.yuRUbf > div > span > a')?.href
                }
            })
            return linkList
        })

        console.log(linkList)
        await page.close()
        resolve(linkList)

    } catch (error) {
        console.log('Error in searching: ' + error)
        reject(error)
    }
})


const downloadConfList = (browser, url) => (async () => {
    // const client = await page.target().createCDPSession();
    // await page.goto(url, { waitUntil: "networkidle2" });
    // await page.waitForSelector(`#downloadLink`)
    // await client.send('Page.setDownloadBehavior', {
    //     behavior: 'allow',
    //     downloadPath: downloadPath
    // });
    // await page.click('./')
    // await browser.close();
})


const test = (browser, url) => new Promise(async (resolve, reject) => {
    try {
        let page = await browser.newPage()
        await page.goto(url, {
            waitUntil: "load"
        })

        let chk = ''

        try {
            if ((await page.waitForXPath('//*[contains(text(), "Conference Portal")]', 30000)) !== null) {
                chk = await page.evaluate(el => el.innerText, await page.$x('//*[contains(text(), "Subscription Confirmed")]'))
                chk = 'Success'
            }

        } catch (error) {
            chk = 'Failed'
        }
        

        console.log(chk)
        await browser.close() 
        resolve()

    } catch (error) {
        console.log('Error in test: ' + error)
        reject(error)
    }
})


module.exports = {
    scrapeSpecificPage,
    searching
}