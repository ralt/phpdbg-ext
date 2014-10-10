'use strict';

var md = require('../markdown');
var element = require('../element');

module.exports = function(node) {
    var el = element('help');

    var lines = node.getAttribute('msg').split('\n');
    var lineEl = element('line');

    lines.forEach(function(line) {
        var lineClone = lineEl.cloneNode();
        lineClone.innerHTML = md(line);
        el.appendChild(lineClone);
    });

    return el;
};
