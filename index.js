
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
exports.getData = require('./lib/get');


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
exports.getUrl = require('./lib/get_url')
