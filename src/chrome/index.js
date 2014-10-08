'use strict';

var viewsManager = require('./views/manager');
var connectionView = require('./views/connection');
var debuggerView = require('./views/debugger');

viewsManager.add(connectionView);
viewsManager.add(debuggerView);
viewsManager.setDefault(connectionView);
viewsManager.run();

/*

 This is working code from previous manual tests.
 Keeping them for the sake of having a correct example.



var socketId;

chrome.sockets.tcp.create({}, function(socket) {
    socketId = socket.socketId;
    chrome.sockets.tcp.connect(socketId, '127.0.0.1', 4000, function(result) {
        console.log('result', result);
        if (result < 0) {
            throw new Exception('Something went wrong');
        }

        chrome.sockets.tcp.send(socketId, str2ab('help\n'), function(resultCode, bytesSent) {
            console.log(resultCode);
            console.log(bytesSent);
        });
    });
});

chrome.sockets.tcp.onReceive.addListener(function(info) {
    console.log('socket', info.socketId);
    console.log('data', ab2str(info.data));
});

chrome.sockets.tcp.onReceiveError.addListener(function(info) {
    console.log('socketerror', info.socketId);
    console.log('resultCode', info.resultCode);
});

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
*/
