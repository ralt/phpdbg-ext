'use strict';

var socket = require('../socket');
var phpdbgParser = require('../../phpdbg/parser');
var manager = require('./manager');

var name = 'debugger';
var element = document.querySelector('#debugger');

var connected = document.querySelector('#connected');
var prompt = document.querySelector('#prompt');
var content = document.querySelector('#content');
var disconnect = document.querySelector('#disconnect');

prompt.addEventListener('keydown', function(e) {
    if (e.keyCode !== 13) return;

    var command = prompt.value;
    prompt.value = '';

    addPrompt(command);

    socket.send(command, fillContent);
});

function addPrompt(command) {
    var el = document.createElement('div');
    el.className = 'command';
    el.textContent = '> ' + command;
    content.appendChild(el);
}

function fillContent(xmldata) {
    phpdbgParser(xmldata).forEach(function(node) {
        content.appendChild(node);
    });
    content.scrollByPages(100); // should be safe enough
}

disconnect.addEventListener('click', function() {
    content.innerHTML = '';
    socket.disconnect();
    manager.setView('connection');
});

module.exports = {
    getName: function() {
        return name;
    },

    getElement: function() {
        return element;
    },

    start: function(hostname, port) {
        connected.textContent = hostname + ':' + port;
        prompt.focus();
    }
};
