import { RoadRow } from "../domain/roadRow";

export class Game {
    state: { map: RoadRow[]; car: number; sinDistance: number; };
    rightEdge: number = 0;
    leftEdge: number = 0;
    straightDirectionDuration: number = 0;
    sinDurance: number = 0;
    static mapRows: number;
    roadLineCount: number = 0;
    roadLine: boolean = false;
    
    constructor () {
        this.state = {
            map: [],
            car: 0.5,
            sinDistance: 0
        }

        this.initializeState();
    }

    convertToRowPercentange(yValue: number) {

        if (yValue < 0) { yValue = 1 + Math.abs(yValue); }
        
        else { yValue = 1 - yValue; }

        return yValue / 2;
    }

    percentangeSideDecider(rowPercentange: number) {
        this.rightEdge = rowPercentange + 0.2;
        this.leftEdge = rowPercentange - 0.2;
    }

    addNewRow() {

        if (this.straightDirectionDuration == 0 && this.sinDurance == 0) {
            this.straightOrSin();
        }
        
        if (this.straightDirectionDuration > 0) {
            this.straightDirectionDuration--;
        } else {
            this.useSinFunction();
            this.sinDurance--;
        }

        this.addRoadLineIfPossible();

        this.state.map.push(
            new RoadRow(this.leftEdge, this.rightEdge, null, this.roadLine)
        );

        if (this.state.map.length > Game.mapRows) {
            this.state.map.splice(0,1);
        }
    }

    addRoadLineIfPossible() {
        if (this.roadLineCount > 10 && this.roadLineCount < 30) {
            this.roadLineCount++;
            this.roadLine = true;
        } else if (this.roadLineCount == 30) {
            this.roadLineCount = 0;
            this.roadLine = false;
        } else {
            this.roadLineCount++;
        }
    }

    useSinFunction() {
        let yValue: number = 0.3 * Math.sin(this.state.sinDistance / 100 * Math.PI);
        this.percentangeSideDecider(this.convertToRowPercentange(yValue));
        this.state.sinDistance++;
    }

    straightOrSin() {
        let randomDecision: number = this.randomNumber(0, 2);

        if (randomDecision == 1) {
            this.straightDirectionDuration = this.randomNumber(1, 200);
        } else {
            this.sinDurance = this.randomNumber(1, 250);
        }
    }

    randomNumber(min: number, max: number) {
        return Math.floor(Math.random() * (max - min) + min);
    }

    initializeState() {

        this.leftEdge = 0.3;
        this.rightEdge = 0.7;

        this.straightDirectionDuration = 0;
        this.sinDurance = 0;

        for (let index: number = 0; index < Game.mapRows; index++) {
            this.addNewRow();
        }
    }
}

Game.mapRows = 100;