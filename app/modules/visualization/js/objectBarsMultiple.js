/*
"use strict";
var policycompass = policycompass || {'version':0.1, 'controller':{}, 'viz': {} ,'extras': {}};

policycompass.viz.barsMultiple = function(options) {

    // Object

    var self = {};

    // Get options data

    for (var key in options){
        self[key] = options[key];
	}

    self.parentSelect = "#"+self.idName;
    
    self.drawBarsMultiple = function (bars, eventsData) {
		
		//var showLegend = document.getElementById("showLegend").checked;	
		//var showLabels = document.getElementById("showLabels").checked;
		//var showGrid = document.getElementById("showGrid").checked;
		
		var showLegend = self.showLegend;	
		var showLabels = self.showLabels;
		var showGrid = self.showGrid;
						
		//console.log(bars);
		var colorScale = d3.scale.category10();
		var valuesY = [];
		
		bars.forEach(function(d,i) {
			//console.log(i);
			//console.log(d.ValueY);
			valuesY.push((d.ValueY));
		});
		//console.log("valuesY="+valuesY);
		//console.log(valuesY);
		var maxV = d3.max(d3.values(valuesY));
		var minVy = d3.min(d3.values(valuesY));
		//console.log("maxV="+maxV);
		//console.log("minVy="+minVy);
		//console.log("maxV="+maxV);
		
		self.x0 = d3.scale.ordinal()
    		.rangeRoundBands([0, self.width], .1);

		self.x1 = d3.scale.ordinal();

		self.y = d3.scale.linear()
    		.range([self.height, 0]);	

    		  		
    	var color = d3.scale.category10();
    	
		var xAxis = d3.svg.axis()
    		.scale(self.x0)
    		.orient("bottom");

		var yAxis = d3.svg.axis()
    		.scale(self.y)
    		.orient("left")
    		.tickFormat(d3.format(".2s"));    	

			//var months = d3.set(bars.map(function(line) {return line.ValueX;})).values();
			var xAxisData = d3.set(bars.map(function(line) {return line.ValueX;})).values();

			function make_x_axis() {
		    	return d3.svg.axis()
		        	.scale(self.x0)
		         	.orient("bottom")
		         	.ticks(10)
			}
		
			function make_y_axis() {
		    	return d3.svg.axis()
			        .scale(self.y)
			        .orient("left")
			        .ticks(10)
			}

			//console.log(months);				
			//console.log("xAxisData");
			//console.log(xAxisData);
  			self.x0.domain(bars.map(function(d) {d.Key;}));
  			
  			//x1.domain(months).rangeRoundBands([0, x0.rangeBand()]);
  			self.x1.domain(xAxisData).rangeRoundBands([0, self.x0.rangeBand()]);
  		
  			//y.domain([0, d3.max(bars, function(d) {return d.ValueY;})]);
  			self.y.domain([0, maxV]);

			if (showLabels)
			{
		  		self.svg.append("g")
      				.attr("class", "x axis")
      				.attr("transform", "translate(0,"+self.height+")")
      				.call(xAxis)
      				.append("text")
      				//.attr("x", self.width)
					//.attr("dx", self.width- (self.margin.left*2))
            		//.attr("dy", self.width- (self.margin.left*2))
      				//.attr("transform", "rotate(-90)")
      				//.style("text-anchor", "end")
      				//.text(self.labelX)
      				;

  				self.svg.append("g")
      				.attr("class", "y axis")
      				.call(yAxis)
    				.append("text")
      				.attr("transform", "rotate(-90)")
      				.attr("y", 6)
      				.attr("dy", ".71em")
      				.style("text-anchor", "end")
      				.text(self.labelY);
				
			}


			if (showGrid)
			{
				
				//console.log("T showGrid 1");
				self.svg.append("g")         
    	    		.attr("class", "grid")
        			.attr("transform", "translate(0," + self.height + ")")
        			.call(make_x_axis()
            			.tickSize(-self.height, 0, 0)
            			.tickFormat("")
        			);
				
    			self.svg.append("g")         
		        	.attr("class", "grid")
    		    	.call(make_y_axis()
        	    	.tickSize(-self.width, 0, 0)
            		.tickFormat("")
	        		);
	        
	
			}


			//console.log("T rect 1");
  			self.svg.selectAll("rect")
	      		.data(bars)
    			.enter().append("rect")
      			.attr("width", self.x1.rangeBand())
	      		.attr("x", function(d) {return self.x0(d.Key)+self.x1(d.ValueX);})
    	  		.attr("y", function(d) {return self.y(+d.ValueY);})
      			//.attr("height", function(d) {return self.height - y(+d.ValueY);})
      			.attr("height", function(d) {return self.height - self.y(+d.ValueY);})
	      		.style("fill", function(d) {return color(d.ValueX);})
    	  		.on("mouseout", function(d,i) {
    	  			//console.log("mouseout");
      				tooltip.style("opacity",0.0);      				
      			})
      			.on("mouseover", function(d,i) {
	      			//console.log(d);
    	  			tooltip.style("opacity",1.0).html("key="+d.Key+"<br/>Value x="+d.ValueX+"<br/>Value y="+d.ValueY);
      			})
				.on("click", function(d,i) {
					var posMouse = d3.mouse(this);
					var posX = posMouse[0];
					var posY = posMouse[1];	
					$('input[name="startDatePosX"]').val(posX);
      			})      			
      			;
			
			//console.log("T rect 2");

			if (showLegend)
			{
		  		var legend = self.svg.selectAll(".legend")
		      		//.data(months.slice().reverse())
		      		.data(xAxisData.slice().reverse())
		    		.enter().append("g")
		      		.attr("class", "legend")
		      		.attr("transform", function(d, i) {return "translate(0," + i * 20 + ")";});
		
		  		legend.append("rect")
		      		.attr("x", self.width - 18)
		      		.attr("width", 18)
		      		.attr("height", 18)
		      		.style("fill", color);
		
		  		legend.append("text")
		      		.attr("x", self.width - 24)
		      		.attr("y", 9)
		      		.attr("dy", ".35em")
		      		.style("text-anchor", "end")
		      		.text(function(d) {return d;});				
			}


			var dataForCircles = [];
			for (var i in eventsData) {
      			//dataForCircles[eventsData[i].posX]=eventsData[i].posY;
      			//console.log(i);
      			//console.log(eventsData[i].posX)
      			//console.log(eventsData[i].posY)
      			 var arrayTemporal = [];
      			 arrayTemporal['posX']=eventsData[i].posX;
      			 arrayTemporal['posY']=eventsData[i].posY;
      			 arrayTemporal['desc']=eventsData[i].desc;
      			 dataForCircles[i]=arrayTemporal;
   			} 
   			

		
		var myDiscoLinesX = self.svg.selectAll("lineXDisco").data(dataForCircles);

			myDiscoLinesX.enter().append("line")
							.attr("class","lineXDisco")
							.style("stroke", function(d,i) {return colorScale("99");})
							.attr("opacity", 0.5)
                          .attr("x1", function(d,i){return (d.posX);})
                          .attr("y1", self.height)
                         .attr("x2", function(d,i){return (d.posX);})
                         .attr("y2", function(d,i){return (d.posY);})
                         
		var myDiscoLinesY = self.svg.selectAll("lineYDisco").data(dataForCircles);

			myDiscoLinesY.enter().append("line")
							.attr("class","lineYDisco")
							.style("stroke", function(d,i) {return colorScale("99");})
							.attr("opacity", 0.5)
                          .attr("x1", function(d,i){return 0;})
                          .attr("y1", function(d,i){return (d.posY);})
                         .attr("x2", function(d,i){return (d.posX);})
                         .attr("y2", function(d,i){return (d.posY);})

		var myCircles = self.svg.selectAll("circulos").data(dataForCircles);
			
			myCircles.enter().append("circle")
                    .attr("cx", function(d,i){return (d.posX);})
                    .attr("cy", function(d,i){return (d.posY);})
                    .attr("r", self.radius)
                    .attr("class","circulos")
                    .attr("opacity", 1.0)
                    .on("mouseover", function (d,i) {

						var circle = d3.select(this);
						 circle.transition()
							.attr("r", self.radius * 2);

      			
      					console.log(d3.select(this));
      					d3.select(this).classed("circuloOn", true);
		    			tooltip.style("opacity",1.0).html("Desc="+d.desc);      
		    			
      			
      		})
            //.on("mouseover", function(d,i){console.log(d3.select(this));d3.select(this).classed("circuloOn", true);})
            .on("mouseout", function(d,i){

				var circle = d3.select(this);
				 circle.transition()
					.attr("r", self.radius);

            	
            	d3.select(this).classed("circuloOn",false);
            	mouseout();
            	})
            .on("click", function(d,i){
            	//console.log(d);
            	});
	}
    

    self.init = function () {

		self.svg = d3.select(self.parentSelect).append("svg")
    		.attr("width", self.width + self.margin.left + self.margin.right)
    		.attr("height", self.height + self.margin.top + self.margin.bottom)
    		.on("mousemove", mousemove)
  			.append("g")
    		.attr("transform", "translate(" + self.margin.left + "," + self.margin.top + ")");
	}

    self.render = function(dataIn, eventsData){
		
		if (Object.keys(dataIn).length === 0)
		{
			
		}
		else
		{
			console.log(dataIn);
			self.drawBarsMultiple(dataIn, eventsData);
		}		
		
	}

    self.init();

    return self;

}
*/

