import Up from "./../images/Porsche_Red_Up.png";
import Left from "./../images/Porsche_Red_Left.png";
import Right from "./../images/Porsche_Red_Right.png";

export class Car {
    gameRoadUi: Element | null;
    carHeight: number;
    rowHeight: number;
    gameRows: number;
    carImage: HTMLImageElement = document.createElement('img');;
    carRows: number = 0; 
    
    constructor(gameRoadUi: Element | null, windowHeight: number, rowHeight: number, gameRows: number) {

        this.gameRoadUi = gameRoadUi;
        this.carHeight = windowHeight * 0.13;
        this.rowHeight = rowHeight;
        this.gameRows = gameRows;

        this.initializeCar();
    }

    initializeCar() {
        this.carImage.src = Up;
        this.carImage.className = "car";
        this.carImage.height = this.carHeight;

        this.carRows = (Math.ceil(this.carHeight / this.rowHeight));

        if (this.gameRoadUi != null) {
            this.gameRoadUi.childNodes[this.gameRows - this.carRows].appendChild(this.carImage);
        }
    }

    moveRight(carStyle: CSSStyleDeclaration, parentWidth: number) {
        if (this.gameRoadUi == null) {return;}

        let rightStyle = getComputedStyle(this.gameRoadUi.childNodes[this.getNodeIndex()].childNodes[2] as Element);
        let possibleNewLoc = ((parseInt(carStyle.left) + parseInt(carStyle.width) + parentWidth * 0.01) / parentWidth) * 100;
    
        if (possibleNewLoc < ((parentWidth - parseInt(rightStyle.width)) / parentWidth * 100)) {
            this.carImage.style.left = (parseInt(carStyle.left) / parentWidth) * 100 + 1 + "%";
            this.carImage.src = Right;

        } else if (parseInt(carStyle.left) != (parentWidth - parseInt(rightStyle.width) - parseInt(carStyle.width))) {
            this.carImage.style.left = (parentWidth - parseInt(rightStyle.width) - parseInt(carStyle.width)).toString();
        }
    }
    
    moveLeft(carStyle: CSSStyleDeclaration, parentWidth: number) {
        if (this.gameRoadUi == null) {return;}
        let leftStyle = getComputedStyle(this.gameRoadUi.childNodes[this.getNodeIndex()].childNodes[0] as Element);
        let newCarLoc = (parseInt(carStyle.left) / parentWidth) * 100 - 1 + "%";
    
        if (parseInt(newCarLoc) > parseInt(leftStyle.width) / parentWidth * 100) {
            this.carImage.style.left = newCarLoc;
            this.carImage.src = Left;

        } else if (carStyle.left != leftStyle.width) {
            this.carImage.style.left = leftStyle.width;
        }
    }
    
    moveUp(carStyle: CSSStyleDeclaration, parentWidth: number, carIndex: number) {

        if (this.gameRoadUi == null || carIndex < 3) {return;}

        let leftStyle = getComputedStyle(this.gameRoadUi.childNodes[carIndex - 1].childNodes[0] as Element);
        let rightStyle = getComputedStyle(this.gameRoadUi.childNodes[carIndex - 1].childNodes[2] as Element);
       
        if (carIndex >= 3 && this.checkIfOutOfBounds(carStyle, parentWidth, leftStyle, rightStyle)) {
            this.gameRoadUi.childNodes[carIndex].childNodes[3].remove();
            this.gameRoadUi.childNodes[carIndex - 3].appendChild(this.carImage);
            this.checkCarImage();
        }
    }
    
