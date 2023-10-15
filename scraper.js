// scrape functions

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


const scrapeSelectedPage = (browser, url) => new Promise(async(resolve, reject) => {
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


        const scrapeDetail = async (link) => new Promise(async(resolve, reject) => {
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
                        if(el.querySelector('img')) { 
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


        for(let link of detailLinks){
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

module.exports = {
    scrapeCategory,
    scrapeSelectedPage
}