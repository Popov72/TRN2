import * as Descr from "./TR4CutSceneDescr";
import BitReader from "./BitReader";

declare var DataStream: any;

const removeUnusedFields = true;

/**
 * 
 * Decode the cutseq.pak file from TR4, thanks to work from Sapper and T4Larson who deciphered the file format
 *
 * https://www.trsearch.org/tool/32/download
 * 
 */
export default class TR4CutSceneDecoder {

    private _layout: any;

    constructor(public url: string) {
        this._layout = null;
    }

    get layout(): any {
        return this._layout;
    }

    public async parse() {
        let res = await this.readFile();

        let dsHeader = new DataStream(res, 0, DataStream.LITTLE_ENDIAN);

        // Read directory
        this._layout = dsHeader.readStruct(Descr.Header);

        this._layout.cutscenes = [] as Array<any>;

        // Read cutscenes
        for (let cs = 0; cs < this._layout.directory.length; ++cs) {

            let directory = this._layout.directory[cs];

            let dsCutscene = new DataStream(dsHeader.buffer, directory.offset + 4, DataStream.LITTLE_ENDIAN);

            // Read global curscene data, actor pointers and camera position / rotation headers
            let sCutscene: any = dsCutscene.readStruct(Descr.Cutscene);

            sCutscene.info = Descr.CutsceneMap[cs];
            this._layout.cutscenes.push(sCutscene);

            // Read camera data
            sCutscene.camera.targetPositionData = this.readPackedData(dsCutscene, sCutscene.camera.targetHeader);
            sCutscene.camera.cameraPositionData = this.readPackedData(dsCutscene, sCutscene.camera.cameraHeader);

            if (removeUnusedFields) {
                delete sCutscene.cameraDataOffset;
                delete sCutscene.numActors;
            }

            // Read actors
            for (let actorIdx = 0; actorIdx < sCutscene.actors.length; ++actorIdx) {
                let actor = sCutscene.actors[actorIdx];

                actor.meshes = [];

                for (let meshIdx = 0; meshIdx < actor.numNodes; ++meshIdx) {
                    actor.meshes.push({});
                }

                // Actor meshes position and rotation headers
                let dsActorHeader = new DataStream(dsCutscene.buffer, dsCutscene.byteOffset + actor.dataOffset, DataStream.LITTLE_ENDIAN);
                let sActorHeader: any = dsActorHeader.readStruct(Descr.PositionHeader);

                actor.meshes[0].positionHeader = sActorHeader.positionHeader;

                (Descr.RotationHeaders[1] as Array<any>)[2] = actor.numNodes;

                let rotHdr = dsActorHeader.readStruct(Descr.RotationHeaders).rotationHeaders;

                for (let meshIdx = 0; meshIdx < actor.numNodes; ++meshIdx) {
                    actor.meshes[meshIdx].rotationHeader = rotHdr[meshIdx];
                }

                // Actor meshes position and rotation data
                for (let meshIdx = 0; meshIdx < actor.numNodes; ++meshIdx) {
                    let mesh = actor.meshes[meshIdx];

                    if (meshIdx == 0) {
                        mesh.positionData = this.readPackedData(dsActorHeader, mesh.positionHeader);
                    }
                    
                    mesh.rotationData = this.readPackedData(dsActorHeader, mesh.rotationHeader);
                }

                if (removeUnusedFields) {
                    delete actor.dataOffset;
                }
            }
        }

        if (removeUnusedFields) {
            delete this._layout.uncompSize;
            delete this._layout._;
            delete this._layout.signature;
            delete this._layout.directory;
        }
    }

    private readPackedData(ds: any, sHeader: any): any {
        let numBitsPX = ((sHeader.bitsSizes >> 10) & 0x0F);
        let numBitsPY = ((sHeader.bitsSizes >>  5) & 0x0F);
        let numBitsPZ = ((sHeader.bitsSizes >>  0) & 0x0F);
        
        if (numBitsPX < 6) {
            console.log('Problem, numBitsPX < 6!!', numBitsPX, ds, sHeader)
        }
        if (numBitsPY < 6) {
            console.log('Problem, numBitsPY < 6!!', numBitsPY, ds, sHeader)
        }
        if (numBitsPZ < 6) {
            console.log('Problem, numBitsPZ < 6!!', numBitsPZ, ds, sHeader)
        }
        
        let numBytesPX = Math.floor(numBitsPX * sHeader.numValuesX / 8) + 4;
        let numBytesPY = Math.floor(numBitsPY * sHeader.numValuesY / 8) + 4;
        let numBytesPZ = Math.floor(numBitsPZ * sHeader.numValuesZ / 8) + 4;
        
        let ret: any =  {
            "x": ds.readStruct([ 'x', ['', 'uint8', numBytesPX]]).x,
            "y": ds.readStruct([ 'y', ['', 'uint8', numBytesPY]]).y,
            "z": ds.readStruct([ 'z', ['', 'uint8', numBytesPZ]]).z,
        }

        ret.dx = this.decompressPackedData(ret.x, numBitsPX, sHeader.numValuesX);
        ret.dy = this.decompressPackedData(ret.y, numBitsPY, sHeader.numValuesY);
        ret.dz = this.decompressPackedData(ret.z, numBitsPZ, sHeader.numValuesZ);

        if (removeUnusedFields) {
            delete ret.x;
            delete ret.y;
            delete ret.z;
            delete sHeader.bitsSizes;
            delete sHeader.numValuesX;
            delete sHeader.numValuesY;
            delete sHeader.numValuesZ;
        }

        return ret;
    }

    private decompressPackedData(packedData: Uint8Array, numBits: number, numValues: number): Array<number> {
        let data: Array<number> = [];

        // Transform packed data
        let packed = new Int16Array(numValues);

        let br: BitReader = new BitReader(packedData);

        let idx = 0;
        while (idx < numValues) {
            let val = br.read(numBits);
            if (val & (1 << (numBits-1))) {
                val |= Descr.bitMasks[numBits-6];
            }
            packed[idx++] = val;
        }

        // Parse packed data
        let v = 0;
        while (v < packed.length) {
            let fc = packed[v++];
            let flag1 = (fc >> 5) & 0x1;
            if (flag1) {
                if ((fc & 0x0F) == 0) {
                    fc = 0x10;
                } else {
                    fc = fc & 0x0F;
                }
                for (let i = 0; i < fc; ++i) {
                    data.push(packed[v++]);
                }
            } else {
                let flag2 = (fc >> 4) & 0x1;
                let delta;
                if (flag2) {
                    let fc1 = packed[v++];
                    delta = packed[v++];
                    fc = (fc & 0x7) << 5;
                    fc1 = fc1 & 0x1F;
                    fc = fc | fc1;
                } else {
                    delta = packed[v++];
                    fc = fc & 0x7;
                }
                for (let i = 0; i < fc; ++i) {
                    data.push(delta);
                }
            }
        }

        return data;
    }

    private async readFile(): Promise<ArrayBuffer> {
        const blob = await (await fetch(this.url)).arrayBuffer();

        return Promise.resolve(blob);
    }
}
