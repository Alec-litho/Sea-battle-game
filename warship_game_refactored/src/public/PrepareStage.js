import { Game } from './Game.js';
export class PrepareStage extends Game {
    constructor(socket, room, game) {
        super(socket, room);
        this.board = document.querySelector('.board');
        this.cells = document.querySelectorAll('.cell');
        this.shipsHTML = document.querySelectorAll('.shipToPut');
        this.finishBTN = document.querySelector('.btn');
        this.shipsCount = [0, 0, 0, 0];
        this.shipTypeList = [[2], [2, 2], [2, 2, 2], [2, 2, 2, 2]];
        this.shipType = {
            type: this.shipTypeList[0],
            direction: 'horizontal'
        };
        this.game = game;
        this.render = setInterval(() => this.renderShips, 300);
        this.finishBTN.addEventListener("click", this.finishPrepareStage);
        this.removeStyles();
        this.board.addEventListener('click', (e) => {
            const target = e.target;
            console.log(target, target.dataset);
        });
    }
    removeStyles() {
        function qselect(HTMLclass) { return document.querySelector(HTMLclass); }
        const [game, ships, startGame] = [qselect('.game'), qselect('.ships'), qselect('.startGame')];
        game.style.display = 'flex';
        ships.style.display = 'grid';
        startGame.style.display = 'none';
    }
    clearEvents() {
        this.board.removeEventListener('click', this.placeShip);
        this.shipsHTML.forEach((ship) => {
            ship.removeEventListener('click', this.chooseShip);
        });
    }
    chooseShip(e) {
        const target = e.target;
        this.shipType.type = this.shipTypeList[target.dataset.num];
    }
    renderShips() {
        [...this.cells].forEach((cell) => {
            for (let y = 0; y < this.game.map.length; y++) {
                for (let x = 0; x < this.game.map[y].length; x++) {
                    if (this.game.map[y][x] === 2) {
                        cell.dataset.cord === [y, x].join('') ? cell.classList.add('ship') : null;
                    }
                }
            }
        });
    }
    placeShip(e) {
        const target = e.target;
        const { x, y } = { x: target.dataset[1], y: target.dataset[0] };
        const cords = y.toString() + x.toString();
        if (this.game.checkForShip(x, y)) {
            console.log(`exists`, this.game.existingShips);
        }
        else if (this.game.checkForBarriers(cords, this.shipType)) {
            console.log('cant place it here');
        }
        else {
            const ship = this.game.createShip(Number.parseFloat(x), Number.parseFloat(y), this.shipType);
            this.game.appendShip(ship);
        }
    }
    incrementShipCount() {
        switch (this.shipType.type.length) {
            case 1:
                this.shipsCount[0]++;
                break;
            case 2:
                this.shipsCount[1]++;
                break;
            case 3:
                this.shipsCount[2]++;
                break;
            case 4:
                this.shipsCount[3]++;
                break;
        }
        if (this.shipsCount.reduce((a, b) => a + b, 0) >= 10) {
            const currentShip = document.querySelector('.currentShip');
            currentShip.style.display = 'none';
            this.cells.forEach((cell) => {
                cell.removeEventListener('click', this.placeShip);
            });
        }
        this.updateShipsDOM(this.shipsCount);
    }
    setCurrentShip() {
        const id = this.shipType.type.length == 1 ? 'one' : this.shipType[0].length == 2 ? 'two' : this.shipType[0].length == 3 ? 'three' : 'four';
        document.querySelector('.currentShip').setAttribute('id', `${id}`);
    }
    updateShipsDOM(arr) {
        arr.forEach((ship, indx) => {
            if (ship === arr.length - indx) {
                const htmlEl = [...this.shipsHTML].filter((el) => el.getAttribute('id') === `${indx + 1}`)[0];
                htmlEl.classList.add('hide');
                this.shipTypeList.splice(indx, 1);
                if (this.shipTypeList.length === 1)
                    this.shipType.type = this.shipTypeList[0];
                else
                    this.shipType.type = this.shipTypeList[indx + 1] === undefined ? this.shipTypeList[indx - 1] : this.shipTypeList[indx + 1];
            }
        });
        this.setCurrentShip();
    }
    finishPrepareStage() {
        if (this.game.existingShips.length >= 10) {
            setTimeout(() => {
                clearInterval(this.render);
                this.clearEvents();
                this.socket.emit('finishedPreparing', { room: this.room });
            }, 500);
            document.querySelector('.btn').style.display = 'none';
        }
        else {
            console.log('some ships are not used');
        }
    }
}
