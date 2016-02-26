///<reference path='../../../typings/browser.d.ts' />
'use strict';

import * as Messages from '../../../../shared/Messages';
import Spaceship from '../../game/Spaceship';
import Enemy from '../../game/Enemy';

import PIXI = require('pixi.js');
import $ = require('jquery');

import angular = require('angular');
angular.module('spacial_conquest')
.controller('HomeController', class HomeController {
    username: string;
    password: string;

    socket: SocketIOClient.Socket;

    renderer: PIXI.WebGLRenderer | PIXI.CanvasRenderer;
    stage: PIXI.Container;

    ships: { [id: string]: Spaceship; } = { };
    myShip: Spaceship;

    constructor ($http: ng.IHttpService) {
        let gameContent: any = $('#gameContent')[0];
        this.renderer = PIXI.autoDetectRenderer(800, 600, { view: gameContent });

        this.stage = new PIXI.Container();

        let starfield: PIXI.Texture = PIXI.Texture.fromImage('/images/starfield.png');
        let tilingSprite: PIXI.extras.TilingSprite = new PIXI.extras.TilingSprite(
            starfield,
            this.renderer.width,
            this.renderer.height);
        this.stage.addChild(tilingSprite);

        requestAnimationFrame(this.animate);

        this.socket = io();
        this.socket.on(Messages.NewUserMessage.type, this.onNewUserMessage);
        this.socket.on(Messages.MoveUserMessage.type, this.onMoveUserMessage);
        this.socket.on(Messages.LeftUserMessage.type, this.onLeftUserMessage);
    }

    animate = () => {
        requestAnimationFrame(this.animate);

        // render the container
        this.renderer.render(this.stage);
    };

    onNewUserMessage = (msg: Messages.NewUserMessage) => {
        // Create a new spaceship
        console.log('create ship for: ', msg.username);
        this.ships[msg.username] = new Spaceship(this.stage, false);
    };

    onMoveUserMessage = (msg: Messages.MoveUserMessage) => {
        let ship: Spaceship = this.ships[msg.username];
        if (ship) {
            ship.setState(
                msg.position,
                msg.velocity,
                msg.force,
                msg.angle,
                msg.angularVelocity,
                msg.angularForce);
        }
    };

    onLeftUserMessage = (msg: Messages.LeftUserMessage) => {
        console.log('Destroying ship: ', msg);

        let ship: Spaceship = this.ships[msg.username];
        if (ship !== null) {
            ship.destroy();
        }

        delete this.ships[msg.username];
    };

    connect () {
        if (!this.username || !this.password) return;

        this.myShip = new Spaceship(this.stage, true);
        this.ships[this.username] = this.myShip;

        let lm: Messages.LoginMessage = new Messages.LoginMessage(this.username, this.password);
        this.sendMessage(lm);
    }

    sendMessage (message: Messages.Message) {
        console.log('Sending:', message);
        this.socket.emit(message.type, message);
    }

    preload = () => {
        /*
        this.game.load.image('starfield', 'images/starfield.png');
        this.game.load.image('player', 'images/player.png');
        */
    };

    create = () => {
        // This is where we init to use P2JS physics, which causes phaser to die
        // You have to view it in a browser to see the error in the console:
        //    Uncaught TypeError: Phaser.Physics.P2 is not a function
        // this.game.physics.startSystem(Phaser.Physics.P2JS);
        // this.game.world.setBounds(0, 0, 1600, 1200);

        // this.starfield = this.game.add.tileSprite(0, 0, 1600, 1200, 'starfield');
    };

    update = () => {
        if (this.myShip) {
            if (this.myShip.update()) {
                // Only send if changed
                this.sendMessage(new Messages.TryMoveUserMessage(this.myShip.move));
            }
        }
    };
});
