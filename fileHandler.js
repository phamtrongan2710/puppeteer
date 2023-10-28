const fs = require('fs')
const { parse } = require('csv-parse')
const constants = require('./CONSTANTS')


var readData = []

fs.createReadStream(constants.CORE_FILE_PATH)
    .pipe(parse({ delimiter: ',', from_line: 1 }))
    .on('data', function (row) {
        readData.push(row)
    })

    .on("end", function () {
        console.log(readData)
        // --- code here ---
    })

    .on("error", function (error) {
        console.log('Error in read file: ' + error)
    })

