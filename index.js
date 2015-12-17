
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
 exports.getData = require('./lib/get');
