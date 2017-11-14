//zifu

//build connection
const marklogic = require('marklogic');
const my = require('./my-connection.js');

//initiate queryBuilder
const db = marklogic.createDatabaseClient(my.connInfo);
const qb = marklogic.queryBuilder;

// console.log("testing before")
// console.log(db.documents)
// console.log("testing after")

//console.log(Object.keys(db.document).length)
// console.log(db.documents.documents)

var resultToReturn = [];
//qbe query
db.documents.query(

  qb.where(qb.byExample({branch: 'Woolwich Extra'}))
  
//show entire roll of data
/*).result( function(results) {
  console.log(JSON.stringify(results, null, 2));
});*/

//show selected fields of data
).result( function(documents) {
	console.log(documents)
    console.log('Matches for brand = Woolwich Extra:')
    documents.forEach( function(document) {
     console.log('\nURI: ' + document.uri);
      // console.log(document.content.sales);
//		resultToReturn.push(document.content.sales)
    });
}, function(error) {
    console.log(JSON.stringify(error, null, 2));
});

/* {
  txn_time: "1/4/16 11:11",
  branch: "11111",
  txn_num: "1.02E+11",
  txn_line: "101516010173~1",
  prod_dept: "GROCERY",
  prod_cat: "CONDIMENTS & SAUCES",
  prod_name: "CHICK PEAS BULK",
  qty: "1.048",
  sales: "176.06",
  discount: "14.8",
  tax: "0",
  sales_after_discount: "161.26\r"
 },*/