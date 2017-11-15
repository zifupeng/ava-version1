var restify = require('restify');
var builder = require('botbuilder');
var SVGConverter = require('./SVGConverter');
var dimple = require('dimple');
var d3 = require('d3');
const request = require('request');
var express = require('express');
var csvtojson = require('./csvtojson.js');
var HashMap = require('hashmap');
var doc_to_db = require('./MarkLogicTry/docToDatabase.js');
const marklogic = require('marklogic');
const my = require('./MarkLogicTry/my-connection.js');


// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url);
   csvtojson.csvtojson();
});

// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: '57c819f2-f915-4ae2-a8c2-69fcb5502930',
    appPassword: 'Yr3rWu8iuWceKACFGob2tpi',
});

// Listen for messages from users
server.post('/api/messages', connector.listen());

//create a array of key words (internts)
var arr = [['total tax', 'heh4sb/totalTax'],
    ['quantity by category', 'quantity_By_Category'],
    ['sales by branch', 'sales_by_branch'],
    ['sales across categories', 'ixPHCb/sales_Across_Category'],
    ['sales across category in woolwich', 'c3EHCb/sales_Across_Category_In_Wool'],
    ['sales across department', 'dasR5w/sales_Across_Department'],
    ['sales in woolwich', 'salesInWool'],
    ['tax across branch', 'hr3oJG/tax_Across_Branch'],
    ['total discount', 'b5N4sb/total_Discount'],
    ['total sales after discount', 'cc0Dkw/total_Sales_After_Discount'],
    ['sales on', 'dtcFyG/sales_On1_4_16_11_12']
];
var map = new Map(arr);


