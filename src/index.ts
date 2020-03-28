import * as d3 from "d3";
import * as topojson from "topojson-client";
const portugaljson = require("./portugal.json");
const d3Composite = require("d3-composite-projections");

import { latLongCommunities } from "./communities";
import { initial, now, Numbers } from "./stats";


const svg = d3
  .select("body")
  .append("svg")
  .attr("width", 1024)
  .attr("height", 800)
  .attr("style", "background-color: #FBFAF0");

const aProjection = d3Composite
.geoConicConformalPortugal()
.scale(7000)
.translate([300, 400]);


const geoPath = d3.geoPath().projection(aProjection)

const geojson = topojson.feature(portugaljson, portugaljson.objects.PRT_adm1);



  const calculateRadiusBasedOnAffectedCases = (comunidad: string, data: Numbers[]) => {
    const entry = data.find(item => item.name === comunidad);
  
    /*const maxAffected = data.reduce(
      (max, item) => (item.value > max ? item.value : max),
      0
    );*/
  
    const affectedRadiusScale = d3
      .scaleLinear()
      .domain([0, 9000])
      .range([3, 40]); // 50 pixel max radius, we could calculate it relative to width and height
  
    return entry ? affectedRadiusScale(entry.value) : 0;
  };
  
  
  const changecolorbasedoninfectedcase = (comunidad: String, data: Numbers[]) => {
  
    const entry = data.find(item => item.name === comunidad);
  
    console.log(entry)
  
    var colorScheme = d3.schemeBlues[7];
    var color = d3.scaleThreshold()
      .domain([0, 1, 10, 50, 100, 500])
      .range(<any>colorScheme);
  
    return entry ? color(entry.value) : color(0);
  };

  svg
  .selectAll("path")
  .data(geojson["features"])
  .enter()
  .append("path")
  .attr("class", "country")
  // data loaded from json file
  .attr("d", geoPath as any)
  .style("fill", function (d: any) {
    return changecolorbasedoninfectedcase(d.properties.NAME_1, initial);
  })

  svg
  .selectAll("circle")
  .data(latLongCommunities)
  .enter()
  .append("circle")
  .attr("class", "affected-marker")
  .attr("r", d => calculateRadiusBasedOnAffectedCases(d.name, initial))
  .attr("cx", d => aProjection([d.long, d.lat])[0])
  .attr("cy", d => aProjection([d.long, d.lat])[1])


//update circles
const updateCircles = (data: Numbers[]) => {
  const circles = svg.selectAll("circle");
  circles
    .data(latLongCommunities)
    .merge(circles as any)
    .transition()
    .duration(500)
    .attr("r", d => calculateRadiusBasedOnAffectedCases(d.name, data))
};

//update color
const updateColor = (data: Numbers[]) => {
  console.log("updateColor");
  const pathCollection = svg.selectAll("path");
  pathCollection
    .data(geojson["features"])
    .enter()
    .merge(pathCollection as any)
    .style("fill", function (d: any) {
      console.log(d);
      return changecolorbasedoninfectedcase(d.properties.NAME_1, data);
    })
    // data loaded from json file
    .attr("d", geoPath as any);
};

document
  .getElementById("Initial date")
  .addEventListener("click", function handleResultsInitial() {
    updateCircles(initial)
    updateColor(initial)
  });

document
  .getElementById("Now")
  .addEventListener("click", function handleResultsNow() {
    updateCircles(now)
    updateColor(now)
  });
  