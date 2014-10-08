'use strict';

var name = 'debugger';
var element = document.querySelector('#debugger');

module.exports = {
    getName: function() {
        return name;
    },

    getElement: function() {
        return element;
    }
};
