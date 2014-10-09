'use strict';

module.exports = function(node) {
    var el = document.createElement('div');
    el.className = 'intro';

    el.innerHTML = node.getAttribute('msgout');
    return el;
};
