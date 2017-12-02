function confirmInput(){
    document.getElementById("selector").style.display = "none";
    document.getElementById("canvasid").style.display = "block";
    gm.player.nickname = document.getElementById("nickname").value;
    gm.difficulty = getDifficulty();
}

function getDifficulty(){
    let difficulty = document.getElementById("difficultyChoice").value;
    switch(difficulty){
        case "easy":
            return 1;
            break;
        case "medium":
            return 2;
            break;
        case "hard":
            return 3;
            break;
        case "impossible":
            return 4;
            break;

        default: return 1;
    }
}

function restart(){
    clearInterval(gm.playing);
    document.getElementById("deadScreen").style.display = "none";
    document.getElementById("selector").style.display = "block";
    gm.load(lm.currentLevel);
}