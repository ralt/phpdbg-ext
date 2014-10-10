'use strict';

var element = require('../element');

module.exports = function(node) {
    var el = element('phpdbg');
    el.innerHTML = node.nodeValue;
    return el;
};
