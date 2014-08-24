

 //SECTION 3: THE MAP - TO GIVE A GLOBAL PERSPECTIVE
 var DrawMap = function() {
	//The 'VISUAL SPACE' that I am working with...  see http://stackoverflow.com/questions/21639305/d3js-take-data-from-an-array-instead-of-a-file
	//MARGINS: width and height
		var margin = {top: 0, right: 20, bottom: 0, left: 100},
			width = 960 - margin.left - margin.right,
			height = 400 - margin.top - margin.bottom;
		
	// 1b. FORMATS... looking good..
		var formatPercent = d3.format("") //hold for now not working as I want in the y axis (tickformat).. so changed used ticks
		
	// Set projection -- how the geography is distorted
		var projection = d3.geo.equirectangular()

	// Set path generator -- how coordinates translate into a path element
		var path = d3.geo.path().projection(projection) //path function
	
	//zoom
		//var zoom = d3.behavior.zoom()
			//.translate(projection.translate())
			//.scale(projection.scale())
			//.scaleExtent([height, 10 * height])
			//.on("zoom", move);
  	
	
	// 1e. TIP
		var tip = d3.tip()
			.attr('class', 'd3-tip') //references the css file
			.offset([-10, 0])
			.html(function(d) {return d.hburden_rankn; })
			
// 1f. SVG... the container where all the action will be happening
		var svg = d3.select("body").append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
			.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		svg.call(tip); 

	
	// create a map g to hold map
	
	svg.append('g')
		.attr("id", "map-g")
		
		var formattedData = {} 
		data.map(function(d) {formattedData[d.iso_3] = d["hl_burden"]}) 
			
	// Draw paths
	 paths = d3.select('#map-g').selectAll('path')
			.data(shape.features)
			.enter().append("path")
			//.attr("fill", "#FFF")
			.attr("stroke", "#000")
			.attr('d', path)
			.style("fill", function (d) {
				var iso_3 = d.properties.adm0_a3
				var value = formattedData[iso_3]
				console.log(value)
				// find a way to return the correct color based on this value
					if (formattedData[iso_3] == 1) return "#23C27D" //high burden rank nice green
					else return "#2368C2" //nice blue
			})
			.on('mouseover', tip.show)
			.on('mouseout', tip.hide)
				
}

DrawMap()
	

		
		
	//The 'VISUAL SPACE' that I am working with...  see http://stackoverflow.com/questions/21639305/d3js-take-data-from-an-array-instead-of-a-file
	//MARGINS: width and height
		var margin = {top: 0, right: 20, bottom: 40, left: 100},
			width = 960 - margin.left - margin.right,
			height = 200 - margin.top - margin.bottom;

// 1c. SCALES: I have space and data.. need to make sure the data fits in the space :-)...scale
		var x = d3.scale.ordinal()
			.rangeRoundBands([0, width], .1);    //categorical data
	
		var y = d3.scale.linear()
			.range([height, 0])
					
// 1d. AXES: this is how we will visualize the axes
		var xAxis = d3.svg.axis()
			.scale(x)
			.orient("bottom");

		var yAxis = d3.svg.axis()
			.scale(y)
			.orient("left")
			//.tickFormat(formatPercent)
			.ticks(10);
// 1e. TIP
		var tip = d3.tip()
			.attr('class', 'd3-tip') //references the css file
			.offset([-10, 0])
			.html(function(d) {return d.hburden_rank + ": <span style='color:yellow'>" + d3.round(d.mr) + "<strong></strong> % of PTB cohort";})
			
// 1f. SVG... the container where all the action will be happening
		var svg = d3.select("body").append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
			.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		svg.call(tip); 
		
		
