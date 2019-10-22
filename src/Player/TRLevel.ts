import Engine from "../Proxy/Engine";
import IGameData from "../Player/IGameData";
import { IMesh } from "../Proxy/IMesh";
import { IScene } from "../Proxy/IScene";
import { ObjectManager } from "./ObjectManager";
import { ConfigManager } from "../ConfigManager";
import { ShaderManager } from "../ShaderManager";
import { Position } from "../Proxy/INode";
import { RawLevel } from "../Loading/LevelLoader";

declare var glMatrix: any;

export class TRLevel {

    public trlevel: RawLevel;

    private movObjID2Index: Map<number, number>;
    private sceneRender: IScene;
    private sceneData: any;
    private objMgr: ObjectManager;
    private confMgr: ConfigManager;
    private shdMgr: ShaderManager;

    constructor() {
        this.movObjID2Index = new Map();
        this.sceneRender = <any>null;
        this.objMgr = <any>null;
        this.confMgr = <any>null;
        this.shdMgr = <any>null;
        this.trlevel = <any>null;
    }

    public initialize(gameData: IGameData): void {
        this.trlevel = gameData.sceneData.trlevel;
        this.sceneRender = gameData.sceneRender;
        this.sceneData = gameData.sceneData;
        this.objMgr = gameData.objMgr;
        this.confMgr = gameData.confMgr;
        this.shdMgr = gameData.shdMgr;
    
        for (let m = 0; m < this.trlevel.moveables.length; ++m) {
            const moveable = this.trlevel.moveables[m];
            this.movObjID2Index.set(moveable.objectID, m);
        }
    }

    public getRoomByPos(pos: Position): number {
        const trlevel = this.trlevel,
              x = Math.floor(pos[0]),
              y = -Math.floor(pos[1]),
              z = -Math.floor(pos[2]);

        for (let r = 0; r < trlevel.rooms.length; ++r) {
            const room = trlevel.rooms[r];
            if (room.isAlternate) {
                continue;
            }
            const mx = room.info.x + room.numXsectors * 1024;
            const mz = room.info.z + room.numZsectors * 1024;
            if (x >= room.info.x && x < mx && z >= room.info.z && z < mz && y >= room.info.yTop && y < room.info.yBottom) {
                return r;
            }
        }
        return -1;
    }

    public isPointInRoom(pos: Position, roomIndex: number): boolean {
        const room = this.trlevel.rooms[roomIndex];

        const x = Math.floor(pos[0]),
              y = -Math.floor(pos[1]),
              z = -Math.floor(pos[2]);

        const mx = room.info.x + room.numXsectors * 1024;
        const mz = room.info.z + room.numZsectors * 1024;

        if (x >= room.info.x && x < mx && z >= room.info.z && z < mz && y >= room.info.yTop && y < room.info.yBottom) {
            return true;
        }

        return false;
    }

    public getItemsWithObjID(objID: number): Array<any> {
        const items = [];
        for (let i = 0; i < this.trlevel.items.length; ++i) {
            const item = this.trlevel.items[i];

            if (item.objectID == objID) {
                items.push(item);
            }
        }
        return items;
    }

	public convertIntensity(intensity: number): Array<number> {
		let l = [intensity/8192.0, intensity/8192.0, intensity/8192.0];

		if (this.trlevel.rversion == 'TR3' || this.trlevel.rversion == 'TR4') {
            const b = ((intensity & 0x7C00) >> 10) << 3, 
                  g = ((intensity & 0x03E0) >> 5) << 3, 
                  r = (intensity & 0x001F) << 3;

			l = [r/255, g/255, b/255];
		}

		return l;
    }
    
    public convertLighting(lighting1: number): Array<number> {
		let color = [0, 0, 0];

		switch(this.trlevel.rversion) {
			case 'TR1':
            case 'TR2': {
                let lighting = Math.floor((1.0-lighting1/8192.)*2*256);
				if (lighting > 255) lighting = 255;
				color = [lighting/255.0, lighting/255.0, lighting/255.0];
                break;
            }
			case 'TR3': {
				let lighting = lighting1;
                const r = (lighting & 0x7C00) >> 10, g = (lighting & 0x03E0) >> 5, b = (lighting & 0x001F);
                color = [((r << 3) + 0x7)/255.0, ((g << 3) + 0x7)/255.0, ((b << 3) + 0x7)/255.0];
                break;
            }
			case 'TR4': {
				let lighting = lighting1;
				let r = (((lighting & 0x7C00) >> 7) + 7) << 1, g = (((lighting & 0x03E0) >> 2) + 7) << 1, b = (((lighting & 0x001F) << 3) + 7) << 1;
				if (r > 255) r = 255;
				if (g > 255) g = 255;
                if (b > 255) b = 255;
                color = [r/255.0, g/255.0, b/255.0];
                break;
            }
		}

        return color;
    }

