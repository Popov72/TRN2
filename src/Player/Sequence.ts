export default class Sequence {

    protected numberOfTiles: number;
    protected tileDisplayDuration: number;
    protected currentDisplayTime: number;
    protected currentTile: number;
    
    constructor(numTiles: number, tileDispDuration: number) {	
        this.numberOfTiles = numTiles;
        this.tileDisplayDuration = tileDispDuration;

        // how long has the current image been displayed?
        this.currentDisplayTime = 0;

        // which image is currently being displayed?
        this.currentTile = 0;
    }

	public update(milliSec: number) {
		this.currentDisplayTime += milliSec;
		while (this.currentDisplayTime > this.tileDisplayDuration) {
			this.currentDisplayTime -= this.tileDisplayDuration;
			this.currentTile++;
			if (this.currentTile == this.numberOfTiles)
				this.currentTile = 0;
		}
	}
}
