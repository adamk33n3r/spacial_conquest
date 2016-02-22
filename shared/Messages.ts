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
