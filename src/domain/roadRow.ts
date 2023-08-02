export class RoadRow {
    leftEdge: number;
    rightEdge: number;
    obstacle: number | null;
    middleLineCount: number;
    roadLine: boolean;
    
    constructor(leftEdge: number, rightEdge: number, obstacle: number | null, roadLine: boolean) {

        this.leftEdge = leftEdge;
        this.rightEdge = rightEdge;
        this.roadLine = roadLine;

        if (obstacle) {
            if (obstacle <= leftEdge || obstacle >= rightEdge) {
                this.obstacle = null
            }
        }

        this.obstacle = obstacle
        this.middleLineCount = 10;
    }
}
