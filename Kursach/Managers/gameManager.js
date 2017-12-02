class gameManager{
    constructor() {
        this.factory = {};
        this.entities = [];
        this.fireNum = 0;
        this.enemiesNum = 0;
        this.enemiesMax = 0;
        this.player = null;
        this.laterKill = [];
        this.difficulty = null;
        this.score = 0;
        this.playing = 0;
        this.stopped = false;
        this.restartTime = null;
        this.gamescore = [];
        this.currentLevel = 0;
        this.loadingNewLevel = null;
    }
    initPlayer(obj){
        this.player=obj;
    }

    kill(obj){
        this.laterKill.push(obj);
    }

    killEverything(){
        this.entities = [];
        gm.player = null;
        console.log(gm.entities);
    }

    update(){
        let settings ={volume :1, looping : true};
        if(gm.player===null || this.entities === [])
            return;
        this.player.move_x=0;
        this.player.move_y = 0;
        if(em.action["up"])this.player.move_y = -1;
        if(em.action["down"])this.player.move_y = 1;
        if(em.action["left"])this.player.move_x = -1;
        if(em.action["right"])this.player.move_x = 1;
        if(em.action["fire"]) this.player.fire();

        for(let entity of this.entities) {
            try {
                entity.update();
            }
            catch (ex) {
                console.log("error updating " + entity.name +" error is: " + ex);
            }
        }
        for(let i = 0; i <this.laterKill.length; i++){
            let idx = this.entities.indexOf(this.laterKill[i]);
            if(idx >-1)
                this.entities.splice(idx, 1);
        }
        if(this.laterKill.length > 0)
            this.laterKill.length = 0;
        if(!this.stopped){
            mm.draw(ctx);
            if(gm.player === null)
                setTimeout(() => {gm.update();}, 50);
            else
                mm.centerAt(this.player.pos_x, this.player.pos_y);
            this.draw(ctx);
            ctx.stroke();
        }
    }


    draw(ctx){
        for(let entity of this.entities)
            entity.draw(ctx);
    }

    load(levelToLoad){
            mm = null;
            gm = null;
            sm = null;
            em = null;
            pm = null;

            mm = new mapManager();
            gm = new gameManager();
            sm = new spriteManager();
            em = new eventsManager();
            pm = new physicManager();

        gm.difficulty = getDifficulty();
        gm.factory['Player'] = Player;
        gm.factory['Orc'] = Orc;
        gm.factory['Potion'] = Potion;
        gm.factory['PlayerArrow'] = PlayerArrow;
        gm.factory['Spider'] = Spider;
        sm.loadAtlas("mapidyMap/atlas.json","mapidyMap/atlas.png");
        em.setup(canvas);
        let mapToLoad = lm.chooseMap(levelToLoad);
        gm.playing = null;
        mm.loadMap(mapToLoad);
        mm.parseEntities();
        mm.draw(ctx);
        gm.play();
    }

    playerPosOnScreen(){
        let scaleX = canvas.getBoundingClientRect().width/canvas.offsetWidth;
        let scaleY = canvas.getBoundingClientRect().height/canvas.offsetHeight;
        let x = canvas.getBoundingClientRect().left + (gm.player.pos_x + Math.floor(gm.player.size_x/2.0) - mm.view.x) * scaleX;
        let y = canvas.getBoundingClientRect().top + (gm.player.pos_y + Math.floor(gm.player.size_y /2.0) - mm.view.y) * scaleY;
        return {x,y};
    }

    play(){
        gm.playing = setInterval(gm.updateWorld,50);
    }

    updateWorld(){
        gm.update();
    }
}