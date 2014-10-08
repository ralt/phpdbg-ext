'use strict';

var manager = require('./manager');

var name = 'connection';
var element = document.querySelector('#connection');

var submit = document.querySelector('#submit-connection');
var hostname = document.querySelector('#hostname');
var port = document.querySelector('#port');
var error = document.querySelector('#error');

submit.addEventListener('click', function(e) {
    chrome.sockets.tcp.create({}, socketCreated);
});

function socketCreated(socketInfo) {
    chrome.sockets.tcp.connect(socketInfo.socketId, hostname.value,
                               +port.value || 0, socketConnected);
}

function socketConnected(result) {
    if (result !== 0) {
        return showError("Can't connect to phpdbg. Error code: " + result);
    }

    manager.setView('debugger');
}

function showError(msg) {
    error.textContent = msg;
    error.hidden = false;
    setTimeout(function() {
        error.hidden = true;
    }, 3000);
}

module.exports = {
    getName: function() {
        return name;
    },

    getElement: function() {
        return element;
    }
};
