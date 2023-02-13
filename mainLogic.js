export default class logic {
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
    shipList = {
        //0 - empty
        //1 - barrier
        //2 - ship
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
            [1,1,1,1],
            [1,2,2,1],
            [1,1,1,1],
        ],
        one: [
            [1,1,1],
            [1,2,1],
            [1,1,1],
        ],
    }
    currShip = {
        x: this.cursorPointX || 0,
        y: this.cursorPointY || 0,
        ship: this.shipList.four
    }
    click() {
        if(this.checkForBarriers()) {
            console.log('cant place it here');
        } else {
            this.placeShip()
        }
    }
    placeShip() {
        let gap = 0
        let {x:Xcord, y:Ycord, ship} = this.currShip

        Xcord === 0 || Ycord === 0? gap = 0 : gap = -1

        for (let y = 0; y < ship.length; y++) {
            for (let x = 0; x < ship[y].length; x++) {
                    this.myField[Ycord - gap + y][Xcord - gap + x] = ship[y][x]
            }
        }
        console.log(Xcord, Ycord, this.myField);
        //we add -1 to place ship in the middle and not from the left upper corner
    }
    checkForBarriers() {
        let {x:Xcord, y:Ycord, ship} = this.currShip

        for (let y = 0; y < ship.length; y++) {
            for (let x = 0; x < ship[y].length; x++) {
                if(this.myField[Ycord + y][Xcord + x] === undefined || this.myField[Ycord + y][Xcord + x] === 1 || this.myField[Ycord + y][Xcord + x] === 2) return true
                    
            }
        }
    }

}

