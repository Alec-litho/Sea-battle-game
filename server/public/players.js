export default class Player {
    constructor() {
        this.field = [
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
        this.existingShips = []
    }

}



// class Ship {
//     constructor(cord,y,x,ship) {
//         console.log(cord);
//         this.y = +y
//         this.x = +x
//         this.ship = ship

//         this.start = cord
//         if(ship.direction === 'horizontal') ship.type[0].length == 1? this.end = +this.start : this.end = this.start[0] + (+this.start[1] + ship.type[0].length-1)
//         else {ship.type[0].length == 1? this.end = +this.start[0] : this.end = (+this.start[0] + ship.type[0].length-1) + this.start[1] }

//         this.id = Math.floor(Math.random() * 100000)
//         this.shipCells = (_ => {
//             let lengthCords = []
//             let extendigCord = ship.direction === 'horizontal'? parseFloat(this.start[1])-1 : parseFloat(this.start[0])-1

//             if(ship.direction === 'horizontal') {
//                 console.log(extendigCord, +this.end[1]);
//                 while(extendigCord < (+this.end[1])) {
//                     lengthCords.push(this.start[0] + (++extendigCord))
//                 }
//             } else {
//                 while(extendigCord < (+this.end[0])) {
//                     lengthCords.push((++extendigCord) + this.start[1] )
//                 }
//             }
//             return {
//                 cords: lengthCords
//             }
//         })()
//     }
// }
