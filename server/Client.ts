///<reference path='typings/main.d.ts' />
'use strict';

import * as p2 from 'p2';

import * as Messages from '../shared/Messages';
import GameServer from './GameServer';

class Client {
    static ACCELERATION: number = 10;
    static ROTATION: number = 2;

    static DRAG: number = 200;
    static ANGULARDRAG: number = 200;

    server: GameServer;
    socket: SocketIO.Socket;
    username: string;
    body: p2.Body;
    move: Messages.Movements;

    constructor(server: GameServer, socket: SocketIO.Socket) {
        this.server = server;
        this.socket = socket;

        // Tell newly connected user about everyone else
        this.server.clients.forEach((client) => {
            this.sendMessage(new Messages.NewUserMessage(client.username));
        });

        this.socket.on('disconnect', () => {
            let myIndex: number = this.server.clients.indexOf(this);
            if (myIndex > -1) {
                this.server.clients.splice(myIndex, 1);
            }

            if (this.username) {
                // Let everyone else know you left
                this.sendBroadcast(new Messages.LeftUserMessage(this.username));
            }
        });

        this.socket.on(Messages.LoginMessage.type, this.onUserLogin);
        this.socket.on(Messages.TryMoveUserMessage.type, this.onTryMoveUser);
    }

    onUserLogin = (message: Messages.LoginMessage) => {
        console.log('LoginMessage:', message);

        // Check auth
        // this.server.checkUsername(this.username);

        this.username = message.username;

        this.body = new p2.Body({
            mass: 1,
            position: [800, 600]
        });

        let circleShape: p2.Circle = new p2.Circle({ radius: 1 });
        this.body.addShape(circleShape);
        this.server.testWorld.addBody(this.body);

        // Let everyone else know you logged in
        this.sendBroadcast(new Messages.NewUserMessage(this.username));
    };

    onTryMoveUser = (message: Messages.TryMoveUserMessage) => {
        if (!this.body) return;

        this.move = message.move;
    };

    preUpdate() {
        if (!this.body) return;

        if ((this.move & Messages.Movements.ForwardThrust) === Messages.Movements.ForwardThrust) {
            this.thrust(Client.ACCELERATION);
        }
        else if ((this.move & Messages.Movements.ReverseThrust) === Messages.Movements.ReverseThrust) {
            this.reverse(Client.ACCELERATION);
        }

        if ((this.move & Messages.Movements.LeftThrust) === Messages.Movements.LeftThrust) {
            this.turnLeft(Client.ROTATION);
        }
        else if ((this.move & Messages.Movements.RightThrust) === Messages.Movements.RightThrust) {
            this.turnRight(Client.ROTATION);
        }
    }

    postUpdate() {
        if (!this.body) return;

        this.server.clients.forEach((client) => {
            this.sendMessage(
                new Messages.MoveUserMessage(
                    client.username,
                    this.body.position,
                    this.body.velocity,
                    this.body.force,
                    this.body.angle,
                    this.body.angularVelocity,
                    this.body.angularForce));
        });
    }

    turnLeft(speed: number) {
        this.body.angularForce -= speed;

        this.body.angularForce = Math.min(10, Math.max(-10, this.body.angularForce));
    }

    turnRight(speed: number) {
        this.body.angularForce += speed;

        this.body.angularForce = Math.min(10, Math.max(-10, this.body.angularForce));
    }

    thrust(speed: number) {
        let magnitude: number = -speed;
        let angle: number = this.body.angle + Math.PI / 2;

        this.body.force[0] -= (magnitude * Math.cos(angle));
        this.body.force[1] -= (magnitude * Math.sin(angle));
    }

    reverse(speed: number) {
        let magnitude: number = -speed;
        let angle: number = this.body.angle + Math.PI / 2;

        this.body.force[0] += (magnitude * Math.cos(angle));
        this.body.force[1] += (magnitude * Math.sin(angle));

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
