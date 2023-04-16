class Ship {
    constructor(cord,y,x,ship) {
        console.log(cord);
        this.y = y
        this.x = x
        this.ship = ship
        this.start = cord
        this.direction = ship.direction
        if(ship.direction === 'horizontal') this.end = ship.type[0].length == 1? +this.start : this.start[0] + (+this.start[1] + ship.type[0].length-1)
        else {this.end = ship.type[0].length == 1?  this.start : (+this.start[0] + ship.type[0].length-1) + this.start[1] }

        this.id = Math.floor(Math.random() * 100000)
        this.shipCells = (_ => {
            let lengthCords = []
            let extendingCord = ship.direction === 'horizontal'? parseFloat(this.start[1])-1 : parseFloat(this.start[0])-1//y or x depends on what we want to extend
            if(ship.direction === 'horizontal') {
                while(extendingCord < (+this.end[1])) {
                    lengthCords.push(this.start[0] + (++extendingCord))
                }
            } else {
                console.log(extendingCord, this.end[0]);
                while(extendingCord < (+this.end[0])) {
                    lengthCords.push((++extendingCord) + this.start[1] )
                }
            }
            return lengthCords
        })()
    }
}

export default class logic {
    init = () => this.createShip(0,0,this.shipList.one)
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
    ]
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
        console.log(this.existingShips);
        obj.ship = {
            type: this.existingShips[this.existingShips.length-1].ship.type,
            direction: 'horizontal'
        }
        return obj
    }
    click(cord,y,x,ship, direction) {
        if(this.checkExistingShips(+x,+y) || ship.type == undefined) {
            console.log(`exists - ${x,y}`, this.existingShips);
            return
        } else {
            this.createShip(cord,y,x,ship, direction)
        }

        if(this.checkForBarriers()) {
            console.log('cant place it here');
            this.existingShips.pop()
        } else {
            this.placeShip()
        }
    }

    placeShip() {
        let {x:Xcord, y:Ycord, ship} = this.currentShipFunc()
        let cords = this.existingShips[this.existingShips.length-1].shipCells
        for (let y = 0; y < this.myField.length; y++) {
            for (let x = 0; x < this.myField[y].length; x++) {
                if(cords.some(cord => +cord[0] === y) && cords.some(cord => +cord[1] === x)) {
                   this.myField[y][x] = 2
                }
            }
        }
    }
    // attackShip(y,x) {
    //     if(this.checkForBarriers()) {
    //         console.log('attacked');
    //         let lastIndex = this.existingShips.length-1
    //         let cords = this.existingShips[lastIndex].shipCells.cords.filter(cord => cord != y + x )
    //         this.myField[y][x] = 1
    //         this.existingShips[lastIndex].shipCells.cords = cords
    //         this.removeShip()
    //     } else {
    //         console.log(`there's no ship`);
    //     }
    // }
    attackShip(y,x) {
            if(this.myField[y][x] === 2) {
                console.log('attacked');
                let lastIndex = this.existingShips.length-1
                console.log(y,x);
                this.existingShips.forEach(ship => {
                    ship.shipCells.map((cord, id) => {
                        if(cord.toString() === `${y} + ${x}`) ship.shipCells.splice(id, 1)
                     })
                })
                this.myField[y][x] = 1
                this.removeShip()
                return true      
            } else {
                return false 
            }
    }
    checkExistingShips(xcord,ycord) {
        if(this.existingShips.length > 0) {
        return [...this.existingShips].some(ship => {
            ship.shipCells.forEach(cord => cord == `${ycord}${xcord}` ? true : false)
        })
        } else {
            return false
        }
    }
    checkForBarriers() {
        // let {x:Xcord, y:Ycord, ship} = this.currentShipFunc()
        let currShip = this.existingShips[this.existingShips.length-1]
        let cords = currShip.shipCells
        let direction = currShip.direction
        console.log(currShip);
        let shipTypeLen = currShip.shipCells.length
        let currCord = +cords[0] 
        console.log(+cords[0][0] - 11, +cords[0][1] - 11);
        let startCord = +cords[0][0] - 11 === 0 || +cords[0][1] - 11 === 0? '00' : `${(+cords[0][0]*10 - 10)}` + `${(+cords[0][1] - 1)}`
        let endCord = currShip.direction === 'horizontal'? `${currCord + (10 + shipTypeLen)}` : `${currCord + (shipTypeLen * 10 + 1)}`//string

        console.log(currCord, startCord, endCord);
        for (let y = +startCord[0]; y <= +endCord[0]; y++) {
            for (let x = +startCord[1]; x <= +endCord[1]; x++) {
                console.log(y, x);
                if(this.myField[y][x] === 2) {console.log('barrier');return true }
            }
        }
        // for (let y = 4; y <= 6; y++) {
        //     for (let x = 2; x <= 5; x++) {
        //         if(this.myField[y][x] === 2) return true 
        //     }
        // }
        // for (let y = 0; y < ship.type.length; y++) {
        //     for (let x = 0; x < ship.type[y].length; x++) {
        //         if(this.myField[Ycord + y][Xcord + x] === 2) return true
        //         // if(this.myField[Ycord + y][Xcord + x] === undefined || this.myField[Ycord + y][Xcord + x] === 2) return true
        //     }
        // }
    }
    removeShip() {
        this.existingShips.forEach(ship => {
            ship.shipCells.length > 0? console.log(ship) : console.log(ship, 'this ship is suppossed to be deleted') 
        })
        this.existingShips = this.existingShips.filter(ship => ship.shipCells.length > 0)
    }
    createShip(cord,y,x,ship, direction) {
        let createdShip = new Ship(cord,y,x,ship)
        this.existingShips.push(createdShip)

    }
}


