import { Box3 } from "../Utils/Box3";

import Key from "./Key";

export default class Track {

    private static _counter: number = 0;

    public keys: Array<Key>;
    public remainingFrames: number;
    public numDataPerKey: number;
    public commandsFrameStart: number;
    public nextTrack: number;
    public nextTrackFrame: number;

    private boundingBox: Box3;
    private _commands: Array<any>;

    public static createTrack(trackJSON: any): Track {
        const keys = trackJSON.keys;

        const track = new Track(trackJSON.numKeys, trackJSON.numFrames, trackJSON.frameRate, trackJSON.fps, trackJSON.name);

        track.setNextTrack(trackJSON.nextTrack, trackJSON.nextTrackFrame);
        track.setCommands(trackJSON.commands, trackJSON.frameStart);

        for (let k = 0; k < keys.length; ++k) {
            const keyJSON = keys[k], dataJSON = keyJSON.data, bbox = keyJSON.boundingBox;

            const boundingBox = new Box3([bbox.xmin, bbox.ymin, bbox.zmin], [bbox.xmax, bbox.ymax, bbox.zmax]);

            const key = new Key(keyJSON.time, boundingBox);

            for (let d = 0; d < dataJSON.length; ++d) {
                key.addData(
                    [dataJSON[d].position.x, dataJSON[d].position.y, dataJSON[d].position.z], 
                    [dataJSON[d].quaternion.x, dataJSON[d].quaternion.y, dataJSON[d].quaternion.z, dataJSON[d].quaternion.w]
                );
            }

            track.addKey(key);
        }

        return track;
    }

    constructor(public numKeys: number, public numFrames: number, public frameRate: number, public animFPS: number, public id?: string) {
        
        this.nextTrack = 0;
        this.nextTrackFrame = 0;
        this.remainingFrames = numFrames - Math.floor((numFrames - 1) / frameRate) * frameRate;
        this.numDataPerKey = 99999;
        this.boundingBox = new Box3();
        this.commandsFrameStart = 0;

        if (typeof(id) == 'undefined') {
            this.id = 'track' + (++Track._counter);
        }

        this.keys = [];
        this._commands = [];
    }

    get commands(): Array<any> {
        return this._commands;
    }
    
    public addKey(key: Key): void {
        this.keys.push(key);

        this.numDataPerKey = Math.min(this.numDataPerKey, key.data.length);

        this.boundingBox.union(key.boundingBox);
    }

    public getLength(): number {
        return this.numFrames / this.animFPS;
    }

    public setNextTrack(track: number, frame: number): void {
        this.nextTrack = track;
        this.nextTrackFrame = frame;
    }

    public setCommands(commands: Array<any>, frameStart: number): void {
        this._commands = commands;
        this.commandsFrameStart = frameStart;
    }

}
