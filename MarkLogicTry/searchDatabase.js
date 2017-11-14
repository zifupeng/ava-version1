//zifu

//build connection
const marklogic = require('marklogic');
const my = require('./my-connection.js');

const db = marklogic.createDatabaseClient(my.connInfo);
const qb = marklogic.queryBuilder;
const vb = marklogic.valuesBuilder;

var branches = [];

db.documents.query(
  qb.where(
	qb.parsedFrom('')).slice(0,10000)
)
.result(
function(documents) {
    console.log('documents results')
	// console.log(documents)
    documents.forEach( function(document) {
		var branch = (document.content.branch);
		if(!(branches.indexOf(branch) > -1)){
		branches.push(branch)
	}
      // console.log(document.content.sales);
//		resultToReturn.push(document.content.sales)
    });
	console.log(branches);


var totalResults = [];
for(var i=0; i< branches.length; i++) {
var resultToReturn = [];
db.documents.query(
  qb.where(
	qb.byExample({branch: branches[i]})).slice(0,10000)
)
.result(
function(documents) {
    console.log('documents results')
	var branchSales = 0;
	// console.log(documents)
    documents.forEach( function(document) {
		var salesInt = parseInt(document.content.sales);
		branchSales += salesInt;
      // console.log(document.content.sales);
//		resultToReturn.push(document.content.sales)
    });
	console.log(branchSales);
}, function(error) {
    console.log(JSON.stringify(error, null, 2));
}
)
}

}, function(error) {
    console.log(JSON.stringify(error, null, 2));
}
)







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