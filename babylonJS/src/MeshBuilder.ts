import {
    DataArray,
    Geometry,
    IndicesArray,
    Mesh as BMesh,
    MultiMaterial,
    ShaderMaterial,
    SubMesh,
    VertexBuffer
} from "babylonjs";

import Engine from "../../src/Proxy/Engine";
import { IMesh } from "../../src/Proxy/IMesh";
import { IMeshBuilder, indexList } from "../../src/Proxy/IMeshBuilder";

import Mesh from "./Mesh";
import Scene from "./Scene";
import { ShaderManager } from "./ShaderManager";

export default class MeshBuilder implements IMeshBuilder {
    
    protected _mesh:        BMesh;
    protected _tmesh:       Mesh;
    protected _skinIndices: Array<indexList>;

    constructor(mesh?: Mesh) {
        this._tmesh = mesh as any;
        this._mesh = mesh ? mesh.object as BMesh : <any>null;
        this._skinIndices = [];
    }

    get mesh(): IMesh {
        return this._tmesh;
    }

    get skinIndicesList(): Array<indexList> {
        return this._skinIndices;
    }

    public setIndex(index: indexList, dontUpdateSubMeshes?: boolean): void {
        const geometry = this._mesh.geometry as Geometry;

        const subMeshes = this._mesh.subMeshes.slice();

        geometry.setIndices(index, null, false); // this call remove the sub meshes and recreate a single new one, hence the lines before and after

        this._mesh.subMeshes = subMeshes;

        if (!dontUpdateSubMeshes) {
            if (subMeshes.length != 1) {
                throw "Works only for meshes with a single sub mesh!";
            }
            const subm = this._mesh.subMeshes[0];
            subm.indexStart = 0;
            subm.indexCount = index.length;
        }
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

        let index = geometry.getIndices(false) as IndicesArray,
            arSkinIndex = this.getArrayFromDataArray(vbSkinIndex);

        for (let i = 0; i < index!.length/3; ++i) {
            const skinIndex = arSkinIndex[index[i * 3 + 0 ] * 4 + 0];
            
            let lst: indexList = this._skinIndices[skinIndex];
            if (!lst) {
                lst = [];
                this._skinIndices[skinIndex] = lst;
            }

            lst.push(index[i * 3 + 0], index[i * 3 + 1], index[i * 3 + 2]);
        }
    }

    public createFaces(faces: Array<any>, matIndex: number): void {
        const geometry = this._mesh.geometry as Geometry,
              index = Array.from(geometry.getIndices(false) as IndicesArray),
              positions = this.getArrayFromDataArray(geometry.getVertexBuffer("position")!),
              colors = this.getArrayFromDataArray(geometry.getVertexBuffer("vertColor")!),
              normals = this.getArrayFromDataArray(geometry.getVertexBuffer("normal")!),
              uvs = this.getArrayFromDataArray(geometry.getVertexBuffer("uv")!),
              _flags = this.getArrayFromDataArray(geometry.getVertexBuffer("_flags")!);

        let addIndex = [],
            ofstIdx = positions.length/3;

        for (let f = 0; f < faces.length; ++f, ofstIdx += 3) {
            const face = faces[f];

            positions.push(...face.v1, ...face.v2, ...face.v3);
            colors.push(...face.c1, ...face.c2, ...face.c3);
            normals.push(...face.n1, ...face.n2, ...face.n3);
            uvs.push(...face.uv1, ...face.uv2, ...face.uv3);
            _flags.push(...face.f1, ...face.f2, ...face.f3);

            addIndex.push(ofstIdx + 2, ofstIdx + 1, ofstIdx);
        }

        index.splice(this._mesh.subMeshes[matIndex].indexStart, 0, ...addIndex);

        const subMeshes = this._mesh.subMeshes.slice();

        subMeshes[matIndex].indexCount += addIndex.length;

        for (let g = matIndex + 1; g < subMeshes.length; ++g) {
            subMeshes[g].indexStart += addIndex.length;
        }

        geometry.setIndices(index);

        this._mesh.setVerticesData("position", positions, false, 3);
        this._mesh.setVerticesData("vertColor", colors, false, 3);
        this._mesh.setVerticesData("normal", normals, false, 3);
        this._mesh.setVerticesData("uv", uvs, false, 2);
        this._mesh.setVerticesData("_flags", _flags, false, 4);

        this._mesh.releaseSubMeshes();

        for (let submeshIndex = 0; submeshIndex < subMeshes.length; submeshIndex++) {
            const previousOne = subMeshes[submeshIndex];
            SubMesh.AddToMesh(previousOne.materialIndex, previousOne.indexStart, previousOne.indexCount, previousOne.indexStart, previousOne.indexCount, this._mesh);
        }
    }

