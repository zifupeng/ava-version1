
var svg = dimple.newSvg("#chartContainer", 590, 400);
var width = 300, height = 300;
d3.csv("supermarket.csv", function (data) {

  var myChart = new dimple.chart(svg, data);
  myChart.setBounds(20, 20, 400, 360)
  myChart.addMeasureAxis("p", "sales");
  myChart.addSeries("prod_cat", dimple.plot.pie);
  myChart.addLegend(420, 20, 100, 300, "left");
  myChart.draw();



      convertPNG();
          });


      function convertPNG(){
        console.log("button clicked");
      	var svgString = getSVGString(svg.node());

        console.log(svgString);
      	svgString2Image( svgString, 2*width, 2*height, 'png', save); // passes Blob and filesize String to the callback

      	function save( dataBlob, filesize ){
      		saveAs( dataBlob, 'salesAcrossCategory.png' ); // FileSaver.js function
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



/*
//this chart will have radial labels
var svg = dimple.newSvg("body", 600, 500);
d3.csv("supermarket.csv", function (data) {
  var chart = new dimple.chart(svg, data);
  chart.addMeasureAxis("p", "sales");
  var ring = chart.addSeries("prod_cat", dimple.plot.pie);
  ring.innerRadius = "50%";
  ring.afterDraw = function(shape, data) {
          var g = svg.select("g");
          //find the center of the pie
          var grect =  g.node().getBBox();
          var gmidx =  grect.x + (grect.width - 7)/2;
          var gmidy =  grect.y + (grect.height - 7)/2;
          var radius = (grect.height - 7) / 2;
          //find the center of the pie-part
          var srect =  d3.select(shape).node().getBBox();
          var smidx =  srect.x + srect.width/2;
          var smidy =  srect.y + srect.height/2;
          //get the direction:
          //the parts are arranged around the center as origin (0,0)
          //so the direction is simply the mid point of the pie-part
          var dirx =   smidx;
          var diry =   smidy;
          var norm =   Math.sqrt(dirx * dirx + diry * diry);
          //normalize the direction
          dirx /= norm;
          diry /= norm;
          //multiply direction by radius to find placement for label
          //get two points: where to put label, and where to draw a line
          var x = Math.round(gmidx + (radius + 25) * dirx);
          var y = Math.round(gmidy + (radius + 15)  * diry);
          var xOnPie = Math.round(gmidx + (radius+4) * dirx);
          var yOnPie = Math.round(gmidy + (radius+4) * diry);
          //append label
          var node = svg.append("text")
                .attr("x", x + ((dirx > 0) ? 5 : -5))
                .attr("y", y + 3)
            .style("font-size", "12px")
                .style("font-family", "sans-serif")
                .style("text-anchor", (dirx > 0) ? "start" : "end")
              .style("fill", "black")
            .text(data.aggField[0]);
          //append line
          svg.append("line")
              .attr("x1", x)
              .attr("y1", y)
              .attr("x2", xOnPie)
              .attr("y2", yOnPie)
              .style("stroke", "#e0e0e0");
        }
  chart.draw();
});*/
