'use strict';

import express = require('express');

import {IUser, IUserModel, User} from './user.model';
import BaseController from '../base.controller';

export default class UserController extends BaseController {
    public static index(req: express.Request, res: express.Response) {
        User.find({}).exec().then(function (users: Array<IUser>) {
            res.json(users);
        });
    }

    public static show(req: express.Request, res: express.Response) {
        User.findOne(req.params.id).exec()
            .then(UserController.handleNotFound(res))
            .then(function (users: Array<IUser>) {
                res.json(users);
            });
    }

    public static create(req: express.Request, res: express.Response) {
        User.create(req.body)
            .then(function (user: IUser) {
                res.status(201).json(user);
            }, function (err: Error) {
                res.status(500).json(err);
            });
    }

    public static auth(req: express.Request, res: express.Response) {
        User.findOneByUsername(req.body.username).exec()
            .then(UserController.handleNotFound(res))
            .then(function (user: IUser) {
                user.checkPass(req.body.password)
                    .then(function (valid: boolean) {
                        if (valid) {
                            res.sendStatus(200);
                        } else {
                            res.sendStatus(401);
                        }
                    });
            });
    }
}
