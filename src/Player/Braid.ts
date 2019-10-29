/*
***
*** Conversion of the Braid class found in lara.h in OpenLara: https://github.com/XProger/OpenLara
*** All credits to XProger for this!
***
*/
import { IMesh } from "../Proxy/IMesh";
import { Position, Quaternion } from "../Proxy/INode";

import IGameData from "./IGameData";
import { ObjectID } from "../Constants";
import { Skeleton, BONE, MASK } from "./Skeleton";
import { Basis } from "./Basis";

declare var glMatrix: any;

const GRAVITY   = 6;
const EPS       = 1.192092896e-07; // smallest such that 1.0+FLT_EPSILON != 1.0

const __m = glMatrix.mat4.create();

interface Joint {
    posPrev:    Position;
    pos:        Position;
    length:     number;
}

export class Braid {

    protected _lara: IMesh;
    protected _laraSkeleton: Skeleton;
    protected _laraStartingMesh: number;
    protected _offset: Position;
    protected _time: number;
    protected _gameData: IGameData;
    protected _model: IMesh;
    protected _modelSkeleton: Skeleton;
    protected _jointsCount: number;
    protected _joints: Array<Joint>;
    protected _basis: Array<Basis>;
    protected _headBasis: Basis;
    protected _curFrame: number;

    constructor(lara: IMesh, offset: Position, gameData: IGameData) {
        (window as any).braid = this;

        this._lara = lara;
        this._offset = offset;
        this._time = 0;
        this._gameData = gameData;
        this._headBasis = <any>null;
        this._curFrame = -1;

        this._laraSkeleton = this._gameData.sceneData.objects[this._lara.name].skeleton;
        this._laraSkeleton.updateBoneMatrices();
        this._laraStartingMesh = this._gameData.sceneData.objects['moveable' + this._gameData.sceneData.objects[this._lara.name].objectid].startingMesh;

        this._model = this.getModel();
        this._modelSkeleton = this._gameData.sceneData.objects[this._model.name].skeleton;

        const modelJointCount = this._modelSkeleton.bones.length;

        this._jointsCount = modelJointCount + 1;
        this._joints = new Array(this._jointsCount);
        this._basis = new Array(this._jointsCount - 1);

        for (let b = 0; b < this._basis.length; ++b) {
            this._basis[b] = new Basis();
        }

        this.reset();
    }

    public get model(): IMesh {
        return this._model;
    }

    public reset(): void {
        const basis = this.getBasis(true);

        basis.translate(this._offset);

        for (let i = 0; i < this._jointsCount - 1; i++) {
            const bonePos = this._modelSkeleton.bonesStartingPos[1 + Math.min(i, this._jointsCount - 3)].pos_init;

            this._joints[i] = {
                "posPrev":  basis.pos.slice() as Position,
                "pos":      basis.pos.slice() as Position,
                "length":   -bonePos[2],
            };

            basis.translate([0.0, 0.0, this._joints[i].length]);
        }

        this._joints[this._jointsCount - 1] = {
            "posPrev":  basis.pos.slice() as Position,
            "pos":      basis.pos.slice() as Position,
            "length":   1.0,
        };
    }

    protected getModel(): IMesh {
        // break the hierarchy between bones so that the matrices are not cumulated: we will calculate the final matrix for each bone ourselves
        const bones = this._gameData.sceneData.objects['moveable' + ObjectID.LaraBraid].bonesStartingPos as Array<any>;

        bones.forEach((b) => b.parent = -1);

        // get the model
        const mvb = this._gameData.objMgr.createMoveable(ObjectID.LaraBraid, this._gameData.sceneData.objects[this._lara.name].roomIndex, undefined, true, false) as IMesh,
              data = this._gameData.sceneData.objects[mvb.name];

        data.has_anims = false;

        mvb.frustumCulled = false; // faster than regenerating a new bounding box each frame, as the braid will be visible most of the time

        return mvb;
    }

    protected getBasis(force: boolean = false): Basis {
        if (!force && (this._curFrame == this._gameData.curFrame)) {
            return this._headBasis;
        }

        this._headBasis = this._laraSkeleton.getBoneDecomposition(BONE.HEAD, this._lara);
        this._curFrame = this._gameData.curFrame;

        return this._headBasis;
    }

    protected getPos(): Position {
        return this.getBasis().mult(this._offset);
    }

    protected integrate(deltaTime: number): void {
        const TIMESTEP = deltaTime;
        const ACCEL    = 16.0 * GRAVITY * 30.0 * TIMESTEP * TIMESTEP;
        let DAMPING    = 1.5;

        DAMPING = 1.0 / (1.0 + DAMPING * TIMESTEP); // Padé approximation

        for (let i = 1; i < this._jointsCount; i++) {
            const j = this._joints[i],
                  delta = [0, 0, 0];

            glMatrix.vec3.sub(delta, j.pos, j.posPrev);

            const deltaLength = glMatrix.vec3.length(delta);

            glMatrix.vec3.normalize(delta, delta);
            glMatrix.vec3.scale(delta, delta, Math.min(deltaLength, 2048.0 * deltaTime) * DAMPING); // speed limit

            glMatrix.vec3.copy(j.posPrev, j.pos);
            glMatrix.vec3.add(j.pos, j.pos, delta);
            j.pos[1] -= ACCEL;
        }
    }