var functions = {
    quantityByCategory: function(){
        // request('file:///Users/admin/Documents/GitHub/ava-version1/quantityByCategory.html', (error, response, body) => {
        //     console.log('html reached!!!!!');
        // });
        // httpGet('file:///Users/admin/Documents/GitHub/ava-version1/quantityByCategory.html');
        var svg = dimple.newSvg("body", 590, 400);
        var width = 300, height = 300;
        d3.csv("supermarket.csv", function (data) {
          var myChart = new dimple.chart(svg, data);
          myChart.setBounds(60, 30, 510, 200)
          var x = myChart.addCategoryAxis("x", "prod_cat");
          // x.addOrderRule("Date");

          myChart.addMeasureAxis("y", "qty");
          myChart.addSeries(null, dimple.plot.bar);
          myChart.draw();

          convertPNG();
        });
    },
    salesAcrossBranch: function(){
        var svg = dimple.newSvg("#chartContainer", 590, 400);
        d3.csv("supermarket.csv", function (data) {
          var myChart = new dimple.chart(svg, data);
          myChart.setBounds(60, 30, 510, 200)
          var x = myChart.addCategoryAxis("x", "branch");
          // x.addOrderRule("Date");

          myChart.addMeasureAxis("y", "sales");
          myChart.addSeries(null, dimple.plot.bar);
          myChart.draw();
        });
    },
    salesAcrossCategory: function(){
        var svg = dimple.newSvg("#chartContainer", 590, 400);
        d3.csv("supermarket.csv", function (data) {
          var myChart = new dimple.chart(svg, data);
          myChart.setBounds(20, 20, 400, 360)
          myChart.addMeasureAxis("p", "sales");
          myChart.addSeries("prod_cat", dimple.plot.pie);
          myChart.addLegend(420, 20, 100, 300, "left");
          myChart.draw();
        });
    },
    salesAcrossCategoryInWool: function(){
        var svg = dimple.newSvg("#chartContainer", 590, 400);
        d3.csv("supermarket.csv", function (data) {

          data = dimple.filterData(data,"branch","Woolwich Extra");
          var myChart = new dimple.chart(svg, data);
          myChart.setBounds(60, 30, 510, 200)
          var x = myChart.addCategoryAxis("x", "prod_cat");
          x.addOrderRule("Date");

          myChart.addMeasureAxis("y", "sales");
          myChart.addSeries(null, dimple.plot.bar);
          myChart.draw();
        });
    },
    salesAcrossDepartment: function(){
        var svg = dimple.newSvg("#chartContainer", 590, 400);
        d3.csv("supermarket.csv", function (data) {
          var myChart = new dimple.chart(svg, data);
          myChart.setBounds(60, 30, 510, 200)
          var x = myChart.addCategoryAxis("x", "prod_dept");
          x.addOrderRule("Date");

          myChart.addMeasureAxis("y", "sales");
          myChart.addSeries(null, dimple.plot.bar);
          myChart.draw();
        });
    },
    salesByTime: function(){
        var svg = dimple.newSvg("#chartContainer", 1000, 2400);
        d3.csv("supermarket.csv", function (data) {
          var myChart = new dimple.chart(svg, data);
          myChart.setBounds(100, 30, 485, 1200);
          myChart.addMeasureAxis("x", "sales");
          var y = myChart.addCategoryAxis("y", "txn_time");
          y.addOrderRule("txn_time",true)
          var s = myChart.addSeries(null, dimple.plot.line);
          myChart.draw();
        });
    },
    salesInWool: function(){
        var salesInWool = 0;
        var svg = dimple.newSvg("#chartContainer", 100, 100);
        d3.csv("supermarket.csv", function (data) {

          data = dimple.filterData(data,"branch","Woolwich Extra");
          data.forEach(function(transaction){
            salesInWool += Number(transaction.sales);
          })


            d3.select("body")
            .append("svg")
            .append("text")
            .attr("x",50)
            .attr("y",60)
            .style("font-size","22px")
            .text(salesInWool);

        });
    },
    taxAcrossBranch: function(){
        var svg = dimple.newSvg("#chartContainer", 590, 400);
        d3.csv("supermarket.csv", function (data) {
          var myChart = new dimple.chart(svg, data);
          myChart.setBounds(60, 30, 510, 200)
          var x = myChart.addCategoryAxis("x", "branch");
          x.addOrderRule("Date");

          myChart.addMeasureAxis("y", "tax");
          myChart.addSeries(null, dimple.plot.bar);
          myChart.draw();
        });
    },
    totalDiscount: function(){
        var svg = dimple.newSvg("#chartContainer", 590, 400);
        d3.csv("supermarket.csv", function (data) {
          var myChart = new dimple.chart(svg, data);
          myChart.setBounds(60, 30, 510, 200)
          var x = myChart.addCategoryAxis("x", "branch");
          x.addOrderRule("Date");

          myChart.addMeasureAxis("y", "tax");
          myChart.addSeries(null, dimple.plot.bar);
          myChart.draw();
        });
    },
    toatlSalesAfterDiscount: function(){
        var totalSalesAfterDiscount = 0;
        var totalSales = 0;
        var totalDiscount = 0;
        d3.csv("supermarket.csv",function(data){
          data.forEach(function(transaction){
            totalSales += Number(transaction.sales);
            totalDiscount += Number(transaction.discount);
          })

          totalSalesAfterDiscount = totalSales - totalDiscount;

          d3.select("body")
          .append("svg")
          .append("text")
          .attr("x",50)
          .attr("y",60)
          .style("font-size","22px")
          .text(totalSalesAfterDiscount);

        });
    },

}


var name = null;
var i = 0;
//This is a dinner reservation bot that uses a waterfall technique to prompt users for input.
var bot = new builder.UniversalBot(connector, [
    function(session){
        session.beginDialog('greetings');
    },
    function(session, results){
        var str = results.response;
        processQuestion(session, str);
    },
    function(session, results){
        var str = results.response;
        processQuestion(session, str);
    },
    function(session, results){
        var str = results.response;
        processQuestion(session, str);
    },
    function(session, results){
        var str = results.response;
        processQuestion(session, str);
    },
    function(session, results){
        var str = results.response;
        processQuestion(session, str);
    }
]);

// Ask the user for their name and greet them by name.
bot.dialog('greetings', [
    function (session) {
        session.beginDialog('askName');
    },
    function (session, results) {
        name = results.response;
        builder.Prompts.text(session, 'Hello ' + name + '! May I know what can I help you? ');
    }
]);
bot.dialog('askName',
    function (session) {
        builder.Prompts.text(session, 'Telegram Analytics Buddy is designed for you, as a client of Just Analytics to retrieve data visualisation and get insights from your data. You can also achieve this using chatbot on 2 other platforms — Slack and Skype! It helps you to visualise data based on your query, based on which you can generate insights for strategic decision making. May I know how could I address you?');
    }
);

