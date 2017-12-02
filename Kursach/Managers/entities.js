class Entity{
    constructor(){
        this.pos_x = 0;
        this.pos_y = 0;
        this.size_x = 0;
        this.size_y = 0;
        this.angle = null;
    }
}

class Spider extends Entity{
    constructor(){
        super();
        this.hp = 75;
        this.move_x = 0;
        this.move_y = 0;
        this.speed = 8* gm.difficulty;
        this.angle = 0;
        this.spotRadius = 120;
        this.minSpotRadius = 120;
        this.spotted = false;
        this.ableToAttack = true;
        this.delay = 400;
    }

    draw(ctx){
        sm.drawSprite(ctx,"spider.png", this.pos_x, this.pos_y, this.angle);
    }

    update()
    {
        let distanceToPlayer = Math.sqrt(Math.pow(this.pos_x - gm.player.pos_x,2) + Math.pow(this.pos_y - gm.player.pos_y,2));
        if((distanceToPlayer < this.minSpotRadius + this.spotRadius && distanceToPlayer > 0)|| this.spotted === true){
            let playerDelta = {
                x: gm.player.pos_x - this.pos_x,
                y: gm.player.pos_y - this.pos_y
            };
            this.angle = Math.atan2(playerDelta.y, playerDelta.x);
            if(this.angle < 0)
                this.angle +=Math.PI * 2;
            if(this.ableToAttack)
                this.speed = 5 * gm.difficulty;
        } else{
            this.speed = 0;
        }
        pm.update(this);
    }

    onTouchEntity(obj) {
        if (obj.name.includes('PlayerArrow')) {
            this.hp -= 25;
            this.spotted = true;
            console.log(this.hp, this.name);
            if (this.hp <= 0) {
                gm.kill(this);
                gm.enemiesNum--;
                console.log("Enemy has died");
                gm.score +=35 * gm.difficulty;
            }
            gm.kill(obj);
        }
        if (obj.name =='Player') {
            if (this.ableToAttack) {
                obj.hp -=25 * gm.difficulty;
                this.ableToAttack = false;
                this.speed = 0;
                setTimeout(() => {
                    this.ableToAttack = true;
                }, this.delay);
            }
        }
    }

    kill(){
        gm.kill(this);
    }

}
class Orc extends Entity{
    constructor(){
        super();
        this.hp = 50;
        this.move_x = 0;
        this.move_y = 0;
        this.speed = 8 * gm.difficulty;
        this.angle = 0;
        this.spotRadius = 100;
        this.spotted = false;
        this.minSpotRadius = 100;
        this.ableToAttack = true;
        this.delay = 500;
    }
    draw(ctx)
    {
        if(this.ableToAttack)
        sm.drawSprite(ctx, "enemyStanding.png", this.pos_x, this.pos_y,this.angle);
        else{
            sm.drawSprite(ctx, "enemyAttacking.png", this.pos_x, this.pos_y, this.angle);
        }
    }

    update()
    {
        let distanceToPlayer = Math.sqrt(Math.pow(this.pos_x - gm.player.pos_x,2) + Math.pow(this.pos_y - gm.player.pos_y,2));
        if((distanceToPlayer < this.minSpotRadius + this.spotRadius && distanceToPlayer > 0)|| this.spotted === true){
            let playerDelta = {
                x: gm.player.pos_x - this.pos_x,
                y: gm.player.pos_y - this.pos_y
            };
            this.angle = Math.atan2(playerDelta.y, playerDelta.x);
            if(this.angle < 0)
                this.angle +=Math.PI * 2;
            if(this.ableToAttack)
                this.speed = 2 * gm.difficulty;
        } else{
            this.speed = 0;
        }
        pm.update(this);
    }

    onTouchEntity(obj) {
        if (obj.name.includes('PlayerArrow')) {
            this.hp -= 25;
            this.spotted = true;
            let settings = {volume: 0.2, looping: false};
            sM.play("sounds/enemyTakingDamage.m4a",settings);
            console.log(this.hp, this.name);
            if (this.hp <= 0) {
                gm.kill(this);
                gm.enemiesNum--;
                sM.play('sounds/enemyDeath.mp3', settings);
                lm.levelScore +=25 * gm.difficulty;
                console.log(lm.levelScore);
            }
            gm.kill(obj);
        }
        if (obj.name ==='Player') {
            if (this.ableToAttack) {
                sm.drawSprite(ctx, "enemyAttacking.png", this.pos_x, this.pos_y, this.angle);
                obj.hp -=25 * gm.difficulty;
                sM.play("sounds/playerTakingDamage.m4a");
                this.ableToAttack = false;
                this.speed = 0;
                setTimeout(() => {
                    this.ableToAttack = true;
                }, this.delay);
            }
        }
    }
    kill()
    {
        gm.kill(this);
    }
}

class Chest extends Entity{
    constructor(){
        super();
        this.name = "Chest";
        this.move_x = 0;
        this.move_y = 0;
        this.speed = 0;
    }

