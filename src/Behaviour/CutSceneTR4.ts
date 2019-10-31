import { IMesh } from "../Proxy/IMesh";
import { IScene } from "../Proxy/IScene";

import IGameData from "../Player/IGameData";
import { ObjectManager } from "../Player/ObjectManager";
import { ConfigManager } from "../ConfigManager";
import Track from "../Animation/Track";
import Misc from "../Utils/Misc";
import { ObjectID } from "../Constants";
import CutSceneHelper from "./CutSceneHelper";
import { Quaternion } from "../Proxy/INode";
import { CutSceneData } from "./CutScene";

declare var glMatrix: any;

export default class CutSceneTR4 {

    private sceneData:  any;
    private objMgr:     ObjectManager;
    private scene:      IScene;
    private confMgr:    ConfigManager;
    private cutscene:   any;
    private helper:     CutSceneHelper;
    private lara:       IMesh;

    constructor(gameData: IGameData, cutscene: CutSceneData, helper: CutSceneHelper, lara: IMesh) {
        this.sceneData = gameData.sceneData;
        this.objMgr = gameData.objMgr;
        this.confMgr = gameData.confMgr;
        this.scene = gameData.sceneRender;
        this.cutscene = cutscene;
        this.helper = helper;
        this.lara = lara;
    }

    public makeTR4Cutscene(icutscene: number): Promise<any> {
        return fetch('/resources/level/tr4/TR4_cutscenes/cut' + icutscene + '.json').then((response) => {
            return response.json().then((data) => {
                const cutscene: Array<any> = [];

                cutscene.push(data);
                cutscene[0].index = icutscene;

                let soundPromise = Promise.resolve();

                // get the sound for this cut scene
                if (cutscene[0].info.audio) {
                    soundPromise = Misc.loadSoundAsync(this.sceneData.soundPath + cutscene[0].info.audio + '.aac').then((ret: any) => {
                        if (ret.code < 0) {
                            console.log('Error decoding sound data for cutscene.');
                        } else {
                            this.cutscene.sound = ret.sound;
                            this.cutscene.soundbuffer = ret.soundbuffer;
                        }
                    });
                }

                if (cutscene[0].index == 1) {
                    return fetch('/resources/level/tr4/TR4_cutscenes/cut' + (icutscene + 1) + '.json').then((response) => {
                        return response.json().then((data) => {
                            cutscene.push(data);
                            cutscene[1].index = icutscene + 1;

                            this.makeCutsceneData(cutscene);

                            return soundPromise;
                        });
                    });
                }

                this.makeCutsceneData(cutscene);

                return soundPromise;
            });
        });
    }

    protected makeCutsceneData(cutscenes: Array<any>): void {
        const ocs = this.cutscene,
              cutscene = cutscenes[0];

        ocs.position = [cutscene.originX, -cutscene.originY, -cutscene.originZ];
        ocs.quaternion = [0, 0, 0, 1];

        // hide moveables (except Lara) that are already in the level and that are referenced in the cutscene (we will create them later)
        const idInCutscenes: any = {};
        for (let ac = 0; ac < cutscene.actors.length; ++ac) {
            const id = cutscene.actors[ac].slotNumber;
            idInCutscenes[id] = true;
        }

        for (let objID in  this.sceneData.objects) {
            const objData = this.sceneData.objects[objID];
            if (objData.type == 'moveable' && objData.roomIndex != -1 && objData.objectid != ObjectID.Lara && objData.objectid in idInCutscenes) {
                objData.visible = false;
                (this.scene.getObjectByName(objID) as IMesh).visible = false;
            }
        }

        const laraRoomIndex = this.sceneData.objects[this.lara.name].roomIndex;

        // create moveable instances used in cutscene
        const actorMoveables = [];

        for (let ac = 0; ac < cutscene.actors.length; ++ac) {
            const id = cutscene.actors[ac].slotNumber;
            let mvb = this.lara;

            if (id != ObjectID.Lara) {
                mvb = this.objMgr.createMoveable(id, laraRoomIndex, undefined, true, false) as IMesh;
            }

            actorMoveables.push(mvb);

            mvb.setPosition(ocs.position);
            mvb.setQuaternion([0, 0, 0, 1]);
        }

        // create actor frames
        for (let ac = 0; ac < cutscene.actors.length; ++ac) {
            const actor = cutscene.actors[ac],
                  animation = this.makeAnimationForActor(cutscene, actor, "anim_cutscene_actor" + ac);

            this.sceneData.objects[actorMoveables[ac].name].animationStartIndex = this.sceneData.animTracks.length;

            const oanimation = Track.createTrack(animation);

            this.sceneData.animTracks.push(oanimation);

            if (cutscene.index == 1 && ac == 0) {
                // special case for cutscene #1: we add the animation for cutscene #2 as #1+#2 is really the same cutscene
                const animationCont = this.makeAnimationForActor(cutscenes[1], cutscenes[1].actors[ac], "anim_cutscene2_actor" + ac);

                oanimation.nextTrack = this.sceneData.animTracks.length;
                animationCont.nextTrack = this.sceneData.animTracks.length - 1;

                this.sceneData.animTracks.push(Track.createTrack(animationCont));
            }
        }

        // create camera frames
        let frames = this.makeAnimationForCamera(cutscene);

        if (cutscene.index == 1) {
            frames = frames.concat(this.makeAnimationForCamera(cutscenes[1]));
        }

        ocs.frames = frames;

        this.helper.prepareLevel(this.confMgr.trversion, this.confMgr.levelName as string, cutscene.index, actorMoveables);
    }

