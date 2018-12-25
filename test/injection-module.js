'use strict'
var path = require('path')
var test = require('tap').test
var Tacks = require('tacks')
var File = Tacks.File
var Dir = Tacks.Dir
var requireInject = require('../index')

var testdir = path.join(__dirname, path.basename(__filename, '.js'))
var adir = path.join(testdir, 'a')
var bdir = path.join(testdir, 'b')
var bfilename = bdir + '.js'

var fixture = new Tacks(
  Dir({
    'a.js': File(
      "'use strict';\n" +
      "require('./b');\n"
    ),
    'b.js': File('')
  })
)

test('setup', function (t) {
  fixture.create(testdir)
  t.end()
})

test('mock with details of original module', function (t) {
  t.plan(4)

  var bmod

  Object.defineProperty(require.cache, bfilename, {
    configurable: true,
    enumerable: true,
    get () {
      return bmod
    },
    set (value) {
      bmod = value
    }
  })

  require(bdir)

  requireInject(adir, {
    [bdir]: 'mock'
  })

  t.equal(bmod.filename, bfilename)
  t.equal(bmod.id, bfilename)
  t.equal(bmod.loaded, true)
  t.equal(bmod.parent, require.cache[__filename])
})

test('cleanup', function (t) {
  fixture.remove(testdir)
  t.end()
})
