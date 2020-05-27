//Code for triangular scatterplot is based on https://bl.ocks.org/cmgiven/a0f58034cea5331a814b30b74aacb8af

var smallScreen = window.innerWidth < 500 ? true : false;
var width =  document.querySelector("#triangle-graph").clientWidth * 0.95;
var margin = { 
        top: smallScreen ? 2*width/24 : 1.25*width/24, 
        bottom: smallScreen ? 4*width/24 : 6*width/24, 
        left: smallScreen ? -15 : 50, 
        right: smallScreen ? 50 : 150 }

var height = document.querySelector("#triangle-graph").clientHeight - margin.top - margin.bottom
var side = height * 2 / Math.sqrt(3)

var svg = d3.select("#triangle-graph")
    .append("svg")
    .attr("width", width)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("class", "triangle-point-group")
    .attr("transform", `translate(${(width - side) / 2}, ${(margin.top + 0.5)})`)


var tooltip = d3.select("#triangle-tooltip")

var sideScale = d3.scaleLinear()
    .domain([0, 1])
    .range([0, side])

var perpScale = d3.scaleLinear()
    .domain([0, 1])
    .range([height, 0])

var r = d3.scaleSqrt().range([smallScreen ? 1 : 2, smallScreen ? 11 : 18]);

var axis = d3.axisLeft()
    .scale(perpScale)
    // .tickFormat(function (n) { return (n * 100).toFixed(0) })
    // .tickSize(side * -0.3)
    // .tickPadding(5)

var axes = svg.selectAll(".axis")
    .data(["i", "ii", "iii"])
    .enter().append("g")
    .attr("class", function (d) { return "axis " + d })
    .attr("transform", function (d) {
        return d === "iii" ? ""
            : "rotate(" + (d === "i" ? 240 : 120) + "," + (side * 0.5) + "," + (height / 3 * 2) + ")"
    })
    .call(axis)

axes.selectAll(".tick")
    .append("line")
    .attr("class", "grid")
    .attr("x1", function (d) { return side * (d * 0.5) })
    .attr("x2", function (d) { return side * (-d * 0.5 + 1) })
    .attr("y1", 0)
    .attr("y2", 0)


var label = svg.selectAll(".label")
    .data(["i", "ii", "iii"])
    .enter().append("text")
    .attr("class", "label")
    .attr("id", function(d){
      return String(d);
    })
    .attr("transform", function(d){
        if(d === "i"){
                return `translate(${-(width)/2 + 15}, ${height + 25})`
        }
        else if (d === "ii") {
                 return `translate(${(width)/2 - 15}, ${height + 25})`
        }
        else {
            return `translate(0, -5)`
        }
    })
    .attr("x", side * 0.5)
    .attr("y", -6)
    .attr("text-anchor", "middle")
    .attr("letter-spacing", "-8px")
    .text(function (d) { 
            if(d == "i") {
                return "China & others"
            }
            else if (d == "ii"){
                return "Countries not China"
            }
            else {
                return "Only China"
            }
         })

var colorRange = ["#f5ccba", "#f5e1ab", "#e8926d", "#f08a2b","#c2420f"] 
var linearGradient1 = svg.append("defs")
            .append("linearGradient")
            .attr("id", "linear-gradient1")
            .attr("gradientUnits", "userSpaceOnUse")
            .attr("x1", "0%")
            .attr("y1", "0%")
            .attr("x2", "100%")
            .attr("y2", "0%");

var linearGradient1Back = svg.append("defs")
            .append("linearGradient")
            .attr("id", "linear-gradient1-back")
            .attr("gradientUnits", "userSpaceOnUse")
            .attr("x1", "100%")
            .attr("y1", "0%")
            .attr("x2", "0%")
            .attr("y2", "0%");
            
var linearGradient2 = svg.append("defs")
            .append("linearGradient")
            .attr("id", "linear-gradient2")
            .attr("gradientUnits", "userSpaceOnUse")
            .attr("x1", "0%")
            .attr("y1", "0%")
            .attr("x2", "100%")
            .attr("y2", "0%");

var linearGradient2Back = svg.append("defs")
            .append("linearGradient")
            .attr("id", "linear-gradient2-back")
            .attr("gradientUnits", "userSpaceOnUse")
            .attr("x1", "100%")
            .attr("y1", "0%")
            .attr("x2", "0%")
            .attr("y2", "0%");

        linearGradient1.append("stop")
            .attr("offset", "0%")
            .attr("stop-color", colorRange[0]);

   
        linearGradient1.append("stop")
            .attr("offset", "100%")
            .attr("stop-color", colorRange[2]);

        linearGradient1Back.append("stop")
            .attr("offset", "0%")
            .attr("stop-color", colorRange[0]);


        linearGradient1Back.append("stop")
            .attr("offset", "100%")
            .attr("stop-color", colorRange[2]);

        linearGradient2.append("stop")
            .attr("offset", "0%")
            .attr("stop-color", colorRange[2]);
        

        linearGradient2.append("stop")
            .attr("offset", "100%")
            .attr("stop-color", colorRange[4]);

        linearGradient2Back.append("stop")
            .attr("offset", "0%")
            .attr("stop-color", colorRange[2]);

        linearGradient2Back.append("stop")
            .attr("offset", "100%")
            .attr("stop-color", colorRange[4]);

var groupWord;
var circleOpac = 0.6;
var lineOpac = 0.2;
var hoveredCircleOpac = 0.9;
var hoveredLineOpac = 0.5;


