import {
    ShaderMaterial,
    Object3D
} from "three";

import { IMaterial } from "../../src/Proxy/IMaterial";

export default class Material implements IMaterial {

    public userData: any;
    public uniforms: any;

    private material: ShaderMaterial;

    constructor(obj: Object3D, mat: ShaderMaterial) {
        this.material = mat;
        this.userData = mat.userData;
        this.uniforms = mat.uniforms;
    }

    public uniformsUpdated(names?: Array<string> | null): void { }
    
}
