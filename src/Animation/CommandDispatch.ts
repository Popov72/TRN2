import IGameData from "../Player/IGameData";
import { IMesh } from "../Proxy/IMesh";
import { Commands } from "./Commands";
import { ObjectID } from "../Constants";
import { Ponytail } from "../Behaviour/Ponytail";
import { LAYER } from "../Player/Layer";
import { MASK, BONE } from "../Player/Skeleton";
import { DynamicLight } from "../Behaviour/DynamicLight";
import TrackInstance from "./TrackInstance";

export enum CommandDispatchMode {
    NORMAL = 0,
    UNDO,
    FAST,
    UNDO_END,
}

export default class CommandDispatch {

    protected sceneData: any;
    protected objMgr: any;
    protected dispatchMap: { [id: number]: (action: number, customParam: any, obj: IMesh, mode: CommandDispatchMode, trackInstance: TrackInstance) => void };
    protected undoMap: { [id: number]: any };
    protected dynLight: DynamicLight;

    constructor(public gameData: IGameData, public trversion: string) {
        this.sceneData = gameData.sceneData;
        this.objMgr = gameData.objMgr;

        gameData.bhvMgr.addBehaviour("DynamicLight");

        this.dynLight = (gameData.bhvMgr.getBehaviour("DynamicLight") as Array<DynamicLight>)![0];
        this.dynLight.color = [0, 0, 0];
        this.dynLight.fadeout = 4096;

        this.dispatchMap = {};
        this.undoMap = {};

        this.dispatchMap[Commands.Misc.ANIMCMD_MISC_COLORFLASH]         = this.colorFlash.bind(this);
        this.dispatchMap[Commands.Misc.ANIMCMD_MISC_GETLEFTGUN]         = this.getLeftGun.bind(this);
        this.dispatchMap[Commands.Misc.ANIMCMD_MISC_GETRIGHTGUN]        = this.getRightGun.bind(this);
        this.dispatchMap[Commands.Misc.ANIMCMD_MISC_FIRELEFTGUN]        = this.fireLeftGun.bind(this);
        this.dispatchMap[Commands.Misc.ANIMCMD_MISC_FIRERIGHTGUN]       = this.fireRightGun.bind(this);
        this.dispatchMap[Commands.Misc.ANIMCMD_MISC_MESHSWAP1]          = this.meshSwap.bind(this);
        this.dispatchMap[Commands.Misc.ANIMCMD_MISC_MESHSWAP2]          = this.meshSwap.bind(this);
        this.dispatchMap[Commands.Misc.ANIMCMD_MISC_MESHSWAP3]          = this.meshSwap.bind(this);
        this.dispatchMap[Commands.Misc.ANIMCMD_MISC_HIDEOBJECT]         = this.hideObject.bind(this);
        this.dispatchMap[Commands.Misc.ANIMCMD_MISC_SHOWOBJECT]         = this.showObject.bind(this);
        this.dispatchMap[Commands.Misc.ANIMCMD_MISC_DYN_ON]             = this.dynamicLightOn.bind(this);
        this.dispatchMap[Commands.Misc.ANIMCMD_MISC_DYN_OFF]            = this.dynamicLightOff.bind(this);
        this.dispatchMap[Commands.Misc.ANIMCMD_MISC_RESETHAIR]          = this.resetHair.bind(this);
        this.dispatchMap[Commands.Misc.ANIMCMD_MISC_CUSTOMFUNCTION]     = this.customFunction.bind(this);
        this.dispatchMap[Commands.Misc.ANIMCMD_MISC_SETINTERPOLATION]   = this.setInterpolation.bind(this);
    }

    public startUndoMode(): void {
        this.undoMap = {};

        for (const id in this.dispatchMap) {
            this.undoMap[id] = {
                "count": 0,
                "firstAction": -1,
            };
        }
    }

