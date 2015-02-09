var _ = require('lodash'),
    DEBUG = false;

var packetCount = 0;

var FadeCandyController = module.exports = function(ledString, options) {
  if (!ledString)
    throw new Error('ledString required!');
  this.ledString = ledString;

  _.bindAll(this);

  options = this.options = _.defaults(options || {}, {
    // Default: connect to a Fadecandy server running on the same computer, on the default port
    host: 'localhost',
    port: 7890,
    framesPerSecond: 24
  });

  this.socket = new WebSocket('ws://' + options.host + ':' + options.port);
  this._connected = false;

  var self = this;
  this.socket.onclose = function(event) {
    console.log('[FadeCandyController] Not connected to fcserver');
    self._connected = false;
  };
  this.socket.onopen = function(event) {
    console.log('[FadeCandyController] Connected');
    self._connected = true;
  };
  this.go();
};

/**
 * Start sending out packets from the LED string (fadecandy keyframes).
 * @param {number} [framesPerSecond] Optional.  Polling frequency of the LED string to send to the fadecandy.
 *   Defaults to constructor option, which defaults to 24.
 */
FadeCandyController.prototype.go = function(framesPerSecond) {
  if (this._interval)
    this.pause();

  this._interval = setInterval(this.sendLeds, Math.floor(1000/ (framesPerSecond || this.options.framesPerSecond_)));
  return this;
};

FadeCandyController.prototype.pause = function() {
  clearInterval(this._interval);
  delete this._interval;
  return this;
};

FadeCandyController.prototype.sendLeds = function() {
  if (!this._connected)
    return;

  if (this.socket.readyState !== 1 /* OPEN */) {
    // The server connection isn't open. Nothing to do.
    return;
  }

  var packet = this.ledString.makePacket();

  if (this.socket.bufferedAmount > packet.length) {
    // The network is lagging, and we still haven't sent the previous frame.
    // Don't flood the network, it will just make us laggy.
    // If fcserver is running on the same computer, it should always be able
    // to keep up with the frames we send, so we shouldn't reach this point.
    console.log('[FadeCandyController] Warning: backpressure building up, waiting to drain.');
    return;
  }

  this.socket.send(packet.buffer);

  packetCount++;
  if (DEBUG && packetCount > 5*30) {
    packetCount = 0;
    console.log('Latest packet: ', packet);
  }
};
