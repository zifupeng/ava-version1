//--------------display first line of data
// d3.csv("supermarket.csv",function(data){
//   console.log(data[0]);
// })

//-------------display bar chart
var dataArray = [23, 13, 21, 14, 37, 15, 18, 34, 30];

var svg = d3.select("body").append("svg")
.attr("height","100%")
.attr("width","100%");

svg.selectAll("rect")
.data(dataArray)
.enter().append("rect")
.attr("class","bar")
.attr("height", function(d, i) {return (d * 10)})
.attr("width","40")
.attr("x", function(d, i) {return (i * 60) + 25})
.attr("y", function(d, i) {return 400 - (d * 10)});

svg.selectAll("text")
    .data(dataArray)
    .enter().append("text")
    .text(function(d) {return d})
          .attr("class", "text")
          .attr("x", function(d, i) {return (i * 60) + 36})
          .attr("y", function(d, i) {return 415 - (d * 10)});
