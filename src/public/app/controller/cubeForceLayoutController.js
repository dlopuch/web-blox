var _ = require('lodash'),
    d3 = require('d3'),
    sculpture = require('./sculptureController');


var WIDTH = 700,
    HEIGHT = 400;

var force = require('../model/cubeForceLayout')(sculpture, WIDTH, HEIGHT);

window.force = force;

var svg = d3.select("body").append("svg")
      .attr("width", WIDTH)
      .attr("height", HEIGHT);

var link = svg.selectAll(".link").data(force.links()),
    node = svg.selectAll(".node").data(force.nodes());


// Enter any new links.
link.enter().insert("line", ".link")
  .attr("class", "link")
  .attr("x1", function(d) { return d.source.x; })
  .attr("y1", function(d) { return d.source.y; })
  .attr("x2", function(d) { return d.target.x; })
  .attr("y2", function(d) { return d.target.y; });

node.enter().append("circle")
  .attr("class", "node")
  .attr("cx", function(d) { return d.x; })
  .attr("cy", function(d) { return d.y; })
  .attr("r", 10)
  .style("fill", 'steelblue')
  .call(force.drag);

// Update positions on a tick
force.on('tick', function() {
  link.attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; });

  node.attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; });
});

var lastPush = Date.now();
sculpture.fadeCandyController.on('pushed', function(fcc, ledString) {

  node
  .transition()
  .duration(Date.now() - lastPush)
  .style('fill', function(n) {
    return n.cube.leds[0].toRgbString();
  });

  lastPush = Date.now();
});
