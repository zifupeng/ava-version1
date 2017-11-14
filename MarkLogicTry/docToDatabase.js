// Load documents into the database.

const marklogic = require('marklogic');
const my = require('./my-connection.js');
const db = marklogic.createDatabaseClient(my.connInfo);


const supermarket=require('./supermarket.json');


// Document descriptors to pass to write(). 
const documents = [

  { uri: './supermarket1.json',
    content: 
	{
	  "txn_time": "1/4/16 11:11",
	  "branch": "11111",
	  "txn_num": "1.02E+11",
	  "txn_line": "101516010173~1",
	  "prod_dept": "GROCERY",
	  "prod_cat": "CONDIMENTS & SAUCES",
	  "prod_name": "CHICK PEAS BULK",
	  "qty": "1.048",
	  "sales": "176.06",
	  "discount": "14.8",
	  "tax": "0",
	  "sales_after_discount": "161.26\r"//
	 }
  }
  ]
  

/*{ uri: './supermarket.json',
    content: 
	 {
	  txn_time: "1/1/11 11:11",
	  branch: "11111",
	  txn_num: "1111111111",
	  txn_line: "11111111111~1",
	  prod_dept: "11111111",
	  prod_cat: "1",
	  prod_name: "1",
	  qty: "1",
	  sales: "1",
	  discount: "1",
	  tax: "1",
	  sales_after_discount: "1"
	 },
  },*/
// ];

// Load the example documents into the database
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