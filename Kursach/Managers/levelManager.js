class levelManager{
    constructor(){
        this.currentLevel = 1;
        this.levelScore = 0;
        this.totalScore = 0;
    }

    startNextLevel(){
        this.removeScoreCounter();
        lm.currentLevel++;
        pm.levelCompleted = false;
        gm.load(lm.currentLevel);
        document.getElementById("success").style.display = "none";
        document.getElementById("canvasid").style.display ="block";
    }

    chooseMap(levelToLoad){
        let mapToLoad = null;
        switch (levelToLoad){
            case 1:
                mapToLoad = "mapidyMap/level1.json";
                break;
            case 2:
                mapToLoad = "mapidyMap/level2.json";
                break;
            default: mapToLoad = "mapidyMap/level1.json";
        }
        return mapToLoad;
    }

    completeLevel(){
        if(gm.enemiesNum<=0) {
            clearInterval(gm.playing);
            sM.play('sounds/levelComplete.m4a');
            this.levelScore += 5*gm.player.arrows;
            lm.totalScore +=lm.levelScore;
            lm.successScreen();
        } else
            console.log("There are still enemies to kill");
    }

    getScoreCounter(){
        document.getElementById("success").innerHTML +=  "Score for this level : " + lm.levelScore + "<br>";
        document.getElementById("success").innerHTML +=  "Enemies killed :" +  gm.enemiesMax + '<br>';
        document.getElementById("success").innerHTML +=  "Arrows left :" + gm.player.arrows + '<br>';
        document.getElementById("success").innerHTML +=  "Total score:" + lm.totalScore + '<br>';
    }

    removeScoreCounter(){
        document.getElementById("success").innerHTML = "";
    }

    successScreen(){
        document.getElementById("canvasid").style.display = "none";
        document.getElementById("success").style.display = "block";
        this.getScoreCounter();
        gm.killEverything();
        document.getElementById("success").innerHTML += "<button onclick ='lm.startNextLevel()'>" + "Start next level" + "</button>";
    }

    deadScreen(){
        document.getElementById("canvasid").style.display = "none";
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        document.getElementById("deadScreen").style.display = "block";
    }
}