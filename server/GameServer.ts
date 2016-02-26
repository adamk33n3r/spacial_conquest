///<reference path='typings/main.d.ts' />
///<reference path='typings/browser/ambient/p2/p2.d.ts' />
'use strict';

import * as fs from 'fs';
import * as url from 'url';
import * as http from 'http';
import * as path from 'path';
import * as morgan from 'morgan';
import * as express from 'express';
import * as socketio from 'socket.io';
import * as p2 from 'p2';

import * as Messages from '../shared/Messages';
import Client from './Client';

const scribe: any = require('scribe-js')({
    createDefaultConsole : false
});
const console: any = scribe.console().time();

const config = require('configamajig')();

let TIMESTEP: number = 1 / 30;

class GameServer {

    io: SocketIO.Server;
    express: express.Express;
    httpServer: http.Server;
    clients: Client[] = [];

    testWorld: p2.World;

    constructor() {
        console.log('Building world...');
        this.testWorld = new p2.World({
            gravity: [0, 0]
        });

        console.log('Setting up file server...');
        this.express = express();
        this.httpServer = http.createServer(this.express);

        this.express.use('/logs', scribe.webPanel());
        this.express.use(morgan('dev'));
        this.express.use(express.static(process.cwd() + '/client'));
        this.express.get('/*', function (req: any, res: any) {
            res.sendFile(path.resolve('client/index.html'));
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

        setInterval(() => {
            // Apply forces
            this.clients.forEach((client) => {
                client.preUpdate();
            });

            // Move stuff
            this.testWorld.step(TIMESTEP);

            // Report
            this.clients.forEach((client) => {
                client.postUpdate();
            });
        }, TIMESTEP * 1000);
    }

    onConnection = (socket: SocketIO.Socket) => {
        let address: string = socket.request.connection.remoteAddress;
        let port: number = socket.request.connection.remotePort;
        console.log('New Connection from ' + address + ':' + port + '!');
        this.clients.push(new Client(this, socket));
        console.log('Client count: ' + this.clients.length);
    };
}

module.exports = GameServer;
export default GameServer;
