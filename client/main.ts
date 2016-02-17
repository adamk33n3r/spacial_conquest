///<reference path='typings/browser.d.ts' />
'use strict';

import * as Messages from '../shared/Messages';

import angular = require('angular');
angular.module('spacial_conquest', [])
.controller('MainController', class {
    test: string;
    username: string;
    socket: SocketIOClient.Socket;
    constructor ($http: ng.IHttpService) {
        this.test = 'This is a string defined in the controller!';

        this.socket = io();

        this.socket.on('msg:LoginMessage', function (data: Messages.LoginMessage) {
            console.log('Login Message: ' + data.username);
        });
    }

    connect () {
        if (!this.username) return;
        let lm: Messages.LoginMessage = new Messages.LoginMessage(this.username);
        this.sendMessage(lm);
    }

    sendMessage (message: Messages.Message) {
        console.log('Sending:', message);
        this.socket.emit(message.type, message);
    }
});

