module Shared {
    export class Message {
        type:string;

        constructor(type:string) {
            this.type = type;
        }
    }

    export class LoginMessage extends Message {
        username:string;

        constructor(name:string) {
            super("msg:LoginMessage");
            this.username = name;
        }
    }
}