import { ICamera } from "../Proxy/ICamera";
import { IMesh } from "../Proxy/IMesh";
import { Position, Quaternion } from "../Proxy/INode";
import IGameData from "../Player/IGameData";
import { Behaviour, BehaviourRetCode } from "./Behaviour";
import { BehaviourManager } from "./BehaviourManager";
import { ObjectManager } from "../Player/ObjectManager";
import { ConfigManager } from "../ConfigManager";
import { AnimationManager } from "../Animation/AnimationManager";
import { ObjectID, baseFrameRate } from "../Constants";
import { MaterialManager } from "../Player/MaterialManager";
import { TRLevel } from "../Player/TRLevel";
import Browser from "../Utils/Browser";
import Misc from "../Utils/Misc";
import TrackInstance from "../Animation/TrackInstance";
import { BasicControl } from "./BasicControl";
import { Lara } from "./Lara";
import CutSceneHelper from "./CutSceneHelper";
import CutSceneTR4 from "./CutSceneTR4";
import CutSceneControl from "./CutSceneControl";

declare var glMatrix: any;

export interface CutSceneData {
    "index"         : number;
    "curFrame"      : number;
    "frames"        : any;
    "position"      : Position;
    "quaternion"    : Quaternion;
    "sound"         : any;
    "soundbuffer"   : any;
    "gainNode"      : any;
}

export class CutScene extends Behaviour {

    public name: string = CutScene.name;

    private sceneData: any;
    private confMgr: ConfigManager;
    private anmMgr: AnimationManager;
    private objMgr: ObjectManager;
    private bhvMgr: BehaviourManager;
    private matMgr: MaterialManager;
    private trlvl: TRLevel;
    private camera: ICamera;
    private cutscene: CutSceneData;
    private cutSceneEnded: boolean;
    private objects: { [name: string]: IMesh };
    private bhvCtrl: BasicControl;
    private helper: CutSceneHelper;
    private lara: IMesh;
    private control: CutSceneControl;
    private soundStarted: boolean;
    private _volume: number;
    private _volumeSaved: number;
    private _muted: boolean;

    constructor(nbhv: any, gameData: IGameData, objectid?: number, objecttype?: string) {
        super(nbhv, gameData, objectid, objecttype);

        this.sceneData = gameData.sceneData;
        this.bhvMgr = gameData.bhvMgr;
        this.confMgr = gameData.confMgr;
        this.anmMgr = gameData.anmMgr;
        this.objMgr = gameData.objMgr;
        this.matMgr = gameData.matMgr;
        this.trlvl = gameData.trlvl;
        this.sceneData = gameData.sceneData;
        this.camera = gameData.camera;
        this.cutscene = this.sceneData.cutScene;
        this.cutSceneEnded = false;
        this.objects = {};
        this.bhvCtrl = <any>null;
        this.helper = <any>null;
        this.lara = <any>null;
        this.soundStarted = false;
        this._volume = this._volumeSaved = 0;
        this._muted = false;

        this.cutscene = {
            "index"         : 0,
            "curFrame"      : 0,
            "frames"        : null,
            "position"      : [0, 0, 0],
            "quaternion"    : [0, 0, 0, 0],
            "sound"         : null,
            "soundbuffer"   : null,
            "gainNode"      : null,
        };

        this.control = new CutSceneControl(this, gameData);
    }

