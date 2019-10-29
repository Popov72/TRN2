import { ICamera } from "../Proxy/ICamera";
import { IMaterial } from "../Proxy/IMaterial";
import { IMesh } from "../Proxy/IMesh";
import { IScene } from "../Proxy/IScene";
import { Position } from "../Proxy/INode";

import { AnimationManager } from "../Animation/AnimationManager";
import { BehaviourManager } from "../Behaviour/BehaviourManager";
import IGameData from "../Player/IGameData";
import { MaterialManager } from "./MaterialManager";
import { Skeleton } from "../Player/Skeleton";

export interface MeshList {
    [id: number]: IMesh | Array<IMesh>;
}

interface Meshes {
    [name: string]: MeshList;
}

export class ObjectManager {

    public objectList: Meshes;

    private count: number;
    private gameData: IGameData;
    private sceneRender: IScene;
    private sceneData: any;
    private bhvMgr: BehaviourManager;
    private matMgr: MaterialManager;
    private anmMgr: AnimationManager;
    private camera: ICamera;

    constructor() {
        this.objectList = <any>null;
        this.count = 0;
        this.sceneRender = <any>null;
        this.bhvMgr = <any>null;
        this.matMgr = <any>null;
        this.anmMgr = <any>null;
        this.gameData = <any>null;
        this.camera = <any>null;
    }

    public initialize(gameData: IGameData): void {
        this.gameData = gameData;
        this.sceneRender = gameData.sceneRender;
        this.sceneData = gameData.sceneData;
        this.matMgr = gameData.matMgr;
        this.bhvMgr = gameData.bhvMgr;
        this.anmMgr = gameData.anmMgr;
        this.camera = gameData.camera;

        this.buildLists();
    }

    public buildLists(): void {
        this.objectList = {
            "moveable":     {},
            "room":         {},
            "staticmesh":   {},
            "sprite":       {},
            "spriteseq":    {}
        };

        this.sceneRender.traverse((obj: IMesh) => {
            const data = this.sceneData.objects[obj.name];

            if (!data) { return; }

            const id: number = data.objectid,
                  type: string = data.type;

            let objs: MeshList = this.objectList[type];
            if (!objs) {
                objs = {};
                this.objectList[type] = objs;
            }

            if (type === 'room') {
                objs[id] = obj;
            } else {
                let objsForId = objs[id];
                if (!objsForId) {
                    objsForId = [];
                    objs[id] = objsForId;
                } else if (!Array.isArray(objsForId)) {
                    throw "Bug!!";
                }
                objsForId.push(obj);
            }
        });
    }

    public createSprite(spriteID: number, roomIndex: number, color: Array<number>, addToScene: boolean = true): IMesh | null {
        const data = this.sceneData.objects[spriteID < 0 ? 'spriteseq' + (-spriteID) : 'sprite' + spriteID];

        if (spriteID < 0) {
            spriteID = -spriteID;
        }

        if (!data || !data.liveObj) {
            return null;
        }

        let obj = (data.liveObj as IMesh).clone();

        // copy material
        const newMaterial: Array<IMaterial> = [];

        for (let m = 0; m < obj.materials.length; ++m) {
            const material = obj.materials[m];

            newMaterial[m] = material.clone();
            newMaterial[m].uniforms.lighting.value = color;
            newMaterial[m].uniforms.map.value = material.uniforms.map.value;
            newMaterial[m].uniforms.mapBump.value = material.uniforms.mapBump.value;

            newMaterial[m].uniformsUpdated();
        }

        obj.materials = newMaterial;
        obj.name = data.type + spriteID + '_room' + roomIndex + '_dyncreate_' + (this.count++);
        obj.visible = true;

        const newData = {
            "type"   	            : data.type,
            "roomIndex"             : roomIndex,
            "has_anims"				: false,
            "objectid"              : data.objectid,
            "visible"  				: true
        };

        this.sceneData.objects[obj.name] = newData;

        let lst = this.objectList[data.type][spriteID];
        if (!lst) {
            lst = [];
            this.objectList[data.type][spriteID] = lst;
        }

        (lst as Array<IMesh>).push(obj);

        this.matMgr.createLightUniformsForObject(obj, true);

        if (addToScene) {
            this.sceneRender.add(obj);
        }

        return obj;
    }

