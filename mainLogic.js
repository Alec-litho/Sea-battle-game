class Ship {
    constructor(y,x,kind) {
        this.y = y
        this.x = x
        this.kind = kind
        this.id = Math.floor(Math.random() * 100000)
    }

}

export default class logic {
    existingShips = []
    myField = [
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],


        // [0,0,0,0,0,0,0,0,0,0,0,0],
        // [0,0,0,0,0,0,0,0,0,0,0,0],
        // [0,0,0,0,0,0,0,0,0,0,0,0],
        // [0,0,0,0,0,0,0,0,0,0,0,0],
        // [0,0,0,0,0,0,0,0,0,0,0,0],
        // [0,0,0,0,0,0,0,0,0,0,0,0],
        // [0,0,0,0,0,0,0,0,0,0,0,0],
        // [0,0,0,0,0,0,0,0,0,0,0,0],
        // [0,0,0,0,0,0,0,0,0,0,0,0],
        // [0,0,0,0,0,0,0,0,0,0,0,0],
        // [0,0,0,0,0,0,0,0,0,0,0,0],
        // [0,0,0,0,0,0,0,0,0,0,0,0]
    ]
    shipList = {
        four: [
            [1,1,1,1,1,1],
            [1,2,2,2,2,1],
            [1,1,1,1,1,1],
        ],
        three: [
            [1,1,1,1,1],
            [1,2,2,2,1],
            [1,1,1,1,1],
        ],
        two: [
            [2,2],
        ],
        one: [
            [2],
        ],
    }
    init = (() => this.createShip(0,0,this.shipList.one))()//creating first ship

    currentShipFunc() {
        let obj = {}
        obj.x = this.existingShips[this.existingShips.length-1].x
        obj.y = this.existingShips[this.existingShips.length-1].y
        obj.ship = this.existingShips[this.existingShips.length-1].kind
        return obj
    }
    click(y,x,kind) {
        this.createShip(y,x,kind)

        if(this.checkForBarriers()) {
            console.log('cant place it here');
        } else {
            this.placeShip()
        }
    }

    placeShip() {
        let gapX, gapY
        let {x:Xcord, y:Ycord, ship} = this.currentShipFunc()
        // Xcord === 0? gapX = 0 : gapX = 1
        // Ycord === 0? gapY = 0 : Ycord = 1
        for (let y = 0; y < ship.length;  y++) {
            for (let x = 0; x < ship[y].length; x++) {
                    this.myField[Ycord  + y][Xcord  + x] = ship[y][x]
            }
        }
    }
    checkForBarriers() {
        let {x:Xcord, y:Ycord, ship} = this.currentShipFunc()
        for (let y = 0; y < ship.length; y++) {
            for (let x = 0; x < ship[y].length; x++) {
                if(this.myField[Ycord + y][Xcord + x] === undefined || this.myField[Ycord + y][Xcord + x] === 2) return true
                    
            }
        }
    }
    createShip(y,x,kind) {
        let ship = new Ship(y,x,kind)
        this.existingShips.push(ship)
    }
}

