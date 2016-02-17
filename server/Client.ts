///<reference path='typings/main.d.ts' />
'use strict';

import * as Messages from '../shared/Messages';
// import Messages = require('../shared/Messages');
import GameServer from './GameServer';

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
        let onUserLogin = (message: Messages.LoginMessage) => {
            console.log('got login');
            console.log(message);
            this.username = message.username;
            // this.server.checkUsername(this.username);

            // Let everyone else now you logged in
            this.sendBroadcast(new Messages.LoginMessage(this.username));
        };

        this.socket.on('msg:LoginMessage', onUserLogin);
    }

    sendMessage(message: Messages.Message) {
        // To web client
        this.socket.emit(message.type, message.data);
    }

    sendBroadcast(message: Messages.Message) {
        // To all other clients except for this one
        console.log('Sending broadcast', message.type, message.data);
        this.socket.broadcast.emit(message.type, message);
    }

}

export default Client;
