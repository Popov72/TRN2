import jQuery from "jquery";
import pako from "pako";

import Utils from "../Utils/Misc";

import TR1Descr from "./LevelDescription/TR1";
import TR1TubDescr from "./LevelDescription/TR1Tub";
import TR2Descr from "./LevelDescription/TR2";
import TR3Descr from "./LevelDescription/TR3";
import TR4Descr from "./LevelDescription/TR4";
import { ConfigManager } from "../ConfigManager";

declare var DataStream: any;

const gameFormatDescr: any = {
    "TR1":      TR1Descr,
    "TR1TUB":   TR1TubDescr,
    "TR2":      TR2Descr,
    "TR3":      TR3Descr,
    "TR4":      TR4Descr,
};

export enum levelVersion {
    TR1 = "TR1",
    TR2 = "TR2",
    TR3 = "TR3",
    TR4 = "TR4",
};

export interface RawLevel {
    confMgr:                    ConfigManager,
    filename:                   string, // name of the level with extension. eg: palaces.tr4
    shortfilename:              string, // name of the level without extension. eg: palaces
    rversion:                   levelVersion,
    version:                    string, // version as read in the first 4 bytes of the file data
    textile:                    Array<any>, // array of textures
    animatedTexturesUVCount:    number, // number of uvcounts

    [name: string] : any,
};


/**
 *  Read the raw level files (meaning the .phd / .tub / .tr2 / ... files)
 *  The result is a JSON tree with all data read
 */
export class LevelLoader {

    private _level: RawLevel;

    constructor() {
        this._level = <any>{};
    }

    get level(): RawLevel {
        return this._level;
    }

    get version(): string {
        return this._level.rversion;
    }