    public init(lstObjs: Array<IMesh | ICamera> | null): [BehaviourRetCode, Array<Promise<void>> | null] {
        const useAddLights = this.nbhv.useadditionallights === 'true' || this.nbhv.useadditionallights === true,
              index = this.nbhv.index || 0,
              promises: Array<Promise<void>> = [];

        this.matMgr.useAdditionalLights = useAddLights;

        this.cutscene.index = index;

        // set cutscene origin
        this.lara = (this.bhvMgr.getBehaviour("Lara") as Array<Lara>)[0].getObject(); //(this.objMgr.objectList['moveable'][ObjectID.Lara] as Array<IMesh>)[0];

        this.helper = new CutSceneHelper(this.gameData, this.lara);

        this.cutscene.frames = this.trlvl.trlevel.cinematicFrames;
        this.cutscene.position = this.lara.position;

        let laraQuat = this.lara.quaternion,
            laraAngle = this.confMgr.float('behaviour[name="Lara"] > angle');

        if (laraAngle != -Infinity) {
            const q = glMatrix.quat.create();
            glMatrix.quat.setAxisAngle(q, [0, 1, 0], glMatrix.glMatrix.toRadian(laraAngle));
            laraQuat = q;
        }

        this.cutscene.quaternion = laraQuat;

        // update position/quaternion for some specific items when we play a cut scene
        const min = this.confMgr.number('cutscene > animminid', true, -1),
              max = this.confMgr.number('cutscene > animmaxid', true, -1),
              ids: string = this.confMgr.param('cutscene > animids', true),
              oids = new Set().add(ObjectID.Lara),
              moveables = this.objMgr.objectList['moveable'];

        if (ids) {
            ids.split(",").forEach((id) => oids.add(parseInt(id)));
        }
        for (let objID in moveables) {
            const lstObj = moveables[objID] as Array<IMesh>;

            lstObj.forEach((obj) => {
                const data = this.sceneData.objects[obj.name];

                if (data.objectid >= min && data.objectid <= max || oids.has(data.objectid)) {
                    obj.setPosition(this.cutscene.position);
                    obj.setQuaternion(this.cutscene.quaternion);
                    if (data.layer) {
                        data.layer.update();
                    }
                }
            });
        }

        if (index > 0) {
            const tr4Promise = new CutSceneTR4(this.gameData, this.cutscene, this.helper, this.lara).makeTR4Cutscene(parseInt(index));
            promises.push(tr4Promise.then(() => {
                this.makeObjectList();
                this.registerAnimations();
                this.control.init();
            }));
        } else {
            promises.push(...this.helper.prepareLevel(this.confMgr.trversion, this.confMgr.levelName as string, 0, []));
            promises.push(
                Misc.loadSoundAsync(this.sceneData.soundPath + this.sceneData.levelShortFileNameNoExt.toUpperCase()).then((ret: any) => {
                    if (ret.code < 0) {
                        console.log('Error decoding sound data for cutscene.');
                    } else {
                        this.cutscene.sound = ret.sound;
                        this.cutscene.soundbuffer = ret.soundbuffer;
                    }
                })
            );

            this.makeObjectList();
            this.registerAnimations();
            this.control.init();
        }

        return [BehaviourRetCode.keepBehaviour, promises];
    }

    protected makeObjectList(): void {
        const moveables = this.objMgr.objectList['moveable'];

        this.objects = {};
        for (let objID in moveables) {
            const lstObj = moveables[objID] as Array<IMesh>;
            for (let i = 0; i < lstObj.length; ++i) {
                const obj = lstObj[i],
                      data = this.sceneData.objects[obj.name];

                if (data.dummy || !data.has_anims || !data.visible) { continue; }

                this.objects[obj.name] = obj;
            }
        }
    }

    // register all animations we will need in the cut scene
    protected registerAnimations(): void {
        for (let objID in this.objects) {
            const obj = this.objects[objID],
                  data = this.sceneData.objects[obj.name],
                  registered: any = {},
                  allTrackInstances: any = {};

            let anmIndex = data.animationStartIndex;

            while (true) {
                if (registered[anmIndex]) { break; }

                registered[anmIndex] = true;

                const track = this.sceneData.animTracks[anmIndex],
                      trackInstance = new TrackInstance(track, data.skeleton);

                allTrackInstances[anmIndex] = trackInstance;

                anmIndex = track.nextTrack;
            }

            data.allTrackInstances = allTrackInstances;

            const trackInstance = allTrackInstances[data.animationStartIndex];

            trackInstance.setNextTrackInstance(data.allTrackInstances[trackInstance.track.nextTrack], trackInstance.track.nextTrackFrame);
            trackInstance.setNoInterpolationToNextTrack = true;

            trackInstance.runForward(0);
            trackInstance.interpolate();

            data.trackInstance = trackInstance;

            data.prevTrackInstance = data.trackInstance;
            data.prevTrackInstanceFrame = 0;
        }
    }

    get volume(): number {
        return this._volume;
    }

    set volume(v: number) {
        this._volume = v;
        if (this.cutscene.gainNode) {
            this.cutscene.gainNode.gain.value = v;
        }
    }

    get muted(): boolean {
        return this._muted;
    }

    set muted(m: boolean) {
        if (m && this._muted || !m && !this._muted) {
            return;
        }

        if (m) {
            this._muted = true;
            this._volumeSaved = this._volume;
            this.volume = 0;
        } else {
            this._muted = false;
            this.volume = this._volumeSaved;
        }
    }

    get duration(): number {
        return this.cutscene.frames.length * 1 / baseFrameRate;
    }

    get currentTime(): number {
        return this.cutscene.curFrame * 1 / baseFrameRate;
    }

    public showController(): void {
        this.control.bindEvents();
    }

    public stopSound(): void {
        if (this.cutscene.sound) {
            this.cutscene.sound.stop();
        }
    }

    public startSound(time: number): void {
        if (this.cutscene.sound) {
            this.cutscene.sound.stop();
            this.cutscene.sound = Browser.AudioContext.createBufferSource();
            this.cutscene.sound.buffer = this.cutscene.soundbuffer;
            this.cutscene.sound.connect(this.cutscene.gainNode);
            this.cutscene.sound.start(0, time);
        }
    }

