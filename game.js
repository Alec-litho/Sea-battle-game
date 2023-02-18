import Logic from './mainLogic.js';
let game = new Logic()
window.game  = game

let cells = document.querySelectorAll('.cell')
let shipsToPut = document.querySelectorAll('.shipToPut')
let board = document.querySelector('.board')
let ship = game.shipList['one']


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


cells.forEach(cell=> {
    //put ship--------------------------------------------------
    cell.addEventListener('click', e => {
        game.click(e.target.dataset.cord[0], e.target.dataset.cord[1], ship)//+e.target.dataset.cord[0]+1, +e.target.dataset.cord[1]+1, ship
    })
    //fire------------------------------------------------------
    cell.addEventListener('contextmenu', e => {
        e.preventDefault()
        e.target.className === "cell ship"? cell.classList.add('attackedShip') : cell.classList.add('attacked')
        cell.classList.remove('ship')
        game.attackShip(e.target.dataset.cord[0],  e.target.dataset.cord[1])
    })
})
// getting ship
cells.forEach(cell=> {
    cell.addEventListener('click', e => {
        for (const ship of game.existingShips) {
            if([...ship.shipCells.cords].some(cord => cord == e.target.dataset.cord[0] + e.target.dataset.cord[1])) {
                console.log(e.target.dataset.cord[0] + e.target.dataset.cord[1]);
            } 
        }
    })
})

document.querySelectorAll('.shipToPut').forEach(item => {
    item.addEventListener('click', e => {
        ship = game.shipList[e.target.dataset.num]

    })
})

setInterval(()=> {
    cells.forEach(cell => {
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
},1000)