d3.queue()
.defer(d3.csv, "data/monthly_onlyworld_onlychina_chinaandothers_percent.csv")
.defer(d3.csv, "data/tweet_group_word_count.csv")
.await(function(error, data, data2){

   if (error) { throw error }

   if (smallScreen) { 
        data = data.slice(0,453)
        d3.selectAll(".number-of-top-word").html("151")
   } else {
        data = data;
   }

   var jan = data.filter(function(d){return d.dateall == "2020-01"})
   var feb = data.filter(function(d){return d.dateall == "2020-02"})
   var mar = data.filter(function(d){return d.dateall == "2020-03"})

   var janChinaTotalWordCount =  +data2[0].only_china_word_count,
       febChinaTotalWordCount = +data2[1].only_china_word_count,
       marChinaTotalWordCount = +data2[2].only_china_word_count,
       janOthersTotalWordCount = +data2[0].only_world_word_count,
       febOthersTotalWordCount = +data2[1].only_world_word_count,
       marOthersTotalWordCount = +data2[2].only_world_word_count,
       janChinaAndOthersTotalWordCount = +data2[0].china_andothers_word_count, 
       febChinaAndOthersTotalWordCount = +data2[1].china_andothers_word_count,
       marChinaAndOthersTotalWordCount = +data2[2].china_andothers_word_count

    jan.forEach(function(d){
        var i = +d.count_in_china_andothers * janChinaTotalWordCount * janOthersTotalWordCount
        var ii = +d.count_in_onlyworld * janChinaTotalWordCount * janChinaAndOthersTotalWordCount
        var iii = +d.count_in_onlychina * janOthersTotalWordCount * janChinaAndOthersTotalWordCount
        var total = (+d.count_in_china_andothers)+(+d.count_in_onlyworld) +(+d.count_in_onlychina)
        var normalizedTotal = i + ii + iii
        var iShare = i / normalizedTotal
        var iiShare = ii / normalizedTotal
        var iiiShare = iii / normalizedTotal
        var date = d.dateall
        var word = d.word_in_all

        d.date = date
        d.word = word
        d.total = total
        d.normalizedTotal = normalizedTotal
        d.i = i
        d.ii = ii
        d.iii = iii
        d.iShare = iShare
        d.iiShare = iiShare
        d.iiiShare = iiiShare
        d.x = iiShare + (iiiShare * 0.5)
    })

    feb.forEach(function(d){
        var i = +d.count_in_china_andothers * febChinaTotalWordCount * febOthersTotalWordCount
        var ii = +d.count_in_onlyworld * febChinaTotalWordCount * febChinaAndOthersTotalWordCount
        var iii = +d.count_in_onlychina * febOthersTotalWordCount * febChinaAndOthersTotalWordCount
        var total = (+d.count_in_china_andothers)+(+d.count_in_onlyworld) +(+d.count_in_onlychina)
        var normalizedTotal = i + ii + iii
        var iShare = i / normalizedTotal
        var iiShare = ii / normalizedTotal
        var iiiShare = iii / normalizedTotal
        var date = d.dateall
        var word = d.word_in_all

        d.date = date
        d.word = word
        d.total = total
        d.normalizedTotal = normalizedTotal
        d.i = i
        d.ii = ii
        d.iii = iii
        d.iShare = iShare
        d.iiShare = iiShare
        d.iiiShare = iiiShare
        d.x = iiShare + (iiiShare * 0.5)
    })
    mar.forEach(function(d){
        var i = +d.count_in_china_andothers * marChinaTotalWordCount * marOthersTotalWordCount
        var ii = +d.count_in_onlyworld * marChinaTotalWordCount * marChinaAndOthersTotalWordCount
        var iii = +d.count_in_onlychina * marOthersTotalWordCount * marChinaAndOthersTotalWordCount
        var total = (+d.count_in_china_andothers)+(+d.count_in_onlyworld) +(+d.count_in_onlychina)
        var normalizedTotal = i + ii + iii
        var iShare = i / normalizedTotal
        var iiShare = ii / normalizedTotal
        var iiiShare = iii / normalizedTotal
        var date = d.dateall
        var word = d.word_in_all

        d.date = date
        d.word = word
        d.total = total
        d.normalizedTotal = normalizedTotal
        d.i = i
        d.ii = ii
        d.iii = iii
        d.iShare = iShare
        d.iiShare = iiShare
        d.iiiShare = iiiShare
        d.x = iiShare + (iiiShare * 0.5)
    })


   r.domain([d3.min(jan, function(d){return +d.normalizedTotal}), d3.max(mar, function (d) { return +d.normalizedTotal })])

    var uniqueWord = data.map(item => item.word)
        .filter((value, index, self) => self.indexOf(value) === index);

    array = [];

    uniqueWord.forEach(function(w){
        for (var j = 0; j < jan.length; j++){
            if (w == jan[j].word) { 
                array.push({
                    "word": jan[j].word,
                    "janCount": jan[j].total,
                    "nmlzdJanCount": jan[j].normalizedTotal,
                    "x1": jan[j].x,
                    "y1": jan[j].iiiShare
                })
            }
         }
         for (var j = 0; j < feb.length; j++){
            if (w == feb[j].word) { 
                array.push({
                    "word": feb[j].word,
                    "febCount": feb[j].total,
                    "nmlzdFebCount": feb[j].normalizedTotal,
                    "x2": feb[j].x,
                    "y2": feb[j].iiiShare
                })
            }
         }
         for (var j = 0; j < mar.length; j++){
            if (w == mar[j].word) { 
                array.push({
                    "word": mar[j].word,
                    "marCount": mar[j].total,
                    "nmlzdMarCount": mar[j].normalizedTotal,
                     "x3": mar[j].x,
                     "y3": mar[j].iiiShare
                        
                })
            }
         }
    })


    groupWord = _(array)
          .groupBy("word")
          .map(_.spread(_.assign))
          .value();

    // console.log(groupWord)

    svg.selectAll(".first-part-line")
       .data(groupWord, function(d){return d.word;})
       .enter()
       .append("line")
       .attr("class", "first-part-line")
       .attr("x1", function(d){
            if (isNaN(d.x1) == false) {
                return sideScale(d.x1)
            } else {
                return 0
            }
            
        })
       .attr("y1", function(d){

         if (isNaN(d.y1) == false) {
                return perpScale(d.y1)
            } else {
                return 0
            }
        })
       .attr("x2", function(d){

        if (isNaN(d.x2) == false) {
                return sideScale(d.x2)
            } else {
                return 0
            }
            
        })
       .attr("y2", function(d){
        if (isNaN(d.y2) == false) {
                return perpScale(d.y2)
            } else {
                return 0
            }
            
        })
       .attr("stroke", function(d){

            if (isNaN(d.x1)||isNaN(d.y1)||isNaN(d.x2)||isNaN(d.y2)){
                return "none"
            }
            else {
                if(sideScale(d.x1) > sideScale(d.x2)){
                    return "url(#linear-gradient1-back)" 
                } else {
                    return "url(#linear-gradient1)" 
                }
                 
            }
       })
       .attr("stroke-width", function(d){
            return  r(d.nmlzdJanCount)*2
       })
       .append("title")
       .text(function (d) { return d.word })

    svg.selectAll(".second-part-line")
       .data(groupWord, function(d){return d.word;})
       .enter()
       .append("line")
       .attr("class", "second-part-line")
        .attr("x1", function(d){
            if (isNaN(d.x2) == false) {
                return sideScale(d.x2)
            } else {
                return 0
            }
            
        })
       .attr("y1", function(d){

         if (isNaN(d.y2) == false) {
                return perpScale(d.y2)
            } else {
                return 0
            }
        })
       .attr("x2", function(d){

        if (isNaN(d.x3) == false) {
                return sideScale(d.x3)
            } else {
                return 0
            }
            
        })
       .attr("y2", function(d){
        if (isNaN(d.y3) == false) {
                return perpScale(d.y3)
            } else {
                return 0
            }
            
        })
       .attr("stroke", function(d){

            if (isNaN(d.x3)||isNaN(d.y3)||isNaN(d.x2)||isNaN(d.y2)){
                return "none"
            }
             else{
                if(sideScale(d.x2) > sideScale(d.x3)){
                   return "url(#linear-gradient2-back)" 

                } else {
                    return "url(#linear-gradient2)" 
                }
            }
            
       })
       .attr("stroke-width", function(d){
            return  r(d.nmlzdFebCount)*2
       })
       .append("title")
       .text(function (d) { return d.word })

       var janPoint = svg.selectAll(".jan-point")
        .data(jan)
        .enter().append("circle")
        .attr("class", "corpus-node jan-point")
        
        var febPoint = svg.selectAll(".feb-point")
        .data(feb)
        .enter().append("circle")
        .attr("class", "corpus-node feb-point");


        var marPoint = svg.selectAll(".mar-point")
        .data(mar)
        .enter().append("circle")
        .attr("class", "corpus-node mar-point")
        

       d3.selectAll(".corpus-node").style("opacity", 0)
        .attr("cx", function (d) { 
            if(isNaN(sideScale(d.x)) == false) {
                return sideScale(d.x) 
            }
        })
        .attr("cy", function (d) { 
            if(isNaN(perpScale(d.iiiShare))==false) {
                return perpScale(d.iiiShare)
            }
         })
        .attr("fill", function(d){
                return  colorRange[4]

        })
        .append("title")
        .text(function (d) { return d.word });


        var colorLegend = svg.append("g")
                            .attr("class", "rect-color-legend")
                            .attr("transform", `translate(${margin.left}, ${margin.top})`)
                            .style("opacity", 0);

        var janLegend = colorLegend.append("g")
            janLegend.append("rect")
                .attr("width", 25)
                .attr("height", 10)
                .attr("fill", colorRange[0])
                .style("opacity", circleOpac+0.2);
            janLegend.append("text")
                .text("January")
                .attr("x", 30)


        var febLegend = colorLegend.append("g")
            febLegend.append("rect")
                .attr("width", 25)
                .attr("height", 10)
                .attr("y", 20)
                .attr("fill", colorRange[2])
                .style("opacity", circleOpac+0.2);
            febLegend.append("text")
                .text("February")
                .attr("x", 30)
                .attr("y", 20)

        var marLegend = colorLegend.append("g")
            marLegend.append("rect")
                .attr("width", 25)
                .attr("height", 10)
                .attr("y", 40)
                .attr("fill", colorRange[4])
                .style("opacity", circleOpac+0.2);
            marLegend.append("text")
                .text("March")
                .attr("x", 30)
                .attr("y", 40)


        // var colorLegendHeight = document.querySelector(".rect-color-legend").getBBox().height;


        var sizeLegend = svg.append("g")
                            .attr("class", "circle-size-legend")
                            .attr("transform", `translate(${side-margin.right}, ${margin.top})`)
                            .style("opacity", 0)

        var small = sizeLegend.append("g")
            small.append("circle")
                    .attr("r", 3)
            small.append("text")
                .text("Used less")
                .attr("x", 15)

        var medium = sizeLegend.append("g")
            medium.append("circle")
                    .attr("r", 5)
                    .attr("cy", 5+14)
            medium.append("text")
                .attr("y", 3+5+14)
                .attr("x", 15)

       var large = sizeLegend.append("g");
            large.append("circle")
                    .attr("r", 10)
                    .attr("cy", 3+5+10+28);
            large.append("text")
                .text("Used more")
                .attr("y", 3+5+10+28)
                .attr("x", 15);

        var triangleTooltipHeight = document.querySelector("#triangle-tooltip").getBoundingClientRect().height;
        var triangleSvgHeight = document.querySelector("#triangle-graph svg").getBoundingClientRect().height;

        d3.select("#triangle-graph-container")
            .style("height", `${triangleTooltipHeight+triangleSvgHeight}px`);

})