    public copyFace(faceIdx: number): any {
        const geometry = this._mesh.geometry as Geometry,
              index = Array.from(geometry.getIndices(false) as IndicesArray),
              positions = this.getArrayFromDataArray(geometry.getVertexBuffer("position")!),
              colors = this.getArrayFromDataArray(geometry.getVertexBuffer("vertColor")!),
              normals = this.getArrayFromDataArray(geometry.getVertexBuffer("normal")!),
              uvs = this.getArrayFromDataArray(geometry.getVertexBuffer("uv")!),
              _flags = this.getArrayFromDataArray(geometry.getVertexBuffer("_flags")!);

        const newFace = {
                v3: [positions[index[faceIdx*3+0]*3+0], positions[index[faceIdx*3+0]*3+1], positions[index[faceIdx*3+0]*3+2]],
                v2: [positions[index[faceIdx*3+1]*3+0], positions[index[faceIdx*3+1]*3+1], positions[index[faceIdx*3+1]*3+2]],
                v1: [positions[index[faceIdx*3+2]*3+0], positions[index[faceIdx*3+2]*3+1], positions[index[faceIdx*3+2]*3+2]],

                c3: [colors[index[faceIdx*3+0]*3+0], colors[index[faceIdx*3+0]*3+1], colors[index[faceIdx*3+0]*3+2]],
                c2: [colors[index[faceIdx*3+1]*3+0], colors[index[faceIdx*3+1]*3+1], colors[index[faceIdx*3+1]*3+2]],
                c1: [colors[index[faceIdx*3+2]*3+0], colors[index[faceIdx*3+2]*3+1], colors[index[faceIdx*3+2]*3+2]],

                n3: [normals[index[faceIdx*3+0]*3+0], normals[index[faceIdx*3+0]*3+1], normals[index[faceIdx*3+0]*3+2]],
                n2: [normals[index[faceIdx*3+1]*3+0], normals[index[faceIdx*3+1]*3+1], normals[index[faceIdx*3+1]*3+2]],
                n1: [normals[index[faceIdx*3+2]*3+0], normals[index[faceIdx*3+2]*3+1], normals[index[faceIdx*3+2]*3+2]],

                uv3: [uvs[index[faceIdx*3+0]*2+0], uvs[index[faceIdx*3+0]*2+1]],
                uv2: [uvs[index[faceIdx*3+1]*2+0], uvs[index[faceIdx*3+1]*2+1]],
                uv1: [uvs[index[faceIdx*3+2]*2+0], uvs[index[faceIdx*3+2]*2+1]],

                f3: [_flags[index[faceIdx*3+0]*4+0], _flags[index[faceIdx*3+0]*4+1], _flags[index[faceIdx*3+0]*4+2], _flags[index[faceIdx*3+0]*4+3]],
                f2: [_flags[index[faceIdx*3+1]*4+0], _flags[index[faceIdx*3+1]*4+1], _flags[index[faceIdx*3+1]*4+2], _flags[index[faceIdx*3+1]*4+3]],
                f1: [_flags[index[faceIdx*3+2]*4+0], _flags[index[faceIdx*3+2]*4+1], _flags[index[faceIdx*3+2]*4+2], _flags[index[faceIdx*3+2]*4+3]]
            };
        
        return newFace;
    }

    public removeFaces(remove: Set<number>): void {
        let geom = this._mesh.geometry as Geometry,
            indices = [],
            index = Array.from(geom.getIndices(false) as IndicesArray);

        let ofstGroups = this._mesh.subMeshes.map( () => 0 );
        for (let i = 0; i < index.length/3; ++i) {
            if (!remove.has(i)) {
                indices.push(index[i * 3 + 0], index[i * 3 + 1], index[i * 3 + 2]);
            } else {
                for (let g = 0; g < this._mesh.subMeshes.length; ++g) {
                    const group = this._mesh.subMeshes[g];
                    if (i*3 >= group.indexStart && i*3 < group.indexStart + group.indexCount) {
                        ofstGroups[g] += 3;
                        break;
                    }
                }
            }
        }

        this.setIndex(indices, true);

        for (let g = 0, sum = 0; g < this._mesh.subMeshes.length; ++g) {
            this._mesh.subMeshes[g].indexCount -= ofstGroups[g];
            this._mesh.subMeshes[g].indexStart -= sum;
            sum += ofstGroups[g];
        }
    }

