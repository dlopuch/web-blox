var _ = require('lodash'),
    sculpture = require('./controller/sculptureController');

window._ = _;

console.log('Welcome to the Sculpture Controller!');
console.log('--------------------------');
console.log('There are some globals that are helpful:');

console.log(" - cubes: List of cubes.  Set cube colors like: cubes[4].setColor('purple');");
console.log("     Refer to tinycolor.js for all color strings");
window.cubes = sculpture.cubes;

console.log(' - lattice: The lattice model.  Can be used to grab adjacent cubes, for example (see demo patterns)');
window.lattice = sculpture.lattice;

console.log(' - fadeCandyController: Change the number of keyframes per second sent out by calling: .go(n)');
window.fadeCandyController = sculpture.fadeCandyController;

console.log('\n\nWe also have some demo patterns to try:');
console.log('--------------------------');
console.log('  - patterns.cycleCubeHues(): Rotate each cube through the rainbow');
console.log("  - patterns.adjecencyCubes(): Highlight each cube and it's adjacent cube(s)");
console.log('Experiment with fadecandy capabilities -- try calling fadeCandyController.go() with different params to ' +
            'see interpolation at different update frequencies.');
// Some demo patterns to try out in console:
window.patterns = {
  /**
   * Cycle Cube Hues:
   * Each cube goes through a piece of the rainbow
   */
  cycleCubeHues: function cycleCubeHues() {
    if (window.stop)
      window.stop();

    var palette = [
      {r: 255, g: 0  , b: 0 },
      {r: 255, g: 255, b: 0 },
      {r: 0  , g: 255, b: 0 },
      {r: 0  , g: 255, b: 255 },
      {r: 0  , g: 0  , b: 255 },
      {r: 255, g: 0  , b: 255 },
    ];

    // Let the fadecandy interpolate -- send out, say, 5 keyframes per second:
    sculpture.fadeCandyController.go(5);

    var cubeI = 0,
        paletteI = 0;

    var interval = setInterval(function() {
      sculpture.cubes[cubeI].setColor( palette[paletteI] );

      cubeI++;
      if (cubeI === sculpture.cubes.length) {
        paletteI++;
        cubeI = 0;

        if (paletteI === palette.length) {
          paletteI = 0;
        }
      }
    }, 50);

    console.log('Cycling cube hues.  stop() to stop');
    window.stop = function() { clearInterval(interval); };
  },

  adjacencyCubes: function() {
    if (window.stop)
      window.stop();

    function setCubeColor(color, cube) {
      cube.setColor(color);
    }

    var purple = _.partial(setCubeColor, 'purple'),
        black = _.partial(setCubeColor, 'black'),
        green = _.partial(setCubeColor, 'green');

    function highlight(cube) {
      sculpture.cubes.forEach(black);
      sculpture.lattice.getAdjacentCubes(cube).forEach(purple);
      cube.setColor('green');
    }

    // Let the fadecandy interpolate -- send out keyframes only twice per second:
    sculpture.fadeCandyController.go(2);

    var i=0,
        interval = setInterval(function() {
      highlight(sculpture.cubes[i++]);
      if (i >= sculpture.cubes.length)
        i = 0;
    }, 500);

    console.log('Highlighting adjacent cubes.  stop() to stop.');
    window.stop = function() { clearInterval(interval); };
  },

  paletteify: function() {
    if (window.stop)
      window.stop();

    require('./pattern_paletteify')(sculpture.cubes, sculpture.fadeCandyController);
  }

};

//window.patterns.cycleCubeHues();
//window.patterns.adjacencyCubes();
window.patterns.paletteify();
