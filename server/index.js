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
/// <reference path="../shared/test.ts" />
var http = require("http");
var fs = require("fs");
var url = require("url");
var path = require("path");
var socketio = require("socket.io");
var config = require('./config.json');
var GameServer = (function () {
    function GameServer() {
        this.testName = "Fred";
        console.log("Starting file server...");
        this.fileServer = http.createServer(function (req, res) {
            var uri = url.parse(req.url).pathname;
            var filename = path.join(fs.realpathSync('../client'), uri);
            fs.exists(filename, function (exists) {
                if (!exists) {
                    res.writeHead(404, { "Content-Type": "text/plain" });
                    res.write("404 Not Found\n");
                    res.end();
                    return;
                }
                if (fs.statSync(filename).isDirectory())
                    filename += '/index.html';
                fs.readFile(filename, "binary", function (err, file) {
                    if (err) {
                        res.writeHead(500, { "Content-Type": "text/plain" });
                        res.write(err + "\n");
                    }
                    else {
                        res.writeHead(200);
                        res.write(file, "binary");
                    }
                    res.end();
                });
            });
        });
        // Socket.io
        console.log("Starting socket io...");
        this.io = socketio(this.fileServer);
        this.io.on('connection', this.onConnection.bind(this));
    }
    GameServer.prototype.start = function () {
        this.fileServer.listen(config.port);
        console.log("Listening on port: " + config.port);
    };
    GameServer.prototype.onConnection = function (sck) {
        // TODO: Add standard logging framework like:
        //       https://github.com/bluejamesbond/Scribe.js
        console.log('New Connection!');
        sck.on('msg:LoginMessage', this.onUserNew.bind(this, sck));
    };
    GameServer.prototype.onUserNew = function (sck, msg) {
        console.log("Got Login Message: " + JSON.stringify(msg));
        // All other clients except for this one
        this.broadcastMessage(sck, msg);
    };
    GameServer.prototype.sendMessage = function (msg) {
        console.log("Sending: " + JSON.stringify(msg));
        this.io.send(msg.type, msg);
    };
    GameServer.prototype.broadcastMessage = function (sck, msg) {
        console.log("Broadcasting: " + JSON.stringify(msg));
        sck.broadcast.emit(msg.type, msg);
    };
    return GameServer;
}());
var gameServer = new GameServer();
gameServer.start();
