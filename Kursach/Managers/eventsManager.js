class eventsManager{
    constructor(){
        this.bind = [];
        this.action = [];
        this.mouse = {x:0,y:0};
    }

    setup(canvas) {
        this.bind[87] = 'up';
        this.bind[65] = 'left';
        this.bind[83] = 'down';
        this.bind[68] = 'right';
        this.bind[32] = 'fire';
        canvas.addEventListener("mousedown", this.onMouseDown);
        canvas.addEventListener("mouseup", this.onMouseUp);
        document.body.addEventListener("keydown", this.onKeyDown);
        document.body.addEventListener("keyup", this.onKeyUp);
        document.body.addEventListener("mousemove",this.onMouseMovement);
    }

    mouseDelta(){
        let mouseDeltaX = em.mouse.x - gm.playerPosOnScreen().x;
        let mouseDeltaY = em.mouse.y - gm.playerPosOnScreen().y;
        return {x: mouseDeltaX, y: mouseDeltaY}
    }

    onMouseMovement(event){
        em.mouse = {x: event.clientX, y: event.clientY};
    }
    onMouseDown(event){
        em.action["fire"] = true;
    }

    onMouseUp(event){
        em.action["fire"] = false;
    }

    onKeyDown(event){
        let action = em.bind[event.keyCode];
        if(action)
            em.action[action] = true;
    }

    onKeyUp(event) {
        let action = em.bind[event.keyCode];
        if (action)
            em.action[action] = false;
    }
}