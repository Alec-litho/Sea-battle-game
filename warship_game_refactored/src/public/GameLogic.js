import Ship from "./Ship.js";
export class GameLogic {
    constructor() {
        this.existingShips = [];
        this.map = [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        ];
        this.ShipClass = Ship;
    }
    appendShip(ship) {
        const shipCords = ship.allShipCords;
        for (let y = 0; y < this.map.length; y++) {
            for (let x = 0; x < this.map[y].length; x++) {
                if (shipCords.some((cord) => +cord[0] === y) && shipCords.some((cord) => +cord[1] === x)) {
                    this.map[y][x] = 2;
                }
            }
        }
    }
    attackShip(y, x) {
        if (this.map[y][x] === 2) {
            this.existingShips.forEach((ship) => {
                ship.allShipCords.map((cord, indx) => {
                    if (cord.toString() === `${y} + ${x}`)
                        ship.allShipCords.splice(indx, 1);
                });
            });
            this.map[y][x] = 1;
            if (this.checkIfShipExists()) {
                const shipId = this.existingShips.filter((ship) => ship.allShipCords.length === 0)[0].id;
                this.removeShip(shipId);
            }
            return true;
        }
        else {
            return false;
        }
    }
    checkIfShipExists() {
        let result;
        this.existingShips.forEach((ship) => {
            result = ship.allShipCords.length > 0 ? true : false;
        });
        return result;
    }
    checkForShip(y, x) {
        if (this.existingShips.length > 0) {
            return [...this.existingShips].some((ship) => {
                ship.allShipCords.forEach((cord) => (cord == Number.parseFloat(y + x) ? true : false));
            });
        }
        else {
            return false;
        }
    }
    paintShipArea(cords, shipType, cells) {
        const { startCord, endCord } = this.defineStartAndEndCords(cords, shipType);
        for (let y = +startCord[0]; y <= +endCord[0]; y++) {
            for (let x = +startCord[1]; x <= +endCord[1]; x++) {
                const indx = y === 0 ? +`${x}` : +`${y}${x}`;
                if (this.map[y][x] === 2) {
                    cells[indx].className = "cell barrier";
                }
                else {
                    cells[indx].className = "cell freeSpace";
                }
            }
        }
    }
    clearShipArea(cells) {
        cells.forEach((cell) => {
            cell.className = cell.className === "cell ship" ? "cell ship" : "cell ";
        });
    }
    checkForBarriers(cords, shipType) {
        const { startCord, endCord } = this.defineStartAndEndCords(cords, shipType);
        for (let y = +startCord[0]; y <= +endCord[0]; y++) {
            for (let x = +startCord[1]; x <= +endCord[1]; x++) {
                if (this.map[y][x] === 2) {
                    console.log('barrier');
                    return true;
                }
            }
        }
    }
    defineStartAndEndCords(cords, shipType) {
        const shipTypeLen = shipType.type.length;
        let currCord = +cords[0];
        let startCord;
        if (+cords[0] - 11 === 0 || +cords[1] - 11 === 0)
            startCord = '00';
        else {
            let y = `${+cords[0] * 10 - 10}`;
            let x = `${+cords[1] - 1}`;
            y.length === 3 ? (y = y.slice(0, 2)) : (y = y.slice(0, 1));
            while (Math.sign(+x) === -1)
                x = `${parseFloat(x) + 1}`;
            while (Math.sign(+y) === -1)
                y = `${parseFloat(y) + 1}`;
            startCord = y.toString() + x;
        }
        currCord.toString() === '9' ? (currCord = currCord - 1) : currCord;
        const endCord = shipType.direction === 'horizontal' ? `${((+startCord[0]) + 2) * 10 + ((+startCord[1]) + shipTypeLen + 1)}` : `${(+startCord[1]) + 2 + ((+startCord[0]) + shipTypeLen + 1) * 10}`;
        const areaCords = [];
        return { startCord, endCord, areaCords };
    }
    removeShip(shipId) {
        let shipIndx;
        this.existingShips.forEach((ship, indx) => {
            if (ship.id === shipId)
                shipIndx = indx;
        });
        this.existingShips = this.existingShips.splice(shipIndx, 1);
    }
    createShip(y, x, ship) {
        const createdShip = new this.ShipClass(y, x, ship);
        this.existingShips.push(createdShip);
        return createdShip;
    }
}
