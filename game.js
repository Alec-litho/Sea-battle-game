import Logic from './mainLogic.js';

let game = new Logic()

window.game  = game

document.querySelectorAll('.cell').forEach(cell=> {
    cell.addEventListener('click', e => {
        console.log(e.target.dataset.cord);
        game.currShip.x = +e.target.dataset.cord[1]
        game.currShip.y = +e.target.dataset.cord[0]
        game.click()
    })
})