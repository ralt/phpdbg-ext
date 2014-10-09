'use strict';

module.exports = function(node) {
    var el = document.createElement('div');
    el.className = 'help';

    var lines = node.getAttribute('msg').split('\n');
    var lineEl = document.createElement('div');
    lineEl.className = 'line';
    lines.forEach(function(line) {
        var lineClone = lineEl.cloneNode();
        lineClone.innerHTML = line;
        el.appendChild(lineClone);
    });
    return el;
};
