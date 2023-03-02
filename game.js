import Logic from './mainLogic.js';
import Player from './players.js';

//----------------------------------------------------------------------------------------------------------------



//THE PROBLEM IS THAT AFTER PLAYER TWO FINISHES PREPARING STAGE ITS STILL HIS TURN ALTHOUGH IT SHOULD BE OVERWISE



//----------------------------------------------------------------------------------------------------------------
document.querySelector('.newGame').addEventListener('click', _ => {
    document.querySelector('.game').style.display = 'flex'
    document.querySelector('.startGame').style.display = 'none'
    const newPlayerOne = new Player()//first player
    const newPlayerTwo = new Player()//second player
    const game = new Logic()//loading logic
    window.game  = game
    let cellsPlayerOne = [...document.querySelector('.board').childNodes].filter(cell => cell.nodeType === Node.ELEMENT_NODE)//first player cells (array, not nodelist)
    let cellsPlayerTwo = [...document.querySelector('.boardPlayerTwo').childNodes].filter(cell => cell.nodeType === Node.ELEMENT_NODE)//second player cells
    let shipsToPut = document.querySelectorAll('.shipToPut')
    let board = document.querySelector('.board')
    let turn = true
    let prepare = true //if false, the preparing stage is finished
    changeTurn(cellsPlayerOne, cellsPlayerTwo, cellsPlayerOne[0].parentNode, cellsPlayerTwo[0].parentNode)

    function changeTurn(playerOne, playerTwo, boardPlayerOne, boardPlayerTwo) {
        console.log(turn);
        if(turn) {
            game.existingShips = newPlayerOne.existingShips
            game.myField = newPlayerOne.field
            logic(playerOne, playerTwo, boardPlayerOne, boardPlayerTwo)
        } else {
            game.existingShips = newPlayerTwo.existingShips
            game.myField = newPlayerTwo.field
            logic(playerTwo, playerOne, boardPlayerTwo, boardPlayerOne) 
            prepare = undefined
        }
    }
    window.newPlayerOne = newPlayerOne
    window.newPlayerTwo = newPlayerTwo
    window.cellsPlayerOne = cellsPlayerOne
    window.cellsPlayerTwo = cellsPlayerTwo

//------------------------------Start game function--------------------------------

    function logic(myCells, enemyCells, myBoard, enemyBoard) {
        prepare !== undefined? prepareStage(myCells, myBoard, enemyCells) : null
            let ship = game.shipList['one']
            let val = false
            let currentCells = ''

    //fire------------------------------------------------------
            enemyCells.forEach(cell => {
                cell.addEventListener('contextmenu', attack)   
            })
            function attack(e) {
                e.preventDefault()
                e.target.className === "cell ship"?  attacked(e.target) : missed(e.target)
                e.target.classList.remove('ship')
                game.attackShip(e.target.dataset.cord[0],  e.target.dataset.cord[1])
                val? null : change()    
            }
    //Clear and change turn functions----------------------------       
            function change() {
                clearCurrentAttack(enemyCells)
                stop()
                changeTurn()
            }
            function clearCurrentAttack(enemyCells) {
                enemyCells.forEach(enemyCell => {
                    enemyCell.removeEventListener('contextmenu', attack)
                })
            }

    //------------------------------------------------------------ 
    
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
    //------------------------------------------------------------ 
    
    //update view-------------------------------------------------
            function update(cells) {
                [...cells].forEach(cell => {
                        for (let y = 0; y < game.myField.length ; y++) {
                            for (let x = 0; x < game.myField[y].length ; x++) {
                                if(game.myField[y][x] === 2) {
                                    if(cell.dataset.cord === [y,x].join('')) {//if(cell.dataset.cord === [y-1,x-1].join('')) {
                                        cell.classList.add('ship')
                                    }
                                }
                            }      
                        }
                })
                // console.log(cells[0].parentNode); BUG!!!--------------------------------------------------
            }
            function stop() {
                clearInterval(interval)
            }
            
            let interval = setInterval(_ => update(myCells), 100)
    //------------------------------------------------------------ 
    
    //Ships to put------------------------------------------------
            document.querySelectorAll('.shipToPut').forEach(item => {
                item.addEventListener('click', e => {
                    ship = game.shipList[e.target.dataset.num]
                })
            })

            function prepareStage(cells, board, cellsEnemy) {

                function clear(cellsMine, cellsEnemy) {
                    if(turn === true) {// clears player one
                        cellsMine.forEach(myCell => {
                            myCell.removeEventListener('contextmenu', attack)
                        })
                        cellsMine.forEach(myCell => {
                            myCell.removeEventListener('click', placeShip)
                        })
                    } else if(turn === false) {// clears player two
                        console.log('playeertwo');
                        cellsEnemy.forEach(cellEnemy => {
                            cellEnemy.removeEventListener('contextmenu', attack)
                        })
                        cellsEnemy.forEach(cellEnemy => {
                            cellEnemy.removeEventListener('click', placeShip)
                        })
                    } 
                }
                    //put ship--------------------------------------------------
            myCells.forEach(cell => {
                cell.addEventListener('click', placeShip)
            })         
            function placeShip(e) {
                game.click(e.target.dataset.cord[0], e.target.dataset.cord[1], ship)//+e.target.dataset.cord[0]+1, +e.target.dataset.cord[1]+1, ship
            }
                let firstKind = 0,
                secondKind = 0,
                thirdKind = 0,
                fourthKind = 0
                //no need for attack on this stage--------------------------
                setTimeout(_ => {cellsEnemy.forEach(enemyCell => {
                    enemyCell.removeEventListener('contextmenu', attack)
                    })
                }, 0)
                //----------------------------------------------------------
                cells.forEach( cell => {
                    cell.addEventListener('click', smthWithShips)
                })
                function smthWithShips() {
                        switch(ship[0].length) {
                            case 1:
                                firstKind++
                                break
                            case 2:
                                secondKind++
                                break
                            case 3:
                                thirdKind++
                                break
                            case 4:
                                fourthKind++
                                break
                        }
                        // if (game.existingShips.length+1 === 3){
                        //     setTimeout(() => {
                        //         stop()
                        //         clearInterval(loadShipInterval)
                        //         clear(cells, cellsEnemy)
                        //         turn = !turn 
                        //         changeTurn(myCells, enemyCells, myBoard, enemyBoard)
                        //     },500)
                        // }------------------------NEEED TO BE FIXED
                }
                
                function loadShip() {
                    if(firstKind === 4) {document.querySelector('#one').classList.add('hide'); ship = game.shipList['two']}
                    if(secondKind === 3) {document.querySelector('#two').classList.add('hide'); ship = game.shipList['three']}
                    if(thirdKind === 2) {document.querySelector('#three').classList.add('hide'); ship = game.shipList['four']}
                    if(fourthKind === 1) {document.querySelector('#four').classList.add('hide');}//need to be fixed
                }
                let loadShipInterval = setInterval(_ => loadShip(), 100)
            }
                  
        }

   })
