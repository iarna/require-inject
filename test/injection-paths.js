'use strict'

var test = require('tap').test
var requireInject = require('../index')

test('mock with absolute path', function (t) {
  t.plan(1)

  var a = requireInject('./lib/a', {
    [require.resolve('./lib/b')]: function (infile, outfile, cb) {
      cb()
    }
  })

  a('in', 'out', function (err) {
    t.notOk(err, 'should be able to rename a file')
  })
})

test('mock with relative path', function (t) {
  t.plan(1)

  var a = requireInject('./lib/a', {
    './lib/b': function (infile, outfile, cb) {
      cb()
    }
  })

  a('in', 'out', function (err) {
    t.notOk(err, 'should be able to rename a file')
  })
})
