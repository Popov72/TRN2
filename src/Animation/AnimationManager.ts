import IGameData from "../Player/IGameData";
import { ObjectManager } from "../Player/ObjectManager";
import { MaterialManager } from "../Player/MaterialManager";
import Track from "../Animation/Track";
import TrackInstance from "../Animation/TrackInstance";
import { IMesh } from "../Proxy/IMesh";
import { Commands } from "./Commands";
import { ObjectID } from "../Constants";
import { Ponytail } from "../Behaviour/Ponytail";
import { LAYER } from "../Player/Layer";
import { MASK } from "../Player/Skeleton";

export class AnimationManager {

    protected paused: boolean;
    protected gameData: IGameData;
    protected sceneData: any;
    protected matMgr: MaterialManager;
    protected objMgr: ObjectManager;
    protected trversion: string;

    constructor() {
        this.paused = false;
        this.gameData = <any>null;
        this.matMgr = <any>null;
        this.objMgr = <any>null;
        this.trversion = <any>null;
    }

    public initialize(gameData: IGameData): void {
        this.gameData = gameData;
        this.sceneData = gameData.sceneData;
        this.matMgr = gameData.matMgr;
        this.objMgr = gameData.objMgr;
        this.trversion = gameData.confMgr.trversion;

        this.makeTracks();
    }

    public pause(pause: boolean): void {
        this.paused = pause;
    }

    public makeTracks(): void {
        const animTracks = [];

        // create one track per animation
        for (let t = 0; t < this.sceneData.animTracks.length; ++t) {
            const track = Track.createTrack(this.sceneData.animTracks[t]);

            animTracks.push(track);
        }

        this.sceneData.animTracks = animTracks;
    }

    public setAnimation(obj: IMesh, animIndex: number, desynchro: boolean = false): TrackInstance | null {
        const data = this.sceneData.objects[obj.name],
              track = this.sceneData.animTracks[animIndex + data.animationStartIndex],
              trackInstance = track ? new TrackInstance(track, data.skeleton) : null;

        if (trackInstance) {
            trackInstance.setNextTrackInstance(trackInstance, track.nextTrackFrame);

            trackInstance.runForward(desynchro ? Math.random() * track.getLength() : 0);
            trackInstance.interpolate();

            data.trackInstance = trackInstance;
            data.prevTrackInstance = data.trackInstance;
            data.prevTrackInstanceFrame = 0;
        }

        return trackInstance;
    }

    public animateObjects(delta: number): void {
        if (this.paused) {
            return;
        }

        const animatables = this.objMgr.objectList['moveable'];

        for (const objID in animatables) {
            const lstObj = animatables[objID] as Array<IMesh>;

            for (let i = 0; i < lstObj.length; ++i) {
                const obj = lstObj[i],
                      data = this.sceneData.objects[obj.name];

                if (data.has_anims && data.trackInstance && (obj.visible || this.gameData.isCutscene)) {
                    if (!data.trackInstance.runForward(delta)) {
                        // it's the end of the current track and we are in a cut scene => we link to the next track
                        let trackInstance = data.trackInstance;

                        const nextTrackFrame = trackInstance.track.nextTrackFrame + trackInstance.param.curFrame - trackInstance.track.numFrames; //trackInstance.param.interpFactor;

                        trackInstance = data.allTrackInstances[trackInstance.track.nextTrack];
                        data.trackInstance = trackInstance;

                        trackInstance.setNextTrackInstance(data.allTrackInstances[trackInstance.track.nextTrack], trackInstance.track.nextTrackFrame);
                        trackInstance.setCurrentFrame(nextTrackFrame);

                        trackInstance.setNoInterpolationToNextTrack = this.gameData.isCutscene;
                    }

                    if (data.trackInstance != data.prevTrackInstance) {
                        this.processAnimCommands(data.prevTrackInstance, data.prevTrackInstanceFrame, 1e10, obj);
                        this.processAnimCommands(data.trackInstance, 0, data.trackInstance.param.curFrame, obj);
                    } else {
                        const frm1 = data.prevTrackInstanceFrame,
                              frm2 = data.trackInstance.param.curFrame;

                        if (frm1 > frm2) {
                            // we have looped in the same animation
                            this.processAnimCommands(data.trackInstance, frm1, 1e10, obj);
                            this.processAnimCommands(data.trackInstance, 0, frm2, obj);
                        } else {
                            this.processAnimCommands(data.trackInstance, frm1, frm2, obj);
                        }
                    }

                    data.visible = obj.visible;

                    data.prevTrackInstance = data.trackInstance;
                    data.prevTrackInstanceFrame = data.trackInstance.param.curFrame;

                    data.trackInstance.interpolate();

                    const boundingBox = data.trackInstance.track.keys[data.trackInstance.param.curKey].boundingBox;

                    obj.setBoundingBox(boundingBox);

                    if (data.layer) {
                        data.layer.update();
                        data.layer.setBoundingObjects();
                    }
                }
            }
        }
    }

