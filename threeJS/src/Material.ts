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

    public uniformsUpdated(names?: Array<string> | null): void { }

    public clone(): Material {
        return new Material(this._material.clone());
    }
    
}