var $corpusWord1 = $("#corpus-chart1-1");
var $corpusWord21 = $("#corpus-chart1-2-1");
var $corpusExplain = $("#corpus-chart-explain");
var $corpusWord22 = $("#corpus-chart1-2-2");
var $corpusWord23 = $("#corpus-chart1-2-3");
var $corpusWord24 = $("#corpus-chart1-2-4");
var $corpusWord3 = $("#corpus-chart1-3");
var $corpusWord4 = $("#corpus-chart1-4");
var $corpusWord5 = $("#corpus-chart1-5");
var $corpusWord6 = $("#corpus-chart1-6");
var $corpusWord7 = $("#corpus-chart1-7");
var $corpusWord8 = $("#corpus-chart1-8");
var $corpusWord9 = $("#corpus-chart1-9");
var $corpusWord10 = $("#corpus-chart1-10");
var $corpusWord11 = $("#corpus-chart1-11");
var $corpusWord12 = $("#corpus-chart1-12");
var $corpusWord13 = $("#corpus-chart1-13");
var $corpusWord14 = $("#corpus-chart1-14");
var $corpusWord15 = $("#corpus-chart1-15");
var $corpusWord16 = $("#corpus-chart1-16");
var $corpusWord17 = $("#corpus-chart1-17");

$corpusWord1.waypoint(function (direction){

        if (direction == "down"){
            $("p#corpus-chart1-1").addClass("right-paragraph-full-opacity");
        }

        if (direction == "up"){
            $("p#corpus-chart1-1").removeClass("right-paragraph-full-opacity");
            d3.selectAll(".line").style("opacity", 0);
            d3.select("#cases").style("opacity", 1);
            d3.select("#total").style("opacity", 1);
            d3.select("#number").style("opacity", 1);
            d3.select("#deaths").style("opacity", 1);
            d3.selectAll(".corpus-node")
                .attr("r", 0)
        }

}, {offset: smallScreen ? "90%" :"60%"})



$corpusWord21.waypoint(function (direction){

        if (direction == "down"){
            $("p#corpus-chart1-2-1").addClass("right-paragraph-full-opacity");
            d3.selectAll(".corpus-node")
                .transition()
                .duration(500)
                .attr("fill", "gray")
                .attr("r", function(d){
                     if(isNaN(sideScale(d.x)) == false || isNaN(perpScale(d.iiiShare))==false){
                        return  3;
                    }
                })
                .style("opacity", 0.2); 
        }

        if (direction == "up"){
            $("p#corpus-chart1-2-1").removeClass("right-paragraph-full-opacity");

              d3.selectAll(".corpus-node")
                .attr("r", 0);

        }

}, {offset: smallScreen ? "90%" :"60%"})

$corpusExplain.waypoint(function(direction){
  if(direction == "down"){
        $corpusExplain.addClass("right-paragraph-full-opacity");
        $("p#corpus-chart-explain").addClass("right-paragraph-full-opacity");
  } if (direction == "up") {
        $corpusExplain.removeClass("right-paragraph-full-opacity");
        $("p#corpus-chart-explain").removeClass("right-paragraph-full-opacity");
  }
}, {offset: smallScreen ? "90%" :"60%"})


$corpusWord22.waypoint(function (direction){

        if (direction == "down"){
            $("p#corpus-chart1-2-2").addClass("right-paragraph-full-opacity");
            d3.selectAll(".corpus-node")
                .transition()
                .duration(500)
                .attr("fill", function(d){
                    if (d.date == "2020-01"){
                        return colorRange[0]
                    }
                    else {
                        return "none"
                    }
                })
                .style("opacity", circleOpac); 

            d3.select(".rect-color-legend")
                .style("opacity", 1)
        }

        if (direction == "up"){
            $("p#corpus-chart1-2-2").removeClass("right-paragraph-full-opacity");

              d3.selectAll(".corpus-node")
                .transition()
                .duration(500)
                .attr("fill", "gray")
                .style("opacity", 0.2); 

             d3.select(".rect-color-legend")
                .style("opacity", 0)
        }

}, {offset: smallScreen ? "90%" :"60%"})

