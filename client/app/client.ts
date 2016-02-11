/// <reference path="../../shared/test.ts" />
declare var define;

var socket;

define(function(require) {
    var io = require("socket.io");

    socket = io();
    socket.on('msg:LoginMessage', function (data:Shared.LoginMessage) {
        console.log("Login Message: " + data.username);
    });
});

function connect (username) {
    if (!username) return;

    var lm:Shared.LoginMessage = new Shared.LoginMessage(username);
    sendMessage(lm);
}

function sendMessage(msg:Shared.Message) {
    console.log("Sending: " + msg.type + " = " + JSON.stringify(msg));
    socket.emit(msg.type, msg);
}
