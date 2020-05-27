function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }
  
  if (!isMobile()) {
  

        // network graph
        // General settings

        var networkDiv = d3.select('#network-graph');
        var networkWidth = document.querySelector('#network-graph').clientWidth;
        var networkHeight = document.querySelector('#network-graph').clientHeight;

        var networkSvg = networkDiv
          .append("svg")
          .attr('width', networkWidth)
          .attr('height', networkHeight);

        var smallScreen = window.innerWidth < 500 ? true : false;


        // Chart
        var networkRadius = smallScreen ? 3 : 6;
        var networkCirclePadding = smallScreen ? 0.5 : 2;
        var networkNodeG = networkSvg.append("g").attr('class', "network-nodeG");
        var yCenter = [networkHeight / 4, networkHeight * 2 / 4, networkHeight *3/4];
        var xCenter = [networkWidth / 4, networkWidth*3/4];
        var yCenterPlatform = [networkHeight / 4, networkHeight*3/4];
        var xCenterPlatform = [networkWidth / 4, networkWidth *2 / 4, networkWidth *3/4];

        var forceY = d3.forceY()
                        .y(d => yCenter[d.yCluster])
                        .strength(smallScreen ? 0.9 : 0.5);
        var forceX = d3.forceX()
                        .x(d => xCenter[d.xCluster])
                        .strength(smallScreen ? 1 : 0.6);

        var groupingForce = forceInABox()
          .strength(0.5) // Strength to foci
          .template('force') // Either treemap or force
          .groupBy('punishment_type') 
          .size([networkWidth, networkHeight])
          .forceCharge(smallScreen ? -20 : -100);

        var forceCollide = d3.forceCollide()
          .radius(networkRadius)
          // .strength(0.5)

        var charge = d3.forceManyBody()
          .strength(smallScreen ? -50 : -100)

        var center = d3.forceCenter()
          .x(networkWidth / 2)
          .y(networkHeight / 2);

        var simulation = d3.forceSimulation()
          .velocityDecay(0.7)
          .force('charge', charge)
          .force('collide', forceCollide)
          .force('center', center)
          .force('group', groupingForce)
          .force('x', forceX)
          .force('y', forceY)
          .alphaTarget(0.1)
          .stop();

        var networkNodes = []


        var colorScale = d3.scaleOrdinal()
          .domain(["detention < 5 days", "detention > five days", 
                  "admonition", "fine", "wechat", "weibo", "others"])
          .range(["#E9D985","#DC602E", 
                "#6A8E7F", "#875D9A", "#61D3A5", "#D36135", "gray"])


        /* ADD A TOOLTIP TO THE NODES */
        var networkTooltip = d3.select("#network-graph")
          .append("div")
          .attr("id", "network-graph-tooltip")

        d3.csv("data/china-text-hell.csv", function (dataset) {

            data = dataset.filter(function(d){
              return d.person !== "";
            })
          
            processData(data);
        });


              function processData(data) {

                data = data.filter(d => d.person !== "");

                data.forEach(d => {

                  var xi, yi, punishment_type, yiPltfm, xiPltfm, platform_type;

                  if ((d.punishment.toLowerCase().includes("detention") && d.punishment.toLowerCase().includes("3"))
                    ||(d.punishment.toLowerCase().includes("detention") && d.punishment.toLowerCase().includes("5"))) {
                        yi = 0;
                        xi = 0;
                        punishment_type = "detention < five days";
                    }

                    else if ((d.punishment.toLowerCase().includes("detention") && d.punishment.toLowerCase().includes("7"))
                    ||(d.punishment.toLowerCase().includes("detention") && d.punishment.toLowerCase().includes("10"))) {
                        yi = 0;
                        xi = 1;
                        punishment_type = "detention > five days";
                    }

                    else if (d.punishment.toLowerCase().includes("admonition")) {
                        yi = 1;
                        xi = 0;
                        punishment_type = "admonition";
                    }

                  else if (d.punishment.toLowerCase().includes("fine")) {
                        yi = 1;
                        xi = 1;
                        punishment_type = "fine";
                    }

                  else {
                      yi = 2;
                      xi = 0;
                      punishment_type = "others";
                    }

                    if (d.platform.toLowerCase().includes("wechat")) {
                        yiPltfm = 0;
                        xiPltfm = 0;
                        platform_type = "wechat";
                    }

                    else if (d.platform.toLowerCase().includes("weibo")) {
                        yiPltfm = 0;
                        xiPltfm = 2;
                        platform_type = "weibo";
                    }
                    else {
                        yiPltfm = 1;
                        xiPltfm = 1;
                        platform_type = "others";
                    }

                  networkNodes.unshift({
                            "xCluster": xi,
                            "yCluster": yi,
                            "radius": networkRadius,
                            "person": d.person,
                            "content": d.content,
                            "location": d.location,
                            "date": d.date,
                            "punishment": d.punishment,
                            "punishment_type": punishment_type,
                            "platform": d.platform,
                            "yPltfmCluster": yiPltfm,
                            "xPltfmCluster": xiPltfm,
                            "platform_type": platform_type,
                            "source1": d.source1,
                            "source2": d.source2
                          });

                });

                simulation.nodes(networkNodes);
                update()
        } 



        function update(){

              /* DRAW THE NODES */
              var network= networkNodeG.selectAll(".network-node")
                      .data(simulation.nodes(), function(d){
                          return d.index
                      });

                network.exit().remove();

                network.enter()
                  .append("circle")
                  .attr('class', "network-node")
                  .attr("stroke", "#fff")
                  .attr("stroke-width", 1.5)
                  .attr("r", networkRadius)
                  .merge(network)
                  .attr("fill", function (d) {
                      return colorScale(d.punishment_type)
                    })

                simulation.on("tick", function () {

                  d3.selectAll(".network-node")
                    .attr("cx", d => Math.max(networkRadius, Math.min(networkWidth - networkRadius, d.x)))
                    .attr("cy", d => Math.max(networkRadius, Math.min(networkHeight - networkRadius, d.y)));
                })

                simulation.alpha(1).restart();

                d3.selectAll(".network-node")
                  .on("mouseover", function (d) {
                    const mouseCoords = d3.mouse(this);
                    const cx = mouseCoords[0] + 20;
                    const cy = mouseCoords[1] - 50;
                    const details = d.content.length ? `Details: ${d.content}` : '';
                    const description = `
                      Punishment: ${d.punishment}<br>
                      Location: ${d.location}<br>
                      Date: ${d.date}<br>
                      ${details}
                    `;

                    networkTooltip.style("visibility", "visible")
                      .html(description)
                      .style("left", `${cx}px`)
                      .style("top", `${cy}px`)

                    d3.selectAll(".network-node").attr("opacity", 0.2);

                    d3.select(this)
                      .attr("opacity", 1)
                      .classed('highlight', true);
                  })
                  .on("mouseout", function () {
                    networkTooltip.style("visibility", "hidden");
                    d3.selectAll(".network-node")
                      .attr("opacity", 1)
                      .classed('highlight', false);
                  });
              }

        function setButtons(){
          d3.selectAll(".btn")
            .on("click", function(){
              
              d3.selectAll(".btn").classed("active", false);
              
              var clicked = d3.select(this);
              
              clicked.classed("active", true);
              
              var clickedId = clicked.attr("id");
              
              if(clickedId == "punishment"){

                d3.select("#platform-legend")
                  .style("display","none");

                d3.select("#punishment-legend")
                  .style("display","flex");

                
                d3.selectAll(".network-node")
                  .attr("fill", function (d) {
                    return colorScale(d.punishment_type)
                  })

                forceY
                  .y(d => yCenter[d.yCluster])

                forceX
                  .x(d => xCenter[d.xCluster])

                groupingForce 
                  .groupBy('punishment_type') // Node attribute to group

                simulation
                    .force('group', groupingForce)
                    .force('x', forceX)
                    .force('y', forceY)


              }
              else if (clickedId == "platform"){


                d3.select("#punishment-legend")
                  .style("display","none");

                d3.select("#platform-legend")
                  .style("display","flex");

                d3.selectAll(".network-node")
                  .attr("fill", function (d) {
                    return colorScale(d.platform_type)
                  })

                  forceY
                    .y(d => yCenterPlatform[d.yPltfmCluster])

                  forceX
                    .x(d => xCenterPlatform[d.xPltfmCluster])

                  groupingForce
                      .groupBy('platform_type');

                  simulation
                    .force('group', groupingForce)
                    .force('x', forceX)
                    .force('y', forceY)
              }
            })
        }

        setButtons()
}