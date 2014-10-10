'use strict';

var element = require('../element');

module.exports = function(node) {
    var el = element('clear');
    el.innerHTML = node.getAttribute('msgout');
    return el;
};
