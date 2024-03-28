import { PrepareStage } from './PrepareStage'
import { GameplayStage } from './GameplayStage'
import { GameLogic } from './GameLogic'
import { io } from 'socket.io-client'
document.querySelector('.newGame').addEventListener('click', createNewGame)
document.querySelector('.join_room').addEventListener('click', joinGame)

function createNewGame() {
  const room = document.querySelector('.createRoomVal') as HTMLInputElement
  const roomVal = room.value
  if (roomVal !== '') handleConnection("join", room, roomVal)
}

function joinGame() {
  const room = document.querySelector('.find_room') as HTMLInputElement
  const roomVal = room.value
  if (roomVal !== '') handleConnection("join", room, roomVal)
}

function handleConnection(type:string, room:HTMLInputElement, roomVal:string) {
  const socket = io('http://localhost:3000')
  if(type==="join") {
    socket.emit('checkIfExists', { room });
    socket.on('error', () => {
      const room = document.querySelector('.find_room') as HTMLInputElement
      room.style.border = '1px solid red'
    });
  }
  socket.on(type==="join"? 'getResp' : 'getId', (socketId) => {
    socket.emit('setId', { socketId, room })
    socket.on('response', () => main(socket, roomVal, socketId, false))
  })
}


function main(socket: ReturnType<typeof io>, room: string, socketId: string, turn:boolean) {
  console.log(socketId)
  new PrepareStage(socket, room, new GameLogic())
  socket.on('playerFinishedPreparing', () => {
    new GameplayStage(socket, room, new GameLogic(), turn)
  })
}