    protected makeAnimationForActor(cutscene: any, actor: any, animName: string) {

        function makeQuaternion(angleX: number, angleY: number, angleZ: number): Quaternion {

            angleX = 2 * Math.PI * (angleX % 1024) / 1024.0,
            angleY = 2 * Math.PI * (angleY % 1024) / 1024.0,
            angleZ = 2 * Math.PI * (angleZ % 1024) / 1024.0;

            const qx = glMatrix.quat.create(),
                  qy = glMatrix.quat.create(),
                  qz = glMatrix.quat.create();

            glMatrix.quat.setAxisAngle(qx, [1, 0, 0], angleX);
            glMatrix.quat.setAxisAngle(qy, [0, 1, 0], -angleY);
            glMatrix.quat.setAxisAngle(qz, [0, 0, 1], -angleZ);

            glMatrix.quat.mul(qy, qy, qx);
            glMatrix.quat.mul(qy, qy, qz);

            return qy;
        }

        const animation = {
            "fps": 30,
            "frameRate": 1,
            "keys": [],
            "name": animName,
            "nextTrack": this.sceneData.animTracks.length,
            "nextTrackFrame": 0,
            "numFrames": cutscene.numFrames,
            "numKeys": cutscene.numFrames,
            "frameStart": 0,
            "commands": []
        };

        const CST0 = 3;

        const prev = [];
        for (let m = 0; m < actor.meshes.length; ++m) {
            const mesh   = actor.meshes[m],
                  posHdr = mesh.positionHeader,
                  rotHdr = mesh.rotationHeader;

            prev.push({
                "position": {
                    x: posHdr ? posHdr.startPosX * CST0 : 0,
                    y: posHdr ? -posHdr.startPosY * CST0 : 0,
                    z: posHdr ? -posHdr.startPosZ * CST0 : 0
                },
                "rotation": {
                    x: rotHdr.startRotX % 1024,
                    y: rotHdr.startRotY % 1024,
                    z: rotHdr.startRotZ % 1024
                }
            });
        }

        let realNumFrames = 0;
        for (let d = 0; d < cutscene.numFrames; ++d) {
            const key: any = {
                "time": d,
                "data": [],
                "boundingBox": {
                    xmin: -1e7, ymin: -1e7, zmin: -1e7,
                    xmax:  1e7, ymax:  1e7, zmax:  1e7
                }
            };

            let addKey = true;

            for (let m = 0; m < actor.meshes.length; ++m) {
                const mesh = actor.meshes[m],
                      posData = mesh.positionData,
                      rotData = mesh.rotationData;

                if (rotData.length <= d) {
                    addKey = false;
                    break;
                }

                let transX = 0,
                    transY = 0,
                    transZ = 0;

                if (posData) {
                    transX =  posData.dx[d] * CST0;
                    transY = -posData.dy[d] * CST0;
                    transZ = -posData.dz[d] * CST0;
                }

                const cur: any = {
                    "position": {
                        x: transX + prev[m].position.x,
                        y: transY + prev[m].position.y,
                        z: transZ + prev[m].position.z
                    },
                    "rotation": {
                        x: (rotData.dx[d] + prev[m].rotation.x) % 1024,
                        y: (rotData.dy[d] + prev[m].rotation.y) % 1024,
                        z: (rotData.dz[d] + prev[m].rotation.z) % 1024
                    }
                };

                const quat = makeQuaternion(cur.rotation.x, cur.rotation.y, cur.rotation.z);

                key.data.push({
                    "position": 	{ x: cur.position.x, y: cur.position.y, z: cur.position.z },
                    "quaternion":	{ x: quat[0], y: quat[1], z: quat[2], w: quat[3] }
                });

                prev[m] = cur;
            }

            if (addKey) {
                realNumFrames = d;
                (animation.keys as Array<any>).push(key);
            }
        }

        animation.numFrames = realNumFrames;

        return animation;
    }

    protected makeAnimationForCamera(cutscene: any): Array<any> {
        // create camera frames
        const frames = [],
              ocam = cutscene.camera,
              CST = 2;

        let prev = {
            posX:       ocam.cameraHeader.startPosX * CST,    posY:       ocam.cameraHeader.startPosY * CST,    posZ:       ocam.cameraHeader.startPosZ * CST,
            targetX:    ocam.targetHeader.startPosX * CST,    targetY:    ocam.targetHeader.startPosY * CST,    targetZ:    ocam.targetHeader.startPosZ * CST
        };

        for (let d = 0; d < cutscene.numFrames; ++d) {
            if (ocam.cameraPositionData.dx.length <= d) {
                break;
            }
            const cur = {
                fov: 13000,
                roll: 0,

                posX: ocam.cameraPositionData.dx[d] * CST + prev.posX,
                posY: ocam.cameraPositionData.dy[d] * CST + prev.posY,
                posZ: ocam.cameraPositionData.dz[d] * CST + prev.posZ,

                targetX: ocam.targetPositionData.dx[d] * CST + prev.targetX,
                targetY: ocam.targetPositionData.dy[d] * CST + prev.targetY,
                targetZ: ocam.targetPositionData.dz[d] * CST + prev.targetZ
            };
            frames.push(cur);
            prev = cur;
        }

        return frames;
    }

}
