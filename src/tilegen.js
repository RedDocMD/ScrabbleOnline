import letterValues from './letter-values';

class BagOfTiles {
    constructor() {
        let tilesLeft = ["", ""];
        for (let letterCode = 0; letterCode < 26; letterCode++) {
            let letter = String.fromCharCode(65 + letterCode);
            let nos = letterValues[letter].nos;
            for (let i = 1; i <= nos; i++) tilesLeft.push(letter);
        }
        this.tileLeft = tilesLeft;
        this.getTiles = this.getTiles.bind(this);
    }

    getTiles(n) {
        let tiles = [];
        let size = this.tileLeft.length;
        for (let i = 0; i < n; i++) {
            let idx = Math.floor(Math.random() * size);
            --size;
            tiles.push(this.tileLeft[idx]);
            this.tileLeft.splice(idx, 1);
        }
        return tiles;
    }

    returnTiles(letters) {
        for (let i = 0; i < letters.length; i++) {
            for (let j = 0; j < this.tileLeft.length; j++) {
                if (letters[i] < this.tileLeft[j]) {
                    this.tileLeft.splice(j - 1, 0, letters[i]);
                    break;
                }
            }
        }
    }
}

export default BagOfTiles