///<reference path='typings/tsd.d.ts' />
///<reference path='../shared/Messages.ts' />
import GameServer from './GameServer';
'use strict';

const UserMessage = require('../shared/userMessage');

class Client {
    server: GameServer;
    socket: SocketIO.Socket;
    username: string;

    constructor(server: GameServer, socket: SocketIO.Socket) {
        this.server = server;
        this.socket = socket;

        /**
         * @param data LoginMessage
         */
        let onUserLogin = (message: Messages.Message) => {
            console.log('got login');
            console.log(message);
            this.username = message.data;
            // this.server.checkUsername(this.username);

            // Let everyone else now you logged in
            this.sendBroadcast(new UserMessage('new', {
                username: this.username
            }));
        };

        this.socket.on('user:login', onUserLogin);
    }

    sendMessage(message: Messages.Message) {
        // To web client
        this.socket.emit(message.type, message.data);
    }

    sendBroadcast(message: Messages.Message) {
        // To all other clients except for this one
        this.socket.broadcast.emit(message.type, message.data);
    }

}

module.exports = Client;
