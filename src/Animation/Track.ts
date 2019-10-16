import { Box3, Vector3, Quaternion } from "../../threeJS/src/threejs/src/Three";

import Key from "./Key";

export default class Track {

    private static _counter: number = 0;

    private nextTrack: number;
    private nextTrackFrame: number;
    public remainingFrames: number;
    public numDataPerKey: number;
    private boundingBox: Box3;
    public keys: Array<Key>;
    private commands: Array<any>;

    public static createTrack(trackJSON: any): Track {
        const keys = trackJSON.keys;

        const track = new Track(trackJSON.numKeys, trackJSON.numFrames, trackJSON.frameRate, trackJSON.fps, trackJSON.name);

        track.setNextTrack(trackJSON.nextTrack, trackJSON.nextTrackFrame);
        track.setCommands(trackJSON.commands, trackJSON.frameStart);

        /*animTracks.push(track);*/

        for (let k = 0; k < keys.length; ++k) {
            const keyJSON = keys[k], dataJSON = keyJSON.data, bbox = keyJSON.boundingBox;

            const boundingBox = new Box3(new Vector3(bbox.xmin, bbox.ymin, bbox.zmin), new Vector3(bbox.xmax, bbox.ymax, bbox.zmax));

            const key = new Key(keyJSON.time, boundingBox);

            for (let d = 0; d < dataJSON.length; ++d) {
                const q = dataJSON[d].quaternion;

                key.addData(dataJSON[d].position, new Quaternion(q.x, q.y, q.z, q.w));
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

        if (typeof(id) == 'undefined') {
            this.id = 'track' + (++Track._counter);
        }

        this.keys = [];
        this.commands = [];
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
        this.commands = commands;
        (this.commands as any).frameStart = frameStart;
    }

}
