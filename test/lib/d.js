'use strict';
// dependencies:
/*
  d requries b and e
  b requires fs
  e requires fs
*/

var b = require('./b');
var e = require('./e');
module.exports.b = function(infile, outfile, cb) {
  b(infile, outfile, cb);
};
module.exports.e = function(infile, outfile, cb) {
  e(infile, outfile, cb);
};