$corpusWord23.waypoint(function (direction){

        if (direction == "down"){
            $("p#corpus-chart1-2-3").addClass("right-paragraph-full-opacity");
            d3.selectAll(".corpus-node")
                .transition()
                .duration(500)
                .attr("fill", function(d){
                    if (d.date == "2020-01"){
                        return colorRange[0]
                    } 
                    else if (d.date == "2020-02") {
                        return colorRange[2]
                    }
                    else {
                        return colorRange[4]
                    }
                })
                .style("opacity", circleOpac); 
        }

        if (direction == "up"){
            $("p#corpus-chart1-2-3").removeClass("right-paragraph-full-opacity");

              d3.selectAll(".corpus-node")
                .transition()
                .duration(500)
                .attr("fill", function(d){
                    if (d.date == "2020-01"){
                        return colorRange[0]
                    }
                    else {
                        return "none"
                    }
                })
                .style("opacity", circleOpac); 
        }

}, {offset: smallScreen ? "90%" :"60%"})

$corpusWord24.waypoint(function (direction){

        if (direction == "down"){
            $("p#corpus-chart1-2-4").addClass("right-paragraph-full-opacity");
            d3.selectAll(".corpus-node")
                .transition()
                .duration(500)
                .attr("r", function(d){
                     if(isNaN(sideScale(d.x)) == false || isNaN(perpScale(d.iiiShare))==false){
                         return r(d.normalizedTotal)
                    }
                })
                .attr("fill", function(d){
                    if (d.date == "2020-01"){
                        return colorRange[0]
                    } 
                    else if (d.date == "2020-02") {
                        return colorRange[2]
                    }
                    else {
                        return colorRange[4]
                    }
                })
                .style("opacity", circleOpac); 

                d3.select(".circle-size-legend")
                    .style("opacity", 1)
        }

        if (direction == "up"){
            $("p#corpus-chart1-2-4").removeClass("right-paragraph-full-opacity");

             d3.selectAll(".corpus-node")
                .transition()
                .duration(500)
                .attr("r", function(d){
                     if(isNaN(sideScale(d.x)) == false || isNaN(perpScale(d.iiiShare))==false){
                        return  3;
                    }
                })
                .style("opacity", circleOpac); 

            d3.select(".circle-size-legend")
                    .style("opacity", 0)
        }

}, {offset: smallScreen ? "90%" :"60%"})


$corpusWord3.waypoint(function (direction){

        if (direction == "down"){
            $("p#corpus-chart1-3").addClass("right-paragraph-full-opacity");
            d3.selectAll(".corpus-node")
            .style("opacity", function(d){
                if(d.word == "wuhan" && d.date == "2020-01"){
                    return hoveredCircleOpac
                }
                else {
                    return 0;
                }
            });

        }

        if (direction == "up"){
          $("p#corpus-chart1-3").removeClass("right-paragraph-full-opacity");
            d3.selectAll(".corpus-node")
                .transition()
                .duration(500)
                .attr("r", function(d){
                     if(isNaN(sideScale(d.x)) == false || isNaN(perpScale(d.iiiShare))==false){
                         return r(d.normalizedTotal)
                    }
                })
                .style("opacity", circleOpac); 
        }

}, {offset: smallScreen ? "90%" :"60%"})


$corpusWord4.waypoint(function (direction){

        if (direction == "down"){
            $("p#corpus-chart1-4").addClass("right-paragraph-full-opacity");
            d3.selectAll(".corpus-node")
            .style("opacity", function(d){
                if(d.word == "wuhan"){
                    return hoveredCircleOpac
                }
                else {
                    return 0;
                }
            });
            

        }

        if (direction == "up"){
          $("p#corpus-chart1-4").removeClass("right-paragraph-full-opacity");
          $("p#corpus-chart1-3").addClass("right-paragraph-full-opacity");


             d3.selectAll(".corpus-node")
                .style("opacity", function(d){
                    if(d.word == "wuhan" && d.date == "2020-01"){
                        return hoveredCircleOpac
                    }
                    else {
                        return 0;
                    }
                });

                
        }

}, {offset: smallScreen ? "90%" :"60%"})

$corpusWord5.waypoint(function (direction){

        if (direction == "down"){
            $("p#corpus-chart1-5").addClass("right-paragraph-full-opacity");

        var selWord = "wuhan"

        d3.selectAll(".first-part-line")
            .style("opacity", function(e){
                if (e.word == selWord){
                    return hoveredLineOpac
                }
            })

        d3.selectAll(".second-part-line")
            .style("opacity", function(e){
                if (e.word == selWord){
                    return hoveredLineOpac
                }
            })

        var val = groupWord.find( function(item) { return item.word == selWord } );  

         tooltip.html(`
            <p>
            ${selWord}</br>
           Count in <span class="des-month" id="des-jan">Jan.</span> ${val.janCount}</br>
            Count in <span class="des-month"id="des-feb">Feb.</span> ${val.febCount}</br>
            Count in <span class="des-month"id="des-mar">Mar.</span> ${val.marCount}</br>
            </p>
            `)
          .style("opacity", 1);


        }

        if (direction == "up"){
          $("p#corpus-chart1-5").removeClass("right-paragraph-full-opacity");
          $("p#corpus-chart1-4").addClass("right-paragraph-full-opacity");
          
            tooltip.html("");
             d3.selectAll(".first-part-line")
            .style("opacity", 0)
            d3.selectAll(".second-part-line")
            .style("opacity", 0)

         d3.selectAll(".corpus-node")
            .style("opacity", function(d){
                if(d.word == "wuhan"){
                    return hoveredCircleOpac
                }
                else {
                    return 0;
                }
            });
        }

}, {offset: smallScreen ? "90%" :"60%"})

$corpusWord6.waypoint(function (direction){

        if (direction == "down"){
            $("p#corpus-chart1-6").addClass("right-paragraph-full-opacity");
            tooltip.html("");
             d3.selectAll(".first-part-line")
            .style("opacity", 0)
            d3.selectAll(".second-part-line")
            .style("opacity", 0)
             d3.selectAll(".corpus-node")
            .style("opacity", circleOpac)
            .attr("r", function(d){
                     if(isNaN(sideScale(d.x)) == false || isNaN(perpScale(d.iiiShare))==false){
                         return r(d.normalizedTotal)
                    }
                })
           .attr("fill", function(d){
                    if (d.date == "2020-01"){
                        return colorRange[0]
                    } 
                    else if (d.date == "2020-02") {
                        return colorRange[2]
                    }
                    else {
                        return colorRange[4]
                    }
                })
        }

        if (direction == "up"){
          $("p#corpus-chart1-6").removeClass("right-paragraph-full-opacity");

          d3.selectAll(".corpus-node")
            .style("opacity", function(d){
              if ((d.word == "wuhan")) {
                return hoveredCircleOpac;
              }
              else {
                return 0;
              }
            })
          var selWord = "wuhan"

          d3.selectAll(".first-part-line")
            .style("opacity", function(e){
                if (e.word == selWord){
                    return hoveredLineOpac
                }
            })

        d3.selectAll(".second-part-line")
            .style("opacity", function(e){
                if (e.word == selWord){
                    return hoveredLineOpac
                }
            })

        var val = groupWord.find( function(item) { return item.word == selWord } );       

         tooltip.html(`
            <p>
            ${selWord}</br>
           Count in <span class="des-month" id="des-jan">Jan.</span> ${val.janCount}</br>
            Count in <span class="des-month"id="des-feb">Feb.</span> ${val.febCount}</br>
            Count in <span class="des-month"id="des-mar">Mar.</span> ${val.marCount}</br>
            </p>
            `)
          .style("opacity", 1);
    }

}, {offset: smallScreen ? "90%" :"60%"})


