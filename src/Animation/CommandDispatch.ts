import IGameData from "../Player/IGameData";
import { IMesh } from "../Proxy/IMesh";
import { Commands } from "./Commands";
import { ObjectID } from "../Constants";
import { Ponytail } from "../Behaviour/Ponytail";
import { LAYER } from "../Player/Layer";
import { MASK, BONE } from "../Player/Skeleton";

export default class CommandDispatch {

    protected sceneData: any;
    protected objMgr: any;
    protected dispatchMap: { [id: number]: (action: number, customParam: any, obj: IMesh) => void };

    constructor(public gameData: IGameData, public trversion: string) {
        this.sceneData = gameData.sceneData;
        this.objMgr = gameData.objMgr;

        this.dispatchMap = {};

        this.dispatchMap[Commands.Misc.ANIMCMD_MISC_COLORFLASH]     = this.colorFlash.bind(this);
        this.dispatchMap[Commands.Misc.ANIMCMD_MISC_GETLEFTGUN]     = this.getLeftGun.bind(this);
        this.dispatchMap[Commands.Misc.ANIMCMD_MISC_GETRIGHTGUN]    = this.getRightGun.bind(this);
        this.dispatchMap[Commands.Misc.ANIMCMD_MISC_FIRELEFTGUN]    = this.fireLeftGun.bind(this);
        this.dispatchMap[Commands.Misc.ANIMCMD_MISC_FIRERIGHTGUN]   = this.fireRightGun.bind(this);
        this.dispatchMap[Commands.Misc.ANIMCMD_MISC_MESHSWAP1]      = this.meshSwap.bind(this);
        this.dispatchMap[Commands.Misc.ANIMCMD_MISC_MESHSWAP2]      = this.meshSwap.bind(this);
        this.dispatchMap[Commands.Misc.ANIMCMD_MISC_MESHSWAP3]      = this.meshSwap.bind(this);
        this.dispatchMap[Commands.Misc.ANIMCMD_MISC_HIDEOBJECT]     = this.hideObject.bind(this);
        this.dispatchMap[Commands.Misc.ANIMCMD_MISC_SHOWOBJECT]     = this.showObject.bind(this);
        this.dispatchMap[Commands.Misc.ANIMCMD_MISC_RESETHAIR]      = this.resetHair.bind(this);
        this.dispatchMap[Commands.Misc.ANIMCMD_MISC_CUSTOMFUNCTION] = this.customFunction.bind(this);
    }

    public dispatch(action: number, customParam: any, obj: IMesh) {
        const func = this.dispatchMap[action];

        if (!func) {
            console.log(`Can't handle command "${action}"!`, obj);
        } else {
            func(action, customParam, obj);
        }
    }

    protected colorFlash(action: number, customParam: any, obj: IMesh): void {
        this.gameData.globalTintColor[0] =
        this.gameData.globalTintColor[1] =
        this.gameData.globalTintColor[2] =
        (this.gameData.globalTintColor[0] < 0.5 ? 1.0 : 0.1);
    }

    protected getLeftGun(action: number, customParam: any, obj: IMesh): void {
        this.getGun(MASK.LEG_L1, MASK.ARM_L3, obj);
    }

    protected getRightGun(action: number, customParam: any, obj: IMesh): void {
        this.getGun(MASK.LEG_R1, MASK.ARM_R3, obj);
    }

    protected getGun(maskLeg: number, maskArm: number, obj: IMesh): void {
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

    protected fireLeftGun(action: number, customParam: any, obj: IMesh): void {
        this.gameData.bhvMgr.addBehaviour('MuzzleFlash', { "bone": BONE.ARM_L3 });
    }

    protected fireRightGun(action: number, customParam: any, obj: IMesh): void {
        this.gameData.bhvMgr.addBehaviour('MuzzleFlash', { "bone": BONE.ARM_R3 });
    }

    protected meshSwap(action: number, customParam: any, obj: IMesh): void {
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
    }

    protected hideObject(action: number, customParam: any, obj: IMesh): void {
        obj.visible = false;
    }

    protected showObject(action: number, customParam: any, obj: IMesh): void {
        obj.visible = true;
    }

    protected resetHair(action: number, customParam: any, obj: IMesh): void {
        const ponytail = this.gameData.bhvMgr.getBehaviour("Ponytail") as Array<Ponytail>;

        if (ponytail && ponytail.length > 0) {
            ponytail[0].reset();
        }
    }

    protected customFunction(action: number, customParam: any, obj: IMesh): void {
        customParam();
    }
}
