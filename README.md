# Data-Scraper

```js
/**
 * GET JSON from API
 *
 * @param opts.seedData {Object|Array} - [{url,query,meta}]
 * @param opts.requestType {String} 'json|html'
 * @param opts.resultFn {Function} // Async
 * @param opts.nextSeedFn {Function}
 *        @return {Object|Array} [{url,query,meta}], // null can also be passed
 * @param opts.agent {Object} (Optional)
 * @param opts.headers {Object} - GET request headers
 * @param opts.query {Object} - GET request query
 * @param opts.concurrency (Optional) Default = 10
 * @param opts.method (Optional) Default = GET
 * @param opts.body (Optional)
 * @param opts.wait (Optional) Default = 0ms
 **/
Promise.resolve()
.then(() => {
  return require('./lib').getJson({
    requestType: 'html' || 'json',
    seedData: {
      url: 'https://www.exmaple.com/',
      meta: 'directory'
    },
    query: {}
    headers: {}
    concurrency: 1,
    resultFn: function(R) {
      console.log(R);
    },
    nextSeedFn: function(R) {
      return R.results;
    }
  })
})
.then(count => {
  console.log(`All Done ${count}`);
})
.catch(err => {
  console.error(err);
});


/**
 * GET_URL
 *
 * @param opts.url {String}
 * @param opts.agent {Object} (Optional)
 * @param opts.headers {Object} - GET request headers
 * @param opts.query {Object} - GET request query
 * @param opts.method (Optional) Default = GET
 * @param opts.body (Optional)
 * @param opts.meta (Optional)
 **/
Promise.resolve()
.then(() => {
  return require('./lib').getJson({
    url: 'http://supermain.com/json'
  })
})
.then(res => {
  console.log(res);
})
.catch(err => {
  console.error(err);
});
```