$corpusWord7.waypoint(function (direction){

        if (direction == "down"){
            $("p#corpus-chart1-7").addClass("right-paragraph-full-opacity");
            d3.selectAll(".corpus-node")
            .style("opacity", function(d){
              if ((d.word == "confirmed")) {
                return hoveredCircleOpac;
              }
              else {
                return 0;
              }
            })
            var selWord = "confirmed"

           d3.selectAll(".first-part-line")
            .style("opacity", function(e){
                if (e.word == selWord){
                    return hoveredLineOpac
                }
            })

            d3.selectAll(".second-part-line")
            .style("opacity", function(e){
                if (e.word == selWord){
                    return hoveredLineOpac
                }
        })
            var val = groupWord.find( function(item) { return item.word == selWord } );       

         tooltip.html(`
            <p>
            ${selWord}</br>
           Count in <span class="des-month" id="des-jan">Jan.</span> ${val.janCount}</br>
            Count in <span class="des-month"id="des-feb">Feb.</span> ${val.febCount}</br>
            Count in <span class="des-month"id="des-mar">Mar.</span> ${val.marCount}</br>
            </p>
            `)
          .style("opacity", 1);
               

        }

        if (direction == "up"){
          $("p#corpus-chart1-7").removeClass("right-paragraph-full-opacity");
          $("p#corpus-chart1-6").addClass("right-paragraph-full-opacity"); 

          tooltip.html("");
          d3.selectAll(".first-part-line")
            .style("opacity", 0)
          d3.selectAll(".second-part-line")
            .style("opacity", 0)
          d3.selectAll(".corpus-node")
            .style("opacity", circleOpac)
            
        }

}, {offset: smallScreen ? "90%" :"60%"})

$corpusWord7.waypoint(function (direction){

        if (direction == "down"){

            d3.selectAll(".corpus-node")
            .style("opacity", function(d){
              if ((d.word == "cases")) {
                return hoveredCircleOpac;
              }
              else {
                return 0;
              }
            })
            var selWord = "cases"

           d3.selectAll(".first-part-line")
            .style("opacity", function(e){
                if (e.word == selWord){
                    return hoveredLineOpac
                } else {
                    return 0
                }
            })

            d3.selectAll(".second-part-line")
            .style("opacity", function(e){
                if (e.word == selWord){
                    return hoveredLineOpac
                }
                else {
                    return 0
                }
        })
            var val = groupWord.find( function(item) { return item.word == selWord } );       

         tooltip.html(`
            <p>
            ${selWord}</br>
           Count in <span class="des-month" id="des-jan">Jan.</span> ${val.janCount}</br>
            Count in <span class="des-month"id="des-feb">Feb.</span> ${val.febCount}</br>
            Count in <span class="des-month"id="des-mar">Mar.</span> ${val.marCount}</br>
            </p>
            `)
          .style("opacity", 1);
               
        }
        if (direction == "up"){

            d3.selectAll(".corpus-node")
            .style("opacity", function(d){
              if ((d.word == "confirmed")) {
                return hoveredCircleOpac;
              }
              else {
                return 0;
              }
            })
            var selWord = "confirmed"

           d3.selectAll(".first-part-line")
            .style("opacity", function(e){
                if (e.word == selWord){
                    return hoveredLineOpac
                } else {
                    return 0
                }
            })

            d3.selectAll(".second-part-line")
            .style("opacity", function(e){
                if (e.word == selWord){
                    return hoveredLineOpac
                }
                else {
                    return 0
                }
        })
            var val = groupWord.find( function(item) { return item.word == selWord } );       

         tooltip.html(`
            <p>
            ${selWord}</br>
           Count in <span class="des-month" id="des-jan">Jan.</span> ${val.janCount}</br>
            Count in <span class="des-month"id="des-feb">Feb.</span> ${val.febCount}</br>
            Count in <span class="des-month"id="des-mar">Mar.</span> ${val.marCount}</br>
            </p>
            `)
          .style("opacity", 1);
        }

}, {offset: smallScreen ? "70%" :"40%"})

$corpusWord8.waypoint(function (direction){

        if (direction == "down"){
            $("p#corpus-chart1-8").addClass("right-paragraph-full-opacity");
            
              tooltip.html("");
              d3.selectAll(".first-part-line")
                .style("opacity", 0)
              d3.selectAll(".second-part-line")
                .style("opacity", 0)

            d3.selectAll(".corpus-node")
            .style("opacity", function(d){
              if ((d.word == "confirmed") && d.date =="2020-01" || (d.word == "cases" && d.date =="2020-01")) {
                return hoveredCircleOpac;
              }
              else {
                return 0;
              }
            })
            
        }

        if (direction == "up"){
          $("p#corpus-chart1-8").removeClass("right-paragraph-full-opacity");
          $("p#corpus-chart1-7").addClass("right-paragraph-full-opacity");

         d3.selectAll(".corpus-node")
            .style("opacity", function(d){
              if ((d.word == "cases")) {
                return hoveredCircleOpac;
              }
              else {
                return 0;
              }
            })
            var selWord = "cases"

           d3.selectAll(".first-part-line")
            .style("opacity", function(e){
                if (e.word == selWord){
                    return hoveredLineOpac
                } else {
                    return 0
                }
            })

            d3.selectAll(".second-part-line")
            .style("opacity", function(e){
                if (e.word == selWord){
                    return hoveredLineOpac
                }
                else {
                    return 0
                }
        })
            var val = groupWord.find( function(item) { return item.word == selWord } );       

         tooltip.html(`
            <p>
            ${selWord}</br>
           Count in <span class="des-month" id="des-jan">Jan.</span> ${val.janCount}</br>
            Count in <span class="des-month"id="des-feb">Feb.</span> ${val.febCount}</br>
            Count in <span class="des-month"id="des-mar">Mar.</span> ${val.marCount}</br>
            </p>
            `)
          .style("opacity", 1);
               

        }

}, {offset: smallScreen ? "90%" :"60%"})


$corpusWord9.waypoint(function (direction){

        if (direction == "down"){
            $("p#corpus-chart1-9").addClass("right-paragraph-full-opacity");
            d3.selectAll(".corpus-node")
            .style("opacity", function(d){
              if ((d.word == "confirmed")|| (d.word == "cases")) {
                return hoveredCircleOpac;
              }
              else {
                return 0;
              }
            })
        }

        if (direction == "up"){
          $("p#corpus-chart1-9").removeClass("right-paragraph-full-opacity");
          $("p#corpus-chart1-8").addClass("right-paragraph-full-opacity");
          d3.selectAll(".corpus-node")
            .style("opacity", function(d){
              if ((d.word == "confirmed") && d.date =="2020-01" || (d.word == "cases" && d.date =="2020-01")) {
                return hoveredCircleOpac;
              }
              else {
                return 0;
              }
            })

        }

}, {offset: smallScreen ? "90%" :"60%"})



