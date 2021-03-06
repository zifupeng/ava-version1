var svg = dimple.newSvg("#chartContainer", 590, 400);
var width = 300, height = 300;
d3.csv("supermarket.csv", function (data) {
  var myChart = new dimple.chart(svg, data);
  myChart.setBounds(60, 30, 510, 200)
  var x = myChart.addCategoryAxis("x", "branch");


  myChart.addMeasureAxis("y", "tax");
  myChart.addSeries(null, dimple.plot.bar);
  myChart.draw();

                convertPNG();
                    });


                function convertPNG(){
                  console.log("button clicked");
                	var svgString = getSVGString(svg.node());

                  console.log(svgString);
                	svgString2Image( svgString, 2*width, 2*height, 'png', save); // passes Blob and filesize String to the callback

                	function save( dataBlob, filesize ){
                		saveAs( dataBlob, 'taxAcrossBranch.png' ); // FileSaver.js function
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


//
//
// d3.csv("supermarket.csv",function(data){
//   var taxAcrossBranch = d3.nest()
//   .key(function(transaction){
//     return transaction.branch;
//   })
//   .rollup(function(leaves){
//     return d3.sum(leaves,function(d){
//       return d.tax;
//     })
//   }).entries(data);
//
//
//   console.log(taxAcrossBranch);
//  var svg = dimple.newSvg("body", 800, 600);
//
//   var chart = new dimple.chart(svg, data);
//     chart.addCategoryAxis("x", "key");
//     chart.addMeasureAxis("y", "values");
//     chart.addSeries(null, dimple.plot.bar);
//     chart.draw();

  // drawBarChar(taxAcrossBranch)
  // taxAcrossBranch.forEach(function(d) {;
  //     d.values = +d.values;
  // });
  //
  // var svg = d3.select("body").append("svg")
  // .attr("height","100%")
  // .attr("width","100%");
  //
  // svg.selectAll("rect")
  // .data(d3.values(taxAcrossBranch))
  // .enter().append("rect")
  // .attr("class","bar")
  // .attr("height", function(d,i) {d})
  // .attr("width","40")
  // .attr("x", function(d, i) {return (i* 60) + 25})
  // .attr("y", "0");
//   //
//
//
// });





// function drawBarChar(taxAcrossBranch){
//
// }
