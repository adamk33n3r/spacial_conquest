"use strict";

var socketio = require('socket.io');
var config = require('./config.json');
var http = require('http');
var fs = require('fs');

function Server() {
    // Constructor

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

    // Socket.io
    this.io = socketio(this.fileServer);
    this.io.on('connection', this.onConnection.bind(this));
}

Server.prototype.start = function () {
    this.fileServer.listen(config.port);
}

Server.prototype.onConnection = function (socket) {
    // TODO: Add standard logging framework like:
    //       https://github.com/bluejamesbond/Scribe.js
    console.log('New Connection!');
    socket.on('user:new', this.onUserNew.bind(socket));
}

// Should pull this out into a separate "socket" class structure.
// Can handle all the user info.
Server.prototype.onUserNew = function (data) {
    this.username = data.username;

    // TODO: Consider hiding this a bit with something like a piece of shared code
    // that (using ES6) a class called "Message", and create one called: "LoginMessage"
    // Then construct that and send like:
    // this.sendMessage(new LoginMessage(data.username));
    //
    // The sendMessage will JSON.stringfy the object and send it, the client will
    // read that message and turn it back into the correct object. Since the JS
    // is shared, all the functions can exists on both sides... right?

    // All other clients except for this one
    this.broadcast.emit('user:new', {
        username: this.username
    });
}

module.exports = Server;