$corpusWord10.waypoint(function (direction){

        if (direction == "down"){
            $("p#corpus-chart1-10").addClass("right-paragraph-full-opacity");
            d3.selectAll(".corpus-node")
            .style("opacity", function(d){
              if ((d.word == "deaths")) {
                return hoveredCircleOpac;
              }
              else {
                return 0;
              }
            })

            var selWord = "deaths"

           d3.selectAll(".first-part-line")
            .style("opacity", function(e){
                if (e.word == selWord){
                    return hoveredLineOpac
                }
            })

            d3.selectAll(".second-part-line")
            .style("opacity", function(e){
                if (e.word == selWord){
                    return hoveredLineOpac
                }
        })
            var val = groupWord.find( function(item) { return item.word == selWord } );       

         tooltip.html(`
            <p>
            ${selWord}</br>
           Count in <span class="des-month" id="des-jan">Jan.</span> ${val.janCount}</br>
            Count in <span class="des-month"id="des-feb">Feb.</span> ${val.febCount}</br>
            Count in <span class="des-month"id="des-mar">Mar.</span> ${val.marCount}</br>
            </p>
            `)
          .style("opacity", 1);

        }

        if (direction == "up"){
          $("p#corpus-chart1-10").removeClass("right-paragraph-full-opacity");
          $("p#corpus-chart1-9").addClass("right-paragraph-full-opacity"); 

              tooltip.html("");
              d3.selectAll(".first-part-line")
                .style("opacity", 0)
              d3.selectAll(".second-part-line")
                .style("opacity", 0)
          

          d3.selectAll(".corpus-node")
            .style("opacity", function(d){
              if ((d.word == "confirmed")|| (d.word == "cases")) {
                return hoveredCircleOpac;
              }
              else {
                return 0;
              }
            })
            
        }

}, {offset: smallScreen ? "90%" :"60%"})

$corpusWord10.waypoint(function (direction){

        if (direction == "down"){
            d3.selectAll(".corpus-node")
            .style("opacity", function(d){
              if ((d.word == "died")) {
                return hoveredCircleOpac;
              }
              else {
                return 0;
              }
            })

            var selWord = "died"

           d3.selectAll(".first-part-line")
            .style("opacity", function(e){
                if (e.word == selWord){
                    return hoveredLineOpac
                }
            })

            d3.selectAll(".second-part-line")
            .style("opacity", function(e){
                if (e.word == selWord){
                    return hoveredLineOpac
                }
        })
            var val = groupWord.find( function(item) { return item.word == selWord } );       

         tooltip.html(`
            <p>
            ${selWord}</br>
           Count in <span class="des-month" id="des-jan">Jan.</span> ${val.janCount}</br>
            Count in <span class="des-month"id="des-feb">Feb.</span> ${val.febCount}</br>
            Count in <span class="des-month"id="des-mar">Mar.</span> ${val.marCount}</br>
            </p>
            `)
          .style("opacity", 1);
        }
        if (direction == "up"){
            d3.selectAll(".corpus-node")
            .style("opacity", function(d){
              if ((d.word == "deaths")) {
                return hoveredCircleOpac;
              }
              else {
                return 0;
              }
            })

            var selWord = "deaths"

           d3.selectAll(".first-part-line")
            .style("opacity", function(e){
                if (e.word == selWord){
                    return hoveredLineOpac
                }
            })

            d3.selectAll(".second-part-line")
            .style("opacity", function(e){
                if (e.word == selWord){
                    return hoveredLineOpac
                }
        })
            var val = groupWord.find( function(item) { return item.word == selWord } );       

         tooltip.html(`
            <p>
            ${selWord}</br>
           Count in <span class="des-month" id="des-jan">Jan.</span> ${val.janCount}</br>
            Count in <span class="des-month"id="des-feb">Feb.</span> ${val.febCount}</br>
            Count in <span class="des-month"id="des-mar">Mar.</span> ${val.marCount}</br>
            </p>
            `)
          .style("opacity", 1);
        }

}, {offset: smallScreen ? "70%" :"40%"})

$corpusWord11.waypoint(function (direction){

        if (direction == "down"){
            $("p#corpus-chart1-11").addClass("right-paragraph-full-opacity");
            
           tooltip.html("");
              d3.selectAll(".first-part-line")
                .style("opacity", 0)
              d3.selectAll(".second-part-line")
                .style("opacity", 0)

            d3.selectAll(".corpus-node")
            .style("opacity", function(d){
              if ((d.word == "deaths") && d.date =="2020-01" || (d.word == "died" && d.date =="2020-01")) {
                return hoveredCircleOpac;
              }
              else {
                return 0;
              }
            })
            
        }

        if (direction == "up"){
          $("p#corpus-chart1-11").removeClass("right-paragraph-full-opacity");
          $("p#corpus-chart1-10").addClass("right-paragraph-full-opacity");
         d3.selectAll(".corpus-node")
            .style("opacity", function(d){
              if ((d.word == "died")) {
                return hoveredCircleOpac;
              }
              else {
                return 0;
              }
            })

            var selWord = "died"

           d3.selectAll(".first-part-line")
            .style("opacity", function(e){
                if (e.word == selWord){
                    return hoveredLineOpac
                }
            })

            d3.selectAll(".second-part-line")
            .style("opacity", function(e){
                if (e.word == selWord){
                    return hoveredLineOpac
                }
        })
            var val = groupWord.find( function(item) { return item.word == selWord } );       

         tooltip.html(`
            <p>
            ${selWord}</br>
           Count in <span class="des-month" id="des-jan">Jan.</span> ${val.janCount}</br>
            Count in <span class="des-month"id="des-feb">Feb.</span> ${val.febCount}</br>
            Count in <span class="des-month"id="des-mar">Mar.</span> ${val.marCount}</br>
            </p>
            `)
          .style("opacity", 1);
        }

}, {offset: smallScreen ? "90%" :"60%"})


$corpusWord12.waypoint(function (direction){

        if (direction == "down"){
            $("p#corpus-chart1-12").addClass("right-paragraph-full-opacity");
            d3.selectAll(".corpus-node")
            .style("opacity", function(d){
              if ((d.word == "deaths")|| (d.word == "died")) {
                return hoveredCircleOpac;
              }
              else {
                return 0;
              }
            })
        }

        if (direction == "up"){
          $("p#corpus-chart1-12").removeClass("right-paragraph-full-opacity");
          $("p#corpus-chart1-11").addClass("right-paragraph-full-opacity");
          d3.selectAll(".corpus-node")
            .style("opacity", function(d){
              if ((d.word == "deaths") && d.date =="2020-01" || (d.word == "died" && d.date =="2020-01")) {
                return hoveredCircleOpac;
              }
              else {
                return 0;
              }
            })

        }

}, {offset: smallScreen ? "90%" :"60%"})


