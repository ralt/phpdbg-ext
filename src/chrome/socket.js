'use strict';

var tcp = chrome.sockets.tcp;

var socketId, sendCb;

tcp.onReceive.addListener(function(info) {
    if (info.socketId !== socketId) return;

    sendCb(ab2str(info.data));

exports.connect = function(hostname, port, cb) {
    tcp.create({}, function(socketInfo) {
        socketId = socketInfo.socketId;
        tcp.connect(socketId, hostname, port || 0, cb);
    });
};

exports.send = function(command, cb) {
    sendCb = cb;
    tcp.send(socketId, str2ab(command + '\n'), function() {});
};

exports.disconnect = function() {
    tcp.close(socketId, function() {});
};

// Thanks html5rocks
// http://updates.html5rocks.com/2012/06/How-to-convert-ArrayBuffer-to-and-from-String
function ab2str(buf) {
  return String.fromCharCode.apply(null, new Uint8Array(buf)); // ascii
}

function str2ab(str) {
    var buf = new ArrayBuffer(str.length); // 1 bytes for each char, ascii
    var bufView = new Uint8Array(buf);
    for (var i = 0; i < str.length; i++) {
        bufView[i] = str.charCodeAt(i);
    }
    return buf;
}
