
'use strict';


/**
 * @params {String} apiKey
 *
 * @public
 */
function Proxy(apiKey) {

  if (! apiKey)
    throw new Error('apiKey is required.');

  return {
    proxy: `http://${apiKey}:@proxy.crawlera.com:8010`
  };

};
