
'use strict';


/**
 * @params {String} apiKey
 *
 * @public
 */
function Proxy(opts) {

  if (! opts.apiKey)
    throw new Error('opts.apiKey is required.');

  return {
    proxy: `http://${apiKey}:@proxy.crawlera.com:8010`
  };
};
