import Logic from './mainLogic.js';
import Player from './players.js';

document.querySelector('.newGame').addEventListener('click', _ => {
    let room = document.querySelector('.createRoomVal').value
    if(room !== '' ) {
        console.log(room);
        const socket = io("http://localhost:3000")
        socket.emit("createRoom", {room})
        socket.on("getId", data => {
            let {socketId} = data
            socket.emit("setId", {socketId, room})
            socket.on("response", _ => startGame(socket, room, socketId))  
        })      
    }
})
document.querySelector('.join_room').addEventListener('click', _ => {
    let room = document.querySelector('.find_room').value
    if(room !== '' ) {
        const socket = io("http://localhost:3000")
        socket.emit("checkIfExists", {room})
        socket.on("getResp", socketId => {
           socket.emit("setId", {socketId, room})
           console.log(socketId)
           let {id} = socketId
           socket.on('response', data => startGame(socket, room, socketId))
        })
       
        socket.on('error', err => {
            document.querySelector('.find_room').style.border = '1px solid red'
        })
    }
})


function startGame(socket, room, socketId) {
    document.querySelector('.game').style.display = 'flex'
    document.querySelector('.ships').style.display = 'grid'
    document.querySelector('.startGame').style.display = 'none'
    // const newPlayerOne = new Player()

    const game = new Logic()//loading logic
    window.game  = game
    let cellsPlayerOne = [...document.querySelector('.board').childNodes].filter(cell => cell.nodeType === Node.ELEMENT_NODE)//first player cells (array, not nodelist)
    let cellsPlayerTwo = [...document.querySelector('.boardPlayerTwo').childNodes].filter(cell => cell.nodeType === Node.ELEMENT_NODE)//second player cells
    let shipsToPut = document.querySelectorAll('.shipToPut')
    let board = document.querySelector('.board')
    let prepare = true //if false, the preparing stage is finished
    let ship = {
        type: game.shipList['one'],
        direction: 'vertical'
    }

    // game.existingShips = newPlayerOne.existingShips
    // game.myField = newPlayerOne.field


    prepareStage(cellsPlayerOne, cellsPlayerOne[0].parentNode, cellsPlayerTwo, ship, socketId, room)
    // window.newPlayerOne = newPlayerOne


//------------------------------Start game function--------------------------------
    function logic(myCells, enemyCells, myBoard, enemyBoard, socketId, room) {
        socket.on('turn', data => {
            let {turn} = data
            console.log(turn, socketId);
            if(turn) {
                    console.log('start');
            //fire-------------------------------------------------------
                     enemyCells.forEach(cell => {
                        cell.addEventListener('click', attack)   
                    })
                    function attack(e) {
                        let cell = e.target
                        socket.emit("checkForShip", {x: e.target.dataset.cord[1], y: e.target.dataset.cord[0], room})

                        socket.on("missed", data => {
                            cell.classList.add('attacked')
                            change()    
                        })
                        socket.on("attacked", data => {
                            cell.classList.add('attackedShip')
                            socket.off("attacked")
                            socket.off("missed")
                        })
                        
                    }
            //Clear and change turn functions----------------------------       
                    function change() {  
                        socket.off("missed")
                        socket.off("attacked")
                        socket.off("getAttacked")                  
                        clearCurrentAttack(enemyCells)
                        socket.emit('changeTurn', {socketId})
                    }
                    function clearCurrentAttack(enemyCells) {
                        enemyCells.forEach(enemyCell => {
                            enemyCell.removeEventListener('click', attack)
                        })
                    }
            
            } else {
                console.log('wait');
                socket.on('getAttacked', cords => {
                    let {y,x} = cords 
                    let result = game.attackShip(+y,+x)
                    socket.off("missed")
                    socket.off("attacked")
                    if(result === true) {
                        socket.emit("gotAttacked_True", {y,x}) 
                    }else {
                        socket.emit("gotMissed_False", {y,x})
                    }
                })
            }
        }
    )}

    function prepareStage(cells, board, cellsEnemy, ship, socketId, room) {
        socket.on("playerFinishedPreparing", _ => {//waiting for second player to finsih preparing
            console.log('playerFinishedPreparing');
            socket.emit('changeTurn', {socketId, beginning: true})
            logic(cellsPlayerOne, cellsPlayerTwo, cellsPlayerOne[0].parentNode, cellsPlayerTwo[0].parentNode, socketId, room)
        })
        let one = document.querySelector('#one')
        let four = document.querySelector('#four')
        let two = document.querySelector('#two')
        let three = document.querySelector('#three')

        document.querySelector('.btn').addEventListener('click', _ => {
            if(shipsCount.reduce((a,b) => a+b,0) >= 10) {
                setTimeout(() => {
                    clearInterval(interval)
                    clear(cells, cellsEnemy)
                    prepare = !prepare
                    socket.emit('finishedPreparing', {room})
                },500)
                document.querySelector('.btn').style.display = 'none'
            } else {
                console.log(shipsCount);
                console.log('some ships are not used');
            }
        })
        //Ships to put------------------------------------------------
        let shipsAllKinds = document.querySelectorAll('.shipToPut')
        function setShipToView() {
            let id = ship.type[0].length==1? 'one' : ship.type[0].length==2? 'two' : ship.type[0].length==3? 'three' : "four"
            document.querySelector('.currentShip').setAttribute('id', `${id}`)
        }
        function chooseShip(e) {
            ship.type = game.shipList[e.target.dataset.num]
        }
        shipsAllKinds.forEach(item => {
            item.addEventListener('click', chooseShip)
        })  
        shipsAllKinds.forEach(item => {
            item.addEventListener('click', setShipToView)
        })  
        let interval = setInterval(_ => update(cells), 100) 
    
        function clear(cellsMine) {
                cellsMine.forEach(myCell => {
                    myCell.removeEventListener('click', placeShip)
                })
                shipsAllKinds.forEach(ship => {
                    ship.removeEventListener('click', chooseShip)
                })
                cells.forEach( cell => {
                    cell.removeEventListener('click', smthWithShips)
                })
        }
        //put ship--------------------------------------------------
        cells.forEach(cell => {
            cell.addEventListener('click', placeShip)
        })         
        let direction = 'vertical'
        let shipsCount = [0/*first ship*/,0/*second ship*/,0/*third ship*/,0/*fourth ship*/]
        function placeShip(e) {
            loadShip()
            game.click(e.target.dataset.cord, e.target.dataset.cord[0], e.target.dataset.cord[1], ship, direction)
        }
        cells.forEach( cell => {
            cell.addEventListener('click', smthWithShips)
        })
        function smthWithShips() {
                switch(ship.type[0].length) {
                    case 1:
                        shipsCount[0]++
                        break
                    case 2:
                        shipsCount[1]++
                        break
                    case 3:
                        shipsCount[2]++
                        break
                    case 4:
                        shipsCount[3]++
                        break
                }
                if (shipsCount.reduce((a,b) => a+b,0) >= 10){
                    document.querySelector('.currentShip').style.display ='none'
                    cells.forEach(cell => {
                        cell.removeEventListener('click', placeShip)
                    })   
                }
                loadShip()
        }
        function loadShip() {
            if(shipsCount[0] === 4) {one.classList.add('hide'); ship.type = game.shipList['two']; game.shipList['one'] = game.shipList['two']}
            if(shipsCount[1] === 3) {two.classList.add('hide'); ship.type = game.shipList['three']; game.shipList['two'] = game.shipList['three']}
            if(shipsCount[2] === 2) {three.classList.add('hide'); ship.type = game.shipList['four']; game.shipList['three'] = game.shipList['four']}
            if(shipsCount[3] === 1) {four.classList.add('hide'); ship.type = game.shipList['one']; console.log('w');}
            setShipToView() 
        }
    }
    //--------------------------updateView-------------------------------
    function update(cells) {
        [...cells].forEach(cell => {
                for (let y = 0; y < game.myField.length ; y++) {
                    for (let x = 0; x < game.myField[y].length ; x++) {
                        if(game.myField[y][x] === 2) {
                            cell.dataset.cord === [y,x].join('')? cell.classList.add('ship') : null
                        }
                    }      
                }
            })
        }
}


 