"use strict";
var path = require("path")
var caller = require('caller');

module.exports = function (toLoad, mocks) {
  // Copy the existing cache
  var originalCache = {}
  Object.keys(require.cache).forEach(function(name) {
    originalCache[name] = require.cache[name]
  })

  var mocked = installGlobally(toLoad, mocks)

  // restore the cache, we can't just assign originalCache to require.cache as the require
  // object is unique to each module, even though require.cache is shared
  Object.keys(require.cache).forEach(function(name){ delete require.cache[name] })
  Object.keys(originalCache).forEach(function(name){ require.cache[name] = originalCache[name] })

  return mocked
}

var installGlobally = module.exports.installGlobally = function (toLoad, mocks) {
  // Inject all of our mocks
  Object.keys(mocks).forEach(function(name){
    var path = require.resolve(name)
    if (mocks[name] == null) {
      delete require.cache[path]
    }
    else {
      require.cache[path] = {exports: mocks[name]}
    }
  })

  var callerFilename = caller() == module.filename ? caller(2) : caller();
  if (/^[.][.]?\//.test(toLoad)) {
    toLoad = path.resolve(path.dirname(callerFilename), toLoad)
  }
  var toLoadPath = require.resolve(toLoad)

  // remove any unmocked version previously loaded
  delete require.cache[toLoadPath]

  // load our new version using our mocks
  return module.parent.require(toLoadPath)
}