"use strict";
var policycompass = policycompass || {'version':0.1, 'controller':{}, 'viz': {} ,'extras': {}};

policycompass.viz.barsMultiple = function(options) {

    // Object

    var self = {};

    // Get options data

    for (var key in options){
        self[key] = options[key];
	}

    self.parentSelect = "#"+self.idName;
    
    self.drawBarsMultiple = function (bars, eventsData) {
		/*
		var showLegend = document.getElementById("showLegend").checked;	
		var showLabels = document.getElementById("showLabels").checked;
		var showGrid = document.getElementById("showGrid").checked;
		*/
		var showLegend = self.showLegend;	
		var showLabels = self.showLabels;
		var showGrid = self.showGrid;
						
		//console.log(bars);
		var colorScale = d3.scale.category20();
		var valuesY = [];
		//console.log("valuesY="+valuesY);
		//console.log(valuesY);
		bars.forEach(function(d,i) {
			//console.log(d.ValueY)
			valuesY.push(parseInt(d.ValueY));
		});
		//console.log("valuesY="+valuesY);
		var maxV = d3.max(d3.values(valuesY));
		var minVy = d3.min(d3.values(valuesY));
		
		//console.log("maxV="+maxV);
		
		var x0 = d3.scale.ordinal()
    		.rangeRoundBands([0, self.width], .1);

		var x1 = d3.scale.ordinal();

		var y = d3.scale.linear()
    		.range([self.height, 0]);	
    		 
		var yInversa = d3.scale.linear()
    		.range([0, self.height]);	

    		  		
    	var color = d3.scale.category20();
    	
		var xAxis = d3.svg.axis()
    		.scale(x0)
    		.orient("bottom")
    		;

		var yAxis = d3.svg.axis()
    		.scale(y)
    		.orient("left")
    		.tickFormat(d3.format(".2s"));    	

			
			//var months = d3.set(bars.map(function(line) {return line.ValueX;})).values();
			var xAxisData = d3.set(bars.map(function(line) {
				//console.log(line.ValueX);	
				return line.ValueX;}
				)).values();

			function make_x_axis() {
		    	return d3.svg.axis()
		        	.scale(x0)
		         	.orient("bottom")
		         	.ticks(10)		         	
			}
		
			function make_y_axis() {
		    	return d3.svg.axis()
			        .scale(y)
			        .orient("left")
			        .ticks(10)
			}


			//console.log("months");
			//console.log(months);				
			//console.log("xAxisData");
			//console.log(xAxisData);
			
  			x0.domain(bars.map(function(d) {
  				//console.log("d.Key="+d.Key);
  				return d.Key;}));
  			
  			//x1.domain(months).rangeRoundBands([0, x0.rangeBand()]);
  			x1.domain(xAxisData).rangeRoundBands([0, x0.rangeBand()]);  		
  			//y.domain([0, d3.max(bars, function(d) {return d.ValueY;})]);
  			y.domain([0, maxV]);

			if (showLabels)
			{
		  		self.svg.append("g")
      				.attr("class", "x axis")
      				.attr("font-size", self.font_size)
      				.attr("transform", "translate(0,"+self.height+")")
 			        .attr("fill", "none")
		        	.style("stroke", "#000000")
		            .style("stroke-width", 1)		                     				
      				.call(xAxis)
      				.append("text")      				    		
      				//.attr("x", self.width)
					//.attr("dx", self.width- (self.margin.left*2))
            		//.attr("dy", self.width- (self.margin.left*2))
      				//.attr("transform", "rotate(-90)")
      				//.style("text-anchor", "end")
      				//.text(self.labelX)
      				;
				
				var keyIndex;
				var arrayYaxisProcessed = [];
				var cnt_keyIndex = 0;
				
				self.svg.append("g")
      				.attr("class", "y axis")
      				.attr("font-size", self.font_size)
 			        .attr("fill", "none")
		        	.style("stroke", "#000000")
		            .style("stroke-width", 1)      				
      				.call(yAxis);
      			//console.log(bars);
				for (keyIndex in self.labelY) {
					
					if (arrayYaxisProcessed[self.labelY[keyIndex]]) 
					{
				    	// Exists
				    	//console.log("Exists");
					} 
					else {
    					// Does not exist 
    					arrayYaxisProcessed[self.labelY[keyIndex]]=self.labelY[keyIndex];
						
						self.svg.append("g")
	    					.append("text")
			    			.attr("font-size", self.font_size)
			      			.attr("transform", "rotate(-90)")
			      			.attr("y", 15*(cnt_keyIndex))
			      			//.style("stroke", function(d,i) {
				      		//		//console.log("----->key="+key);
				      		//		return colorScale(bars[keyIndex].Key);
				      		//})	      				
	      					.attr("dy", "15px")
	      					.style("text-anchor", "end")
	      					//.text(self.labelY[0]);
	      					.text(self.labelY[keyIndex]);    	
	      					
	      					cnt_keyIndex = cnt_keyIndex+1;				
					}

	  				
					
				}
				
			}


			if (showGrid)
			{
				self.svg.append("g")         
    	    		.attr("class", "grid")
        			.attr("transform", "translate(0," + self.height + ")")
        			.call(make_x_axis()
            			.tickSize(-self.height, 0, 0)
            			.tickFormat("")
        		)

    			self.svg.append("g")         
		        	.attr("class", "grid")
    		    	.call(make_y_axis()
        	    	.tickSize(-self.width, 0, 0)
            		.tickFormat("")
            		            		
	        	)	     
			}

           // console.log(self.labelY[0]);
               
  			var myBars = self.svg.selectAll("rect")
	      		.data(bars)
    			.enter().append("rect")
      			.attr("width", x1.rangeBand())
	      		.attr("x", function(d) {return x0(d.Key)+x1(d.ValueX);})
    	  		//.attr("y", function(d) {return y(d.ValueY);})
    	  		.attr("y", function(d) {return self.height;})
      			//.attr("height", function(d) {return self.height - y(+d.ValueY);})
      			.attr("height", function(d) {return 0;})
	      		.style("fill", function(d) {
	      			//console.log("d.ValueX="+d.ValueX);	      			
	      			return color(d.ValueX);})
    	  		.on("mouseout", function(d,i) {
      				tooltip.style("opacity",0.0);
      			})
      			.on("mouseover", function(d,i) {
	      			//console.log(d);
	      			
					var resSplit = d.ValueX.split("-");
					var monthNames = [ "", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
		    				
					var startDateToPlot = monthNames[parseInt(resSplit[1])]+" "+parseInt(resSplit[2])+", "+resSplit[0];

	      			
    	  			//tooltip.style("opacity",1.0).html(d.Key+"<br />Date="+d.ValueX+"<br />Value="+d.ValueY);
    	  			tooltip.style("opacity",1.0).html(d.Key+"<br />"+startDateToPlot+"<br />"+d.ValueY);
    	  			
      			})
				.on("click", function(d,i) {
	      			//console.log("****");      			
    	  			//console.log(i);
      				//console.log(d);
      				//console.log("_____");
	      			//modal();
					var posMouse = d3.mouse(this);
					var posX = posMouse[0];
					var posY = posMouse[1];	
		    		//posX = xInversa(posX);
		    		//posY = yInversa(posY);
					//posX = d.ValueX;
					//posY = d.ValueY;			
      				//$('input[name="posx"]').val(posX);
					//$('input[name="posy"]').val(posY);	
						
					$('input[name="startDatePosX"]').val(posX);
      				//$('#basic-modal-content').modal();
      			})     
      			.transition().duration(3000) 	
      				//.attr("height",function(d) {return 0;})		
      				.attr("y", function(d) {return y(d.ValueY);})
      				.attr("height", function(d) {return self.height - y(+d.ValueY);})
      				//.attr("height", function(d) {return y(d.ValueY);})
      			;


            
                
/*
			if (showLegend)
			{
				
		  		var legend = self.svg.selectAll(".legend")
		      		//.data(months.slice().reverse())
		      		.data(xAxisData.slice().reverse())
		    		.enter().append("g")
		      		.attr("class", "legend")		      		
		      		.attr("transform", function(d, i) {return "translate(0," + i * 20 + ")";});
		
		  		legend.append("rect")
		      		.attr("x", self.width - 18)
		      		.attr("width", 18)
		      		.attr("height", 18)
		      		.style("fill", color);
		
		  		legend.append("text")
		      		//.attr("x", self.width - 24)
		      		.attr("x", self.width + self.margin.left + 40)
		      		.attr("y", 9)
		      		.attr("dy", ".35em")
		      		.style("text-anchor", "end")
		      		.text(function(d) {return d;});				
			}
*/

			var dataForCircles = [];
			for (var i in eventsData) {
      			//dataForCircles[eventsData[i].posX]=eventsData[i].posY;
      			//console.log(i);
      			//console.log(eventsData[i].posX)
      			//console.log(eventsData[i].posY)
      			 var arrayTemporal = [];
      			 arrayTemporal['posX']=eventsData[i].posX;
      			 arrayTemporal['posY']=eventsData[i].posY;
      			 arrayTemporal['desc']=eventsData[i].desc;
      			 dataForCircles[i]=arrayTemporal;
   			} 
   			

		
		var myDiscoLinesX = self.svg.selectAll("lineXDisco").data(dataForCircles);

			myDiscoLinesX.enter().append("line")
							.attr("class","lineXDisco")
							.style("stroke", function(d,i) {return colorScale("99");})
							.attr("opacity", 0.5)
                          .attr("x1", function(d,i){return (d.posX);})
                          .attr("y1", self.height)
                         .attr("x2", function(d,i){return (d.posX);})
                         .attr("y2", function(d,i){return (d.posY);})
                         
		var myDiscoLinesY = self.svg.selectAll("lineYDisco").data(dataForCircles);

			myDiscoLinesY.enter().append("line")
							.attr("class","lineYDisco")
							.style("stroke", function(d,i) {return colorScale("99");})
							.attr("opacity", 0.5)
                          .attr("x1", function(d,i){return 0;})
                          .attr("y1", function(d,i){return (d.posY);})
                         .attr("x2", function(d,i){return (d.posX);})
                         .attr("y2", function(d,i){return (d.posY);})

		var myCircles = self.svg.selectAll("circulos").data(dataForCircles);
			
			myCircles.enter().append("circle")
                    .attr("cx", function(d,i){return (d.posX);})
                    .attr("cy", function(d,i){return (d.posY);})
                    .attr("r", self.radius)
                    .attr("class","circulos")
                    .attr("opacity", 1.0)
                    .on("mouseover", function (d,i) {

						var circle = d3.select(this);
						 circle.transition()
							.attr("r", self.radius * 2);

      			
      					console.log(d3.select(this));
      					d3.select(this).classed("circuloOn", true);
		    			tooltip.style("opacity",1.0).html("Desc="+d.desc);      
		    			
      			
      		})
            //.on("mouseover", function(d,i){console.log(d3.select(this));d3.select(this).classed("circuloOn", true);})
            .on("mouseout", function(d,i){

				var circle = d3.select(this);
				 circle.transition()
					.attr("r", self.radius);

            	
            	d3.select(this).classed("circuloOn",false);
            	mouseout();
            	})
            .on("click", function(d,i){
            	//console.log(d);
            	});
            	
	
            	//console.log("xAxisData");
            	//console.log(xAxisData);
            	var cnti = 1;
            	var cntiMultiple=0;
            	var incremetY = 0;
            	//console.log("xAxisData.length="+xAxisData.length);
            	//console.log("self.legendsColumn="+self.legendsColumn);
            	
        xAxisData.forEach(function(d,i) 
        {
				//console.log("xAxisData["+i+"]="+xAxisData[i]);
	    		var valueX =  ((self.width/(xAxisData.length/self.legendsColumn)) * (cntiMultiple));
	    		if (cnti%self.legendsColumn == 0)
                {
					cntiMultiple=cntiMultiple+1;
				}

				var valueY = (self.height) + self.margin.top + 30 + (incremetY)*20;
				if (cnti%self.legendsColumn == 0)
                {
                    //console.log("---key="+key);
                	incremetY = 0;                    		
                }
                else
            	{
                	incremetY = incremetY + 1;
				}	        
				
				
				self.svg.append("rect")
		    	.attr("x", valueX-10)
				.attr("y", valueY-5) 	
		    	.attr("width", 5)
		    	.attr("height", 5)
		    	.style("fill", color(xAxisData[i]));


  				self.svg.append("text")
                    //.attr("x", function(d,i){return self.width + 10 ;})
                    .attr("x", function(d,i){
                    	//console.log("cnti="+cnti+"--key="+key);
                    	return valueX ;}
                    	)
					//.attr("y", function(d,i){return (0) + (20 * cnti-1) ;})
					//.attr("y", function(d,i){return (self.height) + (self.margin.top+(self.margin.bottom/2))+2 ;})
					.attr("y", function(d,i){
						//console.log("--->cnti="+cnti+"--key="+key);
						return  valueY;}
						)
					.attr("text-anchor","center")
					.attr("text-decoration","none")					
					.attr("class", "link superior legend value")				
					.attr("font-size", self.font_size)					
					//.style("stroke", color(xAxisData[i]))					
					.style("fill",  color(xAxisData[i]))
					      					
					.text(xAxisData[i]);
					
					 
                	
                	cnti = cnti+1;
				
		});            	
            	
            	
	}
    

    self.init = function () {
		
		self.extraWidth = 0;
		if (self.showLegend) 
		{
			self.extraWidth = 60;
		}
		
		//console.log(self.parentSelect);
		self.parentSelect = self.parentSelect.replace("undefined","");
		//console.log(self.parentSelect);
		
		self.svg = d3.select(self.parentSelect).append("svg")
    		.attr("width", self.width + self.margin.left + self.margin.right + self.extraWidth)
    		.attr("height", self.height + self.margin.top + self.margin.bottom)
    		.on("mousemove", mousemove)
  			.append("g")
    		.attr("transform", "translate(" + self.margin.left + "," + self.margin.top + ")");
	}

    self.render = function(dataIn, eventsData){
		
		if (Object.keys(dataIn).length === 0)
		{
			//console.log("No data");			
			self.svg.append("text")
              .text("No data to plot. Add metrics")
              .attr("class", "nodatatoplot")
              .attr("x", self.margin.left)
              .attr("y", self.margin.top)			
		}
		else
		{
			//console.log(dataIn);
			self.drawBarsMultiple(dataIn, eventsData);
		}		
		
	}

    self.init();

    return self;

}