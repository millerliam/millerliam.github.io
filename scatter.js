// Set up dimensions and margins
const margin = {top: 20, right: 30, bottom: 40, left: 50},
    width = 800 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

// Create SVG canvas
const svg = d3.select("#scatterPlot")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Load the Iris data
d3.csv("iris.csv").then(function(data) {
    // Convert data to numeric
    data.forEach(d => {
        d.petalLength = +d.petalLength;
        d.petalWidth = +d.petalWidth;
    });

    // Set up scales
    const xScale = d3.scaleLinear()
        .domain([d3.min(data, d => d.petalLength) - 0.5, d3.max(data, d => d.petalLength) + 0.5])
        .range([0, width]);

    const yScale = d3.scaleLinear()
        .domain([d3.min(data, d => d.petalWidth) - 0.5, d3.max(data, d => d.petalWidth) + 0.5])
        .range([height, 0]);

    // Set up color scale for species
    const color = d3.scaleOrdinal()
        .domain(["setosa", "versicolor", "virginica"])
        .range(["#FF6347", "#4682B4", "#32CD32"]);

    // Add X and Y axes
    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(xScale));
    
    svg.append("g")
        .call(d3.axisLeft(yScale));

    // Add circles
    svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => xScale(d.petalLength))
        .attr("cy", d => yScale(d.petalWidth))
        .attr("r", 5)
        .attr("fill", d => color(d.species));

    // Add X and Y axis labels
    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("transform", `translate(${width / 2}, ${height + margin.bottom - 5})`)
        .text("Petal Length");

    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("transform", `translate(${-margin.left + 15}, ${height / 2}) rotate(-90)`)
        .text("Petal Width");

    // Add legend
    const legend = svg.selectAll(".legend")
        .data(color.domain())
        .enter()
        .append("g")
        .attr("transform", (d, i) => `translate(${width - 100},${i * 25})`);

    legend.append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", 18)
        .attr("height", 18)
        .attr("fill", color);

    legend.append("text")
        .attr("x", 24)
        .attr("y", 14)
        .text(d => d);
});
