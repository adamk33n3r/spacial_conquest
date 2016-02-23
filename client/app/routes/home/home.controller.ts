///<reference path='../../../typings/browser.d.ts' />
'use strict';

import * as Messages from '../../../../shared/Messages';
import Spaceship from '../../game/Spaceship';
import Enemy from '../../game/Enemy';

import Phaser = require('phaser');

import angular = require('angular');
angular.module('spacial_conquest')
.controller('HomeController', class HomeController {
    username: string;
    password: string;

    socket: SocketIOClient.Socket;
    game: Phaser.Game;

    starfield: Phaser.TileSprite;

    p1: Spaceship;

    constructor ($http: ng.IHttpService) {
        this.game = new Phaser.Game(
            800,
            600,
            Phaser.AUTO,
            'gameContent',
            {
                preload: this.preload,
                create: this.create,
                update: this.update
            });

        this.socket = io();
        this.socket.on(Messages.NewUserMessage.type, function (data: Messages.NewUserMessage) {
            console.log('New User Message: ' + data.username);
        });
    }

    connect () {
        if (!this.username || !this.password) return;

        let lm: Messages.LoginMessage = new Messages.LoginMessage(this.username, this.password);
        this.sendMessage(lm);
    }

    sendMessage (message: Messages.Message) {
        console.log('Sending:', message);
        this.socket.emit(message.type, message);
    }

    preload() {
        this.game.load.image('starfield', 'images/starfield.png');
        this.game.load.image('player', 'images/player.png');
    }

    create() {
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.world.setBounds(0, 0, 1600, 1200);

        this.starfield = this.game.add.tileSprite(0, 0, 1600, 1200, 'starfield');

        this.p1 = new Spaceship(this.game);
    }

    update() {
        if (this.p1 != null) {
            this.p1.update(this.game);
        }
    }
});
