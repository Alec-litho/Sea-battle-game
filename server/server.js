const express = require('express')
const app = express()
const path = require('path')
const http = require('http')
const {Server} = require('socket.io')

const cors = require('cors')
app.get('/', (req, res) => {
    res.redirect('index.html');
})
app.use(cors())
const server = http.createServer(app)
app.use(express.static(__dirname + 'public'))

const io = new Server(server, {
    cors: {
        origin: 'http:/localhost:5500',
        methods: ["GET", "POST"]
    }
})
let playersFinished = []
let currentRoom = ''
let sockets = [{turn: true, id: ''}, {turn: false, id: ''}]
let socketsRoom = null
io.on("connection", (socket) => {
    
    socket.on("setId", data => {
        let {socketId, room} = data
        currentRoom = room
        io.sockets.adapter.rooms.get(room).size === 1? sockets[0].id = socket.id : sockets[1].id = socket.id
    })
    socket.on("createRoom", data => {
        let {room} = data
        socket.emit('getId', {socketId: socket.id})
        socket.join(room)
    })

    socket.on('checkIfExists', data => {
        let {room} = data
        let id = socket.id
        if(io.sockets.adapter.rooms.get(room)) {
                socket.join(room)
                socket.emit("getResp", {id})
                let exist = true;
                io.in(room).emit('response', {exist})
        } else {
            let notFound = false
            socket.emit('error', {notFound})
        }
    })
    socket.on("finishedPreparing", data => {
        playersFinished.push('finished')
        let {room} = data
        playersFinished.length === 2? io.in(room).emit('playerFinishedPreparing') : null
        
    })
    socket.on("checkForShip", data => {
        let {y,x, room} = data 
        console.log(y, x);
        socket.to(room).emit("getAttacked", {y,x})
    })
    socket.on("gotAttacked_True", cords => {
        let {y,x} = cords 
        console.log('attacked');
        socket.to(currentRoom).emit("attacked", {y,x})
    })
    socket.on("gotMissed_False", cords => {
        let {y,x} = cords 
        console.log('missed');
        socket.to(currentRoom).emit("missed", {y,x})
    })

    socket.on("changeTurn", data => {
        let {socketId, beginning} = data;
        if(beginning) socketId === sockets[0].id? io.to(sockets[0].id).emit("turn", {turn: sockets[0].turn}) : io.to(sockets[1].id).emit("turn", {turn: sockets[1].turn})
        else {
            sockets[0].turn === true? sockets[0].turn = false : sockets[0].turn = true
            sockets[1].turn === true? sockets[1].turn = false : sockets[1].turn = true
            io.to(sockets[0].id).emit("turn", {turn: sockets[0].turn})
            io.to(sockets[1].id).emit("turn", {turn: sockets[1].turn})
        }

    })
})


// Express Middleware for serving static files
app.use(express.static(path.join(__dirname, 'public')));

app.get('/main', (req, res)=> {
    res.sendFile(__dirname + '/index.html')
})
server.listen(3000, () => {
    console.log('is running');
})