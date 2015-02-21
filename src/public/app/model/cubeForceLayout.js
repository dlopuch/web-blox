var _ = require('lodash'),
    d3 = require('d3');

/**
 * Makes a D3 force layout from the sculpture
 * @param {controller.sculptureController} sculpture
 * @param {Number} w width of force layout
 * @param {Number} h height of force layout
 * @returns {d3.layout.force} Where each cube is the sculpture is a node
 */
module.exports = function cubeForceLayout(sculpture, w, h) {
  var lattice = sculpture.lattice,
      cubes = sculpture.cubes;

  // D3 force needs its own objects.  Create new objects off the cubes.
  var nodes = cubes.map(function(cube) {
    return {
      cube: cube,
      links: [],

      x: w/2 + (Math.random() - 0.5) * w/4,
      y: h/2 + (Math.random() - 0.5) * h/4
    };
  });
  var nodesById = _.indexBy(nodes, function(n) { return '' + n.cube.id; });

  // build links from the lattice connections
  var linksIdx = {};
  nodes.forEach(function(node) {
    var cube = node.cube;

    lattice.getAdjacentCubes(cube).forEach(function(adjCube) {
      if (adjCube === cube)
        return;

      var smallerCubeId = _.min([cube, adjCube], 'id').id,
          largerCubeId = _.max([cube, adjCube], 'id').id;
      linksIdx[ smallerCubeId + '__' + largerCubeId ] = {
        source: nodesById['' + smallerCubeId],
        target: nodesById['' + largerCubeId]
      };
    });
  });

  var links = _.values(linksIdx);

  links.forEach(function(l) {
    l.source.links.push(l);
    l.target.links.push(l);
  });

  function returnSpy(fn, bucket) {
    return function() {
      var ret = fn.apply(this, arguments);
      bucket.push(ret);
      return ret;
    };
  }

  var linkDistances = [], charges = [];

      // See linkDistance function: When link is between two highly-linked nodes, be small
  var linkDistanceScale = d3.scale.linear().domain([3, 8]).range([50, 10]), // 3-8 is sculpture physical config

      // See charge function: Repulsion gets weaker as a node has more links
      chargesScale = d3.scale.linear().domain([1, 4]).range([-30, -5]);  // 1-4 is sculpture physical n-links config

  var forceLayout = d3.layout.force()
      .nodes(nodes)
      .links(links)
      .size([w, h])
      .linkStrength(0.1)
      .friction(0.95)
      .linkDistance(returnSpy(function(l) {
        return linkDistanceScale(l.source.links.length + l.target.links.length);
      }, linkDistances))
      .charge(returnSpy(function(n) {
        return chargesScale(n.links.length);
      }, charges))
      .gravity(0)
      .theta(0.8)
      .alpha(0.1)
      .start();

  // For tweaking params, can use these to see distribution:
  // console.log("linkDistances: ", linkDistances);
  // console.log("charges: ", charges);
  // window.linkDistances = linkDistances;
  // window.charges = charges;

  return forceLayout; // don't forget to forceLayout.start();
};