    public createStaticMesh(staticmeshID: number, roomIndex: number, color: Array<number>, addToScene: boolean = true): IMesh | null {
        const data = this.sceneData.objects['staticmesh' + staticmeshID];

        if (!data || !data.liveObj) {
            return null;
        }

        let obj = (data.liveObj as IMesh).clone();

        // copy material
        const newMaterial: Array<IMaterial> = [];

        for (let m = 0; m < obj.materials.length; ++m) {
            const material = obj.materials[m];

            newMaterial[m] = material.clone();
            newMaterial[m].uniforms.lighting.value = color;
            newMaterial[m].uniforms.map.value = material.uniforms.map.value;
            newMaterial[m].uniforms.mapBump.value = material.uniforms.mapBump.value;

            newMaterial[m].uniformsUpdated();
        }

        obj.materials = newMaterial;
        obj.name = 'staticmesh' + staticmeshID + '_room' + roomIndex + '_dyncreate_' + (this.count++);
        obj.visible = true;

        const newData = {
            "type"   	            : 'staticmesh',
            "roomIndex"             : roomIndex,
            "has_anims"				: false,
            "objectid"              : data.objectid,
            "visible"  				: true
        };

        this.sceneData.objects[obj.name] = newData;

        let lst = this.objectList[data.type][staticmeshID];
        if (!lst) {
            lst = [];
            this.objectList[data.type][staticmeshID] = lst;
        }

        (lst as Array<IMesh>).push(obj);

        this.matMgr.createLightUniformsForObject(obj, true);

        if (addToScene) {
            this.sceneRender.add(obj);
        }

        return obj;
    }

    public createMoveable(moveableID: number, roomIndex: number, extrnColor?: Array<number>, addToScene: boolean = true, setAnimation: boolean = true): IMesh | null {
        const data = this.sceneData.objects['moveable' + moveableID];

        if (!data || !data.liveObj) {
            return null;
        }

        let obj = (data.liveObj as IMesh).clone();

        // copy material
        const newMaterial: Array<IMaterial> = [];

        const skeleton = typeof(setAnimation) == 'boolean' ? new Skeleton(data.bonesStartingPos) : setAnimation;

        for (let m = 0; m < obj.materials.length; ++m) {
            const material = obj.materials[m];

            newMaterial[m] = material.clone();
            newMaterial[m].uniforms.map.value = material.uniforms.map.value;
            newMaterial[m].uniforms.mapBump.value = material.uniforms.mapBump.value;
            newMaterial[m].uniforms.boneMatrices = { "type": "m4v", "value": null };
            if (skeleton) {
                newMaterial[m].uniforms.boneMatrices.value = skeleton.boneMatrices;
            }

            if (extrnColor) {
                newMaterial[m].uniforms.ambientColor.value = extrnColor;
            }

            newMaterial[m].uniformsUpdated();
        }

        obj.materials = newMaterial;
        obj.name = 'moveable' + moveableID + '_room' + roomIndex + '_dyncreate_' + (this.count++);
        obj.visible = true;
        obj.matrixAutoUpdate = true;

        const newData: any = {
            "type"   	            : 'moveable',
            "roomIndex"             : roomIndex,
            "has_anims"				: data.has_anims && typeof(setAnimation) == 'boolean',
            "objectid"              : data.objectid,
            "visible"  				: true,
            "internallyLit"         : extrnColor != undefined,
            "skeleton"              : skeleton
        };

        this.sceneData.objects[obj.name] = newData;

        if (newData.has_anims) {
            newData.animationStartIndex = data.animationStartIndex;
            newData.numAnimations = data.numAnimations;
        }

        let lst = this.objectList['moveable'][moveableID];
        if (!lst) {
            lst = [];
            this.objectList['moveable'][moveableID] = lst;
        }

        (lst as Array<IMesh>).push(obj);

        this.matMgr.createLightUniformsForObject(obj, false);

        if (addToScene) {
            this.sceneRender.add(obj);
        }

        if (typeof(setAnimation) == 'boolean' && setAnimation && data.has_anims) {
            this.anmMgr.setAnimation(obj, 0, false);
        }

        return obj;
    }

    public removeObjectFromScene(obj: IMesh, removeBehaviours?: boolean) {
        if (removeBehaviours === undefined) {
            removeBehaviours = true;
        }

        if (removeBehaviours) {
            this.bhvMgr.removeBehaviours(obj);
        }

        this.sceneRender.remove(obj);
    }

