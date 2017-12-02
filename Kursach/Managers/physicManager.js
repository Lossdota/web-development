class physicManager{
    constructor(){
        this.levelCompleted = false;
    }
    update(obj) {
        if (obj.move_x === 0 && obj.move_y === 0 && obj.angle === null)
            return "stop";
        let newX, newY;

        if (obj.angle === null) {
            newX = obj.pos_x + Math.floor(obj.move_x * obj.speed);
            newY = obj.pos_y + Math.floor(obj.move_y * obj.speed);
        }
            else {
            newX = obj.pos_x + Math.cos(obj.angle) * obj.speed;
            newY = obj.pos_y + Math.sin(obj.angle) * obj.speed;
        }
        let newCenterX = Math.floor(newX + obj.size_x / 2.0);
        let newCenterY = Math.floor(newY + obj.size_y / 2.0);
        if(newCenterX <= 0 || newCenterX > mm.mapSize.x ||
            newCenterY <= 0 || newCenterY > mm.mapSize.y)
            if(obj.name =="Player" || obj.name =="Enemy"){
                return "stop";
            }
                else
                    gm.kill(obj);

        let ts = mm.getTilesetIdx(newCenterX + obj.size_x / 2,
            newCenterY + obj.size_y / 2);
        let tsX = mm.getTilesetIdx(newCenterX, Math.floor(obj.pos_y + obj.size_y / 2.0));
        let tsY = mm.getTilesetIdx(Math.floor(obj.pos_x + obj.size_x / 2.0), newCenterY);
        let e = this.entityAtXY(obj, newX, newY);
        if (e !== null && obj.onTouchEntity)
            obj.onTouchEntity(e);

        if(lm.currentLevel===1){
        if (((ts ==16 || tsX ==16 || tsY ==16) || (ts == 7 || tsX == 7 || tsY == 7))  && (obj.name === "Player" || obj.name === "Orc" || obj.name ==="Spider"))
            return "break";

        else if ((ts == 7 || tsX == 7 || tsY == 7) &&(obj.name =="playerArrow"))
            gm.kill(obj);
        else if ((ts == 34 || tsX == 34 || tsY == 34) && obj.name == "Player"){
            lm.completeLevel();
            this.levelCompleted = true;
            setTimeout(20000);
            }
        }   else if(lm.currentLevel === 2){
            if (((ts ==1 || tsX ==1 || tsY ==1))  && (obj.name === "Player" || obj.name === "Orc" || obj.name ==="Spider" || obj.name ==="PlayerArrow"))
                return "break";
            if (((ts ==16 || tsX ==28 || tsY ==28))  && (obj.name === "Player" )) {
                lm.completeLevel();
                this.levelCompleted = true;
                setTimeout(20000);
            }
        }
            if(!this.levelCompleted){
            obj.pos_x = newX;
            obj.pos_y = newY;
        return "move";
        }
        else if(gm.stopped)
            clearInterval(gm.playing);
    }

    entityAtXY(obj,x,y){
        for(let entity of gm.entities){
            if(entity.name!==obj.name){
                if(x + obj.size_x < entity.pos_x ||
                y + obj.size_y < entity.pos_y ||
                    x > entity.pos_x + entity.size_x ||
                    y > entity.pos_y + entity.size_y)
                continue;
                return entity;
            }
        }
        return null;
    }
}