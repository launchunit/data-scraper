
const _ = require('lodash'),
  request = require('request'),
  cheerio = require('cheerio'),
  logUpdate = console.log,
  // logUpdate = require('log-update'),
  randomUA = require('random-ua'),
  async = require('async'),
  ProxyAgent = require('proxy-agent');


const errorCodes = [
  'EADDRINFO',
  'ETIMEDOUT',
  'ECONNRESET',
  'ESOCKETTIMEDOUT',
  'ENOTFOUND',
  'EADDRNOTAVAIL'
];


/**
 * GET JSON from API
 *
 * @param opts.seedData {Object|Array} - [{url,query,meta}]
 * @param opts.requestType {String} 'json|html'
 * @param opts.resultFn {Function} // Async
 * @param opts.nextSeedFn {Function}
 *        @return {Object|Array} [{url,query,meta}], // null can also be passed
 * @param opts.proxy {Object} (Optional) - Passed to ProxyAgent
 * @param opts.headers {Object} - request headers
 * @param opts.query {Object} - request query
 * @param opts.concurrency (Optional) Default = 10
 * @param opts.method (Optional) Default = GET
 * @param opts.body (Optional)
 * @param opts.form (Optional)
 * @param opts.wait (Optional) Default = 0ms
 **/
module.exports = opts => {

  var Count = 0;
  const CONCURRENCY = opts.concurrency || 10;
  console.time('Processing Time');


  // Request Defaults
  const Request = request.defaults({
    json: opts.requestType === 'json',
    followRedirect: false,
    timeout: 999999,
    pool: {
      maxSockets: Infinity
    }
  });


  if (opts.proxy) {
    var Proxy = ProxyAgent(opts.proxy);
  }


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

          var requestObj = {
            method: item.method || opts.method || undefined,
            headers: headers,
            query: item.query || opts.query || undefined,
            body: item.body || opts.body || undefined,
            form: item.form || opts.form || undefined
          };

          // Proxy Request
          if (opts.proxy) {
            requestObj.proxy = Proxy.request();
          }

          // Run the Request
          req();

          function req() {

            Request(item.url, requestObj, (err, response, data) => {

              logUpdate(`Fetching Complete: ${item.url}`);

              if (err) {
                console.error(`Fetching Error: ${err.message} Code: ${err.code}`);

                // Check Against Error Codes for Retry
                if (errorCodes.indexOf(err.code) !== -1 &&
                  requestObj.proxy) {
                  requestObj.proxy = Proxy.request(true);
                  return req();
                }

                else {
                  console.error(requestObj);
                  return cb(err);
                }
              }

              else if (response.statusCode >= 500) {
                console.error(`Fetching Response Failed statusCode: ${response.statusCode}`);

                if (requestObj.proxy) {
                  requestObj.proxy = Proxy.request(true);
                  return req();
                }

                else {
                  console.error(requestObj);
                  return cb(new Error(`${data.message} statusCode: ${data.status}`));
                }
              }

              else reqDone(response, data);
            });
          };

          function reqDone(response, data) {

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
              headers: response.headers,
              result: data
            };

            opts.resultFn(data);

            // If nextSeed exits, invoke the function
            if (opts.nextSeedFn) {
              const nextSeed = opts.nextSeedFn(data);
              if (nextSeed) addToQueue(nextSeed);
            }
            return cb();
          }

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
        return reject(err);
      }
    };

    // Inital Queue up the Tasks
    addToQueue(opts.seedData);
  });
 }
