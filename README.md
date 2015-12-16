# Data-Scraper

```js

// GET JSON from API
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
