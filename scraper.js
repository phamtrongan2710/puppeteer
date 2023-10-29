import randomUseragent from 'random-useragent';
import dotenv from 'dotenv'
dotenv.config()


async function createPage (browser,url) {
    //Randomize User agent or Set a valid one
    const userAgent = randomUseragent.getRandom();
    const UA = userAgent || process.env.USER_AGENT;
    const page = await browser.newPage();

    // Randomize viewport size
    await page.setViewport({
        width: 1920 + Math.floor(Math.random() * 100),
        height: 3000 + Math.floor(Math.random() * 100),
        deviceScaleFactor: 1,
        hasTouch: false,
        isLandscape: false,
        isMobile: false,
    });

    await page.setUserAgent(UA);
    await page.setJavaScriptEnabled(true);
    await page.setDefaultNavigationTimeout(0);

    // Skip images/styles/fonts loading for performance
    await page.setRequestInterception(true);
    page.on('request', (req) => {
        if(req.resourceType() == 'stylesheet' || req.resourceType() == 'font' || req.resourceType() == 'image'){
            req.abort();
        } else {
            req.continue();
        }
    });

    await page.evaluateOnNewDocument(() => {
        // Pass webdriver check
        Object.defineProperty(navigator, 'webdriver', {
            get: () => false,
        });
    });

    await page.evaluateOnNewDocument(() => {
        // Pass chrome check
        window.chrome = {
            runtime: {},
            // etc.
        };
    });

    await page.evaluateOnNewDocument(() => {
        //Pass notifications check
        const originalQuery = window.navigator.permissions.query;
        return window.navigator.permissions.query = (parameters) => (
            parameters.name === 'notifications' ?
                Promise.resolve({ state: Notification.permission }) :
                originalQuery(parameters)
        );
    });

    await page.evaluateOnNewDocument(() => {
        // Overwrite the `plugins` property to use a custom getter.
        Object.defineProperty(navigator, 'plugins', {
            // This just needs to have `length > 0` for the current test,
            // but we could mock the plugins too if necessary.
            get: () => [1, 2, 3, 4, 5],
        });
    });

    await page.evaluateOnNewDocument(() => {
        // Overwrite the `languages` property to use a custom getter.
        Object.defineProperty(navigator, 'languages', {
            get: () => ['en-US', 'en'],
        });
    });

    await page.goto(url);
    return page;
}


const searching = async (browser, keyword) => {
    try {
        const maxLinks = 4; // Số liên kết cần thu thập
        let links = [];

        let page = await createPage(browser,'https://www.google.com/')
        // if (await browser.userAgent() == Promise.resolve(process.env.USER_AGENT)) {
        //     console.log('a')
        //     await page.waitForSelector('input[name="q"]')
        // } else {
        //     console.log('b')
        //     await page.waitForSelector('#APjFqb')
        // }
        await page.waitForSelector('input[name="q"]')
        await page.keyboard.sendCharacter(keyword);
        await page.keyboard.press('Enter');
        await page.waitForNavigation();

        while (links.length < maxLinks) {
            const linkList = await page.$$eval('#search a', (els) => {
                const result = [];
                const googleScholarDomain = 'scholar.google'; // Tên miền của Google Scholar
                const googleTranslateDomain = 'translate.google';
                const googleDomain = 'google.com';
                for (const el of els) {
                    const href = el.href;
                    // Kiểm tra xem liên kết có chứa tên miền của Google Scholar không
                    if (href && !href.includes(googleScholarDomain) && !href.includes(googleTranslateDomain) && !href.includes(googleDomain)) {
                        result.push({
                            link: href
                        });
                    }
                }
                return result;
            });

            links = links.concat(linkList.map(item => item.link));

            // Nếu links có nhiều hơn maxLinks, cắt bớt đi
            if (links.length > maxLinks) {
                links = links.slice(0, maxLinks);
            }
            
            if (links.length < maxLinks) {
                // Chưa đủ liên kết, tiếp tục tìm kiếm bằng cách lướt xuống
                await page.keyboard.press('PageDown');
                await page.waitForTimeout(2000); // Đợi trang tải xong
            }
        }

        //console.log('Title: ' + keyword);
        //console.log(links);

        await page.close();
        return links.slice(0, maxLinks);
    } catch (error) {
        console.log('Error in searching: ' + error);
        throw error;
    }
};


const scarpeCorePortal = (browser) => new Promise(async (resolve, reject) => {
    try {
        let page = await createPage(browser, process.env.CORE_PORTAL_LINK)
        await page.click('input[value="Search"]')
        
        const year = (await page.$eval('select[name="source"]', (el) => {
            return el.querySelector('option[selected="selected"]').innerText.replace(/^\s+|\s+$/gm, '')
        })).substring(4)
        
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
            // Tạo một thời gian ngẫu nhiên từ 1 đến 3 giây (1000ms = 1 giây)
            const randomDelay = Math.floor(Math.random() * 2000) + 1000; // Từ 1000ms đến 3000ms

            // Sử dụng setTimeout để tạm dừng thực thi mã trong khoảng thời gian ngẫu nhiên
            setTimeout(function () {}, randomDelay);

            let conferenceObj = {
                name: conferenceArr[i][0],
                acronym: conferenceArr[i][1],
                rank: conferenceArr[i][3],
                primaryFoR: conferenceArr[i][6],
                coments: conferenceArr[i][7],
                avgRating: conferenceArr[i][8],
                links: await searching(browser, conferenceArr[i][0] + ' ' + year),

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
        resolve(conferenceArr)
    } catch (error) {
        console.log('Error in scrape core portal page: ' + error)
        reject(error)
    }
})


const crawling = (browser, arr) => new Promise(async (resolve, reject) => {

})


export default {
    searching,
    scarpeCorePortal,
    crawling
}