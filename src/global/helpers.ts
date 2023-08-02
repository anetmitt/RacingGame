
export class Helpers {

    randomNumber(min: number, max: number) {
        let chosenNumber = Math.random() * max;

        if (chosenNumber < min) {
            chosenNumber += min;
        }
        
        return chosenNumber;
    }

    createNewImage(imageHeight: number, styleList: string[]) {
        let image: HTMLImageElement = document.createElement('img');
        image.height = imageHeight;
        image.classList.add(...styleList);
        return image;
    }
}