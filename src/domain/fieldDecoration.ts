import { Helpers } from "../global/helpers";

export class FieldDecoration extends Helpers{
    treeOccurenceFrequency: number = 0;
    grassOccurenceFrequency: number = 0;
    stumpOccurenceFrequency: number = 0;
    flowerOccurenceFrequency: number = 0;

    treeWindowPrecentage: number = 0.24;
    stumpWindowPrecentage: number = 0.07;
    grassWindowPrecentage: number = 0.045;
    flowerWindowPrecentage: number = 0.05;

    windowHeight: number;
    windowWidth: number;

    constructor(windowHeight: number, windowWidth: number) {
        super();
        this.windowHeight = windowHeight;
        this.windowWidth = windowWidth;
    }

    leftSideWidthCalculator(leftEdge: HTMLDivElement, imagewidth: number) {
        return super.randomNumber(0, parseInt(leftEdge.style.width) - (imagewidth / this.windowWidth * 100)) + "%";
    }

    rightSideWidthCalculator(rightEdge: HTMLDivElement) {
        return super.randomNumber(100 - parseInt(rightEdge.style.width), 100) + "%";
    }

    addDecor(leftEdge: HTMLDivElement, rightEdge: HTMLDivElement) {
        
        this.addStumps(leftEdge, rightEdge);
        this.addFlowers(leftEdge, rightEdge);
        this.addGrass(leftEdge, rightEdge);
        this.addTrees(leftEdge, rightEdge);

    }

    addGrass(leftEdge: HTMLDivElement, rightEdge: HTMLDivElement) {
        if(this.grassOccurenceFrequency == 5) {
            this.addNewDecor(leftEdge, rightEdge, 11, ["grass", "fieldDec"], this.grassWindowPrecentage, 2.06);
            this.grassOccurenceFrequency = 0;
        } else {
            this.grassOccurenceFrequency += 1;
        }
    }

    addStumps(leftEdge: HTMLDivElement, rightEdge: HTMLDivElement) {
        if(this.stumpOccurenceFrequency === 30) {
            this.addNewDecor(leftEdge, rightEdge, 1, ["stump", "fieldDec"], this.stumpWindowPrecentage, 1.52);
            this.stumpOccurenceFrequency = 0;
        } else {
            this.stumpOccurenceFrequency += 1;
        }
    }

    addFlowers(leftEdge: HTMLDivElement, rightEdge: HTMLDivElement) {
        if(this.flowerOccurenceFrequency === 25) {
            this.addNewDecor(leftEdge, rightEdge, 2, ["flower", "fieldDec"], this.flowerWindowPrecentage, 1.52);
            this.flowerOccurenceFrequency = 0;
        } else {
            this.flowerOccurenceFrequency += 1;
        }
    }

    addTrees(leftEdge: HTMLDivElement, rightEdge: HTMLDivElement) {
        if(this.treeOccurenceFrequency === 12) {
            this.addNewDecor(leftEdge, rightEdge, 1, ["tree", "fieldDec"], this.treeWindowPrecentage, 0.82);
            this.treeOccurenceFrequency = 0;
        } else {
            this.treeOccurenceFrequency += 1;
        }
    }

    addNewDecor(leftEdge: HTMLDivElement, rightEdge: HTMLDivElement, imageFrequency: number,
        styleList: string[], windowPrecentage: number, widthPrecentage: number) {
            
        let leftDiv: HTMLDivElement = document.createElement('div');
        let rightDiv: HTMLDivElement = document.createElement('div');

        for (let count = 0; count < imageFrequency; count++) {
            let leftImg = this.getLeftEdgeImage(leftEdge, styleList, windowPrecentage, widthPrecentage);
            leftDiv.appendChild(leftImg); 
            let rightImg = this.getRightEdgeImage(rightEdge, styleList, windowPrecentage);
            rightDiv.appendChild(rightImg);     
        }
        leftEdge.appendChild(leftDiv);
        rightEdge.appendChild(rightDiv);
    }

    getLeftEdgeImage(leftEdge: HTMLDivElement, styleList: string[], windowPrecentage: number, widthPrecentage: number) {
        let Img = super.createNewImage(this.windowHeight * windowPrecentage, styleList);
            Img.style.left = this.leftSideWidthCalculator(leftEdge, Img.height * widthPrecentage);
        return Img;
    }

    getRightEdgeImage(rightEdge: HTMLDivElement, styleList: string[], windowPrecentage: number) {
        let Img = super.createNewImage(this.windowHeight * windowPrecentage, styleList);
            Img.style.left = this.rightSideWidthCalculator(rightEdge);
        return Img;
    }

}