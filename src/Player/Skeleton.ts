import Engine from "../Proxy/Engine";
import { INode } from "../Proxy/INode";

export enum BONE {
    HIPS    = 0,
    LEG_L1  = 1,
    LEG_L2  = 2,
    LEG_L3  = 3,
    LEG_R1  = 4,
    LEG_R2  = 5,
    LEG_R3  = 6,
    CHEST   = 7,
    ARM_R1  = 8,
    ARM_R2  = 9,
    ARM_R3  = 10,
    ARM_L1  = 11,
    ARM_L2  = 12,
    ARM_L3  = 13,
    HEAD    =  14,
}

export enum MASK {
    HIPS    =  1 << BONE.HIPS,
    LEG_L1  =  1 << BONE.LEG_L1,
    LEG_L2  =  1 << BONE.LEG_L2,
    LEG_L3  =  1 << BONE.LEG_L3,
    LEG_R1  =  1 << BONE.LEG_R1,
    LEG_R2  =  1 << BONE.LEG_R2,
    LEG_R3  =  1 << BONE.LEG_R3,
    CHEST   =  1 << BONE.CHEST,
    ARM_R1  =  1 << BONE.ARM_R1,
    ARM_R2  =  1 << BONE.ARM_R2,
    ARM_R3  =  1 << BONE.ARM_R3,
    ARM_L1  =  1 << BONE.ARM_L1,
    ARM_L2  =  1 << BONE.ARM_L2,
    ARM_L3  =  1 << BONE.ARM_L3,
    HEAD    =  1 << BONE.HEAD,

    ARM_L   =   ARM_L1 | ARM_L2 | ARM_L3,
    ARM_R   =   ARM_R1 | ARM_R2 | ARM_R3,
    LEG_L   =   LEG_L1 | LEG_L2 | LEG_L3,
    LEG_R   =   LEG_R1 | LEG_R2 | LEG_R3,
    BRAID   =   HEAD   | CHEST  | ARM_L1 | ARM_L2 | ARM_R1 | ARM_R2,

    UPPER   =   CHEST  | ARM_L  | ARM_R,       // without head
    LOWER   =   HIPS   | LEG_L  | LEG_R,

    ALL     =   0xFFFFFFFF,
}

export class Skeleton {

    private _bones:             Array<INode>;
    private _bonesStartingPos:  Array<any>;
    private _boneMatrices:      Float32Array;

    constructor(bonesStartingPos: any) {
        this._bones = [];
        this._bonesStartingPos = bonesStartingPos;

        this._boneMatrices = new Float32Array(64 * 16);

        for (let i = 0; i < 64; ++i) {
            this._boneMatrices.set([1], 0 + 16 * i);
            this._boneMatrices.set([1], 5 + 16 * i);
            this._boneMatrices.set([1], 10 + 16 * i);
            this._boneMatrices.set([1], 15 + 16 * i);
        }

        for (let b = 0; b < bonesStartingPos.length; ++b) {
            const parent = bonesStartingPos[b].parent,
                  bone = Engine.makeNode();

            this.bones.push(bone);

            if (parent >= 0) {
                this.bones[parent].add(bone);
            }
        }
    }

    get bones(): Array<INode> {
        return this._bones;
    }

    get bonesStartingPos(): Array<any> {
        return this._bonesStartingPos;
    }

    get boneMatrices(): Float32Array {
        return this._boneMatrices;
    }

    public updateBoneMatrices(): void {
        this._bones[0].updateMatrixWorld();
        this._setBoneMatrices();
    }

    private _setBoneMatrices() {
        for (let b = 0; b < this._bones.length; b ++) {
            const bone = this._bones[b];

            bone.matrixWorldToArray(this._boneMatrices, b * 16);
        }
    }

}
