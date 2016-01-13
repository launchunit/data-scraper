
'use strict';

/**
 * Module dependencies.
 * @private
 */
const Chance = require('chance').Chance();


/**
 * @params {String}  opts.user
 * @params {String}  opts.pass
 * @params {Number}  opts.switchEvery (Optional) Default = 50
 *
 * @public
 */
function Proxy(opts) {

  if (! (opts.user && opts.pass))
    throw new Error('opts.user and opts.pass is required.');

  this.user = opts.user;
  this.pass = opts.pass;
  this.switchEvery = opts.switchEvery || 50;

  this.lastProxy = undefined;
  this.count = 1;
};


Proxy.prototype = {

  request: function(forceNewAgent) {

    // Force new proxy agent
    if (forceNewAgent) {
      this.lastProxy = undefined;
    }

    if (this.lastProxy &&
        this.count % this.switchEvery !== 0) {

      ++this.count;
      return this.lastProxy;
    }

    // Reset count for memory
    this.count = 1;

    // Generate a new random sessionId
    const sessionId = Chance.hash({ length: 5 });

    this.lastProxy = `http://${self.user}-session-${sessionId}:${self.pass}@zproxy.luminati.io:22225`;
    return this.lastProxy;
  }
};
