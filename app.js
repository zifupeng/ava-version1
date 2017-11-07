var restify = require('restify');
var builder = require('botbuilder');
var SVGConverter = require('./SVGConverter');
var dimple = require('dimple');
var d3 = require('d3');
const request = require('request');
var express = require('express');


// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});

// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: '57c819f2-f915-4ae2-a8c2-69fcb5502930',
    appPassword: 'Yr3rWu8iuWceKACFGob2tpi',
});

// Listen for messages from users
server.post('/api/messages', connector.listen());

//create a array of key words (internts)
var arr = [['total tax', 'totalTax'],
    ['quantity by category', 'quantityByCategory'],
    ['sales by branch', 'salesAcrossBranch'],
    ['sales across category', 'salesAcrossCategory'],
    ['sales across category in woolwich', 'salesAcrossCategoryInWool'],
    ['sales across department', 'salesAcrossDepartment'],
    ['sales in woolwich', 'salesInWool'],
    ['tax across branch', 'taxAcrossBranch'],
    ['total discount', 'totalDiscount'],
    ['total sales after discount', 'totalSalesAfterDiscount'],
    ['sales on', 'salesOn1-4-16 11-12']
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
        console.log('reached!!!!!!');
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
        builder.Prompts.text(session, 'Hello ' + name + '! May I know what can I help you? I am able to answer any question indicated below.What does sales look like across branches? <br>What does sales look like across departments? <br>What does sales look like across categories? <br>What does sales look like in specific_branch?<br>How much are the total discount?<br>What are the total sales after discount?<br>Which category sell better in specific_branch?<br>What are the total tax?<br>Tax across branch?<br>');
    }
]);
bot.dialog('askName',
    function (session) {
        builder.Prompts.text(session, 'Welcome to ABI Visualization bot! May I know how could I address you?');
    }
);

function processQuestion(session, str){
    if (str.trim().toLowerCase() !== 'bye'){
        session.dialogData.question = str.toLowerCase();
        var keyword = sendChart(session);
        builder.Prompts.text(session, "What else would you like to ask me? <br/>How about 'What's the " + arr[getRandomIntInclusive(0,11)][0] + "?'. or type 'Bye' to quit.");
    }else{
        session.endDialog('See you next time, ' + name);
    }
}

function sendChart(session){
    var question = session.dialogData.question;
    var key = null;
    for (i=0; i<arr.length; i++){
        if (question.includes(arr[i][0])){
            key = arr[i][1];
            // functions['quantityByCategory']();
            // url = __dirname + '/charts/${quantityByCategory}.png';
            // url = './images/'+ key + '.png';
            url = 'https://image.ibb.co/msicCb/' + key + '.png';
            var msg = getChart(session, url);
            session.send(msg);
        }
    }
    if (key == null){
        session.send("Sorry, I don't understand your question");
    }
    return key;
}


function getChart(session, url){
    var msg = new builder.Message(session)
        .addAttachment({
            contentUrl: url,
            contentType: 'image/png',
            name: 'test image'
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


 // Set-up the export button
  // d3.select('#saveButton').on('click', function(){

  var convertPNG = function (svg, width, height){
    var svgString = getSVGString(svg.node());

    console.log(svgString);
    svgString2Image( svgString, 2*width, 2*height, 'png', save ); // passes Blob and filesize String to the callback

    function save( dataBlob, filesize ){
        saveAs( dataBlob, 'D3 vis exported to PNG.png' ); // FileSaver.js function
    }
  }
  // });

  // Below are the functions that handle actual exporting:
  // getSVGString ( svgNode ) and svgString2Image( svgString, width, height, format, callback )
  function getSVGString( svgNode ) {
    svgNode.setAttribute('xlink', 'http://www.w3.org/1999/xlink');
    var cssStyleText = getCSSStyles( svgNode );
    appendCSS( cssStyleText, svgNode );

    var serializer = new XMLSerializer();
    var svgString = serializer.serializeToString(svgNode);
    svgString = svgString.replace(/(\w+)?:?xlink=/g, 'xmlns:xlink='); // Fix root xlink without namespace
    svgString = svgString.replace(/NS\d+:href/g, 'xlink:href'); // Safari NS namespace fix

    return svgString;

    function getCSSStyles( parentElement ) {
        var selectorTextArr = [];

        // Add Parent element Id and Classes to the list
        selectorTextArr.push( '#'+parentElement.id );
        for (var c = 0; c < parentElement.classList.length; c++)
                if ( !contains('.'+parentElement.classList[c], selectorTextArr) )
                    selectorTextArr.push( '.'+parentElement.classList[c] );

        // Add Children element Ids and Classes to the list
        var nodes = parentElement.getElementsByTagName("*");
        for (var i = 0; i < nodes.length; i++) {
            var id = nodes[i].id;
            if ( !contains('#'+id, selectorTextArr) )
                selectorTextArr.push( '#'+id );

            var classes = nodes[i].classList;
            for (var c = 0; c < classes.length; c++)
                if ( !contains('.'+classes[c], selectorTextArr) )
                    selectorTextArr.push( '.'+classes[c] );
        }

        // Extract CSS Rules
        var extractedCSSText = "";
        for (var i = 0; i < document.styleSheets.length; i++) {
            var s = document.styleSheets[i];

            try {
                if(!s.cssRules) continue;
            } catch( e ) {
                    if(e.name !== 'SecurityError') throw e; // for Firefox
                    continue;
                }

            var cssRules = s.cssRules;
            for (var r = 0; r < cssRules.length; r++) {
                if ( contains( cssRules[r].selectorText, selectorTextArr ) )
                    extractedCSSText += cssRules[r].cssText;
            }
        }


        return extractedCSSText;

        function contains(str,arr) {
            return arr.indexOf( str ) === -1 ? false : true;
        }

    }

    function appendCSS( cssText, element ) {
        var styleElement = document.createElement("style");
        styleElement.setAttribute("type","text/css");
        styleElement.innerHTML = cssText;
        var refNode = element.hasChildNodes() ? element.children[0] : null;
        element.insertBefore( styleElement, refNode );
    }
  }


  function svgString2Image( svgString, width, height, format, callback ) {
    var format = format ? format : 'png';

    var imgsrc = 'data:image/svg+xml;base64,'+ btoa( unescape( encodeURIComponent( svgString ) ) ); // Convert SVG string to data URL

    var canvas = document.createElement("canvas");
    var context = canvas.getContext("2d");

    canvas.width = width;
    canvas.height = height;

    var image = new Image();
    image.onload = function() {
        context.clearRect ( 0, 0, width, height );
        context.drawImage(image, 0, 0, width, height);

        canvas.toBlob( function(blob) {
            var filesize = Math.round( blob.length/1024 ) + ' KB';
            if ( callback ) callback( blob, filesize );
        });


    };

    image.src = imgsrc;
  }


