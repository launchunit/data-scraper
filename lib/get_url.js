
const got = require('got'),
  logUpdate = require('log-update'),
  randomUA = require('random-ua');


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
module.exports = opts => {

  return new Promise((resolve, reject) => {

    logUpdate(`Fetching Url: ${opts.url}`);

    // Random UA on Each Request
    const headers = Object.assign({
      'User-Agent': randomUA.generate()
    }, opts.headers);

    got(opts.url, {
      method: opts.method || undefined,
      json: true,
      retries: 1,
      agent: opts.agent || false,
      headers: headers,
      query: opts.query || undefined,
      body: opts.body || undefined
    },
    (err, data, response) => {

      logUpdate(`Fetching Complete: ${opts.url}`);

      if (err) {
        if(! err instanceof got.ParseError)
          return reject(err);
      }

      return resolve({
        url: opts.url,
        meta: opts.meta || undefined,
        result: data || null
      })
    });

  });
 }
