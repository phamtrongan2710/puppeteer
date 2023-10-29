import { createReadStream } from 'fs'
import { parse } from 'csv-parse'
import dotenv from 'dotenv'
dotenv.config()

var readData = []

createReadStream(process.env.CORE_FILE_PATH)
    .pipe(parse({ delimiter: ',', from_line: 1 }))
    .on('data', function (row) {
        readData.push(row)
    })
    .on("end", function () {
        console.log('Finished')
    })
    .on("error", function (error) {
        console.log('Error in read file: ' + error)
    })

export default readData