    public processAnimCommands(trackInstance: TrackInstance, prevFrame: number, curFrame: number, obj: IMesh): void {
        const commands = trackInstance.track.commands;

        for (let i = 0; i < commands.length; ++i) {
            const command = commands[i];

            switch (command.cmd) {

                case Commands.ANIMCMD_MISCACTIONONFRAME: {

                    const frame = command.params[0] - trackInstance.track.commandsFrameStart, action = command.params[1];
                    if (frame < prevFrame || frame >= curFrame) { continue; }

                    //console.log(action,'done for frame',frame,obj.name)

                    switch (action) {

                        case Commands.Misc.ANIMCMD_MISC_COLORFLASH: {
                            this.gameData.globalTintColor[0] = this.gameData.globalTintColor[1] = this.gameData.globalTintColor[2] = (this.gameData.globalTintColor[0] < 0.5 ? 1.0 : 0.1);
                            break;
                        }

                        case Commands.Misc.ANIMCMD_MISC_GETLEFTGUN: {
                            const layer = this.sceneData.objects[obj.name].layer;

                            if (this.trversion == 'TR4') {
                                layer.updateMask(LAYER.HOLSTER_EMPTY, MASK.LEG_L1);
                                layer.updateMask(LAYER.HOLSTER_FULL,  MASK.LEG_L1);
                                layer.updateMask(LAYER.WEAPON,        MASK.ARM_L3);

                            } else {
                                layer.updateMask(LAYER.WEAPON, MASK.LEG_L1 | MASK.ARM_L3);
                                layer.updateMask(LAYER.MAIN,   MASK.LEG_L1 | MASK.ARM_L3);
                            }

                            layer.setRoom(this.gameData.sceneData.objects[obj.name].roomIndex);

                            break;
                        }

                        case Commands.Misc.ANIMCMD_MISC_GETRIGHTGUN: {
                            const layer = this.sceneData.objects[obj.name].layer;

                            if (this.trversion == 'TR4') {
                                layer.updateMask(LAYER.HOLSTER_EMPTY, MASK.LEG_R1);
                                layer.updateMask(LAYER.HOLSTER_FULL,  MASK.LEG_R1);
                                layer.updateMask(LAYER.WEAPON,        MASK.ARM_R3);
                            } else {
                                layer.updateMask(LAYER.WEAPON, MASK.LEG_R1 | MASK.ARM_R3);
                                layer.updateMask(LAYER.MAIN,   MASK.LEG_R1 | MASK.ARM_R3);
                            }

                            layer.setRoom(this.gameData.sceneData.objects[obj.name].roomIndex);

                            break;
                        }

                        case Commands.Misc.ANIMCMD_MISC_MESHSWAP1:
                        case Commands.Misc.ANIMCMD_MISC_MESHSWAP2:
                        case Commands.Misc.ANIMCMD_MISC_MESHSWAP3: {
                            const idx = action - Commands.Misc.ANIMCMD_MISC_MESHSWAP1 + 1;

                            const oswap = this.objMgr.objectList['moveable'][ObjectID['meshswap' + idx]];

                            if (oswap && Array.isArray(oswap)) {
                                const layer = this.sceneData.objects[obj.name].layer;

                                if (layer.isEmpty(LAYER.MESHSWAP) || layer.getMesh(LAYER.MESHSWAP) != oswap[0]) {
                                    layer.setMesh(LAYER.MESHSWAP, oswap[0], 0);
                                }

                                layer.updateMask(LAYER.MESHSWAP,  MASK.ALL);
                                layer.updateMask(LAYER.MAIN,      MASK.ALL);

                                layer.setRoom(this.gameData.sceneData.objects[obj.name].roomIndex);
                            } else {
                                console.log('Could not apply anim command meshswap (' , action, '): object meshswap' + idx + ' not found.');
                            }

                            break;
                        }

                        case Commands.Misc.ANIMCMD_MISC_HIDEOBJECT: {
                            obj.visible = false;
                            break;
                        }

                        case Commands.Misc.ANIMCMD_MISC_SHOWOBJECT: {
                            obj.visible = true;
                            break;
                        }

                        case Commands.Misc.ANIMCMD_MISC_RESETHAIR: {
                            const ponytail = this.gameData.bhvMgr.getBehaviour("Ponytail") as Array<Ponytail>;

                            if (ponytail && ponytail.length > 0) {
                                ponytail[0].reset();
                            }
                            break;
                        }

                        case Commands.Misc.ANIMCMD_MISC_CUSTOMFUNCTION: {
                            command.params[2]();
                            break;
                        }
                    }

                    break;
                }
            }
        }
    }
}