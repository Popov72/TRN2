import { ICamera } from "../Proxy/ICamera";
import { IMesh } from "../Proxy/IMesh";
import { Position, Quaternion } from "../Proxy/INode";

import { Behaviour, BehaviourRetCode } from "./Behaviour";
import { BehaviourManager } from "./BehaviourManager";
import { BONE } from "../Player/Skeleton";
import IGameData from "../Player/IGameData";
import { Lara } from "./Lara";
import { SystemLight } from "../Player/SystemLight";

declare var glMatrix: any;

const DURATION = 0.1;
const COLOR = [0.6, 0.5, 0.1];
const DISTANCE = 3072 * 2;

export class MuzzleFlash extends Behaviour {

    public name: string = MuzzleFlash.name;

    protected _bhvMgr:       BehaviourManager;
    protected _sysLight:     SystemLight;
    protected _startTime:    number;
    protected _boneNumber:   number;
    protected _lightNum:     number;
    protected _mesh:         IMesh;

    protected static _flashId:  number = 0;
    protected static _offsetL:   Position = [0, 0, 0];
    protected static _offsetR:   Position = [0, 0, 0];

    constructor(nbhv: any, gameData: IGameData, objectid?: number, objecttype?: string) {
        super(nbhv, gameData, objectid, objecttype);

        this._bhvMgr = gameData.bhvMgr;
        this._sysLight = gameData.sysLight;
        this._startTime = -1;
        this._boneNumber = 0;

        this._lightNum = this._sysLight.add();
        this._sysLight.setFadeout(this._lightNum, DISTANCE);

        this._mesh = <any>null;
    }

    public init(lstObjs: Array<IMesh | ICamera> | null): [BehaviourRetCode, Array<Promise<void>> | null] {
        this._startTime = -1;
        this._boneNumber = this.nbhv.bone ? this.nbhv.bone : 0;

        const lara = (this._bhvMgr.getBehaviour("Lara") as Array<Lara>)[0];

        this._mesh = this.gameData.objMgr.createMoveable(MuzzleFlash._flashId, this.gameData.sceneData.objects[lara.getObject().name].roomIndex, undefined, true, false) as IMesh;

        (async() => {
            const shd = await this.gameData.shdMgr.getVertexShader('TR_flash'),
                  materials = this._mesh.materials;

            for (let mat = 0; mat < materials.length; ++mat) {
                const material = materials[mat];

                material.depthWrite = false;
                material.transparent = true;

                material.vertexShader = shd;
            }
        })();

        return [BehaviourRetCode.keepBehaviour, null];
    }

    public static onEngineInitialized(gameData: IGameData): Array<Promise<any>> {
        let ofst = gameData.confMgr.vector3("gun > left_flashoffset", true);

        if (ofst) {
            MuzzleFlash._offsetL = [ofst.x, ofst.y, ofst.z];
        }

        ofst = gameData.confMgr.vector3("gun > right_flashoffset", true);

        if (ofst) {
            MuzzleFlash._offsetR = [ofst.x, ofst.y, ofst.z];
        }

        MuzzleFlash._flashId = gameData.confMgr.number("gun > flashid", true, 0);

        return [gameData.shdMgr.getVertexShader('TR_flash')];
    }

    public onFrameEnded(curTime: number, delta: number): void {
        if (this._startTime < 0) {
            this._startTime = curTime;
        }

        const time = curTime - this._startTime;

        if (time < DURATION) {
            let intensity = (DURATION - time) * 20;

            const lara = (this._bhvMgr.getBehaviour("Lara") as Array<Lara>)[0],
                  basis = lara.getSkeleton().getBoneDecomposition(this._boneNumber, lara.getObject());

            const q: Quaternion = [0, 0, 0, 1];

            glMatrix.quat.setAxisAngle(q, [1, 0, 0], -Math.PI * 0.5);

            basis.rotate(q);
            basis.translate(this._boneNumber == BONE.ARM_L3 ? MuzzleFlash._offsetL : MuzzleFlash._offsetR);

            this._mesh.setPosition(basis.pos);
            this._mesh.setQuaternion(basis.rot);

            this._sysLight.setPosition(this._lightNum, basis.pos);
            this._sysLight.setColor(this._lightNum, [Math.min(COLOR[0] * intensity, 1), Math.min(COLOR[1] * intensity, 1), Math.min(COLOR[2] * intensity, 1)]);
        } else {
            this._sysLight.remove(this._lightNum);
            this.gameData.objMgr.removeObjectFromScene(this._mesh);
            this._bhvMgr.removeBehaviour(this);
        }
    }

}

BehaviourManager.registerFactory(MuzzleFlash);
