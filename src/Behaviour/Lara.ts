import { ICamera } from "../Proxy/ICamera";
import { IMesh } from "../Proxy/IMesh";
import IGameData from "../Player/IGameData";
import { Behaviour, BehaviourRetCode } from "./Behaviour";
import { BehaviourManager } from "./BehaviourManager";
import { ObjectManager } from "../Player/ObjectManager";
import { ConfigManager } from "../ConfigManager";
import { AnimationManager } from "../Animation/AnimationManager";
import { ObjectID } from "../Constants";
import { Layer, LAYER, MASK } from "../Player/Layer";

declare var glMatrix: any;

export class Lara extends Behaviour {

    public name: string = Lara.name;

    private sceneData: any;
    private confMgr: ConfigManager;
    private anmMgr: AnimationManager;
    private objMgr: ObjectManager;
    private lara: IMesh;

    constructor(nbhv: any, gameData: IGameData, objectid?: number, objecttype?: string) {
        super(nbhv, gameData, objectid, objecttype);

        this.sceneData = gameData.sceneData;
        this.confMgr = gameData.confMgr;
        this.anmMgr = gameData.anmMgr;
        this.objMgr = gameData.objMgr;
        this.lara = <any>null;
    }

    public init(lstObjs: Array<IMesh | ICamera> | null): [BehaviourRetCode, Array<Promise<void>> | null] {
        const startTrans = this.nbhv.starttrans,
              startAnim = this.nbhv.startanim,
              laraAngle = this.nbhv.angle;

        this.lara = lstObjs![0] as IMesh;

        const dataLara = this.sceneData.objects[this.lara.name],
              layer = new Layer(this.lara, this.gameData);

        dataLara.layer = layer;

        if (!this.gameData.isCutscene) {
            if (startTrans) {
                const laraPos = this.lara.position;
                this.lara.setPosition([laraPos[0] + parseFloat(startTrans.x), laraPos[1] + parseFloat(startTrans.y), laraPos[2] + parseFloat(startTrans.z)]);
            }

            let laraQuat = this.lara.quaternion;
            if (laraAngle != undefined) {
                const q = glMatrix.quat.create();
                glMatrix.quat.setAxisAngle(q, [0,1,0], glMatrix.glMatrix.toRadian(parseFloat(laraAngle)));
                laraQuat = q;
            }

            const camPos = this.lara.position;

			const ofstDir = parseFloat(this.nbhv.dirdist),
			      ofstUp  = parseFloat(this.nbhv.updist);

			const v3 = [0, ofstUp, ofstDir],
			      q  = laraQuat.slice();

			glMatrix.vec3.transformQuat(v3, v3, q);

			camPos[0] += v3[0];
			camPos[1] += v3[1];
            camPos[2] += v3[2];
            
            this.gameData.camera.setPosition(camPos);
            this.gameData.camera.setQuaternion(laraQuat);

            if (startAnim !== undefined) {
               this.anmMgr.setAnimation(this.lara, parseInt(startAnim), false);
            }

        }

        // create pistolanim object
        ObjectID.PistolAnim = this.nbhv.animobject && this.nbhv.animobject.pistol ? parseInt(this.nbhv.animobject.pistol) : -1;

        const mvbPistolAnim = this.objMgr.createMoveable(ObjectID.PistolAnim, -1, undefined, true, dataLara.skeleton);
        if (mvbPistolAnim) {
            if (this.confMgr.trversion == 'TR4') {
                // for some reason, pistol animation mesh is only for left hand in TR4... So copy it to do right hand animation
                //!new TRN.MeshBuilder(mvbPistolAnim).copyFacesWithSkinIndex(TRN.Layer.BONE.ARM_L3, TRN.Layer.BONE.ARM_R3);
            }
            layer.setMesh(LAYER.WEAPON, mvbPistolAnim, 0);
        }

        // create "holster empty" object
        ObjectID.HolsterEmpty = this.nbhv.animobject && this.nbhv.animobject.holster ? parseInt(this.nbhv.animobject.holster) : -1;

        /*!const mvbHolsterEmpty = this.objMgr.createMoveable(TRN.ObjectID.HolsterEmpty, -1, undefined, true, dataLara.skeleton);
        if (mvbHolsterEmpty) {
            // for some reason, holster meshes are made of 17 bones and not 15 as Lara mesh...
            // so, modify the skin indices so that left and right holsters match the right bones in Lara mesh
            new TRN.MeshBuilder(mvbHolsterEmpty).replaceSkinIndices({4:TRN.Layer.BONE.LEG_L1, 8:TRN.Layer.BONE.LEG_R1});
            layer.setMesh(TRN.Layer.LAYER.HOLSTER_EMPTY, mvbHolsterEmpty, 0);
        }*/

        // create "holster full" object
        ObjectID.HolsterFull = this.nbhv.animobject && this.nbhv.animobject.holster_pistols ? parseInt(this.nbhv.animobject.holster_pistols) : -1;

        /*!const mvbHolsterFull = this.objMgr.createMoveable(TRN.ObjectID.HolsterFull, -1, undefined, true, dataLara.skeleton);
        if (mvbHolsterFull) {
            new TRN.MeshBuilder(mvbHolsterFull).replaceSkinIndices({4:TRN.Layer.BONE.LEG_L1, 8:TRN.Layer.BONE.LEG_R1});
            layer.setMesh(TRN.Layer.LAYER.HOLSTER_FULL, mvbHolsterFull, 0);
        }*/

        // create the meshswap objects
        const meshSwapIds = [
                this.confMgr.number('meshswap > objid1', true, 0),
                this.confMgr.number('meshswap > objid2', true, 0),
                this.confMgr.number('meshswap > objid3', true, 0)
              ];

        for (let i = 0; i < meshSwapIds.length; ++i) {
            ObjectID['meshswap' + (i+1)] = meshSwapIds[i];
            if (ObjectID['meshswap' + (i+1)] > 0) {
                const mvb = this.objMgr.createMoveable(ObjectID['meshswap' + (i+1)], -1, undefined, true, dataLara.skeleton);
                if (mvb) {
                    mvb.visible = false;
                }
            }
        }

        layer.update();
        layer.setBoundingObjects();

        if (this.confMgr.trversion == 'TR4') {
            /*if (mvbHolsterFull) {
                layer.updateMask(LAYER.HOLSTER_FULL, MASK.LEG_L1 | MASK.LEG_R1);
            }*/
        } else if (mvbPistolAnim) {
            // put pistols in Lara holsters
            layer.updateMask(LAYER.WEAPON, MASK.LEG_L1 | MASK.LEG_R1);
            layer.updateMask(LAYER.MAIN,   MASK.LEG_L1 | MASK.LEG_R1);
        }

        return [BehaviourRetCode.keepBehaviour, null];
    }

    public getObject(): IMesh {
        return this.lara;
    }

}

BehaviourManager.registerFactory(Lara.name, 
    (nbhv: any, gameData: any, objectid?: number, objecttype?: string) => new Lara(nbhv, gameData, objectid, objecttype)
);
