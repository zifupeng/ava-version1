const ml = require('marklogic');
var db = ml.createDatabaseClient({host: 'localhost', port: '8000', database: 'Documents',user:'admin', password: 'admin',authType: 'DIGEST'});
db.createCollection(
  '/books',
  {author: 'Beryl Markham'},
  {author: 'WG Sebald'}
  )
  .result(function(response) {
    console.log(JSON.stringify(response, null, 2));
  }, function (error) {
    console.log(JSON.stringify(error, null, 2));
  });
// db.documents.write(docDescriptor)
// db.documents.write([docDescriptor1, docDescriptor2, ...])
// db.documents.write(docDescriptor1, docDescriptor2, ...)