export class HighScore {
    score: number = 0;
    localStorage: Storage = window.localStorage;

    addScore() {
        this.score += 5;
    }

    checkIfHasStorage() {
        return this.localStorage['score'];
    }

    newStorageObject() {
        let scoreData: {allScores: string[], lastScore: string} = {
            allScores: [],
            lastScore: ""
        }
        return scoreData;
    }

    existingStorageObject() {
        return this.localStorage['score']
    }

    getScoreData() {
        if (this.checkIfHasStorage()) {
            let scoreData: {allScores: string[], lastScore: string} = JSON.parse(this.existingStorageObject());
            return scoreData;
        }

        return this.newStorageObject();
    }

    storeNewScore() {
        let data: {allScores: string[], lastScore: string} = this.sortAndAddHighScores();
        if (data.allScores.length >= 10) { data.allScores.pop(); }
        
        this.localStorage['score'] = JSON.stringify(data);
    }

    sortAndAddHighScores() {
        let data: {allScores: string[], lastScore: string} = this.getScoreData();
        let i: number = 0;

        while (i < data.allScores.length) {
            if (parseInt(data.allScores[i]) < this.score) {
                data.allScores.splice(i, 0, this.score.toString());
                break;
            }
            i++;
        }

        if (data.allScores.length === 0) {
            data.allScores.push(this.score.toString());
        }

        data.lastScore = this.score.toString();
        return data;
    }
}