import Logic from './mainLogic.js';
let game = new Logic()
window.game  = game

let cells = document.querySelectorAll('.cell')

let ship = game.shipList['one']

cells.forEach(cell=> {
    cell.addEventListener('click', e => {
        game.click(e.target.dataset.cord[0], e.target.dataset.cord[1], ship)//+e.target.dataset.cord[0]+1, +e.target.dataset.cord[1]+1, ship
    })
})
// getting ship
cells.forEach(cell=> {
    cell.addEventListener('click', e => {
        for (const ship of game.existingShips) {
            if([...ship.length.cords].some(cord => cord == e.target.dataset.cord[0] + e.target.dataset.cord[1])) {
                console.log('this ship exists', ship);
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

