'use strict';

import Movements from './Movements';

export abstract class Message {
    static type: string;

    constructor() {
    }

    get type () {
        return Object.getPrototypeOf(this).constructor.type;
    }
}

export class Login extends Message {
    static type: string = 'Login';

    username: string;
    password: string;

    constructor(username: string, password: string) {
        super();
        this.username = username;
        this.password = password;
    }
}

export class NewUser extends Message {
    static type: string = 'NewUser';

    username: string;

    constructor(username: string) {
        super();
        this.username = username;
    }
}

export class Disconnect extends Message {
    static type: string = 'Disconnect';

    username: string;

    constructor(username: string) {
        super();
        this.username = username;
    }
}

export class Move extends Message {
    static type: string = 'Move';

    username: string;

    position: number[];
    velocity: number[];
    force: number[];
    angle: number;
    angularVelocity: number;
    angularForce: number;

    constructor(
        username: string,
        position: number[],
        velocity: number[],
        force: number[],
        angle: number,
        angularVelocity: number,
        angularForce: number
    ) {
        super();

        this.username = username;

        this.position = position;
        this.velocity = velocity;
        this.force = force;
        this.angle = angle * 0.05;
        this.angularVelocity = angularVelocity * 0.05;
        this.angularForce = angularForce * 0.05;
    }
}

export class TryMove extends Message {
    static type: string = 'TryMove';

    move: Movements;

    constructor(move: Movements) {
        super();

        this.move = move;
    }
}