    public endUndoMode(): void {
        for (const id in this.dispatchMap) {
            this.dispatchMap[id].call(this, parseInt(id), undefined, <any>undefined, CommandDispatchMode.UNDO_END, <any>undefined);
        }
    }

    public dispatch(action: number, customParam: any, obj: IMesh, mode: CommandDispatchMode, trackInstance: TrackInstance) {
        const func = this.dispatchMap[action];

        if (!func) {
            //console.log(`Misc anim command "${action}" not implemented`, obj);
        } else {
            func(action, customParam, obj, mode, trackInstance);
        }
    }

    protected colorFlash(action: number, customParam: any, obj: IMesh, mode: CommandDispatchMode, trackInstance: TrackInstance): void {
        switch (mode) {
            case CommandDispatchMode.UNDO_END: {
                break;
            }

            default: {
                this.gameData.globalTintColor[0] =
                this.gameData.globalTintColor[1] =
                this.gameData.globalTintColor[2] =
                (this.gameData.globalTintColor[0] < 0.5 ? 1.0 : 0.1);
                break;
            }
        }
    }

    protected getLeftGun(action: number, customParam: any, obj: IMesh, mode: CommandDispatchMode, trackInstance: TrackInstance): void {
        switch (mode) {
            case CommandDispatchMode.UNDO_END: {
                break;
            }

            default: {
                this.getGun(MASK.LEG_L1, MASK.ARM_L3, obj, trackInstance);
                break;
            }
        }
    }

    protected getRightGun(action: number, customParam: any, obj: IMesh, mode: CommandDispatchMode, trackInstance: TrackInstance): void {
        switch (mode) {
            case CommandDispatchMode.UNDO_END: {
                break;
            }

            default: {
                this.getGun(MASK.LEG_R1, MASK.ARM_R3, obj, trackInstance);
                break;
            }
        }
    }

    protected getGun(maskLeg: number, maskArm: number, obj: IMesh, trackInstance: TrackInstance): void {
        const layer = this.sceneData.objects[obj.name].layer;

        if (this.trversion == 'TR4') {
            layer.updateMask(LAYER.HOLSTER_EMPTY, maskLeg);
            layer.updateMask(LAYER.HOLSTER_FULL,  maskLeg);
            layer.updateMask(LAYER.WEAPON,        maskArm);
        } else {
            layer.updateMask(LAYER.WEAPON, maskLeg | maskArm);
            layer.updateMask(LAYER.MAIN,   maskLeg | maskArm);
        }

        layer.setRoom(this.gameData.sceneData.objects[obj.name].roomIndex);
    }

    protected fireLeftGun(action: number, customParam: any, obj: IMesh, mode: CommandDispatchMode, trackInstance: TrackInstance): void {
        if (mode === CommandDispatchMode.NORMAL) {
            this.gameData.bhvMgr.addBehaviour('MuzzleFlash', { "bone": BONE.ARM_L3 });
        }
    }

    protected fireRightGun(action: number, customParam: any, obj: IMesh, mode: CommandDispatchMode, trackInstance: TrackInstance): void {
        if (mode === CommandDispatchMode.NORMAL) {
            this.gameData.bhvMgr.addBehaviour('MuzzleFlash', { "bone": BONE.ARM_R3 });
        }
    }

