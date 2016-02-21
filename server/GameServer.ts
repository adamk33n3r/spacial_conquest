///<reference path='typings/main.d.ts' />
'use strict';

import * as fs from 'fs';
import * as url from 'url';
import * as http from 'http';
import * as path from 'path';
import * as morgan from 'morgan';
import * as express from 'express';
import * as socketio from 'socket.io';

import * as Messages from '../shared/Messages';
import Client from './Client';
// declare var scribe: any;
const scribe = require('scribe-js')();
const console = (<any>process).console;
const config = require('configamajig')();

class GameServer {
    io: SocketIO.Server;
    express: express.Application;
    httpServer: http.Server;
    clients: Client[] = [];

    constructor() {
        let j = new Messages.Message('');
        console.log('Setting up file server...');
        this.express = express();
        this.httpServer = http.createServer(<any>this.express);
        // this.express.use(scribe.express.logger());
        this.express.use('/logs', scribe.webPanel());
        this.express.use(morgan('dev'));
        this.express.use(express.static(process.cwd() + '/client'));
        this.express.get('/', function (res: any) {
            res.send('index.html');
        });

        // Socket.io
        console.log('Setting up socket.io...');
        this.io = socketio(this.httpServer);
        this.io.on('connection', this.onConnection);
    }

    start() {
        setImmediate(() => {
            this.httpServer.listen(config.port, config.ip, () => {
                console.log('Express server listening on %d, in %s mode', config.port, this.express.get('env'));
            });
        });
    }

    onConnection = (socket: SocketIO.Socket) => {
        // TODO: Add standard logging framework like:
        //       https://github.com/bluejamesbond/Scribe.js
        let address: string = socket.request.connection.remoteAddress;
        let port: number = socket.request.connection.remotePort;
        console.log('New Connection from ' + address + ':' + port + '!');
        this.clients.push(new Client(this, socket));
    };
}

module.exports = GameServer;
export default GameServer;
