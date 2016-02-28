'use strict';

import http = require('http');
import path = require('path');
import morgan = require('morgan');
import express = require('express');
import mongoose = require('mongoose');
import socketio = require('socket.io');

const console = (<any>process).console;
const config = require('configamajig')();
const bodyParser = require('body-parser');

export default class Web {
    public io: SocketIO.Server;
    private express: express.Application;
    private httpServer: http.Server;

    constructor() {
        console.log('Setting up web server...');
        this.express = express();
        this.httpServer = http.createServer(<any>this.express);
        this.express.use('/logs', (<any>process).scribe.webPanel());
        this.express.use(morgan('dev'));
        this.express.use(express.static(process.cwd() + '/client'));
        this.express.use(bodyParser.urlencoded({ extended: false }));
        this.express.use(bodyParser.json());

        this.express.use('/api/users', require('./api/user'));

        this.express.get('/*', function (req: any, res: any) {
            res.sendFile(path.resolve('client/index.html'));
        });

        // Socket.io
        console.log('Setting up socket.io...');
        this.io = socketio(this.httpServer);
        this.io.on('connection', (socket: SocketIO.Socket) => {
        });

        // Mongo
        console.log('Setting up db...');
        mongoose.connect(config.mongo.uri, config.mongo.options);
        mongoose.connection.on('error', function (error: any) {
            console.error('MongoDB connection error:', error);
        });
    }

    public start() {
        setImmediate(() => {
            this.httpServer.listen(config.port, config.ip, () => {
                console.log('Express server listening on %d, in %s mode', config.port, this.express.get('env'));
            });
        });
    }
}