$corpusWord13.waypoint(function (direction){

        if (direction == "down"){
            $("p#corpus-chart1-13").addClass("right-paragraph-full-opacity");
            d3.selectAll(".corpus-node")
            .style("opacity", function(d){
              if ((d.word == "total")) {
                return hoveredCircleOpac;
              }
              else {
                return 0;
              }
            })

            var selWord = "total"

           d3.selectAll(".first-part-line")
            .style("opacity", function(e){
                if (e.word == selWord){
                    return hoveredLineOpac
                }
            })

            d3.selectAll(".second-part-line")
            .style("opacity", function(e){
                if (e.word == selWord){
                    return hoveredLineOpac
                }
        })
            var val = groupWord.find( function(item) { return item.word == selWord } );       

         tooltip.html(`
            <p>
            ${selWord}</br>
           Count in <span class="des-month" id="des-jan">Jan.</span> ${val.janCount}</br>
            Count in <span class="des-month"id="des-feb">Feb.</span> ${val.febCount}</br>
            Count in <span class="des-month"id="des-mar">Mar.</span> ${val.marCount}</br>
            </p>
            `)
          .style("opacity", 1);

        }

        if (direction == "up"){
          $("p#corpus-chart1-13").removeClass("right-paragraph-full-opacity");

              tooltip.html("");
              d3.selectAll(".first-part-line")
                .style("opacity", 0)
              d3.selectAll(".second-part-line")
                .style("opacity", 0)
          
                d3.selectAll(".corpus-node")
                            .style("opacity", function(d){
                              if ((d.word == "deaths")|| (d.word == "died")) {
                                return hoveredCircleOpac;
                              }
                              else {
                                return 0;
                              }
                            })
                            
        }
}, {offset: smallScreen ? "90%" :"60%"})

$corpusWord13.waypoint(function (direction){

        if (direction == "down"){
            d3.selectAll(".corpus-node")
            .style("opacity", function(d){
              if ((d.word == "number")) {
                return hoveredCircleOpac;
              }
              else {
                return 0;
              }
            })

            var selWord = "number"

           d3.selectAll(".first-part-line")
            .style("opacity", function(e){
                if (e.word == selWord){
                    return hoveredLineOpac
                }
            })

            d3.selectAll(".second-part-line")
            .style("opacity", function(e){
                if (e.word == selWord){
                    return hoveredLineOpac
                }
        })
            var val = groupWord.find( function(item) { return item.word == selWord } );       

         tooltip.html(`
            <p>
            ${selWord}</br>
           Count in <span class="des-month" id="des-jan">Jan.</span> ${val.janCount}</br>
            Count in <span class="des-month"id="des-feb">Feb.</span> ${val.febCount}</br>
            Count in <span class="des-month"id="des-mar">Mar.</span> ${val.marCount}</br>
            </p>
            `)
          .style("opacity", 1);
        }
        if (direction == "up"){
            d3.selectAll(".corpus-node")
            .style("opacity", function(d){
              if ((d.word == "total")) {
                return hoveredCircleOpac;
              }
              else {
                return 0;
              }
            })

            var selWord = "total"

           d3.selectAll(".first-part-line")
            .style("opacity", function(e){
                if (e.word == selWord){
                    return hoveredLineOpac
                }
            })

            d3.selectAll(".second-part-line")
            .style("opacity", function(e){
                if (e.word == selWord){
                    return hoveredLineOpac
                }
        })
            var val = groupWord.find( function(item) { return item.word == selWord } );       

         tooltip.html(`
            <p>
            ${selWord}</br>
           Count in <span class="des-month" id="des-jan">Jan.</span> ${val.janCount}</br>
            Count in <span class="des-month"id="des-feb">Feb.</span> ${val.febCount}</br>
            Count in <span class="des-month"id="des-mar">Mar.</span> ${val.marCount}</br>
            </p>
            `)
          .style("opacity", 1);
        }

}, {offset: smallScreen ? "70%" :"40%"})

$corpusWord14.waypoint(function (direction){

        if (direction == "down"){
            $("p#corpus-chart1-14").addClass("right-paragraph-full-opacity");
             tooltip.html("");
              d3.selectAll(".first-part-line")
                .style("opacity", 0)
              d3.selectAll(".second-part-line")
                .style("opacity", 0)
          
            d3.selectAll(".corpus-node")
            .style("opacity", function(d){
              if ((d.word == "total" && d.date =="2020-01")|| (d.word == "number" && d.date =="2020-01")) {
                return hoveredCircleOpac;
              }
              else {
                return 0;
              }
            })
        }

        if (direction == "up"){
          $("p#corpus-chart1-14").removeClass("right-paragraph-full-opacity");

         d3.selectAll(".corpus-node")
            .style("opacity", function(d){
              if ((d.word == "number")) {
                return hoveredCircleOpac;
              }
              else {
                return 0;
              }
            })

            var selWord = "number"

           d3.selectAll(".first-part-line")
            .style("opacity", function(e){
                if (e.word == selWord){
                    return hoveredLineOpac
                }
            })

            d3.selectAll(".second-part-line")
            .style("opacity", function(e){
                if (e.word == selWord){
                    return hoveredLineOpac
                }
        })
            var val = groupWord.find( function(item) { return item.word == selWord } );       

         tooltip.html(`
            <p>
            ${selWord}</br>
           Count in <span class="des-month" id="des-jan">Jan.</span> ${val.janCount}</br>
            Count in <span class="des-month"id="des-feb">Feb.</span> ${val.febCount}</br>
            Count in <span class="des-month"id="des-mar">Mar.</span> ${val.marCount}</br>
            </p>
            `)
          .style("opacity", 1);
        }

}, {offset: smallScreen ? "90%" :"60%"})



$corpusWord15.waypoint(function (direction){

        if (direction == "down"){
            $("p#corpus-chart1-15").addClass("right-paragraph-full-opacity");
            d3.selectAll(".corpus-node")
            .style("opacity", function(d){
              if ((d.word == "total")|| (d.word == "number")) {
                return hoveredCircleOpac;
              }
              else {
                return 0;
              }
            })
        }

        if (direction == "up"){
          $("p#corpus-chart1-15").removeClass("right-paragraph-full-opacity");

         d3.selectAll(".corpus-node")
            .style("opacity", function(d){
              if ((d.word == "total" && d.date =="2020-01")|| (d.word == "number" && d.date =="2020-01")) {
                return hoveredCircleOpac;
              }
              else {
                return 0;
              }
            })
            
        }

}, {offset: smallScreen ? "90%" :"60%"})



$corpusWord16.waypoint(function (direction){

        if (direction == "down"){
            $("p#corpus-chart1-16").addClass("right-paragraph-full-opacity");
            d3.selectAll(".corpus-node")
            .style("opacity", function(d){
              if ((d.word == "supplies")) {
                return hoveredCircleOpac;
              }
              else {
                return 0;
              }
            })

            var selWord = "supplies"

           d3.selectAll(".first-part-line")
            .style("opacity", function(e){
                if (e.word == selWord){
                    return hoveredLineOpac
                }
            })

            d3.selectAll(".second-part-line")
            .style("opacity", function(e){
                if (e.word == selWord){
                    return hoveredLineOpac
                }
        })
            var val = groupWord.find( function(item) { return item.word == selWord } );       

         tooltip.html(`
            <p>
            ${selWord}</br>
           Count in <span class="des-month" id="des-jan">Jan.</span> ${val.janCount}</br>
            Count in <span class="des-month"id="des-feb">Feb.</span> ${val.febCount}</br>
            Count in <span class="des-month"id="des-mar">Mar.</span> ${val.marCount}</br>
            </p>
            `)
          .style("opacity", 1);

        }

        if (direction == "up"){
          $("p#corpus-chart1-16").removeClass("right-paragraph-full-opacity");
          $("p#corpus-chart1-15").addClass("right-paragraph-full-opacity"); 

              tooltip.html("");
              d3.selectAll(".first-part-line")
                .style("opacity", 0)
              d3.selectAll(".second-part-line")
                .style("opacity", 0)
          

         d3.selectAll(".corpus-node")
            .style("opacity", function(d){
              if ((d.word == "total")|| (d.word == "number")) {
                return hoveredCircleOpac;
              }
              else {
                return 0;
              }
            })
            
        }

}, {offset: smallScreen ? "90%" :"60%"})

