'use strict';

import express = require('express');

// Dumb. https://github.com/Microsoft/TypeScript/issues/3792
abstract class BaseController {
    public static index(req: express.Request, res: express.Response) {
        res.send('index');
    }

    public static show(req: express.Request, res: express.Response) {
        res.send('show');
    }

    public static create(req: express.Request, res: express.Response) {
        res.send('create');
    }

    public static update(req: express.Request, res: express.Response) {
        res.send('update');
    }

    public static delete(req: express.Request, res: express.Response) {
        res.send('delete');
    }

    protected static handleNotFound(res: express.Response) {
        return function (entity: any) {
            if (!entity) {
                return res.status(404).end();
            }
            return entity;
        };
    }
}

export default BaseController;
