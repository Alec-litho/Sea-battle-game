import { PrepareStage } from './PrepareStage.js'
import { GameplayStage } from './GameplayStage.js'
import { GameLogic } from './GameLogic.js'
import { io } from 'socket.io-client'

document.querySelector('.newGame').addEventListener('click', keyGenerator)
document.querySelector('.join_room').addEventListener('click', joinGame)
const key = document.querySelector('.key') as HTMLTextAreaElement


function keyGenerator() {
  const chars = 'abcdefghijklmnopqrstuvwxyz1234567890'
  const rand = (min = 0, max = 1000) => Math.floor(Math.random() * (max - min) + min)
  const randChar = (length = 2) => {
    const randchars = []
    for (let i = 0; i < length; i++) {
      randchars.push(chars[rand(0, chars.length)])
    }

    return randchars.join('')
  }
  const keygen = (prefix = randChar(), sufix = randChar()) => `${prefix}${randChar()}${sufix}`
  const keyString = keygen()
  key.innerText = keyString
  handleConnection('create', keyString)
}

function joinGame() {
  const room = document.querySelector('.find_room') as HTMLInputElement
  const roomVal = room.value
  if (roomVal !== '') handleConnection('join', roomVal, room)
}

function handleConnection(type: string, roomVal: string,  room?: HTMLInputElement) {
  const socket = io('http://localhost:3000')
  if (type === 'join') {
    socket.emit('checkIfExists', roomVal)
    socket.on('error', (message) => {
      const htmlErrMessage = document.querySelector('.errorMessage') as HTMLTextAreaElement
      htmlErrMessage.innerText = message
      room.style.border = '1px solid red'
    })
  } else {
    socket.emit('createRoom', roomVal)
  }
  socket.on(type === 'join' ? 'getResp' : 'getId', (socketId) => {
    socket.emit('setId', { socketId, roomVal })
    socket.on('response', () => main(socket, roomVal, socketId, type === 'join' ? false : true))
  })
}

function main(socket: ReturnType<typeof io>, room: string, socketId: string, turn: boolean) {
  console.log(socketId);
  const game = new GameLogic();
  (<any>window).Game = new PrepareStage(socket, room, game)
  socket.on('playerFinishedPreparing', () => {
    console.log('gameplay stage')
    ;(<any>window).Game = new GameplayStage(socket, room, game, turn)
  })
}
