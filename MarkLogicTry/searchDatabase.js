// Search for documents about mammals, using Query By Example.
// The query returns an array of document descriptors, one per
// matching document. The descriptor includes the URI and the
// contents of each document.

const marklogic = require('marklogic');
const my = require('./my-connection.js');

const db = marklogic.createDatabaseClient(my.connInfo);
const qb = marklogic.queryBuilder;

db.documents.query(
  qb.where(qb.byExample({branch: '11111'}))
).result( function(documents) {
    console.log('Matches for brand = 11111:')
    documents.forEach( function(document) {
      console.log('\nURI: ' + document.uri);
      console.log('Info: ' + document.content.prod_name);
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