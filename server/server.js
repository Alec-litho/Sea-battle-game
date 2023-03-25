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
io.on("connection", (socket) => {
    
    socket.on("createRoom", data => {
        let {room} = data
        let id = socket.id
        socket.emit("getResp", {id})
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
        console.log(msg);
        console.log(io.sockets.adapter.rooms.get(`${room}`));
        socket.to(room).emit('receiveMsg', {msg})
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