//game constants & variables
let isMusicOn = true;
let isSoundOn = true;
let inputDir = {x:0, y:0};
const foodSound = new Audio('food.mp3');
const gameOverSound = new Audio('gameover.mp3');
const moveSound = new Audio('move.mp3');
const musicSound = new Audio('music.mp3');
let speed = 5;
let score = 0;
let lastPaintTime = 0;
let snakeArr = [
    {x: 12, y: 15} 
]
food = {x: 6, y: 7}

// game function
function main(ctime){
    window.requestAnimationFrame(main);
    //console.log(ctime)
    if((ctime - lastPaintTime)/1000 < 1/speed){
        return;
    }
    lastPaintTime = ctime;
    gameEngine();
}

let isGamePaused = false;
const pauseIcon = document.querySelector('#pauseResumeButton i.fa-pause');
const playIcon = document.querySelector('#pauseResumeButton i.fa-play');

function togglePlayPauseIcon() {
    pauseIcon.style.display = isGamePaused ? 'none' : 'inline';
    playIcon.style.display = isGamePaused ? 'inline' : 'none';
}

function pauseResumeGame() {
    isGamePaused = !isGamePaused;
    togglePlayPauseIcon();
}


function isCollide(snake) {
    //if u pumpt into youself
    for(i = 1; i< snakeArr.length; i++){
        if(snake[i].x === snake[0].x && snake[i].y === snake[0].y){
            return true;
        }
    }
    // if you bump into the wall
    if(snake[0].x >= 18 || snake[0].x <= 0 || snake[0].y >= 18 || snake[0].y <= 0){
        return true
    }
}

let gameOverSoundPlayed = false;

function gameEngine() {
    if (isGamePaused) {
        return;
    }

    // part 1: updating the snake array & food
    if (isCollide(snakeArr)) {
        if (!gameOverSoundPlayed) {
            gameOverSound.play();
            gameOverSoundPlayed = true;
        }
        musicSound.pause();
        inputDir = { x: 0, y: 0 };
        const gameOverContainer = document.getElementById("gameOverContainer");
        gameOverContainer.style.display = "flex";
        document.getElementById("board").classList.add('blur');
        document.getElementById("scoreBox").classList.add('blur');
        document.getElementById("highscoreBox").classList.add('blur');

        return;
    }

    // if you have eaten the food increment the score and regenerate the food
    if (snakeArr[0].y === food.y && snakeArr[0].x === food.x) {
        if (isSoundOn) {
            foodSound.play();
        }
        score += 1;
        if (score > hiscoreval) {
            hiscoreval = score;
            localStorage.setItem("hiscore", JSON.stringify(hiscoreval));
            highscoreBox.innerHTML = "High Score: " + hiscoreval;
        }
        scoreBox.innerHTML = "Score: " + score;
        snakeArr.unshift({ x: snakeArr[0].x + inputDir.x, y: snakeArr[0].y + inputDir.y });
        let a = 2;
        let b = 16;
        food = { x: Math.round(a + (b - a) * Math.random()), y: Math.round(a + (b - a) * Math.random()) }
    }

    // moving the snake
    for (let i = snakeArr.length - 2; i >= 0; i--) {
        snakeArr[i + 1] = { ...snakeArr[i] }
    }

    snakeArr[0].x += inputDir.x;
    snakeArr[0].y += inputDir.y;

    // part 2: render the snake & food
    // render the snake
    board.innerHTML = "";
    snakeArr.forEach((e, index) => {
        snakeElement = document.createElement('div');
        snakeElement.style.gridRowStart = e.y;
        snakeElement.style.gridColumnStart = e.x;
        snakeElement.classList.add('snake');
        if (index == 0) {
            snakeElement.classList.add('head');
        }
        board.appendChild(snakeElement);
    });
    // render the food
    foodElement = document.createElement('div');
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add('food')
    board.appendChild(foodElement);

    // Hide game over text and restart button
    const gameOverContainer = document.getElementById("gameOverContainer");
    gameOverContainer.style.display = "none";
    document.getElementById("board").classList.remove('blur');
    document.getElementById("scoreBox").classList.remove('blur');
    document.getElementById("highscoreBox").classList.remove('blur');
}

function restartGame() {
    gameOverSoundPlayed = false;
    snakeArr = [{ x: 13, y: 15 }];
    food = { x: 6, y: 7 };
    score = 0;
    scoreBox.innerHTML = "Score: " + score;

    const gameOverContainer = document.getElementById("gameOverContainer");
    gameOverContainer.style.display = "none";

    document.getElementById("board").classList.remove('blur');
    document.getElementById("scoreBox").classList.remove('blur');
    document.getElementById("highscoreBox").classList.remove('blur');

    musicSound.pause();
    gameOverSound.pause();

    // Show the home screen
    document.getElementById("home").style.display = "block";
    document.getElementById("game").style.display = "none";
}

