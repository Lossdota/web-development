class mapManager{
    constructor() {
        this.view = {x:0, y: 0, w: 800, h:600};
        this.imgLoadCount = 0;
        this.imgLoaded = false;
        this.jsonLoaded = false;
        this.mapData = null;
        this.scale = 1;
        this.tLayer = null;
        this.xCount = 0;
        this.yCount= 0;
        this.tSize = {x: 32, y: 32};
        this.mapSize = {x: 32, y: 32};
        this.tilesets = new Array();
        this.respawnPoint = {x : 0, y : 0};
        this.completeLevelPoint = {x : 0, y: 0};
    }

    parseMap(tmpData) {
        this.mapData = JSON.parse(tmpData);
        this.xCount = this.mapData.width;
        this.yCount = this.mapData.height;
        this.tSize.x = this.mapData.tilewidth;
        this.tSize.y = this.mapData.tileheight;
        this.mapSize.x = this.xCount * this.tSize.x;
        this.mapSize.y = this.yCount * this.tSize.y;
        for (var i = 0; i < this.mapData.tilesets.length; i++) {
            var img = new Image();
            img.onload = function(){
                mm.imgLoadCount++;
                if (mm.imgLoadCount === mm.mapData.tilesets.length) {
                    mm.imgLoaded = true;
                }
            };
            img.src = this.mapData.tilesets[i].image;
            var t = this.mapData.tilesets[i];
            var ts = {
                firstgid: t.firstgid,
                image: img,
                name: t.name,
                xCount : Math.floor(t.imagewidth / mm.tSize.x),
                yCount : Math.floor(t.imageheight / mm.tSize.y)
            };
            this.tilesets.push(ts);
        }
        if (this.tLayer === null)
            for (let id = 0; id < this.mapData.layers.length; id++) {
                let layer = this.mapData.layers[id];
                if (layer.type === "tilelayer") {
                    this.tLayer = layer;
                    break;
                }
            }
        this.jsonLoaded = true;
    }

    draw(ctx){
        if (!mm.imgLoaded || !mm.jsonLoaded) {
            setTimeout(() => {mm.draw(ctx);}, 100);
        } else {
            if(lm.currentLevel===2)
                this.tLayer = null;
            if (this.tLayer === null)
                for (let id = 0; id < this.mapData.layers.length; id++) {
                    let layer = this.mapData.layers[id];
                    if (layer.type === "tilelayer") {
                        this.tLayer = layer;
                        break;
                    }
                }
            for (let i = 0; i < this.tLayer.data.length; i++) {
                if (this.tLayer.data[i] !== 0) {
                    let tile = this.getTile(this.tLayer.data[i]);
                    if(tile.id === 58 && this.respawnPoint.x == 0 && this.respawnPoint.y == 0) {
                        let pX = (i % this.xCount) * this.tSize.x;
                        let pY = Math.floor(i / this.xCount) * this.tSize.y;

                        let tSizeX = this.tSize.x;
                        let tSizeY = this.tSize.y;
                        if (!this.isVisible(pX, pY, tSizeX, tSizeY))
                            continue;
                        pX -= this.view.x;
                        pY -= this.view.y;
                        this.respawnPoint.x = pX;
                        this.respawnPoint.y = pY;
                        gm.player.pos_x = this.respawnPoint.x;
                        gm.player.pos_y = this.respawnPoint.y;
                    }
                    if(tile.id === 21 && this.completeLevelPoint.x ==0 && this.completeLevelPoint.y ==0){
                        let pX = (i % this.xCount) * this.tSize.x;
                        let pY = Math.floor(i / this.xCount) * this.tSize.y;

                        let tSizeX = this.tSize.x;
                        let tSizeY = this.tSize.y;
                        if (!this.isVisible(pX, pY, tSizeX, tSizeY))
                            continue;
                        pX -= this.view.x;
                        pY -= this.view.y;
                        this.completeLevelPoint.x = pX;
                        this.completeLevelPoint.y = pY;

                    }
                    let pX = (i % this.xCount) * this.tSize.x;
                    let pY = Math.floor(i / this.xCount) * this.tSize.y;

                    let tSizeX = this.tSize.x;
                    let tSizeY = this.tSize.y;
                     if (!this.isVisible(pX, pY, tSizeX, tSizeY))
                         continue;
                     pX -= this.view.x;
                     pY -= this.view.y;
                     ctx.drawImage(tile.img, tile.px, tile.py, this.tSize.x,
                         this.tSize.y, pX, pY, tSizeX, tSizeY);
                }
            }
        }
    }

    getTile(tileIndex) {
        let tile = {
            img: null,
            px: 0, py: 0,
            walkable : true,
            id : null
        };
        let tileset = this.getTileset(tileIndex);
        tile.img = tileset.image;
        let id = tileIndex - tileset.firstgid;
        tile.id = id;
        let x = id % tileset.xCount;
        let y = Math.floor(id / tileset.xCount);
        tile.px = x * mm.tSize.x;
        tile.py = y * mm.tSize.y;
        if(id === 2)
            tile.walkable = false;
        return tile;
    }

    getTileset(tileIndex) {
        for (let i = mm.tilesets.length - 1; i >= 0; i--)
            if (mm.tilesets[i].firstgid <= tileIndex) {
                return mm.tilesets[i];
            }
        return null;
    }

    isVisible(x, y, width, height) {
        if (x + width < this.view.x || y + height < this.view.y ||
            x > this.view.x + this.view.w || y > this.view.y + this.view.h)
            return false;
        return true;
    }

    parseEntities(){
        if(!mm.imgLoaded||!mm.jsonLoaded){
            setTimeout(function(){mm.parseEntities();},100);
        }else
            for(let j=0;j<this.mapData.layers.length;j++)
                if(this.mapData.layers[j].type === 'objectgroup'){
            let entities = this.mapData.layers[j];
            for(let i = 0; i<entities.objects.length; i++){
                let e = entities.objects[i];
                if(e.name=="Player")
                {
                    let obj = null;
                    obj = new Player();
                    console.log(e.name);
                    obj.pos_x = mm.respawnPoint.x;
                    obj.pos_y = mm.respawnPoint.y;
                    obj.size_x = e.width;
                    obj.size_y = e.height;
                    gm.entities.push(obj);
                    gm.initPlayer(obj);
                }
                if(e.name=="Orc"){
                    let obj = null;
                    obj = new Orc();
                    obj.name = e.name + (++gm.enemiesNum);
                    obj.pos_x = e.x;
                    obj.pos_y = e.y;
                    obj.size_x = e.width;
                    obj.size_y = e.height;
                    gm.entities.push(obj);
                }
                if(e.name =="Chest"){
                    let obj = null;
                    obj = new Chest();
                    obj.name = e.name;
                    obj.pos_x = e.x;
                    obj.pos_y = e.y;
                    obj.size_x = e.width;
                    obj.size_y = e.height;
                    gm.entities.push(obj);
                }
                if(e.name =="Potion"){
                    let obj = null;
                    obj = new Potion();
                    obj.name = e.name;
                    obj.pos_x = e.x;
                    obj.pos_y = e.y;
                    obj.size_x = e.width;
                    obj.size_y = e.height;
                    gm.entities.push(obj);
                }

                if(e.name =="Spider"){
                    let obj = null;
                    obj = new Spider();
                    obj.name = e.name;
                    obj.pos_x = e.x;
                    obj.pos_y = e.y;
                    obj.size_x = e.width;
                    obj.size_y = e.height;
                    gm.entities.push(obj);
                }
                gm.enemiesMax = gm.enemiesNum;
            }
        }
    }

    centerAt(x,y){
        if(x<this.view.w/2)
            this.view.x = 0;
        else
            if(x>this.mapSize.x - this.view.w/2)
                this.view.x = this.mapSize.x - this.view.w;
        else
            this.view.x = x-(this.view.w/2);
        if(y<this.view.h/2)
            this.view.y = 0;
        else
            if(y > this.mapSize.y - this.view.h/2)
                this.view.y = this.mapSize.y - this.view.h;
        else
            this.view.y = y - (this.view.h/2);
    }

    getTilesetIdx(x,y){
        let wX = x;
        let wY = y;
        let idx = Math.floor(wY/this.tSize.y) * this.xCount + Math.floor(wX/this.tSize.x);
        return this.tLayer.data[idx];
    }

    loadMap(path){
        let request = new XMLHttpRequest();
        request.onreadystatechange = function(){
            if(request.readyState === 4 && request.status === 200){
                mm.parseMap(request.responseText);
            }
        };
        request.open("GET",path,true);
        request.send();
    }
}