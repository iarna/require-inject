'use strict'
var path = require('path')
var caller = require('caller')

module.exports = function (toLoad, mocks) {
  return requireInject(toLoad, mocks)
}
module.exports.andClearCache = function (toLoad, mocks) {
  return requireInject(toLoad, mocks, true)
}

var requireInject = function (toLoad, mocks, force) {
  // Copy the existing cache
  var originalCache = {}
  var callerFilename = getCallerFilename()
  Object.keys(require.cache).forEach(function (name) {
    originalCache[name] = require.cache[name]
    if (force && name !== callerFilename) {
      delete require.cache[name]
    }
  })

  var mocked = installGlobally(toLoad, mocks)

  // restore the cache, we can't just assign originalCache to require.cache as the require
  // object is unique to each module, even though require.cache is shared
  Object.keys(require.cache).forEach(function (name) { delete require.cache[name] })
  Object.keys(originalCache).forEach(function (name) { require.cache[name] = originalCache[name] })

  return mocked
}

function resolve (callerFilename, name) {
  if (/^[.][.]?\//.test(name)) {
    name = path.resolve(path.dirname(callerFilename), name)
  }
  return require.resolve(name)
}

var installGlobally = module.exports.installGlobally = function (toLoad, mocks) {
  var callerFilename = getCallerFilename()

  // Inject all of our mocks
  Object.keys(mocks).forEach(function (name) {
    var namePath = resolve(callerFilename, name)
    if (mocks[name] == null) {
      delete require.cache[namePath]
    } else {
      require.cache[namePath] = {exports: mocks[name]}
    }
  })

  var toLoadPath = resolve(callerFilename, toLoad)

  // remove any unmocked version previously loaded
  delete require.cache[toLoadPath]
  // load our new version using our mocks
  return require.cache[callerFilename].require(toLoadPath)
}

function getCallerFilename () {
  var i = 1
  var callerFound = caller(i)
  while (callerFound === module.filename && i < 6) {
    i++
    callerFound = caller(i)
  }
  if (i === 5) {
    throw Error('Couldn\'t find callerModule in first 5 moduleCalls')
  }
  return callerFound
}
