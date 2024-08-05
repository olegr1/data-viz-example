import * as d3 from "d3";

export class BarChart {
  constructor(elementId, data) {
    this.#createBarChart(elementId, data);
  }

  #createBarChart(elementId, data) {
    const element = document.getElementById(elementId);

    const ageGroups = [
      { groupTitle: "0-14", min: 0, max: 14 },
      { groupTitle: "15-24", min: 15, max: 24 },
      { groupTitle: "25-64", min: 25, max: 64 },
      { groupTitle: "65 and over", min: 65, max: 1000 },
    ];

    const ageGroupTitles = ageGroups.map((ageGroup) => ageGroup.groupTitle);

    const passengersWithAge = data.filter(
      (passenger) => passenger.Age !== null
    );

    const ageGroupBuckets = ageGroups.map(({ groupTitle, min, max }) => {
      return {
        groupTitle,
        passengers: passengersWithAge.filter(
          (passenger) => passenger.Age >= min && passenger.Age <= max
        ),
      };
    });

    const ageAxisScale = ageGroupBuckets.reduce((maxLength, ageGroupBucket) => {
      return Math.max(maxLength, ageGroupBucket.passengers.length);
    }, 0);

    const ageAxisScaleRounded = Math.ceil(ageAxisScale / 100) * 100;

    const width = 600;
    const height = 400;
    const marginTop = 80;
    const marginRight = 20;
    const marginBottom = 30;
    const marginLeft = 40;

    const x = d3
      .scaleBand()
      .domain(ageGroupTitles)
      .range([marginLeft, width - marginRight])
      .padding(0.3);

    const y = d3
      .scaleLinear()
      .domain([0, ageAxisScaleRounded])
      .range([height - marginBottom, marginTop]);

    const svg = d3
      .create("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "max-width: 100%; height: auto;");

    svg
      .append("text")
      .attr("x", marginLeft)
      .attr("y", 40)
      .attr("font-size", "18px")
      .text("Number of passengers in each age group");

    svg
      .append("g")
      .selectAll()
      .data(ageGroupBuckets)
      .enter()
      .append("rect")
      .attr("class", "chart-bar")
      .attr("x", (d) => x(d.groupTitle))
      .attr("y", (d) => y(d.passengers.length))
      .attr("width", x.bandwidth())
      .attr("height", (d) => height - y(d.passengers.length) - marginBottom);

    svg
      .append("g")
      .selectAll()
      .data(ageGroupBuckets)
      .enter()
      .append("text")
      .attr("class", "chart-label")
      .attr("x", (d) => x(d.groupTitle) + x.bandwidth() / 2)
      .attr("y", (d) => y(d.passengers.length) - 5)
      .attr("font-size", "12px")
      .attr("text-anchor", "middle")
      .text((d) => d.passengers.length);

    svg
      .append("g")
      .attr("transform", `translate(0,${height - marginBottom})`)
      .call(d3.axisBottom(x));

    svg
      .append("g")
      .attr("transform", `translate(${marginLeft},0)`)
      .call(d3.axisLeft(y));

    element.append(svg.node());
  }
}
