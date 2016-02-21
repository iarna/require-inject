require-inject
--------------

A simple mock injector compatible needing no instrumentation in the libraries being tested

### Example

    var requireInject = require('require-inject');

    var mymod = requireInject('mymod', {
        'fs' => {
            stat: function (file,cb) {
                switch (file) {
                case 'testfile1': return cb(null,{})
                case 'testfile2': return cb(new Error('ENOENT'))
                }
            }
        }
    })

    var myglobal = requireInject.installGlobally('myglobal', { … })
    
### Usage in your tests

* **`var mymod = requireInject( module, mocks )`**

*module* is the name of the module you want to require.  This is what you'd
pass to `require` to load the module from your script. This means that for
relative paths, the path should be relative to your test script, not to the
thing you're injecting dependencies into.

*mocks* is an object with keys that are the names of the modules you want
to mock and values of the mock version of the objects.

**requireInject** makes it so that when *module* is required, any of its
calls to require for modules inclued in *mocks* will return the mocked
version.  It takes care to not impact any other uses of *module*, any
calls to require for it will get a version without mocks.

* **`var myglobal = requireInject.installGlobally( module, mocks)`**

As with `requireInject`, except that the module and its mocks are left in
the require cache and any future requires will end up using them too. This is
helpful particularly in the case of things that defer loading.


## Brute-force

Since sometimes you need to mock a module which is deep in the hierachy of your require.cache where it is really hard to find out where exactly you required it (It only records where it was required when it was cached) we give you a method to completly delete your require.cache.
__WARNING:__ This completly kills the sence of the require.cache which can make your tests really slow.

```javascript
var myMod = requireInject.force('myMod', {
    fs: ownFsModule
});
```