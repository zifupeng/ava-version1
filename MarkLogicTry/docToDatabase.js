// Load documents into the database.

const marklogic = require('marklogic');
const my = require('./my-connection.js');
const db = marklogic.createDatabaseClient(my.connInfo);

// //turn csv to json
    // let csvToJson = require('convert-csv-to-json');
    // let fileInputName = 'supermarket.csv';
    // let fileOutputName = 'supermarket.json';
    // csvToJson.fieldDelimiter(',').getJsonFromCsv(fileInputName);
    // const supermarket = csvToJson.generateJsonFileFromCsv(fileInputName,fileOutputName);
	
	
	
// Load documents into the database.
const csvFilePath='../supermarket.csv'
const csv  =require('csvtojson')

var documents =[];
csv()
  .fromFile(csvFilePath)
  .on('json',(jsonObj)=>{
	const documentObj = {
		uri: "/doc/"+ jsonObj.txn_line+ ".json",
		content: jsonObj
	}
	documents.push(documentObj)
  })
  .on('done',(error)=>{
    console.log(error)
    console.log("before")
    console.log(documents)
    console.log("after")
	db.documents.write(documents).result( 
	function(response) {
    console.log('Loaded the following documents:');
    response.documents.forEach( function(document) {
      console.log('  ' + document.uri);
    });
  }, 
	function(error) {
    console.log(JSON.stringify(error, null, 2));
  }
);
  })


// Load the example documents into the database
