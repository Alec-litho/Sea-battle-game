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
let rooms = []
let sockets = [{turn: true, id: ''}, {turn: false, id: ''}]
let i = -1
let socketsRoom = null
io.on("connection", (socket) => {
    
    socket.on("setId", _ => {
        i++

        sockets[i].id = socket.id;
        console.log(sockets);
    })
    socket.on("createRoom", data => {
        let {room} = data
        socketsRoom = room
        socket.emit("getResp", {id: socket.id})
        socket.join(room)
    })
    socket.on('checkIfExists', data => {
        let {room} = data
        let id = socket.id
        socket.emit("getResp", {id})
        if(io.sockets.adapter.rooms.get(room)) {
                let exist = true;
                socket.join(room)
                io.in(room).emit('response', {exist})
                console.log(io.sockets.adapter.rooms);
        } else {
            let notFound = false
            socket.emit('error', {notFound})
        }
    })
    socket.on("finishedPreparing", data => {
        playersFinished.push('finished')
        let {room} = data
        console.log(room);
        playersFinished.length === 2? io.in(room).emit('playerFinishedPreparing', {}) : null
        
    })
    socket.on("message", data => {
        let {msg, room} = data
        console.log(io.sockets.adapter.rooms.get(`${room}`));
        socket.to(room).emit('receiveMsg', {msg})
    })
    socket.on("changeTurn", data => {
        let {socketId, beginning} = data;
        console.log(sockets[0].turn, sockets[1].turn);

        if(beginning) socketId.id === sockets[0].id? io.to(sockets[0].id).emit("turn", {turn: sockets[0].turn}) : io.to(sockets[1].id).emit("turn", {turn: sockets[1].turn})
        else {
            sockets[0].turn === true? sockets[0].turn = false : sockets[0].turn = true
            sockets[1].turn === true? sockets[1].turn = false : sockets[1].turn = true
            io.to(sockets[0].id).emit("turn", {turn: sockets[0].turn})
            io.to(sockets[1].id).emit("turn", {turn: sockets[1].turn})
            console.log(sockets);
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