/**
 * This is a pattern that changes each cube to a random color from some palette.  Each cube gets a different random
 * color every second.  Every color in a palette need not be equally probable -- you can define the probabilities of
 * each color being selected in a palette.
 *
 * Uses Dependency Injection to get cubes and fadeCandyController refs -- see module.exports for what gets exported.
 */
var _ = require('lodash');

// List of palettes to randomly select blocks from
// Format is [0]: probability of selecting the color (relative to total sum), [1] is the color string
var PALETTES = {
  // Nature Walk
  // http://www.colourlovers.com/palette/1081510/Nature_Walk?widths=1
  NATURE_WALK: [
    [194, '#CFB590'],
    [11 , '#9E9A41'],
    [53 , '#758918'],
    [11 , '#564334'],
    [111, '#49281F'],
  ],

  // http://www.colourlovers.com/palette/92095/Giant_Goldfish
  GIANT_GOLDFISH: [
    [1, '#69D2E7'],
    [1, '#A7DBD8'],
    [1, '#E0E4CC'],
    [1, '#F38630'],
    [1, '#FA6900']
  ],

  // http://www.colourlovers.com/palette/3622148/San_Francisco
  SAN_FRANCISCO: [
    [152, '#FA565F'],
    [23 , '#C4C093'],
    [34 , '#9BB697'],
    [46 , '#247B8C'],
    [125, '#2D4B6F']
  ],

  // http://www.colourlovers.com/palette/3641039/fruitful
  FRUITFUL: [
    [217, '#EAF7C0'],
    [49 , '#FFB787'],
    [11 , '#F7778A'],
    [27 , '#A65682'],
    [76 , '#5E1349']
  ],

  //http://www.colourlovers.com/palette/580974/Adrift_in_Dreams
  ADRIFT_IN_DREAMS: [
    [1, '#F8CA00'], // original: CFF09E'],
    [1, '#A8DBA8'],
    [1, '#79BD9A'],
    [1, '#3B8686'],
    [1, '#0B486B']
  ],

  // (◕ ” ◕): http://www.colourlovers.com/palette/848743/(%E2%97%95_%E2%80%9D_%E2%97%95)
  SUGAR_FACE: [
    [100, '#490A3D'],
    [30 , '#BD1550'],
    [30 , '#E97F02'],
    [30 , '#F8CA00'],
    [50 , '#8A9B0F'],
  ]
};

// Makes each palette probability a cumulative density number from 0-1 so a random number 0-1 'lands' on some color
function normalizePaletteProbabilities(palette) {
  var sum = palette.reduce(function(sum, color) { return sum + color[0]; }, 0);

  var cumulativeProbability = 0;
  palette.forEach(function(color) {
    cumulativeProbability += color[0] / sum;
    color[0] = cumulativeProbability;

  });

  return palette;
}

for (var k in PALETTES) {
  PALETTES[k] = normalizePaletteProbabilities(PALETTES[k]);
}

function pickRandomColor(palette) {
  var n = Math.random();
  for (var i=0; i<palette.length; i++) {
    if (palette[i][0] > n)
      break;
  }
  return palette[i][1];
}

// export DI wrapper
module.exports = function(cubes, fadeCandyController) {
  var interval;

  /**
   * Main expose method
   * @param {string | Array} palette name of a palette, or a palette Object literal from PALETTES
   */
  function start(palette) {
    // stop any previous patterns or intervals
    if (window.stop) {
      window.stop();
    }
    if (interval) {
      clearInterval(interval);
      interval = null;
    }

    // pick a palette
    if (_.isString(palette))
      palette = PALETTES[palette];
    else if (_.isArray(palette))
      palette = normalizePaletteProbabilities(palette);
    else // default
      palette = PALETTES.SUGAR_FACE;

    // Stop the fadecandy from auto-update... we'll send frames manually
    fadeCandyController.pause();

    window.stop = function() {
      clearInterval(interval);
      interval = null;
      fadeCandyController.go(); // Make it go back to normal when this pattern is stopped
    };

    interval = setInterval(function() {
      cubes.forEach(function(cube) {
        cube.setColor( pickRandomColor(palette) );
      });
      fadeCandyController.sendLeds();
    }, 1000);
  }

  return {
    start: start,
    PALETTES: PALETTES
  };
};
