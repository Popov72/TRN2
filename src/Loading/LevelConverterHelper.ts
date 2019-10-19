import { ShaderManager } from "../ShaderManager";
import Utils from "../Utils/Misc";

export default class LevelConverterHelper {

    private objects: Array<any>;

    constructor(public sc: any, public shaderMgr: ShaderManager, objects: Array<any>) {
        this.objects = objects;
    }

	public createNewGeometryData(): any {
		return {
            "attributes": {
                "position": {
                    "itemSize": 3,
                    "type": "Float32Array",
                    "array": [],
                    "normalized": false
                },
                "normal": {
                    "itemSize": 3,
                    "type": "Float32Array",
                    "array": [],
                    "normalized": false
                },
                "uv": {
                    "itemSize": 2,
                    "type": "Float32Array",
                    "array": [],
                    "normalized": false
                },
                "vertColor": {
                    "itemSize": 3,
                    "type": "Float32Array",
                    "array": [],
                    "normalized": false
                },
                "_flags": {
                    "itemSize": 4,
                    "type": "Float32Array",
                    "array": [],
                    "normalized": false
                }
            },
            "index": {
                "type": "Uint16Array",
                "array": []
            },
            "groups": null,

            "faces": [],
            "vertices": [],
            "colors": [],
            "normals": [],
            "_flags": []
		};
	}

