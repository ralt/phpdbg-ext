'use strict';

var tcp = chrome.sockets.tcp;

var socketId;

exports.connect = function(hostname, port, cb) {
    tcp.create({}, function(socketInfo) {
        socketId = socketInfo.socketId;
        tcp.connect(socketId, hostname, port || 0, cb);
    });
};
