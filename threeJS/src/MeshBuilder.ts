import { 
    BufferGeometry,
    Mesh as TMesh
} from "three";

import { IMesh } from "../../src/Proxy/IMesh";
import { IMeshBuilder, indexList } from "../../src/Proxy/IMeshBuilder";

import Mesh from "./Mesh";

export default class MeshBuilder implements IMeshBuilder {
    
    protected _mesh:        TMesh;
    protected _tmesh:       Mesh;
    protected _skinIndices: Array<indexList>;

    constructor(mesh: Mesh) {
        this._tmesh = mesh;
        this._mesh = mesh.object as TMesh;
        this._skinIndices = [];
    }

    get mesh(): IMesh {
        return this._tmesh;
    }

    get skinIndicesList(): Array<indexList> {
        return this._skinIndices;
    }

    public createFaces(faces: Array<any>, matIndex: number): void {
        const geometry = this._mesh.geometry as BufferGeometry,
              index = Array.from(geometry.index.array),
              positions = Array.from(geometry.attributes.position.array),
              colors = Array.from(geometry.attributes.vertColor.array),
              normals = Array.from(geometry.attributes.normal.array),
              uvs = Array.from(geometry.attributes.uv.array),
              _flags = Array.from(geometry.attributes._flags.array);

        let addIndex = [],
            ofstIdx = positions.length/3;

        for (let f = 0; f < faces.length; ++f, ofstIdx += 3) {
            const face = faces[f];

            positions.push(...face.v1, ...face.v2, ...face.v3);
            colors.push(...face.c1, ...face.c2, ...face.c3);
            normals.push(...face.n1, ...face.n2, ...face.n3);
            uvs.push(...face.uv1, ...face.uv2, ...face.uv3);
            _flags.push(...face.f1, ...face.f2, ...face.f3);

            addIndex.push(ofstIdx, ofstIdx + 1, ofstIdx + 2);
        }

        index.splice(geometry.groups[matIndex].start, 0, ...addIndex);

        geometry.setIndex(index);

        geometry.groups[matIndex].count += addIndex.length;

        for (let g = matIndex + 1; g < geometry.groups.length; ++g) {
            geometry.groups[g].start += addIndex.length;
        }

        geometry.attributes.position.array = new Float32Array(positions);
        (geometry.attributes.position as any).needsUpdate = true;

        geometry.attributes.vertColor.array = new Float32Array(colors);
        (geometry.attributes.vertColor as any).needsUpdate = true;

        geometry.attributes.normal.array = new Float32Array(normals);
        (geometry.attributes.normal as any).needsUpdate = true;

        geometry.attributes.uv.array = new Float32Array(uvs);
        (geometry.attributes.uv as any).needsUpdate = true;

        geometry.attributes._flags.array = new Float32Array(_flags);
        (geometry.attributes._flags as any).needsUpdate = true;
    }

