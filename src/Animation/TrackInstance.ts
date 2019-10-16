import { Quaternion } from "../../threeJS/src/threejs/src/Three";

import Skeleton from "../Player/Skeleton";

import Track from "./Track";

export default class TrackInstance {

    private track: Track;
    private skeleton: Skeleton;
    private overallSpeed: number;
    private activateInterpolation: boolean;
    private nextTrackInstance: TrackInstance;
    private nextTrackInstanceFrame: number;
    private noInterpolationToNextTrack: boolean;
    private noInterpolationToNextTrackValue: number;
    private interpolatedData: any;
    private param: any;
    private paramSave: any;

    constructor(track: Track, skeleton: Skeleton) {

        this.track = track;
        this.skeleton = skeleton;

        this.overallSpeed = 1.0;
        this.activateInterpolation = true;

        this.nextTrackInstance = null;
        this.nextTrackInstanceFrame = 0;

        this.noInterpolationToNextTrack = false;
        this.noInterpolationToNextTrackValue = 0.0;

        this.interpolatedData = null;

        this.param = {
            curKey : 0,
            curFrame : 0.0,
            interpFactor : 0.0,
            nextKeyIsInCurrentTrack : true
        };

        this.pushState();
    }

    private pushState(): void {
        this.paramSave = jQuery.extend(true, {}, this.param);
    }

    private popState(): void {
        this.param = jQuery.extend(true, {}, this.paramSave);
    }

    public setNextTrackInstance(trackInstance: TrackInstance, frame: number): void {
        if (frame >= trackInstance.track.numFrames) {
            frame = 0;
        }

        this.nextTrackInstance = trackInstance;
        this.nextTrackInstanceFrame = frame;
    }

    private makeCache(): void {
        this.interpolatedData = [];
        for (let numData = 0; numData < this.track.numDataPerKey; ++numData) {
            this.interpolatedData.push({
                position : { x:0, y:0, z:0 },
                quaternion : new Quaternion()
            });
        }
    }

    public runForward(elapsedTime: number): boolean {
        this.param.curFrame += (elapsedTime * this.track.animFPS) * this.overallSpeed;

        return this.setCurrentFrame(this.param.curFrame);
    }

    public setCurrentFrame(frame: number): boolean {
        this.param.curFrame = frame;

        // Have we reached the end of the animation ?
        if (this.param.curFrame >= this.track.numFrames) {

            // Yes. Is the next animation not the current one ?
            if (this.nextTrackInstance.track.id != this.track.id) {

                // Yes. The caller must handle this situation
                const curKey = this.param.curFrame / this.track.frameRate;

                this.param.interpFactor = this.activateInterpolation ? curKey - Math.floor(curKey) : 0.0;
                this.noInterpolationToNextTrack = false;

                return false;
            }

            // The next animation is the current one (looping). Reset internal variables
            this.param.curFrame -= this.track.numFrames;
            this.param.curFrame += this.nextTrackInstanceFrame;
            
            // The next test should always fail, but if the frame rate is *very* bad
            // (elapsedTime is huge), it could succeed
            if (this.param.curFrame >= this.track.numFrames) this.param.curFrame = this.track.numFrames - 1;

            this.noInterpolationToNextTrack = false;
        }

        // Calculate the current key
        const curKey = this.param.curFrame / this.track.frameRate;

        this.param.curKey = Math.floor(curKey);

        // Use the next key for the interpolation. Handle the case where the
        // next key is in the next animation and not in the current one
        const nextFrame = Math.floor((this.param.curKey + 1) * this.track.frameRate);
        let speedFactor = 1.0;

        if (nextFrame < this.track.numFrames) {
            // The key to use for the interpolation is the next one in the current animation
            this.param.nextKeyIsInCurrentTrack = true;
        } else {
            // The next key is in the next animation
            this.param.nextKeyIsInCurrentTrack = false;

            // speedFactor is used to correctly interpolate the last key of the animation with
            // the first one of the next animation. Indeed, interpolation would fail if the number
            // of frames after the last key of the current animation is not equal to the animation
            // frameRate (which is possible)
            speedFactor = this.track.frameRate / this.track.remainingFrames;
        }

        this.param.interpFactor = this.activateInterpolation ? (curKey - this.param.curKey) * speedFactor : 0.0;

        if (!this.param.nextKeyIsInCurrentTrack && this.noInterpolationToNextTrack) {
            this.param.interpFactor = this.noInterpolationToNextTrackValue;
        }

        return true;
    }