	public createMaterial(objType: string): any {
        const matName = 'TR_' + objType;

        const mat = {
            "type": "RawShaderMaterial",
            "name": matName,
            "uniforms": {
                "map":          { type: "t",  value: "" },
                "mapBump":      { type: "t",  value: "" },
                "offsetBump":   { type: "f4", value: [0.0, 0.0, 0.0, 0.0] },
                "ambientColor": { type: "f3", value: [0.0, 0.0, 0.0] },
                "tintColor":    { type: "f3", value: [1.0, 1.0, 1.0] },
                "flickerColor": { type: "f3", value: [1.2, 1.2, 1.2] },
                "curTime":      { type: "f",  value: 0.0 },
                "rnd":          { type: "f",  value: 0.0 },
                "offsetRepeat": { type: "f4", value: [0.0, 0.0, 1.0, 1.0] },
                "useFog":       { type: "i",  value: 0 },
                "lighting":     { type: "f3", value: [0, 0, 0] },
                "camPosition":  { type: "f3", value: [0, 0, 0] }
            },
            "vertexShader": "",
            "fragmentShader": "",
            "vertexColors": false,
            "userData": {}
        };

        let vertexShaderName = objType,
            fragmentShaderName = "standard";

        switch(objType) {
            case 'moveable':
                mat.vertexColors = false;
                break;
            case 'sprite':
                mat.vertexColors = false;
                break;
            case 'sky':
                mat.vertexColors = false;
                fragmentShaderName = "sky";
                break;
            case 'skydome':
                fragmentShaderName = "skydome";
                mat.vertexColors = false;
                break;
        }

        mat.vertexShader = this.shaderMgr.getVertexShader(vertexShaderName);
        mat.fragmentShader = this.shaderMgr.getFragmentShader(fragmentShaderName);

        mat.vertexShader   = mat.vertexShader.replace(/##tr_version##/g, this.sc.data.trlevel.rversion.substr(2));
        mat.fragmentShader = mat.fragmentShader.replace(/##tr_version##/g, this.sc.data.trlevel.rversion.substr(2));

        return mat;
	}

	public getBoundingBox(vertices: Array<any>): number[] {
		let xmin = 1e20, ymin = 1e20, zmin = 1e20,
		    xmax = -1e20, ymax = -1e20, zmax = -1e20;
		for (let i = 0; i < vertices.length; ++i) {
			const vertex = vertices[i].vertex;
			if (xmin > vertex.x) xmin = vertex.x;
			if (xmax < vertex.x) xmax = vertex.x;
			if (ymin > vertex.y) ymin = vertex.y;
			if (ymax < vertex.y) ymax = vertex.y;
			if (zmin > vertex.z) zmin = vertex.z;
			if (zmax < vertex.z) zmax = vertex.z;
		}
		return [xmin, xmax, ymin, ymax, zmin, zmax];
	}

	public processRoomVertex(rvertex: any, isFilledWithWater: boolean): any {
		const vertex = rvertex.vertex, attribute = rvertex.attributes;
		let lighting = 0;

		switch(this.sc.data.trlevel.rversion) {
			case 'TR1': {
				lighting = Math.floor((1.0-rvertex.lighting1/8192.)*2*256);
				if (lighting > 255) lighting = 255;
				const r = lighting, g = lighting, b = lighting;
				lighting = b + (g << 8) + (r << 16);
                break;
            }
			case 'TR2': {
				lighting = Math.floor((1.0-rvertex.lighting2/8192.)*2*256);
				if (lighting > 255) lighting = 255;
				const r = lighting, g = lighting, b = lighting;
				lighting = b + (g << 8) + (r << 16);
                break;
            }
			case 'TR3': {
				lighting = rvertex.lighting2;
				const r = (lighting & 0x7C00) >> 10, g = (lighting & 0x03E0) >> 5, b = (lighting & 0x001F);
				lighting = ((b << 3) + 0x000007) + ((g << 11) + 0x000700) + ((r << 19) + 0x070000);
                break;
            }
			case 'TR4': {
				lighting = rvertex.lighting2;
				let r = (((lighting & 0x7C00) >> 7) + 7) << 1, g = (((lighting & 0x03E0) >> 2) + 7) << 1, b = (((lighting & 0x001F) << 3) + 7) << 1;
				if (r > 255) r = 255;
				if (g > 255) g = 255;
				if (b > 255) b = 255;
				lighting = b + (g << 8) + (r << 16);
                break;
            }
		}

		let moveLight = (attribute & 0x4000) ? 1 : 0,
		    moveVertex = (attribute & 0x2000) ? 1 : 0,
		    strengthEffect = ((attribute & 0x1E)-16)/16;

		if (moveVertex) moveLight = 1;
		if ((this.sc.data.trlevel.rversion == 'TR1' || this.sc.data.trlevel.rversion == 'TR2') && isFilledWithWater) moveLight = 1;
		if (isFilledWithWater && (attribute & 0x8000) == 0) moveVertex = 1;

		return {
			x: vertex.x, y: -vertex.y, z: -vertex.z,
			flag: [moveLight, 0, moveVertex, -strengthEffect],
            color: lighting,
            color2: [((lighting & 0xFF0000) >> 16)/255.0, ((lighting & 0xFF00) >> 8)/255.0, (lighting & 0xFF)/255.0]
		};
	}

	public makeFace(obj: any, oface: any, tiles2material: any, tex: any, mapObjTexture2AnimTexture: any, fidx: ((v: number) => number), ofstvert: number): void {
        let vertices = oface.vertices, texture = oface.texture & 0x7FFF, tile = tex.tile & 0x7FFF, origTile = tex.origTile;
        
        if (origTile == undefined) {
            origTile = tile;
        }

		let minU = 1, minV = 1, maxV = 0;
        for (let tv = 0; tv < vertices.length; ++tv) {
            const u = (tex.vertices[fidx(tv)].Xpixel + 0.5) / this.sc.data.trlevel.atlas.width,
                  v = (tex.vertices[fidx(tv)].Ypixel + 0.5) / this.sc.data.trlevel.atlas.height;
            if (minU > u) minU = u;
            if (minV > v) minV = v;
            if (maxV < v) maxV = v;
        }

		// material
        let imat, alpha = (tex.attributes & 2 || oface.effects & 1) ? 'alpha' : '';
		if (mapObjTexture2AnimTexture && mapObjTexture2AnimTexture[texture]) {
			const animTexture = mapObjTexture2AnimTexture[texture],
			      matName = 'anmtext' + alpha + '_' + animTexture.idxAnimatedTexture + '_' + animTexture.pos;
			imat = tiles2material[matName];
			if (typeof(imat) == 'undefined') {
				imat = Utils.objSize(tiles2material);
				tiles2material[matName] = { imat:imat, tile:tile, minU:minU, minV:minV, origTile:origTile };
            } else {
                imat = imat.imat;
            }
		} else if (alpha) {
			imat = tiles2material['alpha' + tile];
			if (typeof(imat) == 'undefined') {
				imat = Utils.objSize(tiles2material);
				tiles2material['alpha' + tile] = { imat:imat, tile:tile, minU:minU, minV:minV, origTile:origTile };
			} else {
                imat = imat.imat;
            }
		} else if (origTile >= this.sc.data.trlevel.numRoomTextiles+this.sc.data.trlevel.numObjTextiles) {
			imat = tiles2material['bump' + origTile];
			if (typeof(imat) == 'undefined') {
                imat = Utils.objSize(tiles2material);
				tiles2material['bump' + origTile] = { imat:imat, tile:tile, minU:minU, minV:minV, origTile:origTile };
			} else {
                imat = imat.imat;
            }
        } else {
			imat = tiles2material[tile];
			if (typeof(imat) == 'undefined') {
				imat = Utils.objSize(tiles2material);
				tiles2material[tile] = { imat:imat, tile:tile, minU:minU, minV:minV, origTile:origTile };
			} else {
                imat = imat.imat;
            }
		}

        const face = [];
		for (let tv = 0; tv < vertices.length; ++tv) {
			let u = (tex.vertices[fidx(tv)].Xpixel + 0.5) / this.sc.data.trlevel.atlas.width,
                v = (tex.vertices[fidx(tv)].Ypixel + 0.5) / this.sc.data.trlevel.atlas.height;
            
			if (obj.objHasScrollAnim && v == maxV) {
                v = minV + (maxV - minV) / 2;
            }

            face.push({"u":u, "v":v, "idx":vertices[fidx(tv)] + ofstvert});
        }

        (face as any).matIndex = imat;

        obj.faces.push(face);
	}

	public makeFaces(obj: any, facearrays: Array<any>, tiles2material: any, objectTextures: any, mapObjTexture2AnimTexture: any, ofstvert: number = 0): void {
		for (let a = 0; a < facearrays.length; ++a) {
			const lstface = facearrays[a];
			for (let i = 0; i < lstface.length; ++i) {
				const o = lstface[i],
				      twoSided = (o.texture & 0x8000) != 0, tex = objectTextures[o.texture & 0x7FFF];
				this.makeFace(obj, o, tiles2material, tex, mapObjTexture2AnimTexture, function(idx) { return o.vertices.length-1-idx; }, ofstvert);
				if (twoSided) {
					this.makeFace(obj, o, tiles2material, tex, mapObjTexture2AnimTexture, function(idx) { return idx; }, ofstvert);
				}
			}
		}
	}

	public makeMeshGeometry(mesh: any, meshJSON: any, tiles2material: any, objectTextures: any, mapObjTexture2AnimTexture: any, skinidx: number | undefined = undefined): boolean {
        const internallyLit = mesh.lights.length > 0;

        const ofstvert = meshJSON.vertices.length/3;

		// push the vertices + vertex colors of the mesh
		for (let v = 0; v < mesh.vertices.length; ++v) {
			const vertex = mesh.vertices[v], lighting = internallyLit ? 1.0 - mesh.lights[v]/8192.0 : 1.0;

			meshJSON.vertices.push(vertex.x, -vertex.y, -vertex.z);
			meshJSON.colors.push(lighting, lighting, lighting); 	// not used => a specific calculation is done in the vertex shader 
    																// with the constant lighting for the mesh + the lighting at each vertex (passed to the shader via flags.w)
            meshJSON._flags.push(0, 0, 0, lighting);
            
			if (skinidx !== undefined) {
                meshJSON.skinIndices.push(skinidx, skinidx);
                meshJSON.skinWeights.push(0.5, 0.5);
            }
		}

		this.makeFaces(meshJSON, [mesh.texturedRectangles, mesh.texturedTriangles], tiles2material, objectTextures, mapObjTexture2AnimTexture, ofstvert);

		return internallyLit;
	}

	public makeMaterialList(tiles2material: any, matname: string, id: string): Array<any> {
		if (!matname) {
            matname = 'room';
        }
		const lstMat = [];
		for (let tile in tiles2material) {
			const oimat = tiles2material[tile], imat = oimat.imat, origTile = oimat.origTile,
			      isAnimText = tile.substr(0, 7) == 'anmtext',
                  isBump = tile.substr(0, 4) == 'bump';
            let isAlphaText = tile.substr(0, 5) == 'alpha';

            if (isAlphaText) tile = tile.substr(5);
            if (isBump) tile = oimat.tile;

            lstMat[imat] = this.createMaterial(matname);
            lstMat[imat].uuid = id + '-' + imat;
            
			if (isAnimText) {
                const idxAnimText = parseInt(tile.split('_')[1]), pos = parseInt(tile.split('_')[2]);

				isAlphaText = tile.substr(7, 5) == 'alpha';
                lstMat[imat].uniforms.map.value = "texture" + oimat.tile;
				lstMat[imat].uniforms.mapBump.value = "texture" + oimat.tile;
				lstMat[imat].userData.animatedTexture = {
					"idxAnimatedTexture": idxAnimText,
                    "pos": pos,
                    "minU": oimat.minU,
                    "minV": oimat.minV
                };
			} else {
				lstMat[imat].uniforms.map.value = "texture" + tile;
				lstMat[imat].uniforms.mapBump.value = "texture" + tile;
				if (isBump) {
                    if (this.sc.data.trlevel.atlas.make) {
                        const row0 = Math.floor(origTile / this.sc.data.trlevel.atlas.numColPerRow), col0 = origTile - row0 * this.sc.data.trlevel.atlas.numColPerRow,
                              row = Math.floor((origTile + this.sc.data.trlevel.numBumpTextiles/2) / this.sc.data.trlevel.atlas.numColPerRow), col = (origTile + this.sc.data.trlevel.numBumpTextiles/2) - row * this.sc.data.trlevel.atlas.numColPerRow;
                        lstMat[imat].uniforms.mapBump.value = "texture" + tile;
                        lstMat[imat].uniforms.offsetBump.value = [(col-col0)*256.0/this.sc.data.trlevel.atlas.width, (row-row0)*256.0/this.sc.data.trlevel.atlas.height,0,1];
                    } else {
                        lstMat[imat].uniforms.mapBump.value = "texture" + (Math.floor(origTile) + this.sc.data.trlevel.numBumpTextiles/2);
                    }
				}
			}
			lstMat[imat].transparent = isAlphaText;

		}
		return lstMat;
	}

    public numAnimationsForMoveable(moveableIdx: number): number {
        const curr_moveable = this.sc.data.trlevel.moveables[moveableIdx];

        if (curr_moveable.animation != 0xFFFF) {
            let next_anim_index = this.sc.data.trlevel.animations.length;
            for (let i = moveableIdx + 1; i < this.sc.data.trlevel.moveables.length; ++i) {
                if (this.sc.data.trlevel.moveables[i].animation != 0xFFFF) {
                    next_anim_index = this.sc.data.trlevel.moveables[i].animation;
                    break;
                }
            }
            return next_anim_index - curr_moveable.animation;
        }
    
        return 0;
    }

    public getGeometryFromId(id: string): any {
        for (let i = 0; i < this.sc.geometries.length; ++i) {
            const geom = this.sc.geometries[i];
            if (geom.uuid == id) {
                return geom;
            }
        }
        return null;
    }

    public getObjectFromId(id: string): any {
        for (let i = 0; i < this.objects.length; ++i) {
            const obj = this.objects[i];
            if (obj.uuid == id) {
                return obj;
            }
        }
        return null;
    }

}
