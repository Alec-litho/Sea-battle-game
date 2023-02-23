class Ship {
    constructor(y,x,kind) {
        this.y = +y
        this.x = +x
        this.kind = kind

        this.start = y+x
        kind[0].length == 1? this.end = +this.start : this.end = +this.start + kind[0].length-1
        this.id = Math.floor(Math.random() * 100000)
        this.shipCells = (_ => {
            let lengthNum = this.end - this.start + 1
            let lengthCords = []
            let a = this.start
            while(a <= this.end) {lengthCords.push(a++)}
            return {
                num: lengthNum,
                cords: lengthCords
            }
        })()
    }
}

export default class logic {
    init = () => this.createShip(0,0,this.shipList.one)//creating first ship
    //------------------it will be change depending on which turn is it right now
    existingShips = []//thus it's either player one or player two
    myField = [[],[]]
    //------------------
    shipList = {
        four: [[2,2,2,2],],
        three: [[2,2,2],],
        two: [[2,2],],
        one: [[2],],
    }

    currentShipFunc() {
        let obj = {}
        obj.x = this.existingShips[this.existingShips.length-1].x
        obj.y = this.existingShips[this.existingShips.length-1].y
        obj.ship = this.existingShips[this.existingShips.length-1].kind
        return obj
    }
    click(y,x,kind) {
        if(!this.checkExistingShips(+x,+y)) {
            console.log('exists', this.existingShips);
            return
        } else {
            this.createShip(y,x,kind)
        }


        if(this.checkForBarriers()) {
            console.log('cant place it here');
            this.existingShips.pop()
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
    attackShip(y,x) {
        if(this.checkForBarriers()) {
            let lastIndex = this.existingShips.length-1
            let cords = this.existingShips[lastIndex].shipCells.cords.filter(cord => cord != y + x )
            this.myField[y][x] = 1
            this.existingShips[lastIndex].shipCells.cords = cords
            console.log(this.myField);
            this.removeShip()
        } else {
            console.log(`there's no ship`);
        }
    }
    checkExistingShips(x,y) {
        if(this.existingShips.length > 0) {
        return [...this.existingShips].some(ship => ship.x !== x && ship.y !== y)
        } else {
            console.log('empty');
            return true
        }
    }
    checkForBarriers() {
        let {x:Xcord, y:Ycord, ship} = this.currentShipFunc()
        console.log(this.myField);
        for (let y = 0; y < ship.length; y++) {
            for (let x = 0; x < ship[y].length; x++) {
                if(this.myField[Ycord + y][Xcord + x] === undefined || this.myField[Ycord + y][Xcord + x] === 2) return true
            }
        }
    }
    removeShip() {
        let existingShips = this.existingShips.filter(ship => ship.shipCells.cords.length > 0)
        this.existingShips = existingShips
    }
    createShip(y,x,kind) {
        let ship = new Ship(y,x,kind)
        this.existingShips.push(ship)

    }
}

