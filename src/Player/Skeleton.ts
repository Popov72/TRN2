import { Object3D } from "../../threeJS/src/threejs/src/Three";

export default class Skeleton {

    private _bones: Array<any>;
    private _bonesStartingPos: Array<any>;
    private _boneMatrices: Float32Array;

    constructor(bonesStartingPos: any) {
        this._bones = [];
        this._bonesStartingPos = bonesStartingPos;

        this._boneMatrices = new Float32Array( 64 * 16 );

        for (let i = 0; i < 64; ++i) {
            this._boneMatrices.set([1], 0 + 16 * i);
            this._boneMatrices.set([1], 5 + 16 * i);
            this._boneMatrices.set([1], 10 + 16 * i);
            this._boneMatrices.set([1], 15 + 16 * i);
        }

        for (let b = 0; b < bonesStartingPos.length; ++b) {
            const parent = bonesStartingPos[b].parent,
                  bone = new Object3D();

            this.bones.push(bone);

            if (parent >= 0) {
                this.bones[parent].add(bone);
            }
        }
    }

    get bones(): Array<any> {
        return this._bones;
    }

    get bonesStartingPos(): Array<any> {
        return this._bonesStartingPos;
    }

    get boneMatrices(): Float32Array {
        return this._boneMatrices;
    }

    public updateBoneMatrices(): void {
        this._bones[0].updateMatrixWorld(true);
        this._setBoneMatrices();
    }

    private _setBoneMatrices() {
        for (let b = 0; b < this._bones.length; b ++) {
            const bone = this._bones[b];

            bone.matrixWorld.toArray(this._boneMatrices, b * 16);
        }
    }

}