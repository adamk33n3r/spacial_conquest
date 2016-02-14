'use strict'
socketio = require('socket.io')
config = require('./config.json')
http = require('http')
fs = require('fs')
Client = require('./client')

class Server
  constructor: ->
    @clients = []
    @fileServer = http.createServer (req, res) ->
      fs.readFile __dirname + '/../client/index.html', (err, file) ->
        if err
          res.writeHead 404
          res.write '404 Not Found\n'
          res.end()
          return
        res.writeHead 200
        res.write file
        res.end()


    # Socket.io
    @io = socketio(@fileServer)
    @io.on 'connection', @onConnection

  start: ->
    @fileServer.listen config.port

  onConnection: (socket) =>
    # TODO: Add standard logging framework like:
    #       https://github.com/bluejamesbond/Scribe.js
    console.log 'New Connection!'
    @clients.push new Client(this, socket)

module.exports = Server
