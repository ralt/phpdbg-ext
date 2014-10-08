'use strict';

var socket = require('../socket');
var manager = require('./manager');

var name = 'connection';
var element = document.querySelector('#connection');

var submit = document.querySelector('#submit-connection');
var hostname = document.querySelector('#hostname');
var port = document.querySelector('#port');
var error = document.querySelector('#error');

submit.addEventListener('click', function(e) {
    e.preventDefault();
    socket.connect(hostname.value, +port.value, connected);
});

function connected(result) {
    if (result !== 0) {
        return showError("Can't connect to phpdbg. Error code: " + result);
    }

    manager.setView('debugger');
    manager.getView('debugger').start(hostname.value, port.value);
}

function showError(msg) {
    error.textContent = msg;
    error.hidden = false;
    setTimeout(function() {
        error.hidden = true;
    }, 5000);
}

module.exports = {
    getName: function() {
        return name;
    },

    getElement: function() {
        return element;
    }
};
