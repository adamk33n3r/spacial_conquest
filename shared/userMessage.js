"use strict";

var Message = require('./message');

class UserMessage extends Message {
    constructor(subtype, data) {
        super(`user:${subtype}`, data);
    }
}

module.exports = UserMessage;
