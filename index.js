"use strict";
var path = require("path")

module.exports = function (toLoad, mocks) {
  // Inject all of our mocks
  Object.keys(mocks).forEach(function(name){
    var path = require.resolve(name)
    require.cache[path] = {exports: mocks[name]}
  })

  if (/^[.][.]?\//.test(toLoad)) {
      toLoad = path.resolve(path.dirname(module.parent.filename), toLoad)
  }
  var toLoadPath = require.resolve(toLoad)

  // remove any unmocked version previously loaded
  delete require.cache[toLoadPath]
  // load our new version using our mocks
  var mocked = module.parent.require(toLoadPath)
  // remove our version from the cache so anyone else gets the real thing
  delete require.cache[toLoadPath]

  // Remove our injected mocks
  Object.keys(mocks).forEach(function(name){
      delete require.cache[require.resolve(name)]
  })
  return mocked
}
