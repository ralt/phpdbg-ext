'use strict';

var element = require('./element');

module.exports = function(className, attr) {
    return function(node) {
        var el = element(className);
        el.innerHTML = node.getAttribute(attr || 'msgout');
        return el;
    };
};