    public replaceSkinIndices(remap: any): void {
        const geometry = this._mesh.geometry as Geometry,
              vbSkinIndex = geometry.getVertexBuffer("skinIndex");

        if (!vbSkinIndex) {
            return;
        }

        let skinIndices = this.getArrayFromDataArray(vbSkinIndex),
            indices: Array<number> = [];
        for (let i = 0; i < skinIndices.length; ++i) {
            const v = remap[skinIndices[i]];
            if (v !== undefined) {
                indices[i] = v;
            } else {
                indices[i] = skinIndices[i];
            }
        }
        
        this._mesh.setVerticesData("skinIndex", indices, false, vbSkinIndex.byteStride/4);
    }

    public copyFacesWithSkinIndex(skinidx: number, newskinidx: number): void {
        const geometry = this._mesh.geometry as Geometry,
              index = Array.from(geometry.getIndices(false) as IndicesArray),
              positions = this.getArrayFromDataArray(geometry.getVertexBuffer("position")!),
              normals = this.getArrayFromDataArray(geometry.getVertexBuffer("normal")!),
              skinIndices = this.getArrayFromDataArray(geometry.getVertexBuffer("skinIndex")!),
              skinWeights = this.getArrayFromDataArray(geometry.getVertexBuffer("skinWeight")!),
              uvs = this.getArrayFromDataArray(geometry.getVertexBuffer("uv")!),
              _flags = this.getArrayFromDataArray(geometry.getVertexBuffer("_flags")!);
        
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

        this.setIndex(index, true);

        this._mesh.subMeshes[0].indexCount = index.length; // assume there is a single subMesh

        this._mesh.setVerticesData("position", positions, false, 3);
        this._mesh.setVerticesData("normal", normals, false, 3);
        this._mesh.setVerticesData("skinIndex", skinIndices, false, 4);
        this._mesh.setVerticesData("skinWeight", skinWeights, false, 4);
        this._mesh.setVerticesData("uv", uvs, false, 2);
        this._mesh.setVerticesData("_flags", _flags, false, 4);
    }

    protected getArrayFromDataArray(vb: VertexBuffer): Array<number> {
        let da = vb.getData() as DataArray,
            ar: Array<number> = [];

        if (Array.isArray(da)) {
            ar = da;
        } else {
            ar = Array.from(new Float32Array(<ArrayBuffer>da));
        }

        return ar;
    }

    public createMesh(name: string, vshader: string, fshader: string, uniforms: any, vertices: Array<number>, indices: Array<number>, uvs?: Array<number>, colors?: Array<number>): IMesh {
        const geom = new Geometry(`Geometry of ${name}`, (Engine.activeScene as Scene).object),
              attributes = ['position'];

        geom.setVerticesData("position", new Float32Array(vertices), false, 3);

        if (uvs !== undefined) {
            geom.setVerticesData("uv", new Float32Array(uvs), false, 2);
            attributes.push('uv');
        }

        if (colors !== undefined) {
            geom.setVerticesData("vertColor", new Float32Array(colors), false, 3);
            attributes.push('vertColor');
        }

        const aindices = indices.slice();

        for (let i = 0; i < aindices.length; i += 3) {
            const i0 = aindices[i];
            aindices[i] = aindices[i + 2];
            aindices[i + 2] = i0;
        }
        
        geom.setIndices(aindices);

        let uniformsUsed = new Set<string>();

        (Engine.getShaderMgr() as ShaderManager).getVertexUniforms(vshader)!.forEach((u) => uniformsUsed.add(u));
        (Engine.getShaderMgr() as ShaderManager).getFragmentUniforms(fshader)!.forEach((u) => uniformsUsed.add(u));

        let samplers = ["map", "mapBump"];

        if (uniforms) {
            for (const uname in uniforms) {
                uniformsUsed.add(uname);
            }
        }

        const shd = new ShaderMaterial(`Shader of ${name}`, (Engine.activeScene as Scene).object, {
            "vertex":   vshader, 
            "fragment": fshader, 
        }, {
            attributes: attributes,
            samplers: samplers,
            uniforms: Array.from(uniformsUsed)
        });

        shd.metadata = {
            "uniforms": uniforms || {},
            "userData": {}
        };

        const multimat = new MultiMaterial(`Material of ${name}`, (Engine.activeScene as Scene).object);

        multimat.subMaterials.push(shd);

        this._mesh = new BMesh(name, null);
        this._mesh.subMeshes = [];
        this._mesh.material = multimat;

        geom.applyToMesh(this._mesh);

        const tmesh = new Mesh(this._mesh),
              materials = tmesh.materials;

        materials.forEach((m) => m.uniformsUpdated());

        return tmesh;
    }

}
