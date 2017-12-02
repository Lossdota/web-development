class spriteManager{
    constructor(){
        this.image = new Image();
        this.sprites = new Array();
        this.imgLoaded = false;
        this.jsonLoaded = false;
    }

    loadAtlas(atlasJson, atlasImg){
        let request = new XMLHttpRequest();
        request.onreadystatechange = function(){
            if(request.readyState === 4 && request.status===200){
                sm.parseAtlas(request.responseText);
            }
        };
        request.open("GET",atlasJson,true);
        request.send();
        this.loadImg(atlasImg);
    }

    loadImg(imgName) {
        this.image.onload = function () {
            sm.imgLoaded = true;
        };
        this.image.src = imgName;
    }

    parseAtlas(atlasJSON){
        let atlas = JSON.parse(atlasJSON);
        for(let name in atlas.frames){
            let frame = atlas.frames[name].frame;
            this.sprites.push({
                name: name,
                x :frame.x,
                y: frame.y,
                w:frame.w,
                h:frame.h});
        }
        this.jsonLoaded = true;
    }

    drawSprite(ctx,name,x,y, angle = 0){
        if(!this.imgLoaded||!this.jsonLoaded){
            setTimeout(function(){sm.drawSprite(ctx,name,x,y);},100);
        }else{
            let sprite = this.getSprite(name);
            if(!mm.isVisible(x,y,sprite.w,sprite.h))
                return;
            x-=mm.view.x;
            y-=mm.view.y;
            if(angle!==0){
                ctx.translate(x + sprite.w / 2, y+ sprite. h/2);
                ctx.rotate(angle);
            ctx.drawImage(this.image,sprite.x,sprite.y,sprite.w,sprite.h,-sprite.w/2,-sprite.h/2,sprite.w,sprite.h);
            ctx.rotate(-angle);
            ctx.translate(-x - sprite.w/2, -y - sprite.h/2);
            } else{
                ctx.drawImage(this.image, sprite.x,sprite.y,sprite.w,sprite.h,x,y,sprite.w,sprite.h);
            }
        }
    }

    getSprite(name){
        for(var i =0; i<this.sprites.length;i++){
            var s = this.sprites[i];
            if(s.name===name)
                return s;
        }
        return null;
    }
}