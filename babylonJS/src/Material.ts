import {
    AbstractMesh,
    ShaderMaterial,
    Vector3, Vector4
} from "babylonjs";

import { IMaterial } from "../../src/Proxy/IMaterial";

export default class Material implements IMaterial {

    public userData: any;
    public uniforms: any;

    private material: ShaderMaterial;

    constructor(obj: AbstractMesh, mat: ShaderMaterial) {
        this.material = mat;
        this.userData = mat.metadata.userData;
        this.uniforms = mat.metadata.uniforms;
    }

    public uniformsUpdated(names?: Array<string>): void {
        if (names !== undefined) {
            for (let i = 0; i < names.length; ++i) {
                const uval = this.uniforms[names[i]];
                if (uval) {
                    this._setUniformValue(names[i], uval);
                }
            }
        } else {
            for (const uname in this.uniforms) {
                const uval = this.uniforms[uname];
                this._setUniformValue(uname, uval);
            }
        }
    }

    protected _setUniformValue(uname: string, uval: any): void {
        switch(uval.type) {
            case 'i':
                this.material.setInt(uname, uval.value);
                break;
            case 'f':
                this.material.setFloat(uname, uval.value);
                break;
            case 'f3':
                if (!uval._value) {
                    uval._value = new Vector3(0, 0, 0);
                }
                uval._value.copyFromFloats(uval.value[0], uval.value[1], uval.value[2]);
                this.material.setVector3(uname, uval._value);
                break;
            case 'fv1':
            case 'fv':
                this.material.setFloats(uname, uval.value);
                break;
            case 'f4':
                if (!uval._value) {
                    uval._value = new Vector4(0, 0, 0, 0);
                }
                uval._value.copyFromFloats(uval.value[0], uval.value[1], uval.value[2], uval.value[3]);
                this.material.setVector4(uname, uval._value);
                break;
        }
    }

}