	public createObjectsInLevel (): void {
		for (let i = 0; i < this.trlevel.items.length; ++i) {
			const item = this.trlevel.items[i];

			const roomIndex = item.room, lighting = item.intensity1, q = glMatrix.quat.create();

			glMatrix.quat.setAxisAngle(q, [0,1,0], glMatrix.glMatrix.toRadian(-(item.angle >> 14) * 90) );

			const m = this.movObjID2Index.get(item.objectID);
			if (m == null) {
                const obj = this.objMgr.createSprite(-item.objectID, roomIndex, this.convertLighting(lighting), true);
                if (obj != null) {
                    obj.setPosition([item.x, -item.y, -item.z]);
                    obj.matrixAutoUpdate = true;
                }
			} else {
                let obj: IMesh | null = this.objMgr.createMoveable(item.objectID, roomIndex, lighting != -1 ? this.convertIntensity(lighting) : undefined);

                if (obj != null) {
                    obj.setPosition([item.x, -item.y, -item.z]);
                    obj.setQuaternion(q);
                    obj.matrixAutoUpdate = true;
                } else {
                    // moveable is a placeholder with no geometry
                    const spriteSeqObjID = this.confMgr.number('moveable[id="' + item.objectID + '"] > spritesequence', true, -1);

                    if (spriteSeqObjID >= 0) {
                        obj = this.objMgr.createSprite(-spriteSeqObjID, roomIndex, [1, 1, 1], true);
                        if (obj != null) {
                            obj.setPosition([item.x, -item.y, -item.z]);
                            obj.matrixAutoUpdate = true;
                        }
                    }
                }
            }
        }

		for (let m = 0; m < this.trlevel.rooms.length; ++m) {
            const room = this.trlevel.rooms[m],
                  info = room.info, 
                  rdata = room.roomData,
                  data = this.sceneData.objects['room' + m];

            // create portals
            const portals = data.portals, meshPortals: Array<IMesh> = [];
            data.meshPortals = meshPortals;
            for (let p = 0; p < portals.length; ++p) {
                const portal = portals[p];
                const vertices = [
                    portal.vertices[0].x, portal.vertices[0].y, portal.vertices[0].z,
                    portal.vertices[1].x, portal.vertices[1].y, portal.vertices[1].z,
                    portal.vertices[2].x, portal.vertices[2].y, portal.vertices[2].z,
                    portal.vertices[3].x, portal.vertices[3].y, portal.vertices[3].z
                ];

                const colors = [
                    1, 0, 0,
                    0, 1, 0,
                    0, 0, 1,
                    1, 1, 1
                ]

                const faces = [
                    0, 1, 2,
                    0, 2, 3
                ];

                const meshb = Engine.makeMeshBuilder(),
                      mesh = meshb.createMesh('room' + m + '_portal' + p, this.shdMgr.getVertexShader('TR_portal'), this.shdMgr.getFragmentShader('TR_portal'), undefined, vertices, faces, undefined, colors);

                mesh.materials.forEach((m) => (m.transparent = true, m.depthWrite = false));
                mesh.setPosition([0, 0, 0]);
                mesh.matrixAutoUpdate = false;
                mesh.visible = false;
                meshPortals.push(mesh);

                this.sceneRender.add(mesh);
            }

			// static meshes in the room
			for (let s = 0; s < room.staticMeshes.length; ++s) {
				const staticMesh = room.staticMeshes[s],
				      x = staticMesh.x, y = -staticMesh.y, z = -staticMesh.z, rot = ((staticMesh.rotation & 0xC000) >> 14) * 90,
				      objectID = staticMesh.objectID;

				const mflags = this.sceneData.objects['staticmesh' + objectID].flags,
				      nonCollisionable = (mflags & 1) != 0, visible = (mflags & 2) != 0;

				if (!visible) {
                    continue;
                }

                const q = glMatrix.quat.create();
                
				glMatrix.quat.setAxisAngle( q, [0,1,0], glMatrix.glMatrix.toRadian(-rot) );

                const obj = this.objMgr.createStaticMesh(objectID, m, this.convertIntensity(staticMesh.intensity1), true);
                
                if (obj != null) {
                    obj.visible = !data.isAlternateRoom;
                    obj.setPosition([x, y, z]);
                    obj.setQuaternion(q);
                    obj.matrixAutoUpdate = false;
                }
            }
            
			// sprites in the room
			for (let s = 0; s < rdata.sprites.length; ++s) {
                const sprite = rdata.sprites[s], 
                      spriteIndex = sprite.texture,
                      rvertex = rdata.vertices[sprite.vertex],
                      lighting = this.trlevel.rversion == 'TR1' ? rvertex.lighting1 : rvertex.lighting2;

                const obj = this.objMgr.createSprite(spriteIndex, m, this.convertLighting(lighting), true);

                if (obj != null) {
                    obj.visible = !data.isAlternateRoom;
                    obj.setPosition([rvertex.vertex.x + info.x, -rvertex.vertex.y, -rvertex.vertex.z - info.z]);
                    obj.matrixAutoUpdate = true;
                }
			}
        }
	}

}
