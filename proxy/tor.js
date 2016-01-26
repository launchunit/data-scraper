
'use strict';

const TorProxy = require('tor-proxy');


module.exports = opts => {

  const t = TorProxy(Object.assign({
    switchEvery: 50  // Overriding exiting 20 default
  }, opts));

  // Appending Additional Props
  t.requestDefaults = {
    agentClass: require('socks5-http-client/lib/Agent'),
    agentOptions: {
      socksHost: t.socksHost,
      socksPort: t.socksPort
    }
  };

  return t;
};
