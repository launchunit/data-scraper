
exports.rejectCodes = [403, 429, 502, 503];

exports.luminati = require('./luminati');

exports.tor = require('./tor');

exports.crawlera = require('./crawlera');

exports.init = function(opts) {
  return module[opts.provider](opts);
};