    protected collide(): void {
        const BRAID_RADIUS = 0.0,
              meshes = this._gameData.trlvl.trlevel.meshes;

        const pos: Position = [0, 0, 0], quat: Quaternion = [0, 0, 0, 0], dir: Position = [0, 0, 0];

        for (let i = 0; i < this._laraSkeleton.bones.length; i++) {
            if (!(MASK.BRAID & (1 << i))) { continue; }

            const mesh = meshes[i + this._laraStartingMesh],
                  mcenter: Position = [mesh.center.x, -mesh.center.y, -mesh.center.z],
                  mradius: number = mesh.collisionSize;

            this._laraSkeleton.bones[i].decomposeMatrixWorld(pos, quat);

            const laraBasis = new Basis(this._lara.position, this._lara.quaternion),
                  boneBasis = laraBasis.multBasis(new Basis(pos, quat)),
                  center    = boneBasis.mult(mcenter);

            let radiusSq = mradius + BRAID_RADIUS;

            radiusSq *= radiusSq;

            for (let j = 1; j < this._jointsCount; j++) {
                glMatrix.vec3.sub(dir, this._joints[j].pos, center);
                let len = glMatrix.vec3.squaredLength(dir) + EPS;
                if (len < radiusSq) {
                    len = Math.sqrt(len);
                    glMatrix.vec3.scale(dir, dir, (mradius + BRAID_RADIUS - len) / len);
                    glMatrix.vec3.scale(dir, dir, 0.9);
                    glMatrix.vec3.add(this._joints[j].pos, this._joints[j].pos, dir);
                }
            }
        }
    }

    protected solve(): void {
        for (let i = 0; i < this._jointsCount - 1; i++) {
            const a = this._joints[i],
                  b = this._joints[i + 1],
                  dir = [0, 0, 0];

            glMatrix.vec3.sub(dir, b.pos, a.pos);

            const len = glMatrix.vec3.length(dir) + EPS;

            glMatrix.vec3.scale(dir, dir, 1.0 / len);

            const d = a.length - len;

            if (i > 0) {
                glMatrix.vec3.scale(dir, dir, d * (0.5 * 1.0));
                glMatrix.vec3.sub(a.pos, a.pos, dir);
                glMatrix.vec3.add(b.pos, b.pos, dir);
            } else {
                glMatrix.vec3.scale(dir, dir, d * 1.0);
                glMatrix.vec3.add(b.pos, b.pos, dir);
            }
        }
    }

    public update(deltaTime: number): void {
        this._joints[0].pos = this.getPos();

        this.integrate(deltaTime); // Verlet integration step

        this.collide(); // check collision with Lara's mesh

        for (let i = 0; i < this._jointsCount; i++) { // solve connections (springs)
            this.solve();
        }

        const headDir: Position = [0, 0, 0];

        glMatrix.vec3.transformQuat(headDir, [0, 0, 1], this.getBasis().rot);

        for (let i = 0; i < this._jointsCount - 1; i++) {
            const d = [0, 0, 0];

            glMatrix.vec3.sub(d, this._joints[i + 1].pos, this._joints[i].pos);
            glMatrix.vec3.normalize(d, d);

            const r = [0, 0, 0];

            glMatrix.vec3.cross(r, d, headDir);
            glMatrix.vec3.normalize(r, r);

            const u = [0, 0, 0];

            glMatrix.vec3.cross(u, d, r);
            glMatrix.vec3.normalize(u, u);

            __m[0] = r[0]; __m[1] = -r[1]; __m[ 2] = -r[2];
            __m[4] = u[0]; __m[5] = -u[1]; __m[ 6] = -u[2];
            __m[8] = d[0]; __m[9] = -d[1]; __m[10] = -d[2];

            this._basis[i].identity();
            this._basis[i].translate(this._joints[i].pos);

            const q: Quaternion = [0, 0, 0, 1];

            glMatrix.mat4.getRotation(q, __m);

            this._basis[i].rotate(q);

            this._modelSkeleton.bones[i].setPosition(this._basis[i].pos);
            this._modelSkeleton.bones[i].setQuaternion([this._basis[i].rot[0], -this._basis[i].rot[1], -this._basis[i].rot[2], this._basis[i].rot[3]]);
            this._modelSkeleton.bones[i].updateMatrixWorld();
        }

        this._modelSkeleton.setBoneMatrices();

        if (this._gameData.sceneData.objects[this._model.name].roomIndex != this._gameData.sceneData.objects[this._lara.name].roomIndex) {
            this._gameData.objMgr.changeRoomMembership(
                this._model,
                this._gameData.sceneData.objects[this._model.name].roomIndex,
                this._gameData.sceneData.objects[this._lara.name].roomIndex
            );
        }

    }

}
