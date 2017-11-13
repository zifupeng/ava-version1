'use strict';

const ADODB = require('node-adodb');
const connection = ADODB.open('Provider=Microsoft.Jet.OLEDB.4.0;Data Source=/Users/Weiqiao/Dropbox/FYP/Coding/ava_blank.accdb;');


// 全局调试开关，默认关闭
process.env.DEBUG = 'ADODB';
//
// // 不带返回的执行
// connection
//   .execute('INSERT INTO Users(UserName, UserSex, UserAge) VALUES ("Newton", "Male", 25)')
//   .then((data) => {
//     console.log(JSON.stringify(data, null, 2));
//   })
//   .catch((error) => {
//     // TODO 逻辑处理
//   });
//
// // 带返回标识的执行
// connection
//   .execute(
//     'INSERT INTO Users(UserName, UserSex, UserAge) VALUES ("Newton", "Male", 25)',
//     'SELECT @@Identity AS id'
//   )
//   .then((data) => {
//     console.log(JSON.stringify(data, null, 2));
//   })
//   .catch((error) => {
//     // TODO 逻辑处理
//   });
//
// // 带返回的查询
// connection
//   .query('SELECT * FROM Users')
//   .then((data) => {
//     console.log(JSON.stringify(data, null, 2));
//   })
//   .catch((error) => {
//     // TODO 逻辑处理
//   });
//
// // 带字段描述的查询
// connection
//   .schema(20)
//   .then((schema) => {
//     console.log(JSON.stringify(schema, null, 2));
//   })
//   .catch((error) => {
//     // TODO 逻辑处理
//   });
