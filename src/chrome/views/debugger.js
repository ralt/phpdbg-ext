'use strict';

var socket = require('../socket');
var phpdbgParser = require('../../phpdbg/parser');

var name = 'debugger';
var element = document.querySelector('#debugger');

var connected = document.querySelector('#connected');
var prompt = document.querySelector('#prompt');
var content = document.querySelector('#content');

prompt.addEventListener('keyup', function(e) {
    if (e.keyCode !== 13) return;

    var command = prompt.value;
    prompt.value = '';

    socket.send(command, fillContent);
});

function fillContent(xmldata) {
    phpdbgParser(xmldata).forEach(function(node) {
        content.appendChild(node);
    });
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
