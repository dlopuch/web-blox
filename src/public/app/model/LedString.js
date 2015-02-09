var _ = require('lodash');

var LedString = module.exports = function() {
  _.bindAll(this);

  this.ledGroups = [];
  this._numLeds = 0;
};

/**
 * Adds a list of LED's to the string
 *
 * @param {Array(tinycolor)} leds List of tinycolors representing the LEDs.  The tinycolor contents may change, but
 *   the list should remain a constant object and stay constant length.
 */
LedString.prototype.addLeds = function addLeds(leds) {
  if (!_.isArray(leds))
    throw new Error('Must be a list of LEDs');

  this.ledGroups.push(leds);
  this._numLeds += leds.length;

  return this;
};

/**
 * Turns the string of LEDs into a OLC packet
 */
LedString.prototype.makePacket = function() {
  var packet = new Uint8ClampedArray(4 + this._numLeds * 3),
      pByte = 4, // start writing LED bytes after first 4 header bytes
      c;

  for (var i=0; i < this.ledGroups.length; i++) {
    for (var j=0; j < this.ledGroups[i].length; j++) {
      c = this.ledGroups[i][j].toRgb();
      packet[pByte++] = c.r;
      packet[pByte++] = c.g;
      packet[pByte++] = c.b;
    }
  }

  return packet;
};






