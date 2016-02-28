# Spacial Conquest
A simple, yet large, space trading MMO game.

## Development Plans
1. Stand up server/client and connect with websockets (Socket.io) [DONE]
2. Render a background that can display a simple starfield (Phaser.js) [DONE]
3. Allow players to move freely with simple login
4. Add physics to make it spacey (client simulated, server enforced)
5. Add planets and gravity
6. Implement an orbit system
7. Add permanent wormholes to the world to allow long distance travel
8. Add economy and trading (buy low, sell high)
9. Add weapons and combat
10. Add AI pirates
11. ... profit?

## Dev setup
```
npm install
cd server
typings install
cd ../client
typings install
cd ..
gulp serve
```
