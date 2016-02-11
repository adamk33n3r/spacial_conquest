/// <reference path="../shared/test.ts" />

var http = require("http");
var fs = require("fs");
var url = require("url");
var path = require("path");
var socketio = require("socket.io");

var config = require('./config.json');

class GameServer {
    testName:string = "Fred";
    io: SocketIO.Server;
    fileServer: any;

    constructor() {
        console.log("Starting file server...");
        this.fileServer = http.createServer(function (req, res) {
            var uri = url.parse(req.url).pathname;
            var filename = path.join(fs.realpathSync('../client'), uri);

            fs.exists(filename, function(exists) {
                if(!exists) {
                    res.writeHead(404, {"Content-Type": "text/plain"});
                    res.write("404 Not Found\n");
                    res.end();
                    return;
                }

                if (fs.statSync(filename).isDirectory()) filename += '/index.html';

                fs.readFile(filename, "binary", function(err, file) {
                    if(err) {
                        res.writeHead(500, {"Content-Type": "text/plain"});
                        res.write(err + "\n");
                    } else {
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

    start() {
        this.fileServer.listen(config.port);
        console.log("Listening on port: " + config.port);
    }

    onConnection(sck:SocketIO.Socket) {
        // TODO: Add standard logging framework like:
        //       https://github.com/bluejamesbond/Scribe.js
        console.log('New Connection!');
        sck.on('msg:LoginMessage', this.onUserNew.bind(this, sck));
    }

    onUserNew(sck:any, msg:any) {
        console.log("Got Login Message: " + JSON.stringify(msg));
        // All other clients except for this one
        this.broadcastMessage(sck, msg);
    }

    sendMessage(msg:Shared.Message) {
        console.log("Sending: " + JSON.stringify(msg));
        this.io.send(msg.type, msg);
    }

    broadcastMessage(sck:SocketIO.Socket, msg:Shared.Message) {
        console.log("Broadcasting: " + JSON.stringify(msg));
        sck.broadcast.emit(msg.type, msg);
    }
}

var gameServer = new GameServer();
gameServer.start();
