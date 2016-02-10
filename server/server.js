"use strict";

var socketio = require('socket.io');
var config = require('./config.json');
var http = require('http');
var fs = require('fs');

var Client = require('./client');

class Server {
    constructor() {
        this.clients = [];

        // TODO: Move to a webserver like nginx or apache
        this.fileServer = http.createServer(function (req, res) {
            fs.readFile(__dirname + '/../client/index.html', function (err, file) {
                if (err) {
                    res.writeHead(404);
                    res.write("404 Not Found\n");
                    res.end();
                    return;
                }
                res.writeHead(200);
                res.write(file);
                res.end();
            });
        });

        var onConnection = (socket) => {
            // TODO: Add standard logging framework like:
            //       https://github.com/bluejamesbond/Scribe.js
            console.log('New Connection!');
            this.clients.push(new Client(this, socket));
        }

        // Socket.io
        this.io = socketio(this.fileServer);
        this.io.on('connection', onConnection);
    }

    start() {
        this.fileServer.listen(config.port);
    }
}

module.exports = Server;
