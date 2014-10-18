'use strict';

module.exports = function(className) {
    var el = document.createElement('div');
    el.className = className;
    return el;
};
