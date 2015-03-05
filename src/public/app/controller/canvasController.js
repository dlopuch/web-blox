var _ = require('lodash'),
    d3 = require('d3');

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

var ringImg = new Image();
ringImg.src = '/ring.png';
ringImg.onload = function() {

  // create offscreen buffer,
  var buffer = document.createElement('canvas');
  //d3.select("body")[0][0].appendChild(buffer);

  buffer.width = ringImg.width;
  buffer.height = ringImg.height;
  var bx = buffer.getContext('2d');

  function colorizeRingBuffer(rgb) {
    // fill offscreen buffer with the tint color
    bx.globalCompositeOperation = 'normal';
    bx.fillStyle = rgb || '#FF0000';
    bx.fillRect(0,0,buffer.width,buffer.height);

    bx.globalCompositeOperation = 'multiply';
    bx.drawImage(ringImg, 0, 0);
  }



  function drawRing( rgb, x, y, mx, my) {
    if (!mx)
      mx = 100;
    if (!my)
      my = 100;

    ctx.save();

    colorizeRingBuffer(rgb);
    ctx.globalCompositeOperation = 'screen';
    ctx.drawImage(buffer, x, y, mx, my);

    // ctx.globalCompositeOperation = 'overlay';
    // ctx.fillStyle = rgb || '#F00';
    // ctx.fillRect(x, y, ringImg.width * mx/100, ringImg.height * my/100);

    ctx.restore();
  }
  window.drawRing = drawRing;

  function Ring(color, x, y, maxM, minM, p) {
    maxM = maxM || 900;
    minM = minM || 100;
    this.t = 0;
    var m;
    this.tick = function() {
      m = minM + (Math.sin(this.t) / 2 + 0.5) * (maxM - minM);
      drawRing(color, x, y, m, m);
      this.t += p || 0.1;
    }.bind(this);
  }

  function ringify(blendMode) {
    ctx.clearRect(0,0, WIDTH, HEIGHT);
    ctx.globalCompositeOperation = blendMode || 'normal';

    ctx.fillStyle = '#000';
    ctx.fillRect(0,0, WIDTH, HEIGHT);

    var whiteRing = new Ring('#fff', 0,  0,  200, 100, 0.1),
        redRing   = new Ring('#f00', 15, 15, 300, 100, 0.05),
        greenRing = new Ring('#0f0', 5,  5,  900, 100, 0.01);

    function tick() {
      ctx.fillStyle = '#000';
      ctx.fillRect(0,0, WIDTH, HEIGHT);
      whiteRing.tick();
      redRing.tick();
      greenRing.tick();
      requestAnimationFrame(tick);
    }

    tick();

  }
  window.ringify = ringify;


  ringify();
};