// 2b. Data embedded ELEMENTS added into the container i.e. svg... these are the axes and bars (references css file) DRAW THIS CHART
var ChartDraw = function() {

		
// 2. GETTING IN THE ELEMENTS ATTACHED TO THE DATA into the visual space * http://bost.ocks.org/mike/bar/3/ * http://stackoverflow.com/questions/21639305/d3js-take-data-from-an-array-instead-of-a-file

// 2a. DATA DOMAIN: Data - already read into the html as data.js that is the data downloaded: order matters [data, map code, running code]
		
		data.sort(function(a,b) {return Number(a.hburden_rankn) - Number(b.hburden_rankn)}); //sorted the 22hbc in ascending order 1,2,3...22
		
		x.domain(data.map(function(d) { return d.hburden_rankn; }));
		y.domain([0, d3.max(data, function(d) { return d.mr; })]);

		svg.append("text")
		.attr("class", "title")
		.attr("x", x(data[0].name))
		.attr("y", -26)
		.text("Do Country-specific TB Case Fatality Rates Influence WHO STOP Strategy Uptake?");
		
		
		svg.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + height + ")")
			.call(xAxis)
			.selectAll(".tick text")
			.call(wrap, x.rangeBand());

		svg.append("g")
			.attr("class", "y axis")
			.call(yAxis)
			.append("text")
			.attr("transform", "rotate(-90)")
			.attr("y", 10)
			.attr("dy", ".71em")
			.style("text-anchor", "end")
			.style("color", "white") //can't seem to get the text for the axes to get colored here as well as in my style css
			.text("Mortality in %");
			

		svg.selectAll(".bar")
			.data(data)
			.enter().append("rect")
			.attr("class", "bar")
			.attr("x", function(d) { return x(d.hburden_rankn); })
			.attr("width", x.rangeBand())
			.attr("y", function(d) { return y(d.mr); })
			.attr("height", function(d) { return height - y(d.mr); })
			.on('mouseover', tip.show)
			.on('mouseout', tip.hide)



// TEXT WRAPPING
		function wrap(text, width) {
		text.each(function() {
			var text = d3.select(this),
				words = text.text().split(/\s+/).reverse(),
				word,
				line = [],
				lineNumber = 0,
				lineHeight = 1.1, // ems
			y = text.attr("y"),
				dy = parseFloat(text.attr("dy")),
				tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
			while (word = words.pop()) {
			line.push(word);
			tspan.text(line.join(" "));
			if (tspan.node().getComputedTextLength() > width) {
				line.pop();
				tspan.text(line.join(" "));
				line = [word];
				tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
			}
			}
		});
	}
}

ChartDraw()



// 3b. STOP TB STRATEGY 6 COMPONENTS --- THIS COLORS IT...
		var ColorBars = function (strategy) {
	// var strategy = d.stgy1
		svg.selectAll(".bar").style('fill', function(d) { //because this is the string in html from button
			if (d[strategy] == 1) return "#C12267" // http://www.computerhope.com/htmcolor.htm nice website for colors
			else return "#5E5A80" //grape
    	})
		
	// In here, reset your formattedData variable to be updated to the current strategy, 
		var formattedData = {} 
			data.map(function(d) {formattedData[d.iso_3] = d[strategy]}) 
	
	// Take your paths, and change the fill style based on the new formattedData 
		paths.style("fill", function (d) {
			console.log(d)
				var iso_3 = d.properties.adm0_a3
				var value = formattedData[iso_3]
				console.log(value)
				// find a way to return the correct color based on this value
				if (formattedData[iso_3] == 1) return "#C12267" //deep pink.. forgotten exact name of color; all components of strategy
				if (formattedData[iso_3] == 0) return "#5E5A80" //grape not all components of strategy of the 22 hbc
				if (formattedData[iso_3] == "null" && iso_3== 1) return "#5E5A80" //grape not all components of strategy of the 22 hbc
					else return " #2368C2" //blue.... very interesting... #2368C2 no data #494F4E" //wolf gray
		}) 
	
	}

//var ChartDraw = function() {
//svg.selectAll(".bar")
			//.data(data)
			//.enter().append("rect")
			//.attr("class", "bar")
			//.attr("x", function(d) { return x(d.hburden_rankn); })
			//.attr("width", x.rangeBand())
			//.attr("y", function(d) { return y(d.mr); })
			//.attr("height", function(d) { return height - y(d.mr); })
			//.on('mouseover', tip.show)
			//.on('mouseout', tip.hide)
//}
 

	
	
	

