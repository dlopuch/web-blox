var _ = require('lodash'),
    d3 = require('d3'),

    PulsingRing = require('../model/canvas/PulsingRing');

var WIDTH = 700,
    HEIGHT = 400;

var canvas = d3.select("body").append("canvas")
      .attr('id', 'cvs')
      .attr("width", WIDTH)
      .attr("height", HEIGHT);

canvas = canvas[0][0];

var ctx = window.ctx = canvas.getContext('2d');

ctx.fillStyle = '#000';
ctx.fillRect(0, 0, WIDTH, HEIGHT);


function start(blendMode) {
  ctx.clearRect(0,0, WIDTH, HEIGHT);
  ctx.globalCompositeOperation = blendMode || 'normal';

  ctx.fillStyle = '#000';
  ctx.fillRect(0,0, WIDTH, HEIGHT);

  var whiteRing = new PulsingRing('#fff', 0,  0,  200, 100, 0.1),
      redRing   = new PulsingRing('#f00', 15, 15, 300, 100, 0.2),
      greenRing = new PulsingRing('#0f0', 5,  5,  900, 100, 0.01);


  function tick() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0,0, WIDTH, HEIGHT);
    whiteRing.render(ctx);
    redRing.render(ctx);
    greenRing.render(ctx);
    requestAnimationFrame(tick);
  }

  tick();

}
window.startCanvas = start;
start();