    public interpolate(buffer: any, detectRecursInfinite: boolean): void {
        this._interpolate(buffer, detectRecursInfinite);
        this.skeleton.updateBoneMatrices();
    }

    private _interpolate(buffer: any, detectRecursInfinite: boolean): void {
        if (!this.interpolatedData) {
            this.makeCache();
        }

        const curKey = this.param.curKey;
        let internalBuffer = buffer == null;

        if (internalBuffer) {
            buffer = this.skeleton.bones;
        }

        if (this.param.nextKeyIsInCurrentTrack || this.track.numKeys == 1 || detectRecursInfinite) {
            let nextKey = curKey + 1;

            if (nextKey >= this.track.numKeys) nextKey = 0; // to handle animations with only one key

            if (detectRecursInfinite && !this.param.nextKeyIsInCurrentTrack && this.track.numKeys != 1) {
                nextKey = this.track.numKeys - 1;
            }

            for (var numData = 0; numData < this.track.numDataPerKey; ++numData) {

                var dataCurKey  = this.track.keys[curKey].data[numData];
                var dataNextKey = this.track.keys[nextKey].data[numData];

                if (!buffer[numData] || !dataCurKey || !dataNextKey) continue; // without this line, the lost artifact TR3 levels bug

                buffer[numData].position.x = dataCurKey.position.x + (dataNextKey.position.x - dataCurKey.position.x) * this.param.interpFactor;
                buffer[numData].position.y = dataCurKey.position.y + (dataNextKey.position.y - dataCurKey.position.y) * this.param.interpFactor;
                buffer[numData].position.z = dataCurKey.position.z + (dataNextKey.position.z - dataCurKey.position.z) * this.param.interpFactor;

                if (internalBuffer) {
                    buffer[numData].position.x += this.skeleton.bonesStartingPos[numData].pos_init[0];
                    buffer[numData].position.y += this.skeleton.bonesStartingPos[numData].pos_init[1];
                    buffer[numData].position.z += this.skeleton.bonesStartingPos[numData].pos_init[2];
                }

                Quaternion.slerp(dataCurKey.quaternion, dataNextKey.quaternion, buffer[numData].quaternion, this.param.interpFactor);
            }
        } else {
            this.nextTrackInstance.pushState();
            this.nextTrackInstance.setCurrentFrame(this.nextTrackInstanceFrame);

            this.nextTrackInstance._interpolate(this.interpolatedData, true);

            this.nextTrackInstance.popState();

            for (let numData = 0; numData < this.track.numDataPerKey; ++numData) {
                const dataCurKey  = this.track.keys[curKey].data[numData];
                const dataNextKey = this.interpolatedData[numData];

                if (!buffer[numData] || !dataCurKey || !dataNextKey) continue; // without this line, the lost artifact TR3 levels bug

                buffer[numData].position.x = dataCurKey.position.x + (dataNextKey.position.x - dataCurKey.position.x) * this.param.interpFactor;
                buffer[numData].position.y = dataCurKey.position.y + (dataNextKey.position.y - dataCurKey.position.y) * this.param.interpFactor;
                buffer[numData].position.z = dataCurKey.position.z + (dataNextKey.position.z - dataCurKey.position.z) * this.param.interpFactor;

                if (internalBuffer) {
                    buffer[numData].position.x += this.skeleton.bonesStartingPos[numData].pos_init[0];
                    buffer[numData].position.y += this.skeleton.bonesStartingPos[numData].pos_init[1];
                    buffer[numData].position.z += this.skeleton.bonesStartingPos[numData].pos_init[2];
                }

                Quaternion.slerp(dataCurKey.quaternion, dataNextKey.quaternion, buffer[numData].quaternion, this.param.interpFactor);
            }
        }
    }

}
