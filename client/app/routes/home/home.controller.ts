///<reference path='../../../typings/browser.d.ts' />
'use strict';

import * as Messages from '../../../../shared/Messages';

import Phaser = require('phaser');

import angular = require('angular');
angular.module('spacial_conquest')
.controller('HomeController', class {
    test: string;
    username: string;
    socket: SocketIOClient.Socket;
    game: Phaser.Game;

    constructor ($http: ng.IHttpService) {
        this.test = 'This is a string defined in the controller!';

        this.game = new Phaser.Game(800, 600, Phaser.AUTO, 'gameContent', { preload: this.preload, create: this.create });

        this.socket = io();
        this.socket.on(Messages.NewUserMessage.type, function (data: Messages.NewUserMessage) {
            console.log('New User Message: ' + data.username);
        });
    }

    connect () {
        if (!this.username) return;
        let lm: Messages.LoginMessage = new Messages.LoginMessage(this.username, null);
        this.sendMessage(lm);
    }

    sendMessage (message: Messages.Message) {
        console.log('Sending:', message);
        this.socket.emit(message.type, message);
    }

    preload() {
        this.game.load.image('top-secret', 'images/top-secret.jpg');
    }

    create() {
        let topSecret: Phaser.Sprite = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'top-secret');
        topSecret.anchor.setTo(0.5, 0.5);
    }
});

