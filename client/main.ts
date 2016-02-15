///<reference path='typings/tsd.d.ts' />
///<reference path='../shared/Messages.ts' />

let socket: SocketIOClient.Socket = io();

function connect (username: string) {
    if (!username) return;
    let lm: Messages.LoginMessage = new Messages.LoginMessage(username);
    sendMessage(lm);
}

function sendMessage(message: Messages.Message) {
    console.log('Sending:', message);
    socket.emit(message.type, message);
}

socket.on('msg:LoginMessage', function (data: Messages.LoginMessage) {
    console.log('Login Message: ' + data.username);
});
