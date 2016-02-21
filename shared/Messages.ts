export class Message {
    type: string;
    data: any;

    constructor(type: string, data: any = null) {
        this.type = type;
        this.data = data;
    }
}

export class LoginMessage extends Message {
    // TODO: Maybe switch these?
    username: string;
    get data(): string {
        return this.username;
    }

    constructor(name: string) {
        super('msg:LoginMessage');
        this.username = name;
    }
}

export class UserMessage extends Message {
    constructor(subtype: string, data: any) {
        super(`msg:UserMessage:${subtype}`, data);
    }
}
