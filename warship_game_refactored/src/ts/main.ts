import { PrepareStage } from './PrepareStage.js'
import { GameplayStage } from './GameplayStage.js'
import { GameLogic } from './GameLogic.js'
import { io } from 'socket.io-client'


document.querySelector('.newGame').addEventListener('click', createNewGame)
document.querySelector('.join_room').addEventListener('click', joinGame)

function createNewGame() {
  const room = document.querySelector('.createRoomVal') as HTMLInputElement
  const roomVal = room.value
  if (roomVal !== '') handleConnection("create", room, roomVal)
}

function joinGame() {
  const room = document.querySelector('.find_room') as HTMLInputElement
  const roomVal = room.value
  if (roomVal !== '') handleConnection("join", room, roomVal)
}

function handleConnection(type:string, room:HTMLInputElement, roomVal:string) {
  const socket = io('http://localhost:3000')
  if(type==="join") {
    socket.emit('checkIfExists',  roomVal);
    socket.on('error', (message) => {
      const htmlErrMessage = document.querySelector('.errorMessage') as HTMLTextAreaElement
      htmlErrMessage.innerText = message
      room.style.border = '1px solid red'
    })
  } else {
    socket.emit("createRoom", roomVal)
  }
  socket.on(type==="join"? 'getResp' : 'getId', (socketId) => {
    socket.emit('setId', { socketId, roomVal })
    socket.on('response', () => main(socket, roomVal, socketId, false))
  })
}


function main(socket: ReturnType<typeof io>, room: string, socketId: string, turn:boolean) {
  console.log(socketId);
  (<any>window).Game = new PrepareStage(socket, room, new GameLogic())
  socket.on('playerFinishedPreparing', () => {
    new GameplayStage(socket, room, new GameLogic(), turn)
  })
}