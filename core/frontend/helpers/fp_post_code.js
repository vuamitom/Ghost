// # FinPub Post Code Helper
// Usage: `{{post_code}}`
//
// Output product code for the post if any
var proxy = require('./proxy'),
    _ = require('lodash'),
    SafeString = proxy.SafeString;

const urlService = proxy.urlService;
const templates = proxy.templates;

module.exports = function tags(options) {
    options = options || {};
    options.hash = options.hash || {};

    for (let i = 0; i < this.tags.length; i ++) {
        let tag = this.tags[i];
        if (tag.visibility === 'internal') {
            return new SafeString(tag.name.substring(1));
        }
    }
    return new SafeString('');
};
