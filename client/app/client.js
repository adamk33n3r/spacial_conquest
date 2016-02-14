var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Shared;
(function (Shared) {
    var Message = (function () {
        function Message(type) {
            this.type = type;
        }
        return Message;
    }());
    Shared.Message = Message;
    var LoginMessage = (function (_super) {
        __extends(LoginMessage, _super);
        function LoginMessage(name) {
            _super.call(this, "msg:LoginMessage");
            this.username = name;
        }
        return LoginMessage;
    }(Message));
    Shared.LoginMessage = LoginMessage;
})(Shared || (Shared = {}));
/// <reference path="../../shared/test.ts" />
var socket;
define(function (require) {
    var io = require("socket.io");
    socket = io();
    socket.on('msg:LoginMessage', function (data) {
        console.log("Login Message: " + data.username);
    });
});
function connect(username) {
    if (!username)
        return;
    var lm = new Shared.LoginMessage(username);
    sendMessage(lm);
}
function sendMessage(msg) {
    console.log("Sending: " + msg.type + " = " + JSON.stringify(msg));
    socket.emit(msg.type, msg);
}
