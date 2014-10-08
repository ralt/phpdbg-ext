'use strict';

var socket = require('../socket');

var name = 'debugger';
var element = document.querySelector('#debugger');

var connected = document.querySelector('#connected');
var prompt = document.querySelector('#prompt');

prompt.addEventListener('keyup', function(e) {
    if (e.keyCode !== 13) return;

    var command = prompt.value;
    prompt.value = '';

    socket.send(command, fillContent);
});

function fillContent(xmldata) {
    console.log(xmldata);
}

module.exports = {
    getName: function() {
        return name;
    },

    getElement: function() {
        return element;
    },

    start: function(hostname, port) {
        connected.textContent = hostname + ':' + port;
    }
};
