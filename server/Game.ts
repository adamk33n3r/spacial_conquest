'use strict';

import Web from './Web';
import Client from './Client';

const console = (<any>process).console;

export default class Game {
    private web: Web;
    private clients: Client[] = [];

    constructor() {
        this.web = new Web();
        this.web.io.on('connection', (socket: SocketIO.Socket) => {
            this.clients.push(new Client(this, socket));
            let address: string = socket.request.connection.remoteAddress;
            let port: number = socket.request.connection.remotePort;
            console.log('New Connection from ' + address + ':' + port + '!');
            socket.on('disconnect', () => {
                let i: number = 0;
                for (let client of this.clients) {
                    if (client.socket === socket) {
                        break;
                    }
                    i++;
                }
                this.clients.splice(i, 1);
                console.log('Client disconnected');
            });
        });
    }

    public start() {
        this.web.start();
    }
}