$corpusWord16.waypoint(function (direction){

        if (direction == "down"){
            d3.selectAll(".corpus-node")
            .style("opacity", function(d){
              if ((d.word == "donated")) {
                return hoveredCircleOpac;
              }
              else {
                return 0;
              }
            })

            var selWord = "donated"

           d3.selectAll(".first-part-line")
            .style("opacity", function(e){
                if (e.word == selWord){
                    return hoveredLineOpac
                }
            })

            d3.selectAll(".second-part-line")
            .style("opacity", function(e){
                if (e.word == selWord){
                    return hoveredLineOpac
                }
        })
            var val = groupWord.find( function(item) { return item.word == selWord } );       

         tooltip.html(`
            <p>
            ${selWord}</br>
           Count in <span class="des-month" id="des-jan">Jan.</span> ${val.janCount}</br>
            Count in <span class="des-month"id="des-feb">Feb.</span> ${val.febCount}</br>
            Count in <span class="des-month"id="des-mar">Mar.</span> ${val.marCount}</br>
            </p>
            `)
          .style("opacity", 1);
        }
        if (direction == "up"){
            d3.selectAll(".corpus-node")
            .style("opacity", function(d){
              if ((d.word == "supplies")) {
                return hoveredCircleOpac;
              }
              else {
                return 0;
              }
            })

            var selWord = "supplies"

           d3.selectAll(".first-part-line")
            .style("opacity", function(e){
                if (e.word == selWord){
                    return hoveredLineOpac
                }
            })

            d3.selectAll(".second-part-line")
            .style("opacity", function(e){
                if (e.word == selWord){
                    return hoveredLineOpac
                }
        })
            var val = groupWord.find( function(item) { return item.word == selWord } );       

         tooltip.html(`
            <p>
            ${selWord}</br>
           Count in <span class="des-month" id="des-jan">Jan.</span> ${val.janCount}</br>
            Count in <span class="des-month"id="des-feb">Feb.</span> ${val.febCount}</br>
            Count in <span class="des-month"id="des-mar">Mar.</span> ${val.marCount}</br>
            </p>
            `)
          .style("opacity", 1);
        }

}, {offset: smallScreen ? "70%" :"40%"})


$corpusWord17.waypoint(function (direction){

        if (direction == "down"){
            $("p#corpus-chart1-17").addClass("right-paragraph-full-opacity");
            
           tooltip.html("");
              d3.selectAll(".first-part-line")
                .style("opacity", 0)
              d3.selectAll(".second-part-line")
                .style("opacity", 0)


            d3.selectAll(".corpus-node")
                .attr("fill", function(d){
                        if (d.date == "2020-01"){
                            return colorRange[0]
                        } 
                        else if (d.date == "2020-02") {
                            return colorRange[2]
                        }
                        else {
                            return colorRange[4]
                        }
                    })
                .attr("r", 0)
                 .transition()
                 .duration(500)
                  .attr("r", function(d){
                         if(isNaN(sideScale(d.x)) == false || isNaN(perpScale(d.iiiShare))==false){
                             return r(d.normalizedTotal)
                        }
                    })
               .style("opacity", circleOpac)

            d3.selectAll(".corpus-node").on("mouseover", function(d){
                    d3.selectAll(".corpus-node").style("opacity", 0);
                    d3.select(this).style("opacity", hoveredCircleOpac);

                    var selWord = d.word;

                    d3.selectAll(".first-part-line")
                        .style("opacity", function(e){
                            if (e.word == selWord){
                                return hoveredLineOpac
                            }
                        })

                    d3.selectAll(".second-part-line")
                        .style("opacity", function(e){
                            if (e.word == selWord){
                                return hoveredLineOpac
                            }
                    })

                    d3.selectAll(".corpus-node")
                            .style("opacity", function(e){
                                if (e.word == selWord){
                                    return hoveredCircleOpac
                                }
                                else { return 0}
                        })


                    var val = groupWord.find( function(item) { return item.word == selWord } );       

                     tooltip.html(`
                        <p>
                        ${d.word}</br>
                       Count in <span class="des-month" id="des-jan">Jan.</span> ${val.janCount}</br>
                        Count in <span class="des-month"id="des-feb">Feb.</span> ${val.febCount}</br>
                        Count in <span class="des-month"id="des-mar">Mar.</span> ${val.marCount}</br>
                        </p>
                        `)
                      .style("opacity", 1);

                      })
                    .on("mouseout", function(d) {
                        d3.selectAll(".corpus-node").style("opacity", circleOpac);
                        tooltip.html("");
                         d3.selectAll(".first-part-line")
                        .style("opacity", 0)
                        d3.selectAll(".second-part-line")
                        .style("opacity", 0)

                    })


                d3.select(".circle-size-legend")
                    .style("opacity", 1);

                d3.select(".rect-color-legend")
                .style("opacity", 1);
        }

        if (direction == "up"){
          $("p#corpus-chart1-17").removeClass("right-paragraph-full-opacity");
         d3.selectAll(".corpus-node")
         .attr("fill", function(d){
                    if (d.date == "2020-01"){
                        return colorRange[0]
                    } 
                    else if (d.date == "2020-02") {
                        return colorRange[2]
                    }
                    else {
                        return colorRange[4]
                    }
                })
            .on("mouseover", function(d){
                return true;
            })
            .on("mouseout", function(d){
                return true;
            })
            .style("opacity", function(d){
              if ((d.word == "donated")) {
                return hoveredCircleOpac;
              }
              else {
                return 0;
              }
            })

            var selWord = "donated"

           d3.selectAll(".first-part-line")
            .style("opacity", function(e){
                if (e.word == selWord){
                    return hoveredLineOpac
                }
            })

            d3.selectAll(".second-part-line")
            .style("opacity", function(e){
                if (e.word == selWord){
                    return hoveredLineOpac
                }
        })
            var val = groupWord.find( function(item) { return item.word == selWord } );       

         tooltip.html(`
            <p>
            ${selWord}</br>
           Count in <span class="des-month" id="des-jan">Jan.</span> ${val.janCount}</br>
            Count in <span class="des-month"id="des-feb">Feb.</span> ${val.febCount}</br>
            Count in <span class="des-month"id="des-mar">Mar.</span> ${val.marCount}</br>
            </p>
            `)
          .style("opacity", 1);
        }

}, {offset: smallScreen ? "90%" :"60%"})

