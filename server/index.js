"use strict";

var socketio = require('socket.io');
var config = require('./config.json');
var http = require('http');
var fs = require('fs');

function Server() {
    // Constructor
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

    // Socket.io
    this.io = socketio(this.fileServer);
    this.io.on('connection', this.onConnection.bind(this));
}

Server.prototype.start = function () {
    this.fileServer.listen(config.port);
}

Server.prototype.onConnection = function (socket) {
    console.log('New Connection!');
    socket.on('user:new', this.onUserNew.bind(socket));
}

// Should pull this out into a separate "socket" class structure.
// Can handle all the user info.
Server.prototype.onUserNew = function (data) {
    this.username = data.username;
    
    // All other clients except for this one
    this.broadcast.emit('user:new', {
        username: this.username
    });
}

module.exports = Server;