    public copyFace(faceIdx: number): any {
        const geom = this._mesh.geometry as BufferGeometry,
              index = geom.index.array,
              newFace = {
                v1: [geom.attributes.position.array[index[faceIdx*3+0]*3+0], geom.attributes.position.array[index[faceIdx*3+0]*3+1], geom.attributes.position.array[index[faceIdx*3+0]*3+2]],
                v2: [geom.attributes.position.array[index[faceIdx*3+1]*3+0], geom.attributes.position.array[index[faceIdx*3+1]*3+1], geom.attributes.position.array[index[faceIdx*3+1]*3+2]],
                v3: [geom.attributes.position.array[index[faceIdx*3+2]*3+0], geom.attributes.position.array[index[faceIdx*3+2]*3+1], geom.attributes.position.array[index[faceIdx*3+2]*3+2]],

                c1: [geom.attributes.vertColor.array[index[faceIdx*3+0]*3+0], geom.attributes.vertColor.array[index[faceIdx*3+0]*3+1], geom.attributes.vertColor.array[index[faceIdx*3+0]*3+2]],
                c2: [geom.attributes.vertColor.array[index[faceIdx*3+1]*3+0], geom.attributes.vertColor.array[index[faceIdx*3+1]*3+1], geom.attributes.vertColor.array[index[faceIdx*3+1]*3+2]],
                c3: [geom.attributes.vertColor.array[index[faceIdx*3+2]*3+0], geom.attributes.vertColor.array[index[faceIdx*3+2]*3+1], geom.attributes.vertColor.array[index[faceIdx*3+2]*3+2]],

                n1: [geom.attributes.normal.array[index[faceIdx*3+0]*3+0], geom.attributes.normal.array[index[faceIdx*3+0]*3+1], geom.attributes.normal.array[index[faceIdx*3+0]*3+2]],
                n2: [geom.attributes.normal.array[index[faceIdx*3+1]*3+0], geom.attributes.normal.array[index[faceIdx*3+1]*3+1], geom.attributes.normal.array[index[faceIdx*3+1]*3+2]],
                n3: [geom.attributes.normal.array[index[faceIdx*3+2]*3+0], geom.attributes.normal.array[index[faceIdx*3+2]*3+1], geom.attributes.normal.array[index[faceIdx*3+2]*3+2]],

                uv1: [geom.attributes.uv.array[index[faceIdx*3+0]*2+0], geom.attributes.uv.array[index[faceIdx*3+0]*2+1]],
                uv2: [geom.attributes.uv.array[index[faceIdx*3+1]*2+0], geom.attributes.uv.array[index[faceIdx*3+1]*2+1]],
                uv3: [geom.attributes.uv.array[index[faceIdx*3+2]*2+0], geom.attributes.uv.array[index[faceIdx*3+2]*2+1]],

                f1: [geom.attributes._flags.array[index[faceIdx*3+0]*4+0], geom.attributes._flags.array[index[faceIdx*3+0]*4+1], geom.attributes._flags.array[index[faceIdx*3+0]*4+2], geom.attributes._flags.array[index[faceIdx*3+0]*4+3]],
                f2: [geom.attributes._flags.array[index[faceIdx*3+1]*4+0], geom.attributes._flags.array[index[faceIdx*3+1]*4+1], geom.attributes._flags.array[index[faceIdx*3+1]*4+2], geom.attributes._flags.array[index[faceIdx*3+1]*4+3]],
                f3: [geom.attributes._flags.array[index[faceIdx*3+2]*4+0], geom.attributes._flags.array[index[faceIdx*3+2]*4+1], geom.attributes._flags.array[index[faceIdx*3+2]*4+2], geom.attributes._flags.array[index[faceIdx*3+2]*4+3]]
            };
        
        return newFace;
    }

    public removeFaces(remove: Set<number>): void {
        let geom = this._mesh.geometry as BufferGeometry,
            indices = [],
            index = geom.index.array;

        let ofstGroups = geom.groups.map( () => 0 );
        for (let i = 0; i < index.length/3; ++i) {
            if (!remove.has(i)) {
                indices.push(index[i * 3 + 0], index[i * 3 + 1], index[i * 3 + 2]);
            } else {
                for (let g = 0; g < geom.groups.length; ++g) {
                    const group = geom.groups[g];
                    if (i*3 >= group.start && i*3 < group.start + group.count) {
                        ofstGroups[g] += 3;
                        break;
                    }
                }
            }
        }

        for (let g = 0, sum = 0; g < geom.groups.length; ++g) {
            geom.groups[g].count -= ofstGroups[g];
            geom.groups[g].start -= sum;
            sum += ofstGroups[g];
        }

        geom.setIndex(indices);
    }

    public replaceSkinIndices(remap: any) {
        let skinIndices = (this._mesh.geometry as BufferGeometry).attributes.skinIndex.array,
            indices: Array<number> = [];
        for (let i = 0; i < skinIndices.length; ++i) {
            const v = remap[skinIndices[i]];
            if (v !== undefined) {
                indices[i] = v;
            } else {
                indices[i] = skinIndices[i];
            }
        }
        (this._mesh.geometry as BufferGeometry).attributes.skinIndex.array = new Float32Array(indices);
    }