    moveDown(carStyle: CSSStyleDeclaration, parentWidth: number, carIndex: number) {

        if (this.gameRoadUi == null || carIndex >= (this.gameRows - this.carRows)) {return;}

        let leftStyle = getComputedStyle(this.gameRoadUi.childNodes[carIndex + 1 + this.carRows].childNodes[0] as Element);
        let rightStyle = getComputedStyle(this.gameRoadUi.childNodes[carIndex + 1 + this.carRows].childNodes[2] as Element);
    
        if (this.checkIfOutOfBounds(carStyle, parentWidth, leftStyle, rightStyle)) {
            
            this.gameRoadUi.childNodes[carIndex].childNodes[3].remove();
            this.gameRoadUi.childNodes[carIndex + 3].appendChild(this.carImage);
        }
    }

    checkCarImage() {
        if(this.carImage.src != Up) {this.carImage.src = Up};
    }

    checkIfOutOfBounds(carStyle: CSSStyleDeclaration, parentWidth: number, leftStyle: CSSStyleDeclaration, rightStyle: CSSStyleDeclaration) {
        return parseInt(carStyle.left) >= parseInt(leftStyle.width)
        && (parseInt(carStyle.left) + parseInt(carStyle.width)) <= (parentWidth - parseInt(rightStyle.width));
    }

    getBottomRodeNode(carIndex: number) {
        if (this.gameRoadUi == null) {return;}
        return this.gameRoadUi.childNodes[carIndex + this.carRows - 1].childNodes[1] as Element;
    }

    getTopRodeNode(carIndex: number) {
        if (this.gameRoadUi == null || carIndex < 3) {return;}
        return this.gameRoadUi.childNodes[carIndex - 1].childNodes[1] as Element;
    }

    hasObstacle(carStyle: CSSStyleDeclaration, rodeNode: Element|undefined) {
        if (this.gameRoadUi == null || rodeNode === undefined) {return false;}

        if (rodeNode.getAttribute('obstacle') === "true") {
            let obstacleLeft = parseInt(rodeNode.getAttribute("obstacleLeft") as string);
            let obstacleRight = parseInt(rodeNode.getAttribute("obstacleRight") as string);
            let middlePoint = obstacleLeft + (obstacleRight - obstacleLeft / 2);

           return parseInt(carStyle.left) >= obstacleLeft && parseInt(carStyle.left) <= obstacleRight
           || (parseInt(carStyle.left) + parseInt(carStyle.width)) >= obstacleLeft && (parseInt(carStyle.left) + parseInt(carStyle.width)) <= obstacleRight ||
           parseInt(carStyle.left) >= middlePoint && middlePoint <= obstacleRight;
        }

        return false;
    }

    hasObstacleOnRight(carStyle: CSSStyleDeclaration, rodeNode: Element | undefined) {
        if (this.gameRoadUi == null || rodeNode == undefined) {return false;}

        if (rodeNode.getAttribute('obstacle') === "true") {
            let obstacleLeft = parseInt(rodeNode.getAttribute("obstacleLeft") as string);
            let obstacleRight = parseInt(rodeNode.getAttribute("obstacleRight") as string);
            let carRightSide = (parseInt(carStyle.left) + parseInt(carStyle.width));

           return carRightSide > obstacleLeft && carRightSide < obstacleRight;
        }

        return false;
    }

    hasObstacleOnLeft(carStyle: CSSStyleDeclaration, rodeNode: Element | undefined) {
        if (this.gameRoadUi == null || rodeNode == undefined) {return false;}

        if (rodeNode.getAttribute('obstacle') === "true") {
            let obstacleRight = parseInt(rodeNode.getAttribute("obstacleRight") as string);
            let obstacleLeft = parseInt(rodeNode.getAttribute("obstacleLeft") as string);

           return parseInt(carStyle.left) < obstacleRight && parseInt(carStyle.left) > obstacleLeft;
        }

        return false;
    }

    getNodeIndex() {
        if (this.gameRoadUi == null) {return -1;}

        let rows = this.gameRoadUi.childNodes;
        
        for (let index = 0; index < rows.length; index++) {
            let rowParts = rows[index].childNodes;
            if (rowParts.length == 4) {
                return index;
            }
        }
        return -1;
    }
}
