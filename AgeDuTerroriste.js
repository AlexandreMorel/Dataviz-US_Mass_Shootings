
const reduce = data => {
    const dataset = {}

    data.filter(dataAge => dataAge.age_of_shooter).forEach(dataAge => {
        age = dataAge.age_of_shooter
        if (age in dataset) dataset[age]++
        else dataset[age] = 1
    })
    
    let debug = Object.keys(dataset).map(age => ({
        age, dataset: dataset[age]
    }))

    console.log(debug)

    return debug
    
}

/*
 * Inspired by https://www.datavis.fr/index.php?page=barchart
 */
const margin = {top: 20, right: 20, bottom: 90, left: 120}
const width = 800 - margin.left - margin.right
const height = 400 - margin.top - margin.bottom
const x = d3.scaleBand()
    .range([0, width])
    .padding(0.1)
const y = d3.scaleLinear()
    .range([height, 0])
const svg = d3.select("#d3").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
const div = d3.select("#d3").append("div")
    .attr("class", "tooltip")         
        .style("opacity", 0)

d3.csv("datasetv5.csv")
.then(reduce)
.then(data => {
    // Mise en relation du scale avec les données de notre fichier
    x.domain(data.map(d => d.age))
    y.domain([0, d3.max(data, d => d.dataset)])

    // Ajout de l'axe X au SVG
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).tickSize(0))
        .selectAll("text")	
            .attr("class", "xaxis")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-65)")

    // Ajout de l'axe Y au SVG avec 6 éléments de légende en utilisant la fonction ticks (sinon D3JS en place autant qu'il peut).
    svg.append("g")
        .attr("class", "yaxis")
        .call(d3.axisLeft(y).ticks(6))

    // Ajout des bars en utilisant les données de notre fichier
    svg.selectAll(".bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d.age))
        .attr("width", x.bandwidth())
        .attr("y", d => y(d.dataset))
        .attr("height", d => height - y(d.dataset))					
        .on("mouseover", (event, d) => {
            div.transition()        
                .duration(200)      
                .style("opacity", .9);
            div.html("Occurence: " + d.dataset)
                .style("left", (event.x + 10) + "px")     
                .style("top", (event.y - 50) + "px");
        })
        .on("mouseout", function(d) {
            div.transition()
                .duration(500)
                .style("opacity", 0);
        });
})