
'use strict';

const TorControl = require('tor-control');


module.exports = opts => {

  cont t = TorControl(Object.assign({
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
