import { PrepareStage } from "./PrepareStage";
import { GameplayStage } from "./GameplayStage";
import { GameLogic } from "./GameLogic";
import { io } from "socket.io-client";



document.querySelector('.newGame').addEventListener('click', createNewGame)
document.querySelector('.join_room').addEventListener('click', joinGame)

function createNewGame() {
    const room = document.querySelector('.createRoomVal') as HTMLInputElement
    const roomVal = room.value 
    if(roomVal !== '' ) {
        const socket = io("http://localhost:3000")
        socket.emit("createRoom", {room})
        socket.on("getId", (data) => {
            const socketId = data.socketId as string
            socket.emit("setId", {socketId, room})
            socket.on("response", () => main(socket, roomVal, socketId))  
        })      
    }
}
function joinGame() {
    const room = document.querySelector('.find_room') as HTMLInputElement
    const roomVal = room.value 
    if(roomVal !== '' ) {
        const socket = io("http://localhost:3000")
        socket.emit("checkIfExists", {room})
        socket.on("getResp", (socketId) => {
           socket.emit("setId", {socketId, room})
           socket.on('response', () => main(socket, roomVal, socketId))
        })
       
        socket.on('error', () => {
            const room = document.querySelector('.find_room') as HTMLInputElement
            room.style.border = '1px solid red'
        })
    }

}



function main(socket:ReturnType<typeof io>, room:string, socketId:string) {
    console.log(socketId)
    new PrepareStage(socket,room,new GameLogic)
    socket.on("playerFinishedPreparing", () => {
        new GameplayStage(socket,room,new GameLogic, /*player turn */)
    })
    
    
}


