
process.chdir(__dirname);

/**
 * Example Usage
 **/


Promise.resolve()

.then(() => {
  return require('./lib').getJson({
    seedData: {
      url: 'https://www.example.com/',
      meta: 'directory'
    },
    query: {},
    headers: {},
    concurrency: 1,
    resultFn: R => {
    },
    nextSeedFn: R => {}
  });
})

.then(count => {
  console.log(`All Done ${count}`);
  File.end();
})

.catch(err => {
  console.error(err);
});
