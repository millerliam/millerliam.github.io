// Set up dimensions and margins
const margin = {top: 20, right: 30, bottom: 40, left: 50},
    width = 800 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

// Create SVG canvas
const svg = d3.select("#boxPlot")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Load the Iris data
d3.csv("iris.csv").then(function(data) {
    console.log(data);  // Log the data to ensure it is being loaded

    // Convert data to numeric
    data.forEach(d => {
        d.petalLength = +d.petalLength;
    });

    // Set up x and y scales
    const xScale = d3.scaleBand()
        .domain(["setosa", "versicolor", "virginica"])
        .range([0, width])
        .padding(0.2);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.petalLength)])
        .range([height, 0]);

    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(xScale));

    svg.append("g")
        .call(d3.axisLeft(yScale));

    // Function to calculate quartiles and IQR
    const rollupFunction = arr => {
        const q1 = d3.quantile(arr.map(d => d.petalLength).sort(d3.ascending), 0.25);
        const median = d3.quantile(arr.map(d => d.petalLength).sort(d3.ascending), 0.5);
        const q3 = d3.quantile(arr.map(d => d.petalLength).sort(d3.ascending), 0.75);
        const iqr = q3 - q1; // Interquartile range
        return { q1, median, q3, iqr };
    };

    const quartilesBySpecies = d3.rollup(data, rollupFunction, d => d.species);

    // Draw boxes for each species
    quartilesBySpecies.forEach((quartiles, species) => {
        const x = xScale(species);
        const boxWidth = xScale.bandwidth();

        // Vertical lines (whiskers)
        svg.append("line")
            .attr("x1", x + boxWidth / 2)
            .attr("x2", x + boxWidth / 2)
            .attr("y1", yScale(quartiles.q1 - 1.5 * quartiles.iqr))
            .attr("y2", yScale(quartiles.q3 + 1.5 * quartiles.iqr))
            .attr("stroke", "black");

        // Rectangles for q1 to q3
        svg.append("rect")
            .attr("x", x)
            .attr("y", yScale(quartiles.q3))
            .attr("width", boxWidth)
            .attr("height", yScale(quartiles.q1) - yScale(quartiles.q3))
            .attr("fill", "#69b3a2");

        // Horizontal line for median
        svg.append("line")
            .attr("x1", x)
            .attr("x2", x + boxWidth)
            .attr("y1", yScale(quartiles.median))
            .attr("y2", yScale(quart