	public load(data: any, fname: string, showTiles: boolean = false): boolean {
        let ds = new DataStream(data);
        
		ds.endianness = DataStream.LITTLE_ENDIAN;

		const hdr = ds.readStruct([
			'version', 'uint32'
		]);

		let version = hdr.version;
		let rversion = 'Unknown';
		switch(version) {
			case 0x00000020: rversion = 'TR1'; break;
			case 0x0000002D: rversion = 'TR2'; break;
			case 0xFF080038: rversion = 'TR3'; break;
			case 0xFF180034: rversion = 'TR3'; break;
			case 0xFF180038: rversion = 'TR3'; break;
			case 0x00345254: rversion = 'TR4'; break;
		}
		ds.seek(0);

		let rversionLoader: string = rversion;
		if (fname.toLowerCase().indexOf('.tub') >= 0) {
			rversionLoader = 'TR1TUB';
		}

		try {
			let out = ds.readStruct(gameFormatDescr[rversionLoader].part1);

			//console.log('first part ok', out);

            const savepos = ds.position;
            
			ds.position += out.numMeshData*2;

			out.numMeshPointers = ds.readUint32();
			out.meshPointers = ds.readUint32Array(out.numMeshPointers);
			out.meshes = [];

			const savepos2 = ds.position;
			for (let m = 0; m < out.numMeshPointers; ++m) {
				ds.position = savepos + out.meshPointers[m];

				const mesh = ds.readStruct(gameFormatDescr[rversionLoader].part2);
				
				out.meshes[m] = mesh;
				out.meshes[m].dummy = out.meshPointers[m] == 0;
				//if (out.meshPointers[m] == 0) console.log(mesh)
			}
			
			ds.position = savepos2;

			//console.log('second part ok', out);
			
			const nextPart = ds.readStruct(gameFormatDescr[rversionLoader].part3);
			
			//console.log('third part ok', out);

			for (let attr in nextPart) {
				out[attr] = nextPart[attr]
            }
            
            this._level = out;
		} catch (e) {
			console.log('An error occurred while parsing the level! ds.failurePosition=', ds.failurePosition);
            console.log(ds);
            
			throw e;
		}

		// -------------------
		// --- post processing
		//console.log(this._level.numRoomTextiles, this._level.numObjTextiles, this._level.numBumpTextiles);

        var idx = fname.lastIndexOf('\\'), idx2 = fname.lastIndexOf('/');
        
		this._level.filename = fname.substring(1 + Math.max(idx, idx2));
		this._level.shortfilename = fname.substring(0, fname.indexOf('.'));
		this._level.rversion = rversion as levelVersion;
		this._level.version = Utils.toHexString32(version);
		this._level.textile = [];
		this._level.animatedTexturesUVCount = this._level.animatedTexturesUVCount || 0;

		this._level.confMgr = new ConfigManager(this._level.rversion);
        this._level.confMgr.levelName = this._level.filename.toLowerCase();

		if (this._level.textile32misc != undefined) {
			this._level.textile32 = this._level.textile32.concat(this._level.textile32misc);
			delete this._level.textile32misc;
		}

        let numTotTextiles = 0;
        
		if (this._level.textile8 && !this._level.textile16) numTotTextiles += this._level.textile8.length;
		if (this._level.textile16) numTotTextiles += this._level.textile16.length;
		if (this._level.textile32) numTotTextiles += this._level.textile32.length;

		this._level.atlas = {
			"width":        256,
			"height":       256,
			"make":         true,
			"imageData":    null,
			"numColPerRow": 4,
			"curRow":       0,
			"curCol":       0,
		}

		if (this._level.atlas.make) {
			this._level.atlas.width = this._level.atlas.numColPerRow * 256;
			this._level.atlas.height = (Math.floor((numTotTextiles+1) / this._level.atlas.numColPerRow) + (((numTotTextiles+1) % this._level.atlas.numColPerRow) == 0 ? 0 : 1)) * 256;
			this._level.atlas.imageData = new ImageData(this._level.atlas.width, this._level.atlas.height);
		}

		// Handle 8-bit textures
		let numTextiles = 0;
		if (this._level.textile8 && !this._level.textile16) {
			for (let t = 0; t < this._level.textile8.length; ++t, ++numTextiles) {
				const imageData = new ImageData(256, 256);
				for (let j = 0; j < 256; ++j) {
					for (let i = 0; i < 256; ++i) {
						const pix = this._level.textile8[t][j*256+i];
						const a = pix ? 0xFF : 0x00, r = this._level.palette[pix].r << 2, g = this._level.palette[pix].g << 2, b = this._level.palette[pix].b << 2;
						imageData.data[j*256*4+i*4+0]=r;
						imageData.data[j*256*4+i*4+1]=g;
						imageData.data[j*256*4+i*4+2]=b;
						imageData.data[j*256*4+i*4+3]=a;
						if (this._level.atlas.make) {
							this._level.atlas.imageData.data[(j+this._level.atlas.curRow*256)*4*this._level.atlas.width+(i+this._level.atlas.curCol*256)*4+0]=r;
							this._level.atlas.imageData.data[(j+this._level.atlas.curRow*256)*4*this._level.atlas.width+(i+this._level.atlas.curCol*256)*4+1]=g;
							this._level.atlas.imageData.data[(j+this._level.atlas.curRow*256)*4*this._level.atlas.width+(i+this._level.atlas.curCol*256)*4+2]=b;
							this._level.atlas.imageData.data[(j+this._level.atlas.curRow*256)*4*this._level.atlas.width+(i+this._level.atlas.curCol*256)*4+3]=a;
						}
					}
				}
				this._level.textile[numTextiles] = Utils.convertToPng(imageData);
				if (showTiles) {
                    const idElem = "tex8_" + t;
					jQuery('body').append('<span id="' + idElem + '">' +
						'<img alt="' + this._level.shortfilename + '_tile' + numTextiles + '.png" style="border:1px solid red" src="' + this._level.textile[numTextiles] + 
						'"/><span style="position:relative;left:-140px;top:-140px;background-color:white">' + numTextiles + '</span></span>');
                    document.getElementById(idElem)!.addEventListener("click", Utils.saveData.bind(null, this._level.shortfilename + '_tile' + numTextiles, this._level.textile[numTextiles]), false);
                }
				if (this._level.atlas.make) {
					this._level.atlas.curCol++;
					if (this._level.atlas.curCol == this._level.atlas.numColPerRow) {
						this._level.atlas.curCol = 0;
						this._level.atlas.curRow++;
					}
				}
			}
		}

		// Handle 16-bit textures
        if (!this._level.textile16) this._level.textile16 = [];
        
        const newtile = this.replaceColouredPolys(numTotTextiles);
        
		if (newtile != null) this._level.textile16.push(newtile);

		for (let t = 0; t < this._level.textile16.length; ++t, ++numTextiles) {
            const imageData = new ImageData(256, 256);
			for (let j = 0; j < 256; ++j) {
				for (let i = 0; i < 256; ++i) {
					const pix = this._level.textile16[t][j*256+i];
					let a = pix & 0x8000, r = ((pix & 0x7c00) >> 10) << 3, g = ((pix & 0x03e0) >> 5) << 3, b = (pix & 0x001f) << 3;
					if (a) a = 0xFF;
					imageData.data[j*256*4+i*4+0]=r;
					imageData.data[j*256*4+i*4+1]=g;
					imageData.data[j*256*4+i*4+2]=b;
					imageData.data[j*256*4+i*4+3]=a;
					if (this._level.atlas.make) {
						this._level.atlas.imageData.data[(j+this._level.atlas.curRow*256)*4*this._level.atlas.width+(i+this._level.atlas.curCol*256)*4+0]=r;
						this._level.atlas.imageData.data[(j+this._level.atlas.curRow*256)*4*this._level.atlas.width+(i+this._level.atlas.curCol*256)*4+1]=g;
						this._level.atlas.imageData.data[(j+this._level.atlas.curRow*256)*4*this._level.atlas.width+(i+this._level.atlas.curCol*256)*4+2]=b;
						this._level.atlas.imageData.data[(j+this._level.atlas.curRow*256)*4*this._level.atlas.width+(i+this._level.atlas.curCol*256)*4+3]=a;
					}
				}
			}
            this._level.textile[numTextiles] = Utils.convertToPng(imageData);
			if (showTiles) {
                const idElem = "tex16_" + t;
				jQuery('body').append('<span id="' + idElem + '">' +
					'<img alt="' + this._level.shortfilename + '_tile' + numTextiles + '.png" style="border:1px solid red" src="' + this._level.textile[numTextiles] + 
					'"/><span style="position:relative;left:-140px;top:-140px;background-color:white">' + numTextiles + '</span></span>');
                document.getElementById(idElem)!.addEventListener("click", Utils.saveData.bind(null, this._level.shortfilename + '_tile' + numTextiles, this._level.textile[numTextiles]), false);
			}
			if (this._level.atlas.make) {
				this._level.atlas.curCol++;
				if (this._level.atlas.curCol == this._level.atlas.numColPerRow) {
					this._level.atlas.curCol = 0;
					this._level.atlas.curRow++;
				}
			}
		}

		// Handle 32-bit textures
		if (!this._level.textile32) this._level.textile32 = [];

		for (let t = 0; t < this._level.textile32.length; ++t, ++numTextiles) {
            const imageData = new ImageData(256, 256);
			for (let j = 0; j < 256; ++j) {
				for (let i = 0; i < 256; ++i) {
					const pix = this._level.textile32[t][j*256+i];
					const a = ((pix & 0xff000000) >> 24) & 0xFF, r = (pix & 0x00ff0000) >> 16, g = (pix & 0x0000ff00) >> 8, b = (pix & 0x000000ff);
					imageData.data[j*256*4+i*4]=r;
					imageData.data[j*256*4+i*4+1]=g;
					imageData.data[j*256*4+i*4+2]=b;
					imageData.data[j*256*4+i*4+3]=a;
					if (this._level.atlas.make) {
						this._level.atlas.imageData.data[(j+this._level.atlas.curRow*256)*4*this._level.atlas.width+(i+this._level.atlas.curCol*256)*4+0]=r;
						this._level.atlas.imageData.data[(j+this._level.atlas.curRow*256)*4*this._level.atlas.width+(i+this._level.atlas.curCol*256)*4+1]=g;
						this._level.atlas.imageData.data[(j+this._level.atlas.curRow*256)*4*this._level.atlas.width+(i+this._level.atlas.curCol*256)*4+2]=b;
						this._level.atlas.imageData.data[(j+this._level.atlas.curRow*256)*4*this._level.atlas.width+(i+this._level.atlas.curCol*256)*4+3]=a;
					}
				}
			}
            this._level.textile[numTextiles] = Utils.convertToPng(imageData);
			if (showTiles) {
                const idElem = "tex32_" + t;
				jQuery('body').append('<span id="' + idElem + '">' +
					'<img alt="' + this._level.shortfilename + '_tile' + numTextiles + '.png" style="border:1px solid red" src="' + this._level.textile[numTextiles] + 
                    '"/><span style="position:relative;left:-140px;top:-140px;background-color:white">' + numTextiles + '</span></span>');
                document.getElementById(idElem)!.addEventListener("click", Utils.saveData.bind(null, this._level.shortfilename + '_tile' + numTextiles, this._level.textile[numTextiles]), false);
			}
			if (this._level.atlas.make) {
				this._level.atlas.curCol++;
				if (this._level.atlas.curCol == this._level.atlas.numColPerRow) {
					this._level.atlas.curCol = 0;
					this._level.atlas.curRow++;
				}
			}
		}

        if (rversion != 'TR4') {
            for (let i = 0; i < this._level.objectTextures.length; ++i) {
                const tex = this._level.objectTextures[i],
                      tile = tex.tile & 0x7FFF;

                const isTri = 
                        (tex.vertices[3].Xpixel == 0)  &&
                        (tex.vertices[3].Ypixel == 0)  &&
                        (tex.vertices[3].Xcoordinate == 0)  &&
                        (tex.vertices[3].Ycoordinate == 0);
                
                tex.tile = tile + (isTri ? 0x8000 : 0);
            }
        }

		if (this._level.atlas.make) {
			const dataSky = this._level.textile[this._level.textile.length-1];

			this._level.textile = [Utils.convertToPng(this._level.atlas.imageData)];

			if (rversion == 'TR4') this._level.textile.push(dataSky); // the sky textile must always be the last of the this._level.textile array

			if (showTiles) {
				jQuery(document.body).css('overflow', 'auto');
				jQuery('body').append('<span id="atlas">' +
					'<img title="' + this._level.atlas.width + 'x' + this._level.atlas.height + '" alt="' + this._level.shortfilename + '_atlas.png" style="border:1px solid red" src="' + this._level.textile[0] + '"/></span>');
                document.getElementById("atlas")!.addEventListener("click", Utils.saveData.bind(null, this._level.shortfilename + '_atlas', this._level.textile[0]), false);
            }

			for (let i = 0; i < this._level.objectTextures.length; ++i) {
				const objText = this._level.objectTextures[i];
				const tile = objText.tile & 0x7FFF, b16 = objText.tile & 0x8000;

				const row = Math.floor(tile / this._level.atlas.numColPerRow), col = tile - row * this._level.atlas.numColPerRow;

                objText.tile = 0 + b16;
                objText.origTile = tile;

				for (let j = 0; j < objText.vertices.length; ++j) {
					const vert = objText.vertices[j];

					vert.Xpixel = parseInt(vert.Xpixel) + col * 256;
					vert.Ypixel = parseInt(vert.Ypixel) + row * 256;
				}
			}
		}

		delete this._level.palette;
		delete this._level.textile8;
		delete this._level.textile16;
		delete this._level.textile32;

		Utils.flatten(this._level, 'rooms.roomData.rectangles.vertices');
		Utils.flatten(this._level, 'rooms.roomData.triangles.vertices');
		Utils.flatten(this._level, 'floorData');
		Utils.flatten(this._level, 'meshPointers');
		Utils.flatten(this._level, 'meshes.lights');
		Utils.flatten(this._level, 'meshes.texturedRectangles.vertices');
		Utils.flatten(this._level, 'meshes.texturedTriangles.vertices');
		Utils.flatten(this._level, 'meshes.colouredRectangles.vertices');
		Utils.flatten(this._level, 'meshes.colouredTriangles.vertices');
		Utils.flatten(this._level, 'frames');
		Utils.flatten(this._level, 'spr');
		Utils.flatten(this._level, 'overlaps');
		Utils.flatten(this._level, 'zones');
		Utils.flatten(this._level, 'animatedTextures');
		Utils.flatten(this._level, 'lightmap');
		Utils.flatten(this._level, 'tex');
		Utils.flatten(this._level, 'demoData');
		Utils.flatten(this._level, 'soundMap');
		Utils.flatten(this._level, 'sampleIndices');

		return ds.position == ds.byteLength;
	}

