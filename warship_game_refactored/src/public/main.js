import { PrepareStage } from './PrepareStage.js';
import { GameplayStage } from './GameplayStage.js';
import { GameLogic } from './GameLogic.js';
document.querySelector('.newGame').addEventListener('click', createNewGame);
document.querySelector('.join_room').addEventListener('click', joinGame);
function createNewGame() {
    const room = document.querySelector('.createRoomVal');
    const roomVal = room.value;
    if (roomVal !== '')
        handleConnection("create", room, roomVal);
}
function joinGame() {
    const room = document.querySelector('.find_room');
    const roomVal = room.value;
    if (roomVal !== '')
        handleConnection("join", room, roomVal);
}
function handleConnection(type, room, roomVal) {
    const socket = io('http://localhost:3000');
    if (type === "join") {
        socket.emit('checkIfExists', roomVal);
        socket.on('error', (message) => {
            const htmlErrMessage = document.querySelector('.errorMessage');
            htmlErrMessage.innerText = message;
            room.style.border = '1px solid red';
        });
    }
    else {
        socket.emit("createRoom", roomVal);
    }
    socket.on(type === "join" ? 'getResp' : 'getId', (socketId) => {
        socket.emit('setId', { socketId, roomVal });
        socket.on('response', () => main(socket, roomVal, socketId, false));
    });
}
function main(socket, room, socketId, turn) {
    console.log(socketId);
    window.Game = new PrepareStage(socket, room, new GameLogic());
    socket.on('playerFinishedPreparing', () => {
        new GameplayStage(socket, room, new GameLogic(), turn);
    });
}