    protected _collectObjectsWithAnimatedTextures(lst: MeshList): Array<IMesh> {
        const objs: Array<IMesh> = [];

        for (const objID in lst) {
            let lstObjs = lst[objID];

            if (!Array.isArray(lstObjs)) {
                lstObjs = [lstObjs];
            }

            for (let i = 0; i < lstObjs.length; ++i) {
                const obj = lstObjs[i],
                      materials = obj.materials;

                for (let m = 0; m < materials.length; ++m) {
                    const material = materials[m],
                          userData = material.userData;

                    if (!userData || !userData.animatedTexture) {
                        continue;
                    }

                    const animTexture = this.sceneData.animatedTextures[userData.animatedTexture.idxAnimatedTexture];

                    if (!animTexture.scrolltexture) {
                        objs.push(obj);
                        break;
                    }
                }
            }
        }

        return objs;
    }

    public collectObjectsWithAnimatedTextures(): Array<IMesh> {
        let objs = this._collectObjectsWithAnimatedTextures(this.objectList['room']);

        objs = objs.concat(this._collectObjectsWithAnimatedTextures(this.objectList['sprite']));

        objs = objs.concat(this._collectObjectsWithAnimatedTextures(this.objectList['spriteseq']));

        return objs;
    }

    public updateObjects(curTime: number): void {
        this.gameData.curRoom = -1;

        const camPos = this.camera.position;

        this.sceneRender.traverse((obj) => {
            const data = this.sceneData.objects[obj.name];

            if (!data) {
                return;
            }

            // Test camera room membership
            if (data.type == 'room') {
                if (obj.containsPoint(this.gameData.camera.position) && !data.isAlternateRoom) {
                //if (!data.isAlternateRoom && this.gameData.trlvl.isPointInRoom(this.gameData.camera.position, data.roomIndex)) {
                    this.gameData.curRoom = data.roomIndex;
                }
            }

            // Set the visibility for the object
            if (this.gameData.singleRoomMode) {
                obj.visible = data.roomIndex == this.gameData.curRoom && !data.isAlternateRoom;
            } else {
                obj.visible = data.visible;
            }

            // Update material uniforms
            const materials = obj.materials,
                  room = this.sceneData.objects['room' + data.roomIndex];

            if (room < 0) {
                return;
            }

            for (let i = 0; i < materials.length; ++i) {
                const material = materials[i];

                if (this.gameData.globalTintColor != null) {
                    material.uniforms.tintColor.value = this.gameData.globalTintColor;
                }

                material.uniforms.numSystemLight.value = this.gameData.sysLight.numLights;
                material.uniforms.curTime.value = curTime;
                material.uniforms.rnd.value = this.gameData.quantumRnd;
                material.uniforms.flickerColor.value = room && room.flickering ? this.gameData.flickerColor : this.gameData.unitVec3;
                material.uniforms.camPosition.value = camPos;

                material.uniformsUpdated(["tintColor", "numSystemLight", "curTime", "rnd", "flickerColor", "camPosition"]);
            }
        });
    }

    public getRoomByPos(pos: Position): number {
        const roomList = this.objectList['room'];
        for (const r in roomList) {
            const obj = roomList[r], data = this.sceneData.objects[(obj as IMesh).name];
            if (data.isAlternateRoom) {
                continue;
            }
            if (!Array.isArray(obj) && obj.containsPoint(pos)) {
                return parseInt(r);
            }
        }
        return -1;
    }

    public changeRoomMembership(obj: IMesh, oldRoomIndex: number, newRoomIndex: number): void {
        const data = this.sceneData.objects[obj.name];

        const dataCurRoom = this.sceneData.objects['room' + oldRoomIndex],
              curRoomLights = this.matMgr.useAdditionalLights ? dataCurRoom.lightsExt : dataCurRoom.lights,
              curLIdx = this.matMgr.getFirstDirectionalLight(curRoomLights);

        const dataNewRoom = this.sceneData.objects['room' + newRoomIndex],
              newRoomLights = this.matMgr.useAdditionalLights ? dataNewRoom.lightsExt : dataNewRoom.lights,
              newLIdx = this.matMgr.getFirstDirectionalLight(newRoomLights);

        data.roomIndex = newRoomIndex;

        this.matMgr.setUniformsFromRoom(obj, newRoomIndex);

        if (data.layer) {
            data.layer.setRoom(newRoomIndex);
        }

        if (curLIdx >= 0 && newLIdx >= 0) {
            const uniforms = [];
            for (let i = 0; i < obj.materials.length; ++i) {
                const material = obj.materials[i];
                uniforms.push({ a: material.uniforms.directionalLight_color.value, i: 0 });
            }
            this.bhvMgr.addBehaviour('FadeUniformColor',
                {
                    "colorStart":   curRoomLights[curLIdx].color,
                    "colorEnd":     newRoomLights[newLIdx].color,
                    "duration":     1.0,
                    "uniforms":     uniforms
                }
            );
        }
    }

}
