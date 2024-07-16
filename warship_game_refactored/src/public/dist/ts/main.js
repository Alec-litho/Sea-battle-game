"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const PrepareStage_js_1 = require("./PrepareStage.js");
const GameplayStage_js_1 = require("./GameplayStage.js");
const GameLogic_js_1 = require("./GameLogic.js");
const socket_io_client_1 = require("socket.io-client");
document.querySelector('.newGame').addEventListener('click', keyGenerator);
document.querySelector('.join_room').addEventListener('click', joinGame);
const key = document.querySelector('.key');
function keyGenerator() {
    const chars = 'abcdefghijklmnopqrstuvwxyz1234567890';
    const rand = (min = 0, max = 1000) => Math.floor(Math.random() * (max - min) + min);
    const randChar = (length = 2) => {
        const randchars = [];
        for (let i = 0; i < length; i++) {
            randchars.push(chars[rand(0, chars.length)]);
        }
        return randchars.join('');
    };
    const keygen = (prefix = randChar(), sufix = randChar()) => `${prefix}${randChar()}${sufix}`;
    const keyString = keygen();
    key.innerText = keyString;
    handleConnection('create', keyString);
}
function joinGame() {
    const room = document.querySelector('.find_room');
    const roomVal = room.value;
    if (roomVal !== '')
        handleConnection('join', roomVal, room);
}
function handleConnection(type, roomVal, room) {
    const socket = (0, socket_io_client_1.io)('http://localhost:3000');
    if (type === 'join') {
        socket.emit('checkIfExists', roomVal);
        socket.on('error', (message) => {
            const htmlErrMessage = document.querySelector('.errorMessage');
            htmlErrMessage.innerText = message;
            room.style.border = '1px solid red';
        });
    }
    else {
        socket.emit('createRoom', roomVal);
    }
    socket.on(type === 'join' ? 'getResp' : 'getId', (socketId) => {
        socket.emit('setId', { socketId, roomVal });
        socket.on('response', () => main(socket, roomVal, socketId, type === 'join' ? false : true));
    });
}
function main(socket, room, socketId, turn) {
    console.log(socketId);
    const game = new GameLogic_js_1.GameLogic();
    window.Game = new PrepareStage_js_1.PrepareStage(socket, room, game);
    socket.on('playerFinishedPreparing', () => {
        console.log('gameplay stage');
        window.Game = new GameplayStage_js_1.GameplayStage(socket, room, game, turn);
    });
}