    draw(){
        sm.drawSprite(ctx, "Chest.png", this.pos_x, this.pos_y);
    }

    update(){
    }
    kill(){
        gm.kill(this);
    }
}
class Player extends Entity{
    constructor() {
        super();
        this.name = "Player";
        this.hp = 100;
        this.move_x = 0;
        this.move_y = 0;
        this.speed = 6;
        this.arrows = 16;
        this.ableToFire = true;
        this.nickname = 0;
    }

    draw(ctx){
        let mouseDelta = em.mouseDelta();
        let angle = Math.atan2(mouseDelta.y, mouseDelta.x);
        sm.drawSprite(ctx,"player2.png",this.pos_x,this.pos_y,angle);
        let hpImage = null;
        // if(this.hp <=0)
        //     hpImage = "hpBar0.png";
        // else if(this.hp>0 && this.hp <= 25)
        //     hpImage = "hpBar1.png";
        // else if(this.hp>25 && this.hp <= 50)
        //     hpImage = "hpBar2.png";
        // else if(this.hp>50 && this.hp <=75)
        //     hpImage = "hpBar3.png";
        // else if(this.hp >= 100)
        //     hpImage = "hpBar4.png";

        switch(this.hp) {
            case 0: hpImage = "hpBar0.png";
            break;

            case 25: hpImage = "hpBar1.png";
            break;

            case 50: hpImage = "hpBar2.png";
            break;

            case 75: hpImage = "hpBar3.png";
            break;

            case 100: hpImage = "hpBar4.png";
            break;
            default: hpImage = "hpBar4.png";
        }
        sm.drawSprite(ctx,"profileBackground.png",mm.view.x,mm.view.y-4);
        sm.drawSprite(ctx,hpImage,mm.view.x+40,mm.view.y+2);
        for(let i = 0; i < this.arrows;i++)
        sm.drawSprite(ctx,"arrowCount.png",mm.view.x + i*10,mm.view.y+12);
    }
    update(){
        if(this.hp<=0) {
            lm.deadScreen();
            gm.killEverything();
        }
        else
        pm.update(this);
    }
    onTouchEntity(obj){
        if(obj.name.includes('PlayerArrow')){

        }
        if(obj.name.includes("Chest")){
            this.arrows +=4;
            sM.play('sounds/takingChest.m4a');
            gm.kill(obj);
        }
        if(obj.name.includes("Potion")){
            this.hp +=25;
            if(this.hp >100)
                this.hp = 100;
            gm.kill(obj);
            sM.play('sounds/takingPotion.m4a');
        }
    }
    kill(){
        gm.kill(this);
    }
    fire(){
        if(this.ableToFire && this.arrows!==0) {
            let r = new PlayerArrow();
            r.size_x = 6;
            r.size_y = 10;
            r.delay = 700;
            r.name = "PlayerArrow" + (++gm.fireNum);
            let mouseDelta = em.mouseDelta();
            let angle = Math.atan2(mouseDelta.y, mouseDelta.x);
            r.angle = angle;
            r.pos_x = this.pos_x + this.size_x / 2 - 4 + Math.cos(r.angle) * r.speed;
            r.pos_y = this.pos_y + this.size_y / 2 - 4 + Math.sin(r.angle) * r.speed;
            gm.entities.push(r);
            this.draw(ctx);
            this.arrows -=1;
            this.ableToFire = false;
            setTimeout(() => {
                this.ableToFire = true;
            }, r.delay);
            sM.play('sounds/arrow.mp3');
        }
    }
}

class EnemyArrow extends Entity{
    constructor(){
        super();
        this.move_x = 0;
        this.move_y = 0;
        this.delay = 200;
        this.angle = 0;
        this.speed = 20;
    }

    draw(){
        sm.drawSprite(ctx,"arrow.png",this.pos_x,this.pos_y, this.angle);
    }

    update(){
        pm.update(this);
    }

    onTouchEntity(entity) {
    }

    kill(){
        gm.kill(this);
    }

}

class PlayerArrow extends Entity{
    constructor() {
        super();
        this.speed = 38;
        this.move_x = 0;
        this.move_y = 0;
        this.angle = 0;
        this.delay = 200;
    }

    draw(ctx){
        sm.drawSprite(ctx,"arrow.png",this.pos_x,this.pos_y, this.angle);
    }

    update(){
        pm.update(this);
    }
    onTouchEntity(entity){
    }

    onTouchMap(idx){
        this.kill();
    }
    kill(){
        gm.kill(this);
    }
}

class Potion extends Entity{
    constructor(){
        super();
        this.name = "Potion";
        this.move_x = 0;
        this.move_y = 0;
        this.speed = 0;
    }

    draw(){
        sm.drawSprite(ctx, "potion.png", this.pos_x, this.pos_y);
    }

    update(){
    }
    kill(){
        gm.kill(this);
    }
}