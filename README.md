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
    
### Usage

* **`var mymod = requireInject( module, mocks )`**

*module* is the name of the module you want to require.

*mocks* is an object with keys that are the names of the modules you want
*to mock and values of the mock version of the objects.

**requireInject** makes it so that when *module* is required, any of its
calls to require for modules inclued in *mocks* will return the mocked
version.  It takes care to not impact any other uses of *module*, any
calls to require for it will get a version without mocks.

