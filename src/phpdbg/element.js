'use strict';

var el = document.createElement('div');

module.exports = function(className) {
    var clone = el.cloneNode();
    clone.className = className;
    return clone;
};
