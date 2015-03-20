var d3 = require('d3'),
    APromise = require('promise');

// Load the source ring to be used for all instances
var ringImg = new Image(),
    ringLoaded = false;
ringImg.src = '/ring.png';

var ringPromise = new APromise(function(resolve, reject) {
  ringImg.onload = function() {
    ringLoaded = true;
    resolve();
  };
});

/**
 * @private
 *
 * Helper function to draw an instance's ring buffer onto a target context
 *
 * @param {2dContext} targetCanvasCtx
 * @param {Canvas} coloredRingBuffer
 * @param {number} x
 * @param {number} y
 * @param {number} mx Multiplier X (100 = normal size)
 * @param {number} my Multiplier Y (100 = normal size)
 */
function drawRing(targetCanvasCtx, coloredRingBuffer, x, y, mx, my) {
  if (!mx)
    mx = 100;
  if (!my)
    my = 100;

  targetCanvasCtx.save();

  targetCanvasCtx.globalCompositeOperation = 'screen';
  targetCanvasCtx.drawImage(coloredRingBuffer, x, y, mx, my);

  targetCanvasCtx.restore();
}


/**
 * @constructor
 * Pulsing Ring constructor
 *
 * @param {string} color string like 'red' or '#f00' or 'rgb(255, 0, 0)'
 * @param {number} x offset of top of ring
 * @param {number} y offset of left of ring
 * @param {number} maxM Maximum size multiplier (100 is normal)
 * @param {number} minM Minimum size multiplier (100 is normal)
 * @param {number} p Period increment amount.  Every render, the sin wave increases by this amount.
 */
function PulsingRing(color, x, y, maxM, minM, p) {
  maxM = maxM || 900;
  minM = minM || 100;
  this.multiplierScale = d3.scale.linear().domain([-1, 1]).range([minM, maxM]);

  this.t = 0;
  this.x = x;
  this.y = y;
  this.p = p;

  // Each Ring holds its own color-shaded ringImg as a separate canvas buffer so that color blending onto main canvas
  // can include the ring's coloring
  var buffer = this.buffer = document.createElement('canvas');
  ringPromise.done(function() {
    buffer.width = ringImg.width;
    buffer.height = ringImg.height;

    var bx = buffer.getContext('2d');
    bx.globalCompositeOperation = 'normal';
    bx.fillStyle = color || '#FF0000';
    bx.fillRect(0,0, buffer.width, buffer.height);
    bx.globalCompositeOperation = 'multiply';

    bx.drawImage(ringImg, 0, 0);
    //d3.select("body")[0][0].appendChild(buffer);
  });
}

PulsingRing.prototype.render = function render(canvasCtx) {
  var multiplier = this.multiplierScale(Math.sin(this.t));

  if (ringLoaded)
    drawRing(canvasCtx, this.buffer, this.x, this.y, multiplier, multiplier);

  this.t += this.p || 0.1;
};

PulsingRing.isLoaded = function() {
  return ringLoaded;
};

module.exports = PulsingRing;
