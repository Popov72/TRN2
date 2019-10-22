import { ICamera } from "../Proxy/ICamera";
import { IMesh, isMesh } from "../Proxy/IMesh";
import IGameData from "../Player/IGameData";
import { Behaviour, BehaviourRetCode } from "./Behaviour";
import { BehaviourManager } from "./BehaviourManager";
import { IScene } from "../Proxy/IScene";
import { Position } from "../Proxy/INode";

export class Fade extends Behaviour {

    public name: string = Fade.name;

    protected sceneRender: IScene;
    protected bhvMgr: BehaviourManager;
    protected colorStart: Position;
    protected colorEnd: Position;
    protected duration: number;
    protected startTime: number;

    constructor(nbhv: any, gameData: IGameData, objectid?: number, objecttype?: string) {
        super(nbhv, gameData, objectid, objecttype);

        this.sceneRender = gameData.sceneRender;
        this.bhvMgr = gameData.bhvMgr;
        this.colorStart = this.colorEnd = [0, 0, 0];
        this.duration = 0;
        this.startTime = -1;
    }

    public init(lstObjs: Array<IMesh | ICamera> | null): [BehaviourRetCode, Array<Promise<void>> | null] {
        this.colorStart = this.nbhv.colorStart;
        this.colorEnd = this.nbhv.colorEnd;
        this.duration = parseFloat(this.nbhv.duration);
        this.startTime = -1;

        this.setColor(this.colorStart);

        return [BehaviourRetCode.keepBehaviour, null];
    }

    public frameStarted(curTime: number, delta: number): void {
        if (this.startTime < 0) {
            this.startTime = curTime;
        }

        const ratio = (curTime - this.startTime) / this.duration,
              color: Position = [
                this.colorStart[0] + (this.colorEnd[0] - this.colorStart[0]) * ratio,
                this.colorStart[1] + (this.colorEnd[1] - this.colorStart[1]) * ratio,
                this.colorStart[2] + (this.colorEnd[2] - this.colorStart[2]) * ratio
              ];

        this.setColor(color);

        if (curTime - this.startTime >= this.duration) {
            this.setColor(this.colorEnd);
            this.bhvMgr.removeBehaviour(this);
        }
    }

    protected setColor(color: Position): void {
        this.sceneRender.traverse((obj) => {
            if (!obj.visible || !isMesh(obj)) {
                return;
            }

            const materials = obj.materials;

            if (!materials || !materials.length) {
                return;
            }

            for (let i = 0; i < materials.length; ++i) {
                const material = materials[i];

                material.uniforms.tintColor.value = color;

                material.uniformsUpdated(["tintColor"]);
            }
        });
    }

}

BehaviourManager.registerFactory(Fade.name,
    (nbhv: any, gameData: any, objectid?: number, objecttype?: string) => new Fade(nbhv, gameData, objectid, objecttype)
);
