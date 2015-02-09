var _ = require('lodash'),
    Lattice = require('../model/Lattice'),
    LedString = require('../model/LedString'),
    FadeCandyController = require('./FadeCandyController');

var lattice = new Lattice(6, 7, 6),
    ledString = new LedString(),
    fadeCandyController = new FadeCandyController(ledString),
    cubes = [];

exports.lattice = lattice;
exports.ledString = ledString;
exports.fadeCandyController = fadeCandyController;
exports.cubes = cubes;


// Now make the cubes per lattice configuration, and add each cube's LED's to the string, which is sent to the FadeCandy
// We define the cube lattice positions in the order that they appear on the sculpture's LED string
var c;

// 0
c = lattice.makeCube(4,2,0);
ledString.addLeds(c.leds);
cubes.push(c);

// 1
c = lattice.makeCube(3,3,1);
ledString.addLeds(c.leds);
cubes.push(c);

// 2
c = lattice.makeCube(2,2,0);
ledString.addLeds(c.leds);
cubes.push(c);

// 3
c = lattice.makeCube(1,1,1);
ledString.addLeds(c.leds);
cubes.push(c);

// 4
c = lattice.makeCube(2,0,2);
ledString.addLeds(c.leds);
cubes.push(c);

// 5
c = lattice.makeCube(3,1,1);
ledString.addLeds(c.leds);
cubes.push(c);

// 6
c = lattice.makeCube(4,2,2);
ledString.addLeds(c.leds);
cubes.push(c);

// 7
c = lattice.makeCube(5,1,3);
ledString.addLeds(c.leds);
cubes.push(c);

// 8
c = lattice.makeCube(4,0,4);
ledString.addLeds(c.leds);
cubes.push(c);

// 9
c = lattice.makeCube(3,1,3);
ledString.addLeds(c.leds);
cubes.push(c);

// 10
c = lattice.makeCube(2,2,4);
ledString.addLeds(c.leds);
cubes.push(c);

// 11
c = lattice.makeCube(1,3,5);
ledString.addLeds(c.leds);
cubes.push(c);

// 12
c = lattice.makeCube(0,4,4);
ledString.addLeds(c.leds);
cubes.push(c);

// 13
c = lattice.makeCube(1,5,5);
ledString.addLeds(c.leds);
cubes.push(c);

// 14
c = lattice.makeCube(2,4,4);
ledString.addLeds(c.leds);
cubes.push(c);

// 15
c = lattice.makeCube(1,5,3);
ledString.addLeds(c.leds);
cubes.push(c);

// 16
c = lattice.makeCube(2,4,2);
ledString.addLeds(c.leds);
cubes.push(c);

// 17
c = lattice.makeCube(3,5,1);
ledString.addLeds(c.leds);
cubes.push(c);

// 18
c = lattice.makeCube(4,6,2);
ledString.addLeds(c.leds);
cubes.push(c);

// 19
c = lattice.makeCube(5,5,3);
ledString.addLeds(c.leds);
cubes.push(c);


