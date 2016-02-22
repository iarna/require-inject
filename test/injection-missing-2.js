"use strict";
var test = require("tap").test
var requireInject = require("../index")


test("injection leaking at a distance", function(t) {
  t.plan(2);

  var first = require("./lib/d");

  first.b("in", "out", function (err) { t.ok(err,"shouldn\'t be able to rename") })
  first.e("in", "out", function (err) { t.ok(err,"shouldn\'t be able to rename") })

  var second = requireInject.force("./lib/d", {
    "fs": {
      rename: function(infile, outfile, cb) {
        cb()
      }
    }
  });

  second.b("in", "out", function (err) { t.notOk(err,"should be able to rename a file now") })
  second.e("in", "out", function (err) { t.notOk(err,"should be able to rename a file now") })
})
