'use strict';

import * as p2 from 'p2';

import Web from './Web';
import Client from './Client';

const console = (<any>process).console;

const TIMESTEP: number = 1 / 30;

export default class Game {
    private web: Web;
    private clients: Client[] = [];

    testWorld: p2.World;

    constructor() {
        console.log('Building world...');
        this.testWorld = new p2.World({
            gravity: [0, 0]
        });
        this.web = new Web();
        this.web.io.on('connection', (socket: SocketIO.Socket) => {
            this.clients.push(new Client(this, socket));
            let address: string = socket.request.connection.remoteAddress;
            let port: number = socket.request.connection.remotePort;
            console.log('New Connection from ' + address + ':' + port + '!');
            console.log('Client count:', this.clients.length);
        });
    }

    public start() {
        this.web.start();
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

    public getClients() {
        return this.clients;
    }
}
