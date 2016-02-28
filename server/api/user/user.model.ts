'use strict';

import mongoose = require('mongoose');
import Schema = mongoose.Schema;
const bcrypt = require('bcrypt-as-promised');

class UserSchema extends Schema {
    // To be able to define functions
    methods: {
        checkPass: (password: string) => Promise<boolean>;
    };

    statics: {
        findOneByUsername: Function
    };

    constructor() {
        super({
            username: {
                type: String,
                required: true,
                index: {
                    unique: true
                }
            },
            password: {
                type: String,
                required: true
            },
            role: {
                type: String,
                default: 'user'
            },
            settings: {}
        });

        this.methods.checkPass = function (password: string) {
            return new Promise((resolve: Function, reject: Function) => {
                bcrypt.compare(password, this.password)
                    .then(function () {
                        resolve(true);
                    })
                    .catch(function () {
                        resolve(false);
                    });
            });
        };
    }
}

// Use to extend "user". Like `user.checkPass('$up3r$3cr37')`
export interface IUser extends mongoose.Document {
    _id: string;
    username: string;
    password: string;
    role: string;
    settings: {};
    checkPass(password: string): Promise<boolean>;
}

// Use to extend "User". Like `User.findOneByUsername('franklin')`
export interface IUserModel extends mongoose.Model<IUser> {
    findOneByUsername(username: string): mongoose.Query<IUser>;
}

let userSchema = new UserSchema;
userSchema.statics.findOneByUsername = function (username: string) {
    return this.findOne({ username: username });
};

/**
 * Virtuals
 */

// Non-sensitive info we'll be putting in the token
/*UserSchema
  .virtual('token')
  .get(function() {
  return {
  '_id': this._id,
  'role': this.role
  };
  });
 */

/**
 * Validations
 */

// Validate username is not taken
userSchema
.path('username')
.validate(function(value: string, respond: (val: boolean) => any) {
    let self = this;
    return this.constructor.findOne({ username: value }).exec()
    .then(function(user: any) {
        if (user) {
            if (self.id === user.id) {
                return respond(true);
            }
            return respond(false);
        }
        return respond(true);
    })
    .catch(function(err: any) {
        throw err;
    });
}, 'The specified username is already in use.');

/**
 * Pre-save hook
 */
userSchema
.pre('save', function (next: Function) {
    bcrypt.hash(this.password, 10)
    .then((hash: string) => {
        this.password = hash;
        next();
    }, function (err: any) {
        next(err);
    });
});

export var User = <IUserModel>mongoose.model('User', userSchema);
