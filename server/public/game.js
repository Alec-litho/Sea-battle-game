import Logic from './mainLogic.js';
import Player from './players.js';



document.querySelector('.newGame').addEventListener('click', _ => {
    let room = document.querySelector('.createRoomVal').value
    if(room !== '' ) {
        const socket = io("http://localhost:3000")
        socket.emit("createRoom", {room})
        socket.on("getResp", socketId => {
            console.log(socketId);
            socket.on("response", connected => {
                startGame(socket, room)
            })
        })
        
    }
})
document.querySelector('.join_room').addEventListener('click', _ => {
    let room = document.querySelector('.find_room').value
    if(room !== '' ) {
        const socket = io("http://localhost:3000")
        socket.emit("checkIfExists", {room})
        socket.on("getResp", socketId => {
        console.log(socketId)
        socket.on('response', data => startGame(socket, room))
        })
       
        socket.on('error', err => {
            document.querySelector('.find_room').style.border = '1px solid red'
        })
    }
})

// let msg = 'none'
// let btn = document.querySelector('.btn').addEventListener('click', _ => {   
// socket.emit('message', {msg, room})
// })
// socket.on('receiveMsg', data => {

//     console.log(data);
// })

function startGame(socket, room) {
    document.querySelector('.game').style.display = 'flex'
    document.querySelector('.ships').style.display = 'grid'
    document.querySelector('.startGame').style.display = 'none'
    const newPlayerOne = new Player()//first player
    
    // const newPlayerTwo = new Player()//second player

    const game = new Logic()//loading logic
    window.game  = game
    let cellsPlayerOne = [...document.querySelector('.board').childNodes].filter(cell => cell.nodeType === Node.ELEMENT_NODE)//first player cells (array, not nodelist)
    let cellsPlayerTwo = [...document.querySelector('.boardPlayerTwo').childNodes].filter(cell => cell.nodeType === Node.ELEMENT_NODE)//second player cells
    let shipsToPut = document.querySelectorAll('.shipToPut')
    let board = document.querySelector('.board')
    let turn = true
    let prepare = true //if false, the preparing stage is finished

    logic(cellsPlayerOne, cellsPlayerTwo, cellsPlayerOne[0].parentNode, cellsPlayerTwo[0].parentNode)

    // changeTurn(cellsPlayerOne, cellsPlayerTwo, cellsPlayerOne[0].parentNode, cellsPlayerTwo[0].parentNode)

    // function changeTurn(playerOne, playerTwo, boardPlayerOne, boardPlayerTwo) {

    //     if(turn) {
    //         game.existingShips = newPlayerOne.existingShips
    //         game.myField = newPlayerOne.field
    //         logic(playerOne, playerTwo, boardPlayerOne, boardPlayerTwo)
    //     } else {
    //         game.existingShips = newPlayerTwo.existingShips
    //         game.myField = newPlayerTwo.field
    //         logic(playerTwo, playerOne, boardPlayerTwo, boardPlayerOne) 
    //         prepare = undefined
    //     }
    // }
    // window.newPlayerOne = newPlayerOne
    // window.cellsPlayerOne = cellsPlayerOne


//------------------------------Start game function--------------------------------
    function logic(myCells, enemyCells, myBoard, enemyBoard) {
        game.existingShips = newPlayerOne.existingShips
        game.myField = newPlayerOne.field
        let ship = game.shipList['one']
        let val = false
        let currentCells = ''
        if(prepare) {prepareStage(myCells, myBoard, enemyCells, ship)}
        else {
                console.log('start');
        //fire-------------------------------------------------------
                 enemyCells.forEach(cell => {
                    cell.addEventListener('contextmenu', attack)   
                })
                function attack(e) {
                    e.preventDefault()
                    let cell = e.target
                    socket.emit("checkForShip", {cell})
                    cell.className === "cell ship"?  attacked(cell) : missed(cell)
                    cell.classList.remove('ship')
                    game.attackShip(cell.dataset.cord[0],  cell.dataset.cord[1])
                    val? null : change()    
                }
        //Clear and change turn functions----------------------------       
                function change() {
                    clearCurrentAttack(enemyCells)
                    stop()
                    changeTurn(cellsPlayerOne, cellsPlayerTwo, cellsPlayerOne[0].parentNode, cellsPlayerTwo[0].parentNode)
                }
                function clearCurrentAttack(enemyCells) {
                    enemyCells.forEach(enemyCell => {
                        enemyCell.removeEventListener('contextmenu', attack)
                    })
                }
        //status functions--------------------------------------------
                function missed(cell) {
                    cell.classList.add('attacked')
                    val = false
                    turn = !turn
                }
                function attacked(cell) {
                    cell.classList.add('attackedShip')
                    val = true
                }
        
            }
        }



    function prepareStage(cells, board, cellsEnemy, ship) {
        socket.on("playerFinishedPreparing", _ => {//waiting for second player to finsih preparing
            console.log('playerFinishedPreparing');
            logic(cellsPlayerOne, cellsPlayerTwo, cellsPlayerOne[0].parentNode, cellsPlayerTwo[0].parentNode)
        })
        document.querySelector('.btn').addEventListener('click', _ => {
            if(shipsCount.reduce((a,b) => a+b,0) === 10) {
                setTimeout(() => {
                    clearInterval(interval)
                    clearInterval(loadShipInterval)
                    clear(cells, cellsEnemy)
                    prepare = !prepare
                    socket.emit('finishedPreparing', {room})
                },500)
                document.querySelector('.btn').style.display = 'none'
            } else {
                console.log('some ships are not used');
            }
        })
        //Ships to put------------------------------------------------
        let shipsAllKinds = document.querySelectorAll('.shipToPut')
        function chooseShip(e) {
            ship = game.shipList[e.target.dataset.num]
        }
        shipsAllKinds.forEach(item => {
            item.addEventListener('click', chooseShip)
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
        function placeShip(e) {game.click(e.target.dataset.cord[0], e.target.dataset.cord[1], ship)}
        let shipsCount = [0/*first ship*/,0/*second ship*/,0/*third ship*/,0/*fourth ship*/]
        cells.forEach( cell => {
            cell.addEventListener('click', smthWithShips)
        })
        function smthWithShips() {
                switch(ship[0].length) {
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
                if (shipsCount.reduce((a,b) => a+b,0) === 10){
                    cells.forEach(cell => {
                        cell.removeEventListener('click', placeShip)
                    })   
                }
        }
        function loadShip() {
            if(shipsCount[0] === 4) {document.querySelector('#one').classList.add('hide'); ship = game.shipList['two']}
            if(shipsCount[1] === 3) {document.querySelector('#two').classList.add('hide'); ship = game.shipList['three']}
            if(shipsCount[2] === 2) {document.querySelector('#three').classList.add('hide'); ship = game.shipList['four']}
            if(shipsCount[3] === 1) {document.querySelector('#four').classList.add('hide');}//need to be fixed
        }
        let loadShipInterval = setInterval(_ => loadShip(), 100)
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


 