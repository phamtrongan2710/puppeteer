import startBrowser from './browser.js'
import scrapeController from './scrapeController.js'
import dotenv from 'dotenv'
dotenv.config()

let browser = startBrowser()
scrapeController(browser)
