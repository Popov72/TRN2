export class SystemLight {

    private static __id: number = 0;

    protected _positions:   Array<number>;
    protected _colors:      Array<number>;
    protected _fadeouts:    Array<number>;
    protected _lightIds:    Array<number>;

    constructor() {
        this._positions = [0, 0, 0];
        this._colors = [0, 0, 0];
        this._fadeouts = [0];
        this._lightIds = [];
    }

    get numLights(): number {
        return this._lightIds.length;
    }

    public add(): number {
        const id = SystemLight.__id++;

        this._lightIds.push(id);

        if (this._lightIds.length > 1) {
            this._positions.push(0, 0, 0);
            this._colors.push(0, 0, 0);
            this._fadeouts.push(0);
        }

        return id;
    }

    public remove(id: number): void {
        const idx = this.findIndexFromId(id);

        if (idx < 0) { return; }

        if (this._lightIds.length > 1) {
            this._positions.splice(idx * 3, 3);
            this._colors.splice(idx * 3, 3);
            this._fadeouts.splice(idx, 1);
        }

        this._lightIds.splice(idx, 1);
    }

    public setPosition(id: number, position: Array<number>): void {
        const idx = this.findIndexFromId(id);

        this._positions[idx * 3 + 0] = position[0];
        this._positions[idx * 3 + 1] = position[1];
        this._positions[idx * 3 + 2] = position[2];
    }

    public setColor(id: number, color: Array<number>): void {
        const idx = this.findIndexFromId(id);

        this._colors[idx * 3 + 0] = color[0];
        this._colors[idx * 3 + 1] = color[1];
        this._colors[idx * 3 + 2] = color[2];
    }

    public setFadeout(id: number, distance: number): void {
        const idx = this.findIndexFromId(id);

        this._fadeouts[idx] = distance;
    }

    public bindToUniforms(uniforms: any): void {
        uniforms.numSystemLight.value       = this._lightIds.length;
        uniforms.systemLight_position.value = this._positions;
        uniforms.systemLight_color.value    = this._colors;
        uniforms.systemLight_distance.value = this._fadeouts;
    }

    protected findIndexFromId(id: number): number {
        for (let i = 0; i < this._lightIds.length; ++i) {
            if (this._lightIds[i] == id) {
                return i;
            }
        }

        return -1;
    }

}
