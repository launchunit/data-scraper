# Proxy

#### Supported Providers
1. [luminati.io](https://luminati.io/)
2. [tor onion network](https://www.torproject.org/)
3. [Crawlera](https://scrapinghub.com/)

__Note:__ Feel free to ask for more providers.

----

### Usage exmaple
```js
// Use Request module
const request = require('request');


/**
 * Using luminati.IO
 *
 * A new proxy.request() should be used for each request.
 * The proxy nodes are cleared and new nodes are generated based on the `switchEvery` option passed
 */

const luminatiOpts = {
 user: 'USER_NAME',
 pass: 'PASSWORD',
 switchEvery: 100, // (Optional) Default = 50
};

const luminatiProxy = require('./').luminati(luminatiOpts);

request({
  url: 'http://blah.com',
  proxy: Proxy.request() // Proxy to use
}, function (err, res) {
  console.log('"response" event!', res.headers);
});


/**
 * Using Tor
 */
// @params {String}  opts.socksHost (Optional)
// @params {Number}  opts.socksPort (Optional)

const torProxy = require('./').tor();

var R = request.defaults(torProxy);

request({
  url: 'http://blah.com',
}, function (err, res) {
  console.log('"response" event!', res.headers);
});


/**
 * Using Scrapinghub Crawlera
 */
const apiKey = 'Some_key';
const crawleraProxy = require('./').crawlera(apiKey);

var R = request.defaults(crawleraProxy);

request({
  url: 'http://blah.com',
}, function (err, res) {
  console.log('"response" event!', res.headers);
});
```

#### Run Tests
```bash
$ npm test
```
