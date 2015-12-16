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
 * @param opts.headers {Object} - GET request headers
 * @param opts.query {Object} - GET request query
 * @param opts.concurrency (Optional) Default = 10
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
```
