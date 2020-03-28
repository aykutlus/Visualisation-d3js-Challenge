# Spain COVID-19 Visualisation

In below map, infected cases are shown by color and circles. With button, it can be seen evaluation of confirmed cases in Spain. 

![Screen Shot 2020-03-28 at 12 47 22](https://user-images.githubusercontent.com/35189163/77822655-06b44f80-70f5-11ea-9e1b-878e45a7ed1f.png)

# Installation

==> Run npm install on your visual studio to insall 

# Visualisation

==> Run npm start to see the map

# Explanation

Calculation of radius' circles                                                                                                 
```
const calculateRadiusBasedOnAffectedCases = (comunidad: string, data: Numbers[]) => {
  const entry = data.find(item => item.name === comunidad);

  /*const maxAffected = data.reduce(
    (max, item) => (item.value > max ? item.value : max),
    0
  );*/

  const affectedRadiusScale = d3
    .scaleLinear()
    .domain([0, 9000])
    .range([5, 40]); // 50 pixel max radius, we could calculate it relative to width and height

  return entry ? affectedRadiusScale(entry.value) : 0;
};
```
MaxAffecfed case could be calculated and put it to the domain scale but in this case I preferred giving its value by hand.

Changing color
```
const changecolorbasedoninfectedcase = (comunidad: String, data: Numbers[]) => {

  const entry = data.find(item => item.name === comunidad);

  console.log(entry)

  var colorScheme = d3.schemePurples[7];
  var color = d3.scaleThreshold()
    .domain([0, 1, 10, 50, 100, 500])
    .range(<any>colorScheme);

  return entry ? color(entry.value) : color(0);
};
```

Update circles 
```
const updateCircles = (data: Numbers[]) => {
  const circles = svg.selectAll("circle");
  circles
    .data(latLongCommunities)
    .merge(circles as any)
    .transition()
    .duration(500)
    .attr("r", d => calculateRadiusBasedOnAffectedCases(d.name, data))
};
```

Update color 
```
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
```

Application of update color and circles
```
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
  ```
 



