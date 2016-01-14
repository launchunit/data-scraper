
exports.rejectCodes = [403, 429, 502, 503];

exports.luminati = require('./luminati');

exports.tor = require('./tor');

exports.crawlera = require('./crawlera');

exports.init = function(opts) {

  if (! opts.provider)
    throw new Error('opts.proxy.provider is required')

  return exports[opts.provider](opts);
};
