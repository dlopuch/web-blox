var _ = require('lodash'),
    tinycolor = require('../lib/tinycolor');

var id = 0;

/**
 * @constructor
 */
var Cube = module.exports = function Cube() {
  this.id = id++;
  this.leds = [tinycolor(), tinycolor(), tinycolor(), tinycolor()];
};

/**
 * Sets the color of all four cube LEDs
 * @param {string} tinycolorStr tinycolor initializer string
 */
Cube.prototype.setColor = function(tinycolorStr) {
  var color = tinycolor(tinycolorStr);

  // Do not re-assign this.leds.  models.LedString relies on object equivalency against the arrays!
  this.leds[0] = this.leds[1] = this.leds[2] = this.leds[3] = color;
  return this;
};
