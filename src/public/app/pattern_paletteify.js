// List of palettes to randomly select blocks from
// Format is [0]: probability of selecting the color, [1] is the color string
var palettes = {
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

};

function normalizePaletteProbabilities(palette) {
  var sum = palette.reduce(function(sum, color) { return sum + color[0]; }, 0);

  var cumulativeProbability = 0;
  palette.forEach(function(color) {
    cumulativeProbability += color[0] / sum;
    color[0] = cumulativeProbability;

  });

  return palette;
}

for (var k in palettes) {
  palettes[k] = normalizePaletteProbabilities(palettes[k]);
}

function pickRandomColor(palette) {
  var n = Math.random();
  for (var i=0; i<palette.length; i++) {
    if (palette[i][0] > n)
      break;
  }
  return palette[i][1];
}

module.exports = function(cubes, fadeCandyController) {
  fadeCandyController.pause();

  function randomCubeColor(cube) {
    cube.setColor(pickRandomColor(palettes.NATURE_WALK));
    //cube.setColor(pickRandomColor(palettes.GIANT_GOLDFISH));
    // cube.setColor(pickRandomColor(palettes.SAN_FRANCISCO));
    // cube.setColor(pickRandomColor(palettes.FRUITFUL));
  }
  var interval = setInterval(function() {
    cubes.forEach(randomCubeColor);
    fadeCandyController.sendLeds();
  }, 500);

  window.stop = function() { clearInterval(interval); };
};
