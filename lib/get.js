
const _ = require('lodash'),
  got = require('got'),
  cheerio = require('cheerio'),
  logUpdate = require('log-update'),
  randomUA = require('random-ua'),
  async = require('async');


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
 * @param opts.method (Optional) Default = GET
 * @param opts.body (Optional)
 * @param opts.wait (Optional) Default = 0ms
 **/
module.exports = opts => {

  var Count = 0;
  const CONCURRENCY = opts.concurrency || 10;
  console.time('Processing Time');


  return new Promise((resolve, reject) => {

    // Create a Queue for task
    const Queue = async.queue((item, cb) => {

      if (++Count % 9999 === 0)
        logUpdate(`Processing Item: ${Count}`);


      // Defer to next tick of the event loop.
      async.setImmediate(() => {
        setTimeout(function() {

          logUpdate(`Fetching Url: ${item.url}`);

          // Random UA on Each Request
          const headers = Object.assign({
            'User-Agent': randomUA.generate()
          }, opts.headers, item.headers);


          got(item.url, {
            method: item.method || opts.method || undefined,
            json: opts.requestType === 'json',
            retries: 1,
            agent: false,
            headers: headers,
            query: item.query || opts.query || undefined,
            body: item.body || opts.body || undefined
          },
          (err, data, response) => {

            logUpdate(`Fetching Complete: ${item.url}`);

            if (err) {
              console.log(err);
              console.log(data);
            }

            else {

              // Parse HTML w/ Cheerio
              if (opts.requestType === 'html') {

                data = cheerio.load(data, {
                  normalizeWhitespace: true,
                  lowerCaseTags: true,
                  lowerCaseAttributeNames: true
                });
              }

              data = {
                url: item.url,
                query: item.query || opts.query || undefined,
                body: item.body || opts.body || undefined,
                meta: item.meta || undefined,
                headers: response.headers
                result: data
              };

              opts.resultFn(data);

              // If nextSeed exits, invoke the function
              if (opts.nextSeedFn) {
                const nextSeed = opts.nextSeedFn(data);
                if (nextSeed) addToQueue(nextSeed);
              }
            }

            return cb();
          });

        }, opts.wait || 0);
      });
    }, CONCURRENCY);


    const addToQueue = data => {
      if (Array.isArray(data)) {
        _.forEach(data, function(i) {
          Queue.push(i, Queue.QueueErr);
        });
      }

      else if (typeof data === 'object')
        Queue.push(data, Queue.QueueErr);
    };

    Queue.drain = err => {
      if (err) return reject(err);
      console.timeEnd('Processing Time');
      return resolve(Count);
    };

    Queue.QueueErr = err => {
      if (err) {
        console.log(err);
        return reject(err);
      }
    };

    // Inital Queue up the Tasks
    addToQueue(opts.seedData);
  });
 }
