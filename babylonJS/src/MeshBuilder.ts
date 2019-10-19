import {
    DataArray,
    Geometry,
    IndicesArray,
    Mesh as BMesh
} from "babylonjs";

import { IMesh } from "../../src/Proxy/IMesh";
import { IMeshBuilder, skinIndices } from "../../src/Proxy/IMeshBuilder";

import Mesh from "./Mesh";

export default class MeshBuilder implements IMeshBuilder {
    
    protected _mesh:        BMesh;
    protected _tmesh:       Mesh;
    protected _skinIndices: Array<skinIndices>;

    constructor(mesh: Mesh) {
        this._tmesh = mesh;
        this._mesh = mesh.object as BMesh;
        this._skinIndices = [];
    }

    get mesh(): IMesh {
        return this._tmesh;
    }

    get skinIndicesList(): Array<skinIndices> {
        return this._skinIndices;
    }

    public setIndex(index: skinIndices): void {
        const geometry = this._mesh.geometry as Geometry;

        geometry.setIndices(index);
    }

    public makeSkinIndicesList(): void {
        if (this._skinIndices.length > 0) {
            return;
        }

        const geometry = this._mesh.geometry as Geometry,
              vbSkinIndex = geometry.getVertexBuffer("skinIndex");

        if (!vbSkinIndex) {
            return;
        }

        let daSkinIndex = vbSkinIndex.getData() as DataArray,
            index = geometry.getIndices(false) as IndicesArray,
            sndices: Array<number> = [];

        if (Array.isArray(daSkinIndex)) {
            sndices = daSkinIndex;
        } else {
            sndices = Array.from(new Float32Array(<ArrayBuffer>daSkinIndex));
        }

        for (let i = 0; i < index!.length/3; ++i) {
            const skinIndex = sndices[index[i * 3 + 0 ] * 4 + 0];
            
            let lst: skinIndices = this._skinIndices[skinIndex];
            if (!lst) {
                lst = [];
                this._skinIndices[skinIndex] = lst;
            }

            lst.push(index[i * 3 + 0], index[i * 3 + 1], index[i * 3 + 2]);
        }
    }

}
