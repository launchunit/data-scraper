
'use strict';


/**
 * @params {String} opts.socksHost (Optional)
 * @params {Number} opts.socksPort (Optional)
 *
 * @public
 */
module.exports = opts => {

  opts = Object.assign({
    socksHost: '127.0.0.1',
    socksPort: 9050
  } , opts || {});

  return {
    agentClass: require('socks5-http-client/lib/Agent'),
    agentOptions: opts
  };
};
