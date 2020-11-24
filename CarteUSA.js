//Width and height of map
var width = 960;
var height = 500;

// D3 Projection
var projection = d3.geo.albersUsa()
                .translate([width/2, height/2])    // translate to center of screen
                .scale([1000]);          // scale things down so see entire US
        
// Define path generator
var path = d3.geo.path()               // path generator that will convert GeoJSON to SVG paths
            .projection(projection);  // tell path generator to use albersUsa projection

// Define scale for output
var color = d3.scale.linear()
            .range(["rgb(255,255,178)", "rgb(254,204,92)", "rgb(253,141,60)", "rgb(227,26,28)"]);

var legendText = ["fatalities >= 50", "50 > fatalities >= 25", "25 > fatalities >= 1", "No fatalities"];

//Create SVG element and append map to the SVG
var svg = d3.select("body")
            .append("svg")
            .attr("width", width)
            .attr("height", height);
        
// Append Div for tooltip to SVG
var div = d3.select("body")
            .append("div")   
            .attr("class", "tooltip")               
            .style("opacity", 0);
            
// Load in my states data!
d3.csv("datasetv6.csv", function(data) {
    color.domain([0,1,2,3]); // setting the range of the input data

    let states = {}

    data.forEach(elt => {
        let stateName = elt.states
        let state = stateName === 'D.C.' ? 'District of Columbia' : stateName

        if(state in states) {
            states[state].fatalities += +elt.fatalities
            states[state].injured += +elt.injured
        } else states[state] = {
                state,
                fatalities: +elt.fatalities,
                injured: +elt.injured
        }
    })

    // Load GeoJSON data and merge with states data
    d3.json("us-states.json", function(json) {

    for (var i = 0; i < Object.values(states).length; i++) {

        // Grab State Name
        var dataState = Object.values(states)[i].state;

        // Grab data value 
        var dataValue = Object.values(states)[i].fatalities;

        // Find the corresponding state inside the GeoJSON
        for (var j = 0; j < json.features.length; j++)  {
            var jsonState = json.features[j].properties.name;

            if (dataState==jsonState) {

                // Copy the data value into the JSON
                json.features[j].properties.fatalities = dataValue;

                // Stop looking through the JSON
                break;
            }
        }
    }

    // Bind the data to the SVG and create one path per GeoJSON feature
    svg.selectAll("path")
        .data(json.features)
        .enter()
        .append("path")
        .attr("d", path)
        .style("stroke", "#fff")
        .style("stroke-width", "1")
        .style("fill", function(d) {

            // Get data value
            var value = d.properties.fatalities;
            console.log(value)

            //If value exists…
            if(value) {
                if ((value => 1) && (value <25)) {
                    return "rgb(254,204,92)"

                } else if ((value >= 25) && (value < 50)) {
                    return "rgb(253,141,60)"

                } else if(value >= 50) {
                    return "rgb(227,26,28)"
                }

            } else {
                return "rgb(255,255,178)";
            } 
        })

        .on("mouseover", function (d) {
            div.transition()
                .duration(200)
                .style("height", "30px")
                .style("width", "120px")
                .style("opacity", .9);
            div.text(d.properties.name)
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px")
                .style("font-size", 12 + "px");
        })
        .on("mouseout", function (d) {
            div.transition()
                .duration(500)
                .style("opacity", 0);
        });

    d3.csv("datasetv6.csv", function(data) {

    svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", function(d) {
            return projection([d.longitude, d.latitude])[0];
        })
        .attr("cy", function(d) {
            return projection([d.longitude, d.latitude])[1];
        })
        .attr("r", function(d) {
            return Math.sqrt(d.fatalities) * 2.5;
        })
            .style("fill", "rgb(0, 0, 0)")	
            .style("opacity", 0.75)	

        // Modification of custom tooltip code provided by Malcolm Maclean, "D3 Tips and Tricks" 
        // http://www.d3noob.org/2013/01/adding-tooltips-to-d3js-graph.html
        .on("mouseover", function(d) {      
            div.transition()        
            .duration(200)      
            .style("opacity", .9);      
            div.text(d.location + '\nDeath: ' + d.fatalities)
            .style("left", (d3.event.pageX) + "px")     
            .style("top", (d3.event.pageY - 28) + "px");    
        })   

        // fade out tooltip on mouse out               
        .on("mouseout", function(d) {       
            div.transition()        
            .duration(500)      
            .style("opacity", 0);   
        });
    });  
            
    // Modified Legend Code from Mike Bostock: http://bl.ocks.org/mbostock/3888852
    var legend = d3.select("body").append("svg")
                    .attr("class", "legend")
                    .attr("width", 140)
                    .attr("height", 200)
                    .selectAll("g")
                    .data(color.domain().slice().reverse())
                    .enter()
                    .append("g")
                    .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

        legend.append("rect")
            .attr("width", 18)
            .attr("height", 18)
            .style("fill", color);

        legend.append("text")
            .data(legendText)
            .attr("x", 24)
            .attr("y", 9)
            .attr("dy", ".35em")
            .text(function(d) { return d; });
    });

});