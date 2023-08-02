import { Game } from "./game/game";
import { Car } from "./domain/car";
import { Obstacle } from "./domain/obstacle";
import { FieldDecoration } from "./domain/fieldDecoration";
import {HighScore} from "./domain/highScore";
import { Ui } from "./game/Ui";
import "./style.css";

// --------------- Nessecary Game Objects ---------------

const gameRoadUi: Element | null = document.querySelector("#app");
const pauseButton: Element | null = document.querySelector(".pauseBtn");

let game: Game = new Game();
let highScore: HighScore = new HighScore();

let rowHeight: number = window.innerHeight / Game.mapRows;
let gameSpeed: number = 30;
let changedSpeed = gameSpeed;

let fieldDec: FieldDecoration = new FieldDecoration(window.innerHeight, window.innerWidth);
let obstacle: Obstacle = new Obstacle(window.innerHeight, window.innerWidth, rowHeight);
const gameUi = new Ui(gameRoadUi, highScore, fieldDec, obstacle, rowHeight);


// --------------- Game Setup ---------------

pauseButtonEvent();

for (let index: number = Game.mapRows - 1; index >= 0; index--) {
    if (gameRoadUi != null) {
        gameRoadUi.appendChild(gameUi.generateGameRowsUi(game.state.map[index]));
    }
}

let car: Car = new Car(gameRoadUi, window.innerHeight, rowHeight, Game.mapRows);
document.addEventListener("keydown", moveCar);

let interval = setInterval(growSpeed, gameSpeed);
interval;

let speedInterval = setInterval(() => {if(changedSpeed > 15) {changedSpeed -= 5}}, 15000);
speedInterval;


// --------------- Car Movement Logic ---------------

function moveCar (e:KeyboardEvent) {

    let code: string = e.key;
    let carStyle: CSSStyleDeclaration = getComputedStyle(car.carImage);
    let parentWidth: number = window.innerWidth;
    let hasObstacle: boolean = false;
    let carIndex = car.getNodeIndex();

    if (code === "ArrowLeft") {
        car.moveLeft(carStyle, parentWidth);
        game.state.car = parseInt(car.carImage.style.left);
        hasObstacle = car.hasObstacleOnLeft(carStyle, car.getBottomRodeNode(carIndex))
        || car.hasObstacleOnLeft(carStyle, car.getTopRodeNode(carIndex));    
    }
    else if (code === "ArrowUp") {
        car.moveUp(carStyle, parentWidth, carIndex);
        hasObstacle = car.hasObstacle(carStyle, car.getTopRodeNode(carIndex));
    }
    else if (code === "ArrowRight") {
        car.moveRight(carStyle, parentWidth);
        game.state.car = parseInt(car.carImage.style.left);
        hasObstacle = car.hasObstacleOnRight(carStyle, car.getBottomRodeNode(carIndex))
        || car.hasObstacleOnRight(carStyle, car.getTopRodeNode(carIndex));
    }
    else if (code === "ArrowDown") {
        car.moveDown(carStyle, parentWidth, carIndex);
        hasObstacle = car.hasObstacle(carStyle, car.getBottomRodeNode(carIndex));
    }

    if (hasObstacle) {
        gameOver();
        document.removeEventListener("keydown", moveCar);
    }
}

// --------------- Game Over Modal ---------------

function gameOver() {
    if (getPauseButtonState() === 'false' && pauseButton != null) {
        pauseButton.setAttribute('gamePause', 'true');
    }

    let newGameButton = gameUi.newButton("New Game!", "btn");
    newGameButton.addEventListener("click", () => {window.location.reload()});

    let scoreButton = gameUi.newButton("High Scores", "btn");
    scoreButton.addEventListener("click", highScorePopUp);

    gameUi.addPopUp(["Game Over!", "Your score is: " + highScore.score], [newGameButton, scoreButton]);
    clearInterval(interval);

    document.removeEventListener("keydown", moveCar);

    highScore.storeNewScore();
}

// --------------- Pause Logic ---------------

function pauseButtonEvent() {
    if (pauseButton == null) {return;}
    pauseButton.addEventListener("click", pause);
}

function getPauseButtonState() {
    if (pauseButton == null) {return;}
    return pauseButton.getAttribute('gamePause');
}

function unpause() {
    const popup: Element | null = document.querySelector("#popup");

    if (popup == null || pauseButton == null) {return;}
    pauseButton.setAttribute('gamePause', 'false');
    document.addEventListener("keydown", moveCar);
    interval = setInterval(newRowGenerator, gameSpeed);
    popup.childNodes[0].remove();
}

function pause() {
    if (pauseButton == null) {return;}

    if (getPauseButtonState() != 'true') {
    clearInterval(interval);
    document.removeEventListener("keydown", moveCar);

    let unpauseButton = gameUi.newButton("Unpause", "btn");
    unpauseButton.addEventListener("click", unpause);

    gameUi.addPopUp(["Game paused!"], [unpauseButton]);
    pauseButton.setAttribute('gamePause', 'true');
    }
}


// --------------- High Score Modal ---------------

function highScorePopUp() {
    const popup: Element | null = document.querySelector("#popup");
    if (popup == null) {return;}

    let storedData: {allScores: string[], lastScore: string} = highScore.getScoreData();
    let score: string[] = storedData.allScores;
    
    score.unshift("Previous high scores:");
    score.push("Last high score: " + storedData.lastScore);

    let backButton = gameUi.newButton("Back", "btn");
    backButton.addEventListener("click", () => {
        popup.childNodes[popup.childNodes.length - 1].remove();
        gameOver();
    });

    popup.childNodes[0].remove();
    gameUi.addPopUp(score, [backButton]);
}


// --------------- Car Out Of Bounds ---------------

function outOfBounds() {
    let carStyle: CSSStyleDeclaration = getComputedStyle(car.carImage);

    if (gameRoadUi == null) {return;}

    let leftStyle = getComputedStyle(gameRoadUi.childNodes[Game.mapRows - car.carRows].childNodes[0] as Element);
    let rightStyle = getComputedStyle(gameRoadUi.childNodes[Game.mapRows - car.carRows].childNodes[2] as Element);

    if (car.hasObstacle(carStyle, gameRoadUi.childNodes[Game.mapRows - car.carRows].childNodes[1] as Element) ||
    !car.checkIfOutOfBounds(carStyle, window.innerWidth, leftStyle, rightStyle)) {
        gameOver();
    }

}


// --------------- Game New Row Gererator Logic ---------------

function newRowGenerator() {
    if (gameRoadUi != null) {
        game.addNewRow();
        highScore.addScore();
        gameUi.changeScore();
        if (gameRoadUi.childNodes[Game.mapRows - car.carRows].childNodes.length == 4) {
            outOfBounds();
            gameRoadUi.childNodes[Game.mapRows - car.carRows].childNodes[3].remove();
            gameRoadUi.childNodes[Game.mapRows - car.carRows - 1].appendChild(car.carImage);
        }
        gameRoadUi.childNodes[gameRoadUi.childNodes.length - 1].remove();
        gameRoadUi.prepend(gameUi.generateGameRowsUi(game.state.map[Game.mapRows - 1]));
    }
}

function growSpeed() {
    if (changedSpeed === gameSpeed) {
        newRowGenerator();
    } else {
        clearInterval(interval);
        gameSpeed = changedSpeed;
        interval = setInterval(growSpeed, gameSpeed);
    }
}
