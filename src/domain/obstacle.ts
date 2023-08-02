import { Helpers } from "./../global/helpers";
import Yellow from "./../images/Porsche_Yellow.png";
import Blue from "./../images/Porsche_Blue.png";

export class Obstacle extends Helpers{
    windowHeight: number;
    windowWidth: number;
    carHeight: number;
    carOccurenceFrquency: number = 0;
    obstacleRows: number;
    carWidth: number = 0.72;

    constructor(windowHeight: number, windowWidth: number, rowHeight: number) {
        super();
        this.windowHeight = windowHeight;
        this.windowWidth = windowWidth;
        this.carHeight = windowHeight * 0.15;
        this.obstacleRows = Math.ceil(this.carHeight / rowHeight);
    }

    addCar(leftWidth: number, road: HTMLDivElement, gameRoadUi: Element | null) {
        if (this.carOccurenceFrquency === 105 && gameRoadUi != null) {
            let image = super.createNewImage(this.carHeight, ['obstacle-car']);
            image.style.left = super.randomNumber(this.windowWidth * leftWidth, parseInt(road.style.width) / 100 * this.windowWidth - this.carHeight * this.carWidth) + "px";
            this.chooseRandomCarImage(image);
            road.appendChild(image);
            this.addObstacleProperty(gameRoadUi, parseInt(image.style.left));
            this.carOccurenceFrquency = 0;
        } else {
            this.carOccurenceFrquency += 1;
        }
    }

    addObstacleProperty(gameRoadUi: Element, left: number) {
        for (let row = 0; row < (this.obstacleRows); row++) {
            let roadRow = gameRoadUi.childNodes[row];
            let road = roadRow.childNodes[1] as Element;

            road.setAttribute("obstacle", "true");
            road.setAttribute("obstacleLeft", left.toString());
            road.setAttribute("obstacleRight", (left + this.carHeight * this.carWidth).toString());
        }
    }

    chooseRandomCarImage(image: HTMLImageElement) {
        let carImages = [Yellow, Blue];
        let randomIndex = Math.round(super.randomNumber(0, 1));
        image.src = carImages[randomIndex];
    }
}