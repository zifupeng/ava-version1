//install https://www.npmjs.com/package/convert-csv-to-json
module.exports={
  csvtojson : function(){
    let csvToJson = require('convert-csv-to-json');

    let fileInputName = 'supermarket.csv';
    let fileOutputName = 'supermarket.json';
    csvToJson.fieldDelimiter(',').getJsonFromCsv(fileInputName);
    csvToJson.generateJsonFileFromCsv(fileInputName,fileOutputName);
  }
}