	private replaceColouredPolys(tile: number): Uint16Array | null {
		if (this._level.rversion == 'TR4') {
            return null;
        }

	    // Build a new textile from the color palette
	 	const newTile = new Uint16Array(256*256);
	 	let ofst = 0, lgn = 0;
		for (let c = 0; c < 256; ++c) {
            let color = this.version == 'TR1' ? this._level.palette[c] : this._level.palette16[c];
            
			if (this.version == 'TR1')  {
				color = ((color.r >> 1) << 10) + ((color.g >> 1) << 5) + (color.b >> 1) + 0x8000;
            } else {
                color = ((color.r >> 3) << 10) + ((color.g >> 3) << 5) + (color.b >> 3) + 0x8000;
            }

			for (let j = 0; j < 3; ++j) {
				for (let i = 0; i < 3; ++i) {
					newTile[lgn * 256 + ofst + i + j * 256] = color;
				}
            }
            
	        ofst += 3;
	        if (ofst + 3 >= 256) {
	            ofst = 0;
	            lgn += 3;
			}
		}

	    // Build new objectTexture structures for the 256 colors of the palette
	    // There are 2 new sets of 256 objectTexture structs: one for tris and one for quads
		let numObjText = this._level.numObjectTextures;	
		for (let j = 0; j < 2; ++j) {
             ofst = lgn = 0;

	 		for (let c = 0; c < 256; ++c) {
	 			let objText = {
	 				"attributes": 0,
					"tile": tile,
					"vertices": [
						{ "Xcoordinate":+1, "Xpixel":ofst,   "Ycoordinate":+1, "Ypixel":lgn },
						{ "Xcoordinate":-1, "Xpixel":ofst+2, "Ycoordinate":+1, "Ypixel":lgn },
						{ "Xcoordinate":-1, "Xpixel":ofst+2, "Ycoordinate":-1, "Ypixel":lgn+2 },
						{ "Xcoordinate":0,  "Xpixel":0,      "Ycoordinate":0,  "Ypixel":0 }
					]
	 			};
	 			if (j == 1) {
	 				objText.vertices[3].Xcoordinate = +1;
	 				objText.vertices[3].Xpixel = ofst;
	 				objText.vertices[3].Ycoordinate = -1;
	 				objText.vertices[3].Ypixel = lgn+2;
	 			}
	 			this._level.objectTextures.push(objText);
                numObjText++;
                 
		        ofst += 3;
		        if (ofst + 3 >= 256) {
		            ofst = 0;
		            lgn += 3;
				}
	 		}
		}

		const skyRemovePolyStart = this._level.confMgr.number('behaviour[name="Sky"] > removepoly > start', true, 0);
		const skyRemovePolyNum   = this._level.confMgr.number('behaviour[name="Sky"] > removepoly > num', true, 0);
		if (skyRemovePolyNum > 0) {
			const skyId = this._level.confMgr.number('behaviour[name="Sky"] > id', true, 0);
			if (skyId) {
				for (let m = 0; m < this._level.moveables.length; ++m) {
					let moveable = this._level.moveables[m];
					if (moveable.objectID == skyId) {
						this._level.meshes[moveable.startingMesh].colouredTriangles.splice(skyRemovePolyStart, skyRemovePolyNum);
						break;
					}
				}
			}
		}

	    // Process the meshes and replace colored polys by textured ones
	    for (let m = 0; m < this._level.meshes.length; ++m) {
	    	let mesh = this._level.meshes[m];

	    	// coloured rectangles
			for (let i = 0; i < mesh.colouredRectangles.length; ++i) {
				let poly = mesh.colouredRectangles[i];
				const index = this._level.rversion == levelVersion.TR1 ? poly.texture & 0xFF : poly.texture >> 8;
				poly.texture = numObjText - 256 + index;
				mesh.texturedRectangles.push(poly);
			}
			mesh.colouredRectangles = [];
			mesh.numColouredRectangles = 0;

	    	// coloured triangles
			for (let i = 0; i < mesh.colouredTriangles.length; ++i) {
				let poly = mesh.colouredTriangles[i];
				const index = this._level.rversion == levelVersion.TR1 ? poly.texture & 0xFF : poly.texture >> 8;
				poly.texture = numObjText - 512 + index;
				mesh.texturedTriangles.push(poly);
			}
			mesh.colouredTriangles = [];
			mesh.numColouredTriangles = 0;
	    }

	    return newTile;
	}

	public static unzip(ds: any, struct: any, dlength: number): void {
        // unzip chunk of data
        if (dlength == 0) {
            dlength = ds.byteLength - ds.position;
        }

		let arr = new Uint8Array(dlength);
		DataStream.memcpy(arr.buffer, 0, ds.buffer, ds.byteOffset + ds.position, dlength);
		let unzipped = pako.inflate(arr);

		// recreate a buffer and replace the compressed data with the uncompressed one
		let buf = new Uint8Array(ds.byteLength + unzipped.length - dlength), ofst = 0;
        let src = new Uint8Array(ds.buffer, 0, ds.byteOffset + ds.position);
        
		buf.set(src, ofst);
		ofst += src.length;
		buf.set(unzipped, ofst);
		ofst += unzipped.length;
		src = new Uint8Array(ds.buffer, ds.byteOffset + ds.position + dlength);
		buf.set(src, ofst);
        ds.buffer = buf.buffer.slice(buf.byteOffset, buf.byteLength + buf.byteOffset);
	}

}
