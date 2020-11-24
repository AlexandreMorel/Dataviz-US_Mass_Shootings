// set the dimensions and margins of the graph
var width = 300
height = 300
margin = 40

// The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
var radius = Math.min(width, height) / 2 - margin

// append the svg object to the div called 'my_dataviz'
var svg = d3.select("#my_dataviz")
.append("svg")
.attr("width", width)
.attr("height", height)
.append("g")
.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");


d3.csv("datasetv6.csv", function(data){
let genders = {}
            var femmes=0;
            var hommes=0;

            data.forEach(crime => {
                let gender=crime.gender;
                
                    if(gender=="M"||gender=="Male"){
                        hommes += +1;
                    }
                    else if(gender=="F"||gender=="Female"){
                        femmes += +1;
                        
                    }
                    else{
                        femmes += +1;
                        hommes += +1;
                    }   
            }
            );
            
            genders['Female']=femmes;
            genders['Male']=hommes;


// set the color scale
var color = d3.scaleOrdinal()
  .range(["rgb(255, 255, 51)", "rgb(0, 153, 153)"]);

var legendText = ["Male", "Female"];


// Compute the position of each group on the pie:
var pie = d3.pie()
.value(function(d) {return d.value; })
var data_ready = pie(d3.entries(genders))
// Now I know that group A goes from 0 degrees to x degrees and so on.

// shape helper to build arcs:
var arcGenerator = d3.arc()
.innerRadius(0)
.outerRadius(radius)

// Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
svg
.selectAll('mySlices')
.data(data_ready)
.enter()
.append('path')
.attr('d', arcGenerator)
.attr('fill', function(d){ return(color(d.data.key)) })
.attr("stroke", "black")
.style("stroke-width", "2px")
.style("opacity", 0.7)
.on("mouseover", function(d) {      
            div.transition()        
            .duration(200)      
            .style("opacity", .9);      
            div.text(d.data.key + ' ' + parseInt((d.data.value/120)*100) +'%')
            .style("left", (d3.event.pageX) + "px")     
            .style("top", (d3.event.pageY - 28) + "px");    
        })
// fade out tooltip on mouse out               
        .on("mouseout", function(d) {       
            div.transition()        
            .duration(500)      
            .style("opacity", 0);   
        });

// Append Div for tooltip to SVG
var div = d3.select("body")
        .append("div")   
        .attr("class", "tooltip")               
        .style("opacity", 0);


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
 
})