///<reference path='typings/main.d.ts' />
'use strict';

import http = require('http');
import fs = require('fs');
import url = require('url');
import path = require('path');
import socketio = require('socket.io');

import * as Messages from '../shared/Messages';
import Client from './Client';
console.log(Client);
const config = require('./config.json');

class GameServer {
    io: SocketIO.Server;
    fileServer: http.Server;
    clients: Client[] = [];

    constructor() {
        let j = new Messages.Message('');
        console.log('Starting file server...');
        this.fileServer = http.createServer(function (req: http.IncomingMessage, res: http.ServerResponse) {
            let uri = url.parse(req.url).pathname;
            let filename = path.join(fs.realpathSync(__dirname + '/../client'), uri);

            fs.access(filename, fs.F_OK, function(err: any) {
                if (err) {
                    res.writeHead(404, {'Content-Type': 'text/plain'});
                    res.write('404 Not Found\n');
                    res.end();
                    return;
                }

                if (fs.statSync(filename).isDirectory()) filename += '/index.html';

                fs.readFile(filename, 'binary', function(err: NodeJS.ErrnoException, file: Buffer) {
                    if (err) {
                        res.writeHead(500, {'Content-Type': 'text/plain'});
                        res.write(err + '\n');
                    } else {
                        res.writeHead(200);
                        res.write(file, 'binary');
                    }

                    res.end();
                });
            });
        });

        // Socket.io
        console.log('Starting socket io...');
        this.io = socketio(this.fileServer);
        this.io.on('connection', this.onConnection);
    }

    start() {
        this.fileServer.listen(config.port);
        console.log('Listening on port: ' + config.port);
    }

    sendMessage(message: Messages.Message) {
        console.log('Sending:', message);
        this.io.send(message.type, message);
    }

    broadcastMessage(socket: SocketIO.Socket, message: Messages.Message) {
        console.log('Broadcasting:', message);
        socket.broadcast.emit(message.type, message);
    }

    onConnection = (socket: SocketIO.Socket) => {
        // TODO: Add standard logging framework like:
        //       https://github.com/bluejamesbond/Scribe.js
        console.log('New Connection!');
        this.clients.push(new Client(this, socket));
    };
}

module.exports = GameServer;
export default GameServer;
