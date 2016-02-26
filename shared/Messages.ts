export abstract class Message {
    static type: string;

    constructor() {
    }

    get type () {
        return Object.getPrototypeOf(this).constructor.type;
    }
}

export class LoginMessage extends Message {
    static type: string = 'LoginMessage';

    username: string;
    password: string;

    constructor(username: string, password: string) {
        super();
        this.username = username;
        this.password = password;
    }
}

export class NewUserMessage extends Message {
    static type: string = 'NewUserMessage';

    username: string;

    constructor(username: string) {
        super();
        this.username = username;
    }
}

export class LeftUserMessage extends Message {
    static type: string = 'LeftUserMessage';

    username: string;

    constructor(username: string) {
        super();
        this.username = username;
    }
}

export class MoveUserMessage extends Message {
    static type: string = 'MoveUserMessage';

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
        angularForce: number) {
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

export enum Movements {
    Idle = 0,
    ForwardThrust = 1 << 0,
    ReverseThrust = 1 << 1,
    LeftThrust = 1 << 2,
    RightThrust = 1 << 3
};

export class TryMoveUserMessage extends Message {
    static type: string = 'TryMoveUserMessage';

    move: Movements;

    constructor(move: Movements) {
        super();

        this.move = move;
    }
}
