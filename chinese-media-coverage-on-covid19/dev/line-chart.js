
var smallScreen = window.innerWidth < 500 ? true : false;

var lineMargin = {top: 50, right: 50, bottom: 20, left: 50},
    lineWidth = document.querySelector("#use-of-word-chart").clientWidth,
    lineHeight = document.querySelector("#use-of-word-chart").clientHeight,
    boundedHeight = lineHeight - lineMargin.top - lineMargin.bottom,
    boundedWidth = lineWidth - lineMargin.left - lineMargin.right; 

var lineChartTitle = d3.select(".line-chart-title")
  .style("transform", `translate(${lineMargin.left+20}px,${lineMargin.top/2}px)`);

var useOfWordChartSvg = d3.select("#use-of-word-chart").append("svg").attr("id", "useOfWordChartSvg");

useOfWordChartSvg.attr("height", lineHeight)
  .attr("width", lineWidth);

var lineXScale = d3.scaleTime()
    .range([0, boundedWidth]),
    lineYScale = d3.scaleLinear()
    .range([boundedHeight, 0]);

var x, y, r;

d3.queue()
.defer(d3.csv, "data/daily_top_words_percentage.csv")
.await(function(error, dataOne){

  // console.log(dataOne)

  if (error) throw error;

  dataOne = dataOne.filter(function(d){
    return d.word == "china" || d.word == "coronavirus" || d.word == "covid19"
          || d.word == "cases" || d.word == "total" || d.word == "number" || d.word == "deaths"
  })

  var parseDate = d3.timeFormat("%Y-%m-%d");

  dataOne.forEach(function(d){

      d.date = new Date(d.new_date_x);
      d.word_count = +d.word_count;
      d.percentage = +d.percentage; 
  })

  drawLineChart(dataOne)

  function drawLineChart(data) {

    // console.log(data)

    lineXScale.domain(d3.extent(data, d => d.date)).nice(); 
    lineYScale.domain(d3.extent(data, d => d.percentage));

    var color = d3.scaleOrdinal()
      .domain(["china", "coronavirus", "covid19", "cases", "total", "number", "deaths"])
      .range(["#D36135", "#875D9A", "#61D3A5", "#E9D985", "#6A8E7F", "#D0CFEC", "#B7B3A1"])


    multiLineData = color.domain()
      .map(function(name){
        ls = [];
        data.map(function(d) {
              if (d.word == name) {
                ls.push({
                  "date": d.date, 
                  "percentage": +d.percentage
                })
              }
          });
        
        return {
            name: name,
            values: ls
        }
      })

    // console.log(multiLineData)

    var yAxis = d3.axisLeft()
            .scale(lineYScale)
            .tickFormat(d3.format(",.1%"));
            
    var xAxis = d3.axisBottom()
            .scale(lineXScale);

    var lineGenerator = d3.line()
      .x(function(d){ 
          return lineXScale(d.date); 
        })
      .y(function(d){ 
         if (typeof(lineYScale(+d.percentage)) == "number"){
          return lineYScale(+d.percentage); 
        } else {
          return false;
        }
      })
      .curve(d3.curveCatmullRom)
    
  
  var lineGroup = useOfWordChartSvg.append("g")
    .attr("class","lineGroup")
    .attr("transform",`translate(${lineMargin.left},${lineMargin.top})`);
    
    // Draw the lines
  var lines = lineGroup.selectAll(".lines")
    .data(multiLineData)
    .enter().append("g")
    .attr("class", "lines");

  lines.append("path")
    .attr("class", "line")
    .attr("id", d => d.name)
    .attr("d", function(d) {
      return lineGenerator(d.values);
    })
    .attr("fill", "none")
    .style("stroke", function(d) {
      return color(d.name);
    })
    .attr("stroke-width", "2px")
    .style("opacity", 0);
    

    lineGroup.append("g")
      .attr("class","line-axis line-x-axis")
      .attr("transform","translate(0,"+boundedHeight+")")
      .call(smallScreen ? xAxis.ticks(3) : xAxis);
    lineGroup.append("g")
      .attr("class","line-axis line-y-axis")
      .call(yAxis);
  }

})


var $useOfWord1 = $("#use-of-word1");
var $useOfWord2 = $("#use-of-word2");
var $useOfWord3 = $("#use-of-word3");
var $useOfWord4 = $("#use-of-word4");

$useOfWord1.waypoint(function (direction){

        if (direction == "down"){
            $("p#use-of-word1").addClass("right-paragraph-full-opacity");

        }

        if (direction == "up"){
            $("p#use-of-word1").removeClass("right-paragraph-full-opacity");
        }

}, {offset: smallScreen ? "80%" : "60%"})



$useOfWord2.waypoint(function (direction){

        if (direction == "down"){
            $("p#use-of-word2").addClass("right-paragraph-full-opacity");
            d3.select("#china").style("opacity", 1);

            lineChartTitle.html(`Use of <span id='china-legend'>China</span> over time`);


        }

        if (direction == "up"){
            $("p#use-of-word2").removeClass("right-paragraph-full-opacity");
            d3.selectAll(".line").style("opacity", 0);
            lineChartTitle.html(` `);
        }

}, {offset: smallScreen ? "80%" : "60%"})


$useOfWord3.waypoint(function (direction){

        if (direction == "down"){
            $("p#use-of-word3").addClass("right-paragraph-full-opacity");
            d3.selectAll(".line").style("opacity", 0);
            d3.select("#covid19").style("opacity", 1);
            d3.select("#coronavirus").style("opacity", 1);
          
            lineChartTitle.html(`Use of <span id='coro-legend'>coronavirus</span> and 
              <span id="covid-legend">covid-19</span> over time`);
        
        }

        if (direction == "up"){
            $("p#use-of-word3").removeClass("right-paragraph-full-opacity");
            d3.selectAll(".line").style("opacity", 0);
            d3.select("#china").style("opacity", 1);
            
            lineChartTitle.html(`Use of <span id='china-legend'>China</span> over time`);
        }

}, {offset: smallScreen ? "80%" : "40%"})


$useOfWord4.waypoint(function (direction){

        if (direction == "down"){
            $("p#use-of-word4").addClass("right-paragraph-full-opacity");
            d3.selectAll(".line").style("opacity", 0);
            d3.select("#cases").style("opacity", 1);
            d3.select("#total").style("opacity", 1);
            d3.select("#number").style("opacity", 1);
            d3.select("#deaths").style("opacity", 1);

            lineChartTitle.html(`Use of <span id='cases-legend'>cases</span>, 
              <span id='total-legend'>total</span>, 
              <span id='num-legend'>number</span> and 
              <span id='deaths-legend'>deaths</span> over time`);

        }

        if (direction == "up"){
            $("p#use-of-word4").removeClass("right-paragraph-full-opacity");
            d3.selectAll(".line").style("opacity", 0);
            d3.select("#covid19").style("opacity", 1);
            d3.select("#coronavirus").style("opacity", 1);
             lineChartTitle.html(`Use of <span id='coro-legend'>coronavirus</span> and 
              <span id="covid-legend">covid-19</span> over time`);

        }

}, {offset: smallScreen ? "80%" : "40%"})