    public copyFacesWithSkinIndex(skinidx: number, newskinidx: number): void {
        const geometry = this._mesh.geometry as BufferGeometry,
              index = Array.from(geometry.index.array),
              positions = Array.from(geometry.attributes.position.array),
              normals = Array.from(geometry.attributes.normal.array),
              skinIndices = Array.from(geometry.attributes.skinIndex.array),
              skinWeights = Array.from(geometry.attributes.skinWeight.array),
              uvs = Array.from(geometry.attributes.uv.array),
              _flags = Array.from(geometry.attributes._flags.array);
        
        const addIndex = [];

        for (let i = 0; i < index.length/3; ++i) {
            const posIdx1 = index[i * 3 + 0], posIdx2 = index[i * 3 + 1], posIdx3 = index[i * 3 + 2];
            if (skinIndices[posIdx1 * 4 + 0] == skinidx && skinIndices[posIdx1 * 4 + 1] == skinidx) {
                // we assume that the 2 other vertices of the face have also skinidx has skin index
                const nposIdx = positions.length/3;

                addIndex.push(nposIdx, nposIdx + 1, nposIdx + 2);

                positions.push(positions[posIdx1 * 3 + 0], positions[posIdx1 * 3 + 1], positions[posIdx1 * 3 + 2]);
                positions.push(positions[posIdx2 * 3 + 0], positions[posIdx2 * 3 + 1], positions[posIdx2 * 3 + 2]);
                positions.push(positions[posIdx3 * 3 + 0], positions[posIdx3 * 3 + 1], positions[posIdx3 * 3 + 2]);

                normals.push(normals[posIdx1 * 3 + 0], normals[posIdx1 * 3 + 1], normals[posIdx1 * 3 + 2]);
                normals.push(normals[posIdx2 * 3 + 0], normals[posIdx2 * 3 + 1], normals[posIdx2 * 3 + 2]);
                normals.push(normals[posIdx3 * 3 + 0], normals[posIdx3 * 3 + 1], normals[posIdx3 * 3 + 2]);

                skinIndices.push(newskinidx, newskinidx, 0, 0);
                skinIndices.push(newskinidx, newskinidx, 0, 0);
                skinIndices.push(newskinidx, newskinidx, 0, 0);

                skinWeights.push(skinWeights[posIdx1 * 4 + 0], skinWeights[posIdx1 * 4 + 1], skinWeights[posIdx1 * 4 + 2], skinWeights[posIdx1 * 4 + 3]);
                skinWeights.push(skinWeights[posIdx2 * 4 + 0], skinWeights[posIdx2 * 4 + 1], skinWeights[posIdx2 * 4 + 2], skinWeights[posIdx2 * 4 + 3]);
                skinWeights.push(skinWeights[posIdx3 * 4 + 0], skinWeights[posIdx3 * 4 + 1], skinWeights[posIdx3 * 4 + 2], skinWeights[posIdx3 * 4 + 3]);

                uvs.push(uvs[posIdx1 * 2 + 0], uvs[posIdx1 * 2 + 1]);
                uvs.push(uvs[posIdx2 * 2 + 0], uvs[posIdx2 * 2 + 1]);
                uvs.push(uvs[posIdx3 * 2 + 0], uvs[posIdx3 * 2 + 1]);

                _flags.push(_flags[posIdx1 * 4 + 0], _flags[posIdx1 * 4 + 1], _flags[posIdx1 * 4 + 2], _flags[posIdx1 * 4 + 3]);
                _flags.push(_flags[posIdx2 * 4 + 0], _flags[posIdx2 * 4 + 1], _flags[posIdx2 * 4 + 2], _flags[posIdx2 * 4 + 3]);
                _flags.push(_flags[posIdx3 * 4 + 0], _flags[posIdx3 * 4 + 1], _flags[posIdx3 * 4 + 2], _flags[posIdx3 * 4 + 3]);
            }
        }

        index.push(...addIndex);

        geometry.setIndex(index);

        geometry.groups[0].count = geometry.index.count; // assume there is a single group

        geometry.attributes.position.array = new Float32Array(positions);
        (geometry.attributes.position as any).needsUpdate = true;

        geometry.attributes.normal.array = new Float32Array(normals);
        (geometry.attributes.normal as any).needsUpdate = true;

        geometry.attributes.skinIndex.array = new Float32Array(skinIndices);
        (geometry.attributes.skinIndex as any).needsUpdate = true;

        geometry.attributes.skinWeight.array = new Float32Array(skinWeights);
        (geometry.attributes.skinWeight as any).needsUpdate = true;

        geometry.attributes.uv.array = new Float32Array(uvs);
        (geometry.attributes.uv as any).needsUpdate = true;

        geometry.attributes._flags.array = new Float32Array(_flags);
        (geometry.attributes._flags as any).needsUpdate = true;
    }

    public setIndex(index: indexList): void {
        const geometry = this._mesh.geometry as BufferGeometry;

        geometry.setIndex(index);
    }

    public makeSkinIndicesList(): void {
        if (this._skinIndices.length > 0) {
            return;
        }

        const geometry = this._mesh.geometry as BufferGeometry;

        if (!geometry.attributes.skinIndex) {
            return;
        }

        const sindices = geometry.attributes.skinIndex.array,
              index = geometry.index;

        for (let i = 0; i < index.count/3; ++i) {
            const skinIndex = sindices[index.array[i*3+0]*4+0];
            
            let lst: indexList = this._skinIndices[skinIndex];
            if (!lst) {
                lst = [];
                this._skinIndices[skinIndex] = lst;
            }

            lst.push(index.array[i*3+0], index.array[i*3+1], index.array[i*3+2]);
        }
    }

}
