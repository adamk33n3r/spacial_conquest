"use strict";

var UserMessage = require('./userMessage');

class LoginMessage extends UserMessage {
    constructor(username) {
        super('login', username)
    }
}

module.exports = LoginMessage;
