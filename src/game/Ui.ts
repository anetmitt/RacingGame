import { RoadRow } from "../domain/roadRow";
import { Obstacle } from "../domain/obstacle";
import { FieldDecoration } from "../domain/fieldDecoration";
import {HighScore} from "../domain/highScore";

export class Ui {
    gameRoadUi: Element | null;
    highScore: HighScore;
    rowHeight: number;
    obstacle: Obstacle;
    fieldDec: FieldDecoration;

    constructor(gameRoadUi: Element | null, highScore: HighScore, fieldDec: FieldDecoration, obstacle: Obstacle, rowHeight: number) {
        this.gameRoadUi = gameRoadUi;
        this.highScore = highScore;
        this.rowHeight = rowHeight;
        this.obstacle = obstacle;
        this.fieldDec = fieldDec;
    }
    
    generateGameRowsUi(roadRow: RoadRow) {
        let roadRowDiv: HTMLDivElement = this.newRoadRow();
        let rightEdgeDiv: HTMLDivElement = this.newRightEdgeDiv(roadRow);
        let leftEdgeDiv: HTMLDivElement = this.newLeftEdgeDiv(roadRow);
        let roadDiv: HTMLDivElement = this.newRoadDiv(roadRow);
    
        this.fieldDec.addDecor(leftEdgeDiv, rightEdgeDiv);
    
        if (roadRow.roadLine) {this.addRoadLine(roadDiv);}
    
        this.obstacle.addCar(roadRow.leftEdge, roadDiv, this.gameRoadUi);
    
        roadRowDiv.appendChild(leftEdgeDiv);
        roadRowDiv.appendChild(roadDiv);
        roadRowDiv.appendChild(rightEdgeDiv);
    
        return roadRowDiv;
    }

    newRoadRow() {
        let roadRowDiv: HTMLDivElement = document.createElement('div');
        roadRowDiv.className = "road-row";
        roadRowDiv.style.height = this.rowHeight + "px";
        return roadRowDiv;
    }

    newRoadDiv(roadRow: RoadRow) {
        let roadDiv: HTMLDivElement = document.createElement('div');
        roadDiv.className = "road";
        roadDiv.style.width = (roadRow.rightEdge - roadRow.leftEdge) * 100 + "%";
        return roadDiv;
    }

    newLeftEdgeDiv(roadRow: RoadRow) {
        let leftEdgeDiv: HTMLDivElement = document.createElement('div');
        leftEdgeDiv.className = "left-edge";
        leftEdgeDiv.style.width = roadRow.leftEdge * 100 + "%";
        return leftEdgeDiv;
    }

    newRightEdgeDiv(roadRow: RoadRow) {
        let rightEdgeDiv: HTMLDivElement = document.createElement('div');
        rightEdgeDiv.className = "right-edge";
        rightEdgeDiv.style.width = (1 - roadRow.rightEdge) * 100 + "%";
        return rightEdgeDiv;
    }
    
    addRoadLine(roadElement: HTMLDivElement) {
        let roadLineDiv: HTMLDivElement = document.createElement('div');
        roadLineDiv.className = "road-line";
        roadElement.appendChild(roadLineDiv);
    }

    newButton(content: string, className: string) {
        let button = document.createElement('button');
        button.className = className;
        button.textContent = content;
        return button;
    }

    changeScore() {
        const score: Element | null = document.querySelector(".score");
        
        if (score == null) {return;}
        score.textContent = this.highScore.score.toString();
    }
    
    addPopUp(text: string[], buttons: Element[]) {
        const popup: Element | null = document.querySelector("#popup");
    
        if (popup == null) {return;}
        
        let modal = document.createElement('div');
        modal.className = "modal";
        modal.appendChild(this.popUpMessages(text));
    
        let options = this.popUpButtons(buttons);
        modal.appendChild(options);
    
        popup.appendChild(modal);
    }
    
    popUpButtons(buttons: Element[]) {
        let options = document.createElement('div');
        options.className = "options";
        buttons.forEach(button => {
            options.appendChild(button);
        });
        return options;
    }
    
    popUpMessages(messages: string[]) {
        let allMessages = document.createElement('div');
        messages.forEach(message => {
            let currentMessage = document.createElement('p');
            currentMessage.className = "message";
            currentMessage.textContent = message;
            allMessages.appendChild(currentMessage);
        });
        return allMessages;
    }
}