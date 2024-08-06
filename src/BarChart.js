import * as d3 from "d3";

export class BarChart {
  #isSurvivorsOnly = false;
  #ageGroups = [
    { groupTitle: "0-14", min: 0, max: 14 },
    { groupTitle: "15-24", min: 15, max: 24 },
    { groupTitle: "25-64", min: 25, max: 64 },
    { groupTitle: "65 and over", min: 65, max: 1000 },
  ];
  #width = 600;
  #height = 400;
  #marginTop = 40;
  #marginRight = 0;
  #marginBottom = 30;
  #marginLeft = 35;
  #svg;
  #x;
  #y;
  #ageGroupBuckets;
  #ageGroupBucketsSurvivors;

  constructor(elementId, data) {
    this.#createBarChart(elementId, data);
  }

  #createBarChart(elementId, data) {
    const element = document.getElementById(elementId);
    const barChartToggle = document.getElementById("barChartToggle");
    barChartToggle.setAttribute("aria-pressed", this.#isSurvivorsOnly);

    barChartToggle.addEventListener("click", (e) => {
      const button = e.target.classList.contains("toggle-button")
        ? e.target
        : e.target.closest(".toggle-button");

      this.#isSurvivorsOnly = !this.#isSurvivorsOnly;

      button.setAttribute("aria-pressed", this.#isSurvivorsOnly);

      if (this.#isSurvivorsOnly) {
        this.#updateChart(this.#ageGroupBucketsSurvivors);
      } else {
        this.#updateChart(this.#ageGroupBuckets);
      }
    });

    const ageGroupTitles = this.#ageGroups.map(
      (ageGroup) => ageGroup.groupTitle
    );

    const passengersWithAge = data.filter(
      (passenger) => passenger.Age !== null
    );

    this.#ageGroupBuckets = this.#ageGroups.map(({ groupTitle, min, max }) => {
      return {
        groupTitle,
        passengers: passengersWithAge.filter(
          (passenger) => passenger.Age >= min && passenger.Age <= max
        ),
      };
    });

    this.#ageGroupBucketsSurvivors = this.#ageGroupBuckets.map(
      (ageGroupBucket) => {
        return {
          groupTitle: ageGroupBucket.groupTitle,
          passengers: ageGroupBucket.passengers.filter(
            (passenger) => passenger.Survived === 1
          ),
        };
      }
    );

    const ageAxisScale = this.#ageGroupBuckets.reduce(
      (maxLength, ageGroupBucket) => {
        return Math.max(maxLength, ageGroupBucket.passengers.length);
      },
      0
    );

    const ageAxisScaleRounded = Math.ceil(ageAxisScale / 100) * 100;

    this.#x = d3
      .scaleBand()
      .domain(ageGroupTitles)
      .range([this.#marginLeft, this.#width - this.#marginRight])
      .padding(0.3);

    this.#y = d3
      .scaleLinear()
      .domain([0, ageAxisScaleRounded])
      .range([this.#height - this.#marginBottom, this.#marginTop]);

    this.#svg = d3
      .create("svg")
      .attr("viewBox", [0, 0, this.#width, this.#height])
      .attr("class", "chart");

    this.#svg
      .append("g")
      .selectAll()
      .data(this.#ageGroupBuckets)
      .enter()
      .append("rect")
      .attr("class", "chart-bar")
      .attr("x", (d) => this.#x(d.groupTitle))
      .attr("y", (d) => this.#y(d.passengers.length))
      .attr("width", this.#x.bandwidth())
      .attr(
        "height",
        (d) => this.#height - this.#y(d.passengers.length) - this.#marginBottom
      );

    this.#svg
      .append("g")
      .selectAll()
      .data(this.#ageGroupBuckets)
      .enter()
      .append("text")
      .attr("class", "chart-label")
      .attr("x", (d) => this.#x(d.groupTitle) + this.#x.bandwidth() / 2)
      .attr("y", (d) => this.#y(d.passengers.length) - 10)
      .text((d) => d.passengers.length);

    this.#svg
      .append("g")
      .attr("class", "chart-axis")
      .attr("transform", `translate(0,${this.#height - this.#marginBottom})`)
      .call(d3.axisBottom(this.#x));

    this.#svg
      .append("g")
      .attr("class", "chart-axis")
      .attr("transform", `translate(${this.#marginLeft},0)`)
      .call(d3.axisLeft(this.#y));

    element.append(this.#svg.node());
  }

  #updateChart(data) {
    this.#svg
      .selectAll(".chart-bar")
      .data(data)
      .transition()
      .duration(500)
      .attr("y", (d) => this.#y(d.passengers.length))
      .attr(
        "height",
        (d) => this.#height - this.#y(d.passengers.length) - this.#marginBottom
      );

    this.#svg
      .selectAll(".chart-label")
      .data(data)
      .transition()
      .duration(500)
      .attr("y", (d) => this.#y(d.passengers.length) - 5)
      .text((d) => d.passengers.length);
  }
}
