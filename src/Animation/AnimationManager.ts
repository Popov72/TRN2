import IGameData from "../Player/IGameData";
import { ObjectManager } from "../Player/ObjectManager";
import { MaterialManager } from "../Player/MaterialManager";
import Track from "../Animation/Track";
import TrackInstance from "../Animation/TrackInstance";
import { IMesh } from "../Proxy/IMesh";
import { Commands } from "./Commands";
import CommandDispatch, { CommandDispatchMode } from "./CommandDispatch";

export class AnimationManager {

    protected paused: boolean;
    protected gameData: IGameData;
    protected sceneData: any;
    protected matMgr: MaterialManager;
    protected objMgr: ObjectManager;
    protected _commandDispatch: CommandDispatch;

    constructor() {
        this.paused = false;
        this.gameData = <any>null;
        this.matMgr = <any>null;
        this.objMgr = <any>null;
        this._commandDispatch = <any>null;
    }

    public initialize(gameData: IGameData): void {
        this.gameData = gameData;
        this.sceneData = gameData.sceneData;
        this.matMgr = gameData.matMgr;
        this.objMgr = gameData.objMgr;

        this._commandDispatch = new CommandDispatch(gameData, gameData.confMgr.trversion);

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
                    const nextTrackFrame = data.trackInstance.track.nextTrackFrame;

                    if (!data.trackInstance.runForward(delta)) {
                        if (data.trackInstance.track.nextTrack == -1) {
                            continue;
                        }

                        // it's the end of the current track and we are in a cut scene (because animations that are not in a cutscene loop on themselves, and so .runFoward won't return false for them) => we link to the next track
                        let trackInstance = data.trackInstance as TrackInstance,
                            curTrackInstance = trackInstance;

                        trackInstance = data.allTrackInstances[trackInstance.track.nextTrack];
                        data.trackInstance = trackInstance;

                        if (trackInstance.track.nextTrack != -1) {
                            trackInstance.setNextTrackInstance(data.allTrackInstances[trackInstance.track.nextTrack], trackInstance.track.nextTrackFrame);
                        }
                        trackInstance.setCurrentFrame(nextTrackFrame + curTrackInstance.param.curFrame - curTrackInstance.track.numFrames);
                    }

                    if (data.trackInstance != data.prevTrackInstance) {
                        this.processAnimCommands(data.prevTrackInstance, data.prevTrackInstanceFrame, 1e10, obj);
                        this.processAnimCommands(data.trackInstance, nextTrackFrame, data.trackInstance.param.curFrame, obj);
                    } else {
                        const frm1 = data.prevTrackInstanceFrame,
                              frm2 = data.trackInstance.param.curFrame;

                        if (frm1 > frm2) {
                            // we have looped in the same animation
                            this.processAnimCommands(data.trackInstance, frm1, 1e10, obj);
                            this.processAnimCommands(data.trackInstance, nextTrackFrame, frm2, obj);
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

    // Undo animation commands that have been done up to the 'futureFrame' point in time
    public undoAnimCommands(futureFrame: number, objects: { [name: string]: IMesh }): void {
        this._commandDispatch.startUndoMode();

        for (let objID in objects) {
            const obj = objects[objID],
                  data = this.sceneData.objects[obj.name],
                  allTrackInstances = data.allTrackInstances as { [id: number] : TrackInstance };

            let trackInstance = data.trackInstance as TrackInstance;
            let frame = 0, nextTrackFrame = 0;

            while (frame < futureFrame) {
                if (frame - nextTrackFrame + trackInstance.track.numFrames >= futureFrame) {
                    this.processAnimCommands(trackInstance, nextTrackFrame, futureFrame - frame + nextTrackFrame, obj, CommandDispatchMode.UNDO);
                    break;
                }

                this.processAnimCommands(trackInstance, nextTrackFrame, trackInstance.track.numFrames, obj, CommandDispatchMode.UNDO);

                frame += trackInstance.track.numFrames;

                if (trackInstance.track.nextTrack == -1) {
                    break;
                }

                nextTrackFrame = trackInstance.track.nextTrackFrame;

                trackInstance = allTrackInstances[trackInstance.track.nextTrack];
            }
        }

        this._commandDispatch.endUndoMode();
    }

    // replay animations up to 'futureFrame' point in time
    public fastForward(futureFrame: number, objects: { [name: string]: IMesh }): void {
        for (let objID in objects) {
            const obj = objects[objID],
                  data = this.sceneData.objects[obj.name],
                  allTrackInstances = data.allTrackInstances as { [id: number] : TrackInstance };

            let trackInstance = data.trackInstance as TrackInstance;
            let frame = 0, nextTrackFrame = 0;

            while (frame < futureFrame) {
                if (frame - nextTrackFrame + trackInstance.track.numFrames >= futureFrame) {
                    trackInstance.setCurrentFrame(futureFrame - frame + nextTrackFrame);
                    this.processAnimCommands(trackInstance, nextTrackFrame, futureFrame - frame + nextTrackFrame, obj, CommandDispatchMode.FAST);
                    break;
                }

                this.processAnimCommands(trackInstance, nextTrackFrame, trackInstance.track.numFrames, obj, CommandDispatchMode.FAST);

                frame += trackInstance.track.numFrames;

                if (trackInstance.track.nextTrack == -1) {
                    break;
                }

                nextTrackFrame = trackInstance.track.nextTrackFrame;

                trackInstance = allTrackInstances[trackInstance.track.nextTrack];
                data.trackInstance = trackInstance;

                trackInstance.setCurrentFrame(nextTrackFrame);
                if (trackInstance.track.nextTrack != -1) {
                    trackInstance.setNextTrackInstance(allTrackInstances[trackInstance.track.nextTrack], trackInstance.track.nextTrackFrame);
                }

                trackInstance.noInterpolationToNextTrack = this.gameData.isCutscene;
            }

            data.prevTrackInstance = trackInstance;
            data.prevTrackInstanceFrame = data.trackInstance.param.curFrame;

            trackInstance.interpolate();

            const boundingBox = trackInstance.track.keys[trackInstance.param.curKey].boundingBox;

            obj.setBoundingBox(boundingBox);

            if (data.layer) {
                data.layer.update();
                data.layer.setBoundingObjects();
            }
        }
    }

    public processAnimCommands(trackInstance: TrackInstance, prevFrame: number, curFrame: number, obj: IMesh, mode: CommandDispatchMode = CommandDispatchMode.NORMAL): void {
        const commands = trackInstance.track.commands;

        for (let i = 0; i < commands.length; ++i) {
            const command = commands[i];

            switch (command.cmd) {

                case Commands.ANIMCMD_MISCACTIONONFRAME: {

                    const frame = command.params[0] - trackInstance.track.commandsFrameStart, action = command.params[1], customParam = command.params[2];
                    if (frame < prevFrame || frame >= curFrame) { continue; }

                    //console.log(action,'done for frame',frame,obj.name)

                    this._commandDispatch.dispatch(action, customParam, obj, mode, trackInstance);

                    break;
                }
            }
        }
    }
}