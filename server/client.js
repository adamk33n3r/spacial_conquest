"use strict";

var UserMessage = require('../shared/userMessage');

class Client {
    constructor(server, socket) {
        this.server = server;
        this.socket = socket;

        /**
         * @param data LoginMessage
         */
        var onUserLogin = (message) => {
            console.log("got login");
            console.log(message);
            this.username = message.data;
            // this.server.checkUsername(this.username);

            // Let everyone else now you logged in
            this.sendBroadcast(new UserMessage('new', {
                username: this.username
            }));
        }

        this.socket.on('user:login', onUserLogin);
    }

    sendMessage(message) {
        // To web client
        this.socket.emit(message.type, message.data);
    }

    sendBroadcast(message) {
        // To all other clients except for this one
        this.socket.broadcast.emit(message.type, message.data);
    }

}

module.exports = Client;
