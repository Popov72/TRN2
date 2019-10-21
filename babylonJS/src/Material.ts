import {
    ShaderMaterial,
    Vector3, 
    Vector4
} from "babylonjs";

import { IMaterial } from "../../src/Proxy/IMaterial";

export default class Material implements IMaterial {

    public userData:    any;
    public uniforms:    any;

    private _material:  ShaderMaterial;

    private static count: number = 0;

    constructor(mat: ShaderMaterial) {
        this._material = mat;
        this.userData = mat.metadata.userData;
        this.uniforms = mat.metadata.uniforms;
    }

    get material(): ShaderMaterial {
        return this._material;
    }

    get depthWrite(): boolean {
        return !this._material.disableDepthWrite;
    }

    set depthWrite(dw: boolean) {
        this._material.disableDepthWrite = !dw;
    }

    get vertexShader(): string {
        const mat = this._material;

        return (mat as any)._shaderPath.vertex;  //! todo better
    }

    set vertexShader(vs: string) {
        const mat = this._material;

        (mat as any)._shaderPath.vertex = vs;  //! todo better
    }

    get fragmentShader(): string {
        const mat = this._material;

        return (mat as any)._shaderPath.fragment;  //! todo better
    }

    set fragmentShader(fs: string) {
        const mat = this._material;

        (mat as any)._shaderPath.fragment = fs;  //! todo better
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
            case 't':
                this._material.setTexture(uname, uval.value);
                break;
            case 'i':
                this._material.setInt(uname, uval.value);
                break;
            case 'f':
                this._material.setFloat(uname, uval.value);
                break;
            case 'f3':
                if (!uval._value) {
                    uval._value = new Vector3(0, 0, 0);
                }
                uval._value.copyFromFloats(uval.value[0], uval.value[1], uval.value[2]);
                this._material.setVector3(uname, uval._value);
                break;
            case 'f4':
                if (!uval._value) {
                    uval._value = new Vector4(0, 0, 0, 0);
                }
                uval._value.copyFromFloats(uval.value[0], uval.value[1], uval.value[2], uval.value[3]);
                this._material.setVector4(uname, uval._value);
                break;
            case 'fv1':
                this._material.setFloats(uname, uval.value);
                break;
            case 'fv':
                this._material.setArray3(uname, uval.value);
                break;
            case 'm4v':
                (this._material as any).setMatrices(uname, uval.value); //! todo better
                break;
        }
    }

    public clone(): Material {
        const shd = this._material.clone(this._material.name + '_copy' + (Material.count++));

        (shd as any)._shaderPath = Object.assign({}, (shd as any)._shaderPath); //! todo better

        shd.alphaMode = this._material.alphaMode; //! todo: remove when using updated babylon

        shd.metadata = {
            "userData": this.userData,
            "uniforms": this.cloneUniforms(this.uniforms),
        }

        return new Material(shd);
    }

    protected cloneUniforms(src: any): any {
        const dst: any = {};
    
        for (const u in src) {
            dst[u] = {};
    
            for (const p in src[u]) {
                const property = src[u][p];
    
                if (p === "_value") continue;

                if (Array.isArray(property)) {
                    dst[u][p] = property.slice();
                } else {
                    dst[u][p] = property;
                }
            }
        }
    
        return dst;
    }

    public setZBias(factor: number, unit: number): void {
        this._material.zOffset = factor;
    }

}
