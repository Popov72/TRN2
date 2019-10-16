export default class BitReader {

    private _index: number;
    private _curbit: number;

    constructor(public data: Uint8Array) {
        this._index = 0;
        this._curbit = 0;
    }

    public read(numBits: number): number {
        let val: number = 0, shift = 0;
        while (numBits-- > 0) {
            val += this.readBit() << shift++;
        }
        return val;
    }

    private readBit(): number {
        let b: number = (this.data[this._index] & (1 << this._curbit)) >> this._curbit;

        this._curbit++;
        if (this._curbit == 8) {
            this._curbit = 0;
            this._index++;
        }
                
        return b;
    }
}
