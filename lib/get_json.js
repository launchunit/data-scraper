
const _ = require('lodash'),
  got = require('got'),
  logUpdate = require('log-update'),
  async = require('async');


/**
 * @param opts.seedData {Array} - [{url,query,meta}]
 * @param opts.resultFn {Function} // Async
 * @param opts.nextSeedFn {Function} @return {url,query,meta}, // null can also be passed
 * @param opts.headers {Object} - GET request headers
 * @param opts.query {Object} - GET request query
 * @param opts.concurrency (Optional) Default = 10
 **/
module.exports = opts => {

  var Count = 0;
  const CONCURRENCY = opts.concurrency || 10;
  console.time('Processing Time');


  const headers = Object.assign({
    'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
  }, opts.headers);


  return new Promise((resolve, reject) => {

    // Create a Queue for task
    const Queue = async.queue((item, cb) => {

      if (++Count % 9999 === 0)
        logUpdate(`Processing Item: ${Count}`);


      // Defer to next tick of the event loop.
      async.setImmediate(() => {

        logUpdate(`Fetching Url: ${item.url}`);

        got(item.url, {
          retries: 1,
          agent: false,
          json: true,
          headers: headers,
          query: item.query || opts.query || {}
        },
        (err, data) => {

          logUpdate(`Fetching Complete: ${item.url}`);

          if (err) {
            console.log(err);
          }

          else {

            data = {
              url: item.url,
              query: item.query || opts.query || {},
              meta: item.meta || null,
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

      });
    }, CONCURRENCY);


    const addToQueue = data => {
      if (Array.isArray(data)) {
        _.forEach(data, function(i) {
          Queue.push(i, Queue.QueueErr);
        });
      }

      else
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