function processQuestion(session, str){
    if (str.trim().toLowerCase() !== 'bye'){
        session.dialogData.question = str.toLowerCase();
        var keyword = sendChart(session);
        builder.Prompts.text(session, "What else would you like to ask me?  or type 'Bye' to quit.");
    }else{
        session.endDialog('See you next time, ' + name);
    }
}

function sendChart(session){
    var question = session.dialogData.question;
    var key = null;
    for (i=0; i<arr.length; i++){
        // if (question.includes(arr[i][0])){
            key = arr[i][1];
            // functions['quantityByCategory']();
            //get hashmap from database
            // var arr1 = [10,  20, 30, 40,  50, 60,  70, 80,90];
            // var arr2 = ['Woolwich Extra', 'Deptford Bridge Express', 'Greenwich Metro', 'Stratford City Super Store','Surrey Keys Extra', 'South Kensington Superstore','Fullham Broadway Express', 'Piccadally Extra', 'Canary Wharf Metro'];
            doc_to_db.doc_to_db();
            search_db(function doneSearching(totalResults){
              // while (totalResults[0].length < totalResults[1].length){
              //   for(var i = 0; i < 1000; i++){var j = i}
              // }
              var url = create_url(totalResults);
              var msg = new builder.Message(session).addAttachment(createHeroCard(session, url));
              // var msg = getChart(session, url);
              session.send(msg);
            });
            //create chart
            
        // }
    }
    if (key == null){
        session.send("Sorry, I don't understand your question");
    }
    return key;
}

function create_url(arr_2d){
  var lable = "" + arr_2d[1][0];
  var num = "" + arr_2d[0][0];
  var lable = "" + arr_2d[1][0];
  for (var i = 1; i < arr_2d[0].length; i++){
    num += "," + arr_2d[0][i];
  }
  for (var i = 1; i < arr_2d[1].length; i++){
    lable += "|" + arr_2d[1][i];
  }
  // return "http://chart.googleapis.com/chart?cht=bvg&chs=400x150&chd=" +  + "&chxt=x,y&chxl=" + chxl;
  return "http://chart.googleapis.com/chart?cht=bhs&chs=500x600&chd=t:" + num + "&chxt=x,y&chdl=" + lable;
}

function createHeroCard(session, url) {
    return new builder.HeroCard(session)
        .title('Sales by Branch')
        .subtitle('Using a Chart as Image service...')
        .text('Build and connect intelligent bots that have charts rendered as images.')
        .images([
            builder.CardImage.create(session, url)
            // builder.CardImage.create(session, 'http://chart.googleapis.com/chart?cht=bvg&chs=250x150&chd=s:Monkeys&chxt=x,y&chxl=0:|Jan|Feb|Mar|Apr|May|Jun|Jul')
        ])
        // .buttons([
        //     builder.CardAction.openUrl(session, 'https://docs.microsoft.com/bot-framework/', 'Get Started')
        // ])
        ;
}

function getChart(session, url){
    var msg = new builder.Message(session)
        .addAttachment({
            contentUrl: url,
            contentType: 'image/png'
        });
    return msg;
}

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
}

function httpGet(theUrl){
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
}

//____________________________________________________________-------------------------------------------------------------------------

//____________________________________________________________-------------------------------------------------------------------------

//____________________________________________________________-------------------------------------------------------------------------


function search_db(callback){
  const db = marklogic.createDatabaseClient(my.connInfo);
  const qb = marklogic.queryBuilder;
  const vb = marklogic.valuesBuilder;
  var branches = [];
  var branchesSalesList = [];
  var totalResults = [];
  // var map = new HashMap();

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
    })

    for(var i=0; i< branches.length; i++) {
      var resultToReturn = [];
      var branch = branches[i];
      var branchSales = 0;
      console.log("branch::::" + branch);
      db.documents.query(
        qb.where(
        qb.byExample({branch: branches[i]})).slice(0,10000)
      )
      .result(
      function(documents) {

      
        documents.forEach( function(document) {
        var salesInt = parseInt(document.content.sales);
        branchSales += salesInt;
        });
      console.log("branchSales::::" + branchSales);
      branchesSalesList.push(branchSales);
      

    }, function(error) {
        console.log(JSON.stringify(error, null, 2));
    }
    )

    }
    totalResults.push(branchesSalesList);
    totalResults.push(branches);
    return callback(totalResults);
    }, function(){
    }, function(error) {
        console.log(JSON.stringify(error, null, 2));
    }
    )
  }
