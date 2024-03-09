


class PrepareStage extends Game {
    shipsHTML: NodeListOf<Element> = document.querySelectorAll('.shipToPut');
    shipsCount: number[];
    game: GameLogic;
    shipType:ShipType;
    shipTypeList:number[][] = [
        [2],
        [2,2],
        [2,2,2],
        [2,2,2,2],
    ];

    constructor(socket:any, room:any, game: GameLogic) {
        super(socket, room)
        this.shipType = {
            type: this.shipTypeList[0],
            direction: 'horizontal'
        }

   }
    public placeShip(x:number,y:number):boolean {
        const cords = y.toString() + x.toString();
        if(this.game.checkForShip(x,y)) {
            console.log(`exists`, this.game.existingShips);
            return false;
        } else if(this.game.checkForBarriers(cords,this.shipType)) {
            console.log('cant place it here');
            return false;
        } else {
            const ship = this.game.createShip(x,y,this.shipType)
            this.game.appendShip(ship)
        }
    
    }
    public setCurrentShip() {
        let id = this.shipType[0].length==1? 'one' :  this.shipType[0].length==2? 'two' : this.shipType[0].length==3? 'three' : "four"
    document.querySelector('.currentShip').setAttribute('id', `${id}`)
   }

   public finishPrepareStage() {
    if(this.game.existingShips.length >= 10) {
        setTimeout(() => {
            clearInterval(interval)
            clear(cells, cellsEnemy)
            this.socket.emit('finishedPreparing', {room:this.room})
        },500)
        document.querySelector<HTMLElement>('.btn').style.display = 'none'
    } else {
        console.log('some ships are not used');
    }
    
    }

}