    protected meshSwap(action: number, customParam: any, obj: IMesh, mode: CommandDispatchMode, trackInstance: TrackInstance): void {
        switch (mode) {
            case CommandDispatchMode.UNDO_END: {
                break;
            }

            default: {
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
        }
    }

    protected hideObject(action: number, customParam: any, obj: IMesh, mode: CommandDispatchMode, trackInstance: TrackInstance): void {
        switch (mode) {
            case CommandDispatchMode.UNDO: {
                let counters = this.undoMap[action].counters;
                if (!counters) {
                    counters = {};
                    this.undoMap[action].counters = counters;
                }
                let counter = counters[obj.name];
                if (!counter) {
                    counter = counters[obj.name] = {
                        "obj": obj,
                        "count": 0,
                        "firstAction": -1,
                    };
                }
                counter.count++;
                if (counter.firstAction < 0) {
                    counter.firstAction = 0;
                }
                break;
            }

            case CommandDispatchMode.UNDO_END: {
                for (const name in this.undoMap[action].counters) {
                    const counter = this.undoMap[action].counters[name];
                    if (counter.count > 0) {
                        counter.obj.visible = counter.firstAction === 0;
                    }
                }
                break;
            }

            default: {
                obj.visible = false;
                break;
            }
        }
    }

    protected showObject(action: number, customParam: any, obj: IMesh, mode: CommandDispatchMode, trackInstance: TrackInstance): void {
        switch (mode) {
            case CommandDispatchMode.UNDO: {
                let counters = this.undoMap[action].counters;
                if (!counters) {
                    counters = {};
                    this.undoMap[action].counters = counters;
                }
                let counter = counters[obj.name];
                if (!counter) {
                    counter = counters[obj.name] = {
                        "obj": obj,
                        "count": 0,
                        "firstAction": -1,
                    };
                }
                counter.count++;
                if (counter.firstAction < 0) {
                    counter.firstAction = 1;
                }
                break;
            }

            case CommandDispatchMode.NORMAL:
            case CommandDispatchMode.FAST: {
                obj.visible = true;
                break;
            }
        }
    }

    protected resetHair(action: number, customParam: any, obj: IMesh, mode: CommandDispatchMode, trackInstance: TrackInstance): void {
        const ponytail = this.gameData.bhvMgr.getBehaviour("Ponytail") as Array<Ponytail>;

        if (ponytail && ponytail.length > 0 && mode === CommandDispatchMode.NORMAL) {
            ponytail[0].reset();
            ponytail[0].preWarm();
        }
    }

    protected dynamicLightOn(action: number, customParam: any, obj: IMesh, mode: CommandDispatchMode, trackInstance: TrackInstance): void {
        switch (mode) {
            case CommandDispatchMode.UNDO: {
                this.undoMap[action].count++;
                if (this.undoMap[action].firstAction < 0) {
                    this.undoMap[action].firstAction = 0;
                }
                break;
            }

            case CommandDispatchMode.UNDO_END: {
                if (this.undoMap[action].count > 0) {
                    this.dynLight.color = this.undoMap[action].firstAction === 0 ? [0, 0, 0] : [2.8, 2.8, 2.8];
                }
                break;
            }

            default: {
                this.dynLight.color = [2.8, 2.8, 2.8];
                this.dynLight.position = obj.position;
                break;
            }
        }
    }

    protected dynamicLightOff(action: number, customParam: any, obj: IMesh, mode: CommandDispatchMode, trackInstance: TrackInstance): void {
        switch (mode) {
            case CommandDispatchMode.UNDO: {
                this.undoMap[Commands.Misc.ANIMCMD_MISC_DYN_ON].count++;
                if (this.undoMap[Commands.Misc.ANIMCMD_MISC_DYN_ON].firstAction < 0) {
                    this.undoMap[Commands.Misc.ANIMCMD_MISC_DYN_ON].firstAction = 1;
                }
                break;
            }

            case CommandDispatchMode.NORMAL:
            case CommandDispatchMode.FAST: {
                this.dynLight.color = [0, 0, 0];
                break;
            }
        }
    }

    protected customFunction(action: number, customParam: any, obj: IMesh, mode: CommandDispatchMode, trackInstance: TrackInstance): void {
        if (customParam) {
            customParam(action, obj, mode);
        }
    }

    protected setInterpolation(action: number, customParam: any, obj: IMesh, mode: CommandDispatchMode, trackInstance: TrackInstance): void {
        if (mode === CommandDispatchMode.NORMAL || mode === CommandDispatchMode.FAST) {
            trackInstance.activateInterpolation = customParam as boolean;
        }
    }
}