    public onBeforeRenderLoop(): void {
        this.gameData.panel.hide();

        this.bhvCtrl = (this.bhvMgr.getBehaviour("BasicControl") as Array<Behaviour>)[0] as BasicControl;
    }

    public onFrameStarted(curTime: number, delta: number): void {
        if (this.cutSceneEnded) {
            return;
        }

        if (!this.soundStarted && this.cutscene.sound != null && !this.gameData.singleFrame) {
            this.soundStarted = true;
            this.cutscene.gainNode = Browser.AudioContext.createGain();
            this.volume = this.volume;
            this.cutscene.gainNode.connect(Browser.AudioContext.destination);
            this.cutscene.sound.connect(this.cutscene.gainNode);
            this.cutscene.sound.start();
        }

        this.cutscene.curFrame += baseFrameRate * delta;

        this.control.updateTime(this.cutscene.curFrame * 1 / baseFrameRate);

        // Update camera
        const t = this.cutscene.curFrame - Math.floor(this.cutscene.curFrame),
              cfrmA = Math.min(Math.floor(this.cutscene.curFrame), this.cutscene.frames.length - 2),
              cfrmB = Math.min(cfrmA + 1, this.cutscene.frames.length - 1);

        if (cfrmA < this.cutscene.frames.length - 2) {
            if (!this.bhvCtrl.captureMouse) {
                const frm1 = this.cutscene.frames[cfrmA],
                      frm2 = this.cutscene.frames[cfrmB],
                      maxDelta = 512.0 * 512.0,
                      fovMult = 60.0 / 16384.0,
                      rollMult = -90.0 / 16384.0;

                const eyePos:   Position = [frm1.posX, -frm1.posY, -frm1.posZ],
                      eyePos2:  Position = [frm2.posX, -frm2.posY, -frm2.posZ],
                      lkat:     Position = [frm1.targetX, -frm1.targetY, -frm1.targetZ],
                      lkat2:    Position = [frm2.targetX, -frm2.targetY, -frm2.targetZ];

                const odp = [0, 0, 0],
                      odt = [0, 0, 0];

                glMatrix.vec3.sub(odp, eyePos, eyePos2);
                glMatrix.vec3.sub(odt, lkat, lkat2);

                const dp = glMatrix.vec3.squaredLength(odp),
                      dt = glMatrix.vec3.squaredLength(odt);

                let fov = frm1.fov * fovMult,
                    roll = frm1.roll * rollMult;

                if (dp <= maxDelta && dt <= maxDelta) {
                    glMatrix.vec3.lerp(eyePos, eyePos, eyePos2, t);
                    glMatrix.vec3.lerp(lkat, lkat, lkat2, t);
                    fov = Misc.lerp(frm1.fov * fovMult, frm2.fov * fovMult, t);
                    roll = Misc.lerp(frm1.roll * rollMult, frm2.roll * rollMult, t);
                }

                const q = this.cutscene.quaternion.slice();

                glMatrix.vec3.transformQuat(lkat, lkat, q);
                glMatrix.vec3.transformQuat(eyePos, eyePos, q);

                this.camera.fov = fov;
                this.camera.setPosition(eyePos);
                this.camera.lookAt(lkat);
                this.camera.setPosition([this.camera.position[0] + this.cutscene.position[0], this.camera.position[1] + this.cutscene.position[1], this.camera.position[2] + this.cutscene.position[2]]);

                const qcam = this.camera.quaternion;

                glMatrix.quat.setAxisAngle(q, [0, 1, 0], glMatrix.glMatrix.toRadian(roll));
                glMatrix.quat.mul(qcam, q, qcam);

                this.camera.setQuaternion(qcam);
                this.camera.updateProjectionMatrix();
            }

        } else {
            this.cutSceneEnded = true;
            this.anmMgr.pause(true);
            this.control.finished();
        }
    }

    public onFrameEnded(curTime: number, delta: number): void {
        // Update object lights (only in TR4 cutscenes)
        if (this.cutscene.index <= 0) {
            return;
        }

        for (let objID in this.objects) {
            const obj = this.objects[objID],
                  data = this.sceneData.objects[obj.name];

            const pos = obj.position;

            pos[0] += data.skeleton.bones[0].position[0];
            pos[1] += data.skeleton.bones[0].position[1];
            pos[2] += data.skeleton.bones[0].position[2];

            const roomObj = this.objMgr.getRoomByPos(pos);

            if (roomObj >= 0 && roomObj != data.roomIndex) {
                this.objMgr.changeRoomMembership(obj, data.roomIndex, roomObj);
            }
        }
    }
}

BehaviourManager.registerFactory(CutScene);
