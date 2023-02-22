import Logic from './mainLogic.js';
import Player from './players.js';

document.querySelector('.newGame').addEventListener('click', _ => {
    document.querySelector('.game').style.display = 'flex'
    document.querySelector('.startGame').style.display = 'none'
    const playerOne = new Player()//first player
    const playerTwo = new Player()//second player
    const game = new Logic()//loading logic
    window.playerOne = playerOne
    window.playerTwo = playerTwo
    window.game  = game
    let cellsPlayerOne = document.querySelector('.board').childNodes//first player cells
    let cellsPlayerTwo = document.querySelector('.boardPlayerTwo').childNodes//second player cells
    window.cellsPlayerOne = cellsPlayerOne
    window.cellsPlayerTwo = cellsPlayerTwo
    
    let shipsToPut = document.querySelectorAll('.shipToPut')
    let board = document.querySelector('.board')
    let ship = game.shipList['one']
    let turn = false
    changeTurn()
    
    function changeTurn() {
        turn = !turn
        console.log(turn);
        if(turn) {
            game.existingShips = playerOne.existingShips
            game.myField = playerOne.field
            logic(cellsPlayerOne, cellsPlayerTwo, cellsPlayerTwo[0].parentNode) 
        } else {
            game.existingShips = playerTwo.existingShips
            game.myField = playerTwo.field
            logic(cellsPlayerTwo, cellsPlayerOne, cellsPlayerOne[0].parentNode) 
        }
    }
//-------------------------------clear---------------------------------------

//----------------------------------------------------------------------------------
    function logic(cells, enemyCells, board) {
        let val = false
        let currentCells = ''
        let cellss = []
        function placeShip(e) {
            game.click(e.target.dataset.cord[0], e.target.dataset.cord[1], ship)//+e.target.dataset.cord[0]+1, +e.target.dataset.cord[1]+1, ship
        }
//put ship--------------------------------------------------
        cells.forEach(cell=> {
            cell.addEventListener('click', placeShip)
        })         
//fire------------------------------------------------------
        enemyCells.forEach(cell=> {
            if(cell.nodeType === Node.ELEMENT_NODE) {
            cellss.push(cell)
            cell.parameter = cellss
            cell.addEventListener('contextmenu', attack)   
            }
        })
//----------------------------------------------------------


//ПРОБЛЕМА, ПРИ НАЖАТИИ РАБОТАЕТ ТАК ЧТО ТОТ ЖЕ САМЫЙ ИВЕНТ НЕ РАБОТАЕТ, НО
//ТАК КАК СРАБАТЫВАЕТ CHANGETURN ТО ПОЛУЧАЕТСЯ БАГ
        function attack(e) {
                e.preventDefault()
                e.target.className === "cell ship"?  attacked(e.target) : missed(e.target)
                e.target.classList.remove('ship')
                game.attackShip(e.target.dataset.cord[0],  e.target.dataset.cord[1])
                // val? null : change()    
            }
           
        
        board.addEventListener('contextmenu', change)

        function change() {
            clear()
            stop()
            changeTurn()
        }
        function clear() {
            cellsPlayerOne.forEach(enemyCell => {
                enemyCell.removeEventListener('contextmenu', attack)
                
            })
            cellsPlayerTwo.forEach(enemyCell => {
                enemyCell.removeEventListener('contextmenu', attack)

            })
        } 
        function missed(cell) {
            cell.classList.add('attacked')
            val = false
        }
        function attacked(cell) {
            cell.classList.add('attackedShip')
            val = true
        }
      
        document.querySelectorAll('.shipToPut').forEach(item => {
            item.addEventListener('click', e => {
                ship = game.shipList[e.target.dataset.num]
            })
        })

        function update(cells) {
            [...cells].forEach(cell => {
                if(cell.nodeType === Node.ELEMENT_NODE) {
                    for (let y = 0; y < game.myField.length ; y++) {
                        for (let x = 0; x < game.myField[y].length ; x++) {
                            if(game.myField[y][x] === 2) {
            
                                if(cell.dataset.cord === [y,x].join('')) {//if(cell.dataset.cord === [y-1,x-1].join('')) {
                                    cell.classList.add('ship')
                                }
                            }
                        }      
                    }}
            })
        }
        function stop() {clearInterval(interval)}
        let interval = setInterval(_ => update(cells), 1000)
}})


// cells.forEach( cell => {
//     let firstKind = 0,
//     secondKind = 0,
//     thirdKind = 0,
//     fourthKind = 0

//     cell.addEventListener('mousedown', () => {
//     for (const existingShip of game.existingShips) {
//         switch(existingShip.kind[0].length) {
//             case 1:
//                 firstKind++
//                 break
//             case 2:
//                 secondKind++
//                 break
//             case 3:
//                 thirdKind++
//                 break
//             case 4:
//                 fourthKind++
//                 break
//         }}
//     })
//     board.addEventListener('mousemove', ()=> {
//         if(firstKind === 4) {document.querySelector('#one').classList.add('hide')}
//         if(secondKind === 3) document.querySelector('#two').classList.add('hide')
//         if(thirdKind === 2) document.querySelector('#three').classList.add('hide')
//         if(fourthKind === 1) document.querySelector('#four').classList.add('hide')
//     })
// })


    // getting ship
    // cells.forEach(cell=> {
    //     cell.addEventListener('click', e => {
    //         for (const ship of game.existingShips) {
    //             if([...ship.shipCells.cords].some(cord => cord == e.target.dataset.cord[0] + e.target.dataset.cord[1])) {
    //                 console.log(e.target.dataset.cord[0] + e.target.dataset.cord[1]);
    //             } 
    //         }
    //     })
    // })