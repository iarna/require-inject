'use strict'
var fs = require('fs')
module.exports = function (infile, outfile, cb) {
  fs.rename(infile, outfile, cb)
}
