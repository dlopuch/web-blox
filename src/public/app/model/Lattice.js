var _ = require('lodash'),
    Cube = require('./Cube');

/**
 * @constructor
 *
 * Create a new lattice
 *
 * @param {number} maxX Size of lattice in x
 * @param {number} maxY Size of lattice in y
 * @param {number} maxZ Size of lattice in z
 */
var Lattice = module.exports = function(maxX, maxY, maxZ) {
  _.bindAll(this);

  this.maxX = maxX;
  this.maxY = maxY;
  this.maxZ = maxZ;

  this.cubeCount = 0;

  this._cubePosByIdx = {};

  // Create cubes matrix: this.cubes[x][y][z]
  this.cubes = new Array(maxX);
  for (var x = 0; x < maxX; x++) {
    this.cubes[x] = new Array(maxY);

    for (var y = 0; y < maxY; y++) {
      this.cubes[x][y] = new Array(maxZ);
    }
  }
};

Lattice.prototype._validateXyz = function _validateXyz(x, y, z) {
  if (x < 0 || this.maxX <= x)
    throw new Error('x is out of lattice bounds');
  if (y < 0 || this.maxY <= y)
    throw new Error('x is out of lattice bounds');
  if (z < 0 || this.maxZ <= z)
    throw new Error('x is out of lattice bounds');
  return;
};

/**
 * Creates a new cube and adds it to the lattice at the given position
 *
 * @param {number} x Position of cube
 * @param {number} y Position of cube
 * @param {number} z Position of cube
 */
Lattice.prototype.makeCube = function makeCube(x, y, z) {
  this._validateXyz(x, y, z);

  if (this.cubes[x][y][z])
    throw new Error('cube already exists at x,y,z');

  var cube = new Cube();
  cube.setColor('rgb 255 255 255');

  this.cubes[x][y][z] = cube;
  this._cubePosByIdx[cube.id] = [x,y,z];

  return cube;
};

Lattice.prototype.getAdjacentCubes = function getAdjacentCubes(cube) {
  var pos = this._cubePosByIdx[cube.id];

  if (!pos)
    throw new Error('Cube not in the lattice');

  return this.getAdjacentCubesByVector(pos[0], pos[1], pos[2]);
};


Lattice.prototype.getAdjacentCubesByVector = function getAdjacentCubesByVector(x, y, z) {
  this._validateXyz(x, y, z);

  var adjacentCubes = [];

  for (var ix = x-1; ix <= x+1; ix++) {
    if (!this.cubes[ix])
      continue;

    for (var iy = y-1; iy <= y+1; iy++) {
      if (!this.cubes[ix][iy])
        continue;

      for (var iz = z-1; iz <= z+1; iz++) {
        if (this.cubes[ix][iy][iz])
          adjacentCubes.push(this.cubes[ix][iy][iz]);
      }
    }
  }

  return adjacentCubes;
};


