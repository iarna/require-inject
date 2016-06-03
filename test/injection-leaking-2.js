'use strict'
var test = require('tap').test
var requireInject = require('../index')

test('injection leaking at a distance', function (t) {
  t.plan(2)

  var first = requireInject('./lib/b', {
    'fs': {
      rename: function (infile, outfile, cb) {
        cb()
      }
    }
  })
  first('in', 'out', function (err) { t.notOk(err, 'should be able to rename a file') })

  var second = require('./lib/c')

  second('in', 'out', function (err) { t.ok(err, 'shouldn\'t be able to rename now') })
})
