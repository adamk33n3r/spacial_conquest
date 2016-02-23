///<reference path='typings/main.d.ts' />
'use strict';

import * as Messages from '../shared/Messages';
import GameServer from './GameServer';

class Client {
    server: GameServer;
    socket: SocketIO.Socket;
    username: string;

    constructor(server: GameServer, socket: SocketIO.Socket) {
        this.server = server;
        this.socket = socket;

        let onUserLogin = (message: Messages.LoginMessage) => {
            console.log('LoginMessage:', message);
            this.username = message.username;

            // Check auth
            // this.server.checkUsername(this.username);

            // Let everyone else now you logged in
            this.sendBroadcast(new Messages.NewUserMessage(this.username));
        };

        this.socket.on(Messages.LoginMessage.type, onUserLogin);
    }

    sendMessage(message: Messages.Message) {
        // To web client
        this.socket.emit(message.type, message);
    }

    sendBroadcast(message: Messages.Message) {
        // To all other clients except for this one
        console.log('Sending Broadcast:', message.type, message);
        this.socket.broadcast.emit(message.type, message);
    }

}

export default Client;
