import {
    ShaderMaterial
} from "three";

import { IMaterial } from "../../src/Proxy/IMaterial";

export default class Material implements IMaterial {

    public userData:    any;
    public uniforms:    any;

    private _material:  ShaderMaterial;

    constructor(mat: ShaderMaterial) {
        this._material = mat;
        this.userData = mat.userData;
        this.uniforms = mat.uniforms;
    }

    get material(): ShaderMaterial {
        return this._material;
    }

    get depthWrite(): boolean {
        return this._material.depthWrite;
    }

    set depthWrite(d: boolean) {
        this._material.depthWrite = d;
    }
    
    get vertexShader(): string {
        return this._material.vertexShader;
    }

    set vertexShader(vs: string) {
        this._material.vertexShader = vs;
        this._material.needsUpdate = true;
    }

    get fragmentShader(): string {
        return this._material.fragmentShader;
    }

    set fragmentShader(fs: string) {
        this._material.fragmentShader = fs;
        this._material.needsUpdate = true;
    }

    public uniformsUpdated(names?: Array<string> | null): void { }

    public clone(): Material {
        return new Material(this._material.clone());
    }
    
}
