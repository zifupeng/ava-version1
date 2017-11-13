//install https://www.npmjs.com/package/convert-csv-to-json
let csvToJson = require('convert-csv-to-json');

let fileInputName = 'supermarket.csv';
let fileOutputName = 'supermarket.json';
csvToJson.fieldDelimiter(',').getJsonFromCsv(fileInputName);

csvToJson.generateJsonFileFromCsv(fileInputName,fileOutputName);
