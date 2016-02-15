module Messages {
    export class Message {
        type: string;
        data: string;

        constructor(type: string, data: string = null) {
            this.type = type;
            this.data = data;
        }
    }

    export class LoginMessage extends Message {
        username: string;

        constructor(name: string) {
            super('msg:LoginMessage');
            this.username = name;
        }
    }

    export class UserMessage extends Message {
        constructor(subtype: string, data: string) {
            super(`user:${subtype}`, data);
        }
    }
}