//main logic start here
let hiscore = localStorage.getItem("hiscore");
if(hiscore === null){
    hiscoreval = 0;
    localStorage.setItem("hiscore", JSON.stringify(hiscoreval));
}
else{
    hiscoreval = JSON.parse(hiscore);
    highscoreBox.innerHTML = "High Score: " + hiscore;
}

document.getElementById("home").style.display = "block";
document.getElementById("game").style.display = "none";

function startGame() {
    // Hide the home screen
    document.getElementById("home").style.display = "none";

    // Show the game screen
    document.getElementById("game").style.display = "block";

    if (isMusicOn && (musicSound.paused || musicSound.ended)) {
        musicSound.play();
    }

    window.requestAnimationFrame(main);
}

function showOptions() {
    console.log("Options button clicked!");
}


window.requestAnimationFrame(main);
window.addEventListener('keydown', e => {
    if (e.key === "Enter") {
        pauseResumeGame();
    } else {
        inputDir = { x: 0, y: 1 }; // start the game
        if (isSoundOn) {
            moveSound.play();
        }
        switch (e.key) {
            case "ArrowUp":
                console.log("ArrowUp");
                inputDir.x = 0;
                inputDir.y = -1;
                break;
            case "ArrowDown":
                console.log("ArrowDown");
                inputDir.x = 0;
                inputDir.y = 1;
                break;
            case "ArrowRight":
                console.log("ArrowRight");
                inputDir.x = 1;
                inputDir.y = 0;
                break;
            case "ArrowLeft":
                console.log("ArrowLeft");
                inputDir.x = -1;
                inputDir.y = 0;
                break;
        }
    }
});
togglePlayPauseIcon();

//functions for settings
function toggleMusic() {
    isMusicOn = !isMusicOn;
    const musicToggle = document.getElementById("musicToggle");

    if (isMusicOn) {
        musicToggle.innerText = "Music: ON";
        if (musicSound.paused || musicSound.ended) {
            musicSound.play();
        }
    } else {
        musicToggle.innerText = "Music: OFF";
        musicSound.pause();
        musicSound.currentTime = 0;
    }
}

function toggleSound() {
    console.log("Toggle Sound Button Clicked");

    isSoundOn = !isSoundOn;
    const soundToggle = document.getElementById("soundToggle");

    console.log("isSoundOn:", isSoundOn);

    if (isSoundOn) {
        soundToggle.innerText = "Sound: ON";
        console.log("Playing sounds...");
        // Play sounds
        if (!moveSound.paused) {
            moveSound.pause();
            moveSound.currentTime = 0;
        }
        moveSound.play();

        if (!foodSound.paused) {
            foodSound.pause();
            foodSound.currentTime = 0;
        }
        foodSound.play();
    } else {
        soundToggle.innerText = "Sound: OFF";
        console.log("Pausing sounds...");
        // Pause sounds
        moveSound.pause();
        moveSound.currentTime = 0;

        foodSound.pause();
        foodSound.currentTime = 0;
    }
}

function applySettings() {
    // Apply settings logic 
    const speedInput = document.getElementById("speedInput");
    speed = parseInt(speedInput.value);

    // Apply music settings
    const musicToggle = document.getElementById("musicToggle");
    if (isMusicOn) {
        musicToggle.innerText = "Music: ON";
        if (musicSound.paused || musicSound.ended) {
            musicSound.play();
        }
    } else {
        musicToggle.innerText = "Music: OFF";
        musicSound.pause();
    }

    // Apply sound settings
    const soundToggle = document.getElementById("soundToggle");
    isSoundOn = soundToggle.innerText.includes("ON"); 
    if (isSoundOn) {
        soundToggle.innerText = "Sound: ON";
        // Play sounds
        if (!moveSound.paused) {
            moveSound.pause();
            moveSound.currentTime = 0;
        }
        moveSound.play();

        if (!foodSound.paused) {
            foodSound.pause();
            foodSound.currentTime = 0;
        }
        foodSound.play();
    } else {
        soundToggle.innerText = "Sound: OFF";
        // Pause sounds
        moveSound.pause();
        moveSound.currentTime = 0;

        foodSound.pause();
        foodSound.currentTime = 0;
    }

    // Hide settings screen
    document.getElementById("settings").style.display = "none";

    // Show the home screen
    document.getElementById("home").style.display = "block";
}

function showSettings() {
    // Show the settings screen and hide the game screen
    document.getElementById("settings").style.display = "block";
    document.getElementById("game").style.display = "none";
}

// Adjust the size of the food element
foodElement.style.width = "20px"; 
foodElement.style.height = "20px";
