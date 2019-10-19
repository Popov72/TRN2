import Utils from "../Utils/Misc";
import IGameData from "../Player/IGameData";
import { IMesh } from "../Proxy/IMesh";
import { ICamera } from "../Proxy/ICamera";
import { ConfigManager } from "../ConfigManager";
import { ObjectManager, MeshList } from "../Player/ObjectManager";
import { Behaviour, BehaviourRetCode } from "./Behaviour";

type factory = (nbhv: any, gameData: IGameData, objectid?: number, objecttype?: string) => Behaviour;

export class BehaviourManager {

    private static factories: Map<string, factory> = new Map();

    private behaviours: Array<Behaviour>;
    private behavioursByName: Map<string, Array<Behaviour>>;
    private gameData: IGameData;
    private confMgr: ConfigManager;
    private objMgr: ObjectManager;

    public static registerFactory(name: string, func: factory): void {
        this.factories.set(name, func);
    }

    constructor() {
        this.behaviours = [];
        this.behavioursByName = new Map();
        this.confMgr = <any>null;
        this.objMgr = <any>null;
        this.gameData = <any>null;
    }


    public initialize(gameData: IGameData): void {
        this.gameData = gameData;

        this.confMgr = gameData.confMgr;
        this.objMgr = gameData.objMgr;
    }

    public removeBehaviours(obj: any): void {
        if (obj.__behaviours) {
            obj.__behaviours.forEach( (bhv: Behaviour) => this.removeBehaviour(bhv) );

            delete obj.__behaviours;
        };
    }

    public removeBehaviour(bhv: Behaviour): void {
        let idx = this.behaviours.indexOf(bhv);
        if (idx !== -1) {
            this.behaviours.splice(idx, 1);
        }

        const lst = this.behavioursByName.get(bhv.name);
        if (lst) {
            idx = lst.indexOf(bhv);
            if (idx !== -1) {
                lst.splice(idx, 1);
            }
        }
    }

    public callFunction(funcname: string, params: Array<any>) {
        for (let i = 0; i < this.behaviours.length; ++i) {
            const bhv = this.behaviours[i];

            if ((bhv as any)[funcname]) {
                (bhv as any)[funcname].apply(bhv, params);
            }
        }
    }

    public onBeforeRenderLoop(): void {
        this.callFunction('onBeforeRenderLoop', []);
    }

    public frameStarted(curTime: number, delta: number) {
        this.callFunction('frameStarted', [curTime, delta]);
    }

    public frameEnded(curTime: number, delta: number) {
        this.callFunction('frameEnded', [curTime, delta]);
    }

    public getBehaviour(name: string): Array<Behaviour> | undefined {
        return this.behavioursByName.get(name);
    }

    public addBehaviour(name: string, params?: any, objectid?: number, objecttype?: string, _lstObjs?:Array<IMesh>): Array<Promise<void>> | null {
        let lstObjs: Array<IMesh | ICamera> | null = null;

        if (_lstObjs !== undefined) {
            lstObjs = _lstObjs;
        } else {
            const objList: MeshList | Array<ICamera> | null = objecttype !== undefined ? (objecttype == 'camera' ? [this.gameData.camera] : this.objMgr.objectList[objecttype]) : null;

            if ((objectid !== undefined || objecttype !== undefined) && (objList === null || objectid === undefined || !objList[objectid])) {
                return null;
            }

            if (objList && objectid !== undefined && objList[objectid]) {
                const objs = objList[objectid];
                if (!Array.isArray(objs)) {
                    lstObjs = [objs];
                } else {
                    lstObjs = objs;
                }
            }
        }

        const factory = BehaviourManager.factories.get(name);

        if (factory === undefined) {
            throw `Can't find a factory to create a behaviour with name ${name}`;
        }

        const obhv = factory(params, this.gameData, objectid, objecttype);

        const [retCode, promises] = obhv.init(lstObjs);

        if (retCode == BehaviourRetCode.keepBehaviour) {
            this.behaviours.push(obhv);

            if (lstObjs) {
                lstObjs.forEach( (obj) => {
                    let lbhv = obj.behaviours;
                    if (!lbhv) {
                        lbhv = [];
                        obj.behaviours = lbhv;
                    }
                    lbhv.push(obhv);
                });
            }

            let blst = this.behavioursByName.get(name);
            if (!blst) {
                blst = [];
                this.behavioursByName.set(name, blst);
            }
            blst.push(obhv);
        }

        return promises;
    }

    public loadBehaviours(): Array<Promise<void>> {
        this.behaviours = [];
        this.behavioursByName = new Map();

        let behaviours = jQuery(this.confMgr.globalParam('behaviour', true)),
            allPromises = this.loadBehavioursSub(behaviours);

        behaviours = jQuery(this.confMgr.param('behaviour', false, true));
        
        allPromises = allPromises.concat(this.loadBehavioursSub(behaviours));

        return allPromises;
    }

    private loadBehavioursSub(behaviours: any): Array<Promise<void>> {
        let promises: Array<Promise<void>> = [];

        for (let bhv = 0; bhv < behaviours.length; ++bhv) {
            let nbhv = behaviours[bhv], 
                name = nbhv.getAttribute("name"), 
                cutsceneOnly = nbhv.getAttribute("cutsceneonly");
    
            if (nbhv.__consumed || BehaviourManager.factories.get(name) === undefined) continue;
            if (cutsceneOnly && cutsceneOnly == "true" && !this.gameData.isCutscene) continue;
    
            // get the type and id of the object to apply the behaviour to
            let objectid = nbhv.getAttribute('objectid'), 
                objecttype = nbhv.getAttribute('objecttype') || "moveable";
            
            if (objectid == "" || objectid == null) {
                if (!nbhv.parentNode) continue;
    
                objectid = nbhv.parentNode.getAttribute("id");
                objecttype = objectid ? nbhv.parentNode.nodeName : null;
            }
    
            // get overriden data from the level (if any)
            // look first for a <behaviour> tag with the same objectid and objecttype as the current one
            let bhvLevel = objectid ? jQuery(this.confMgr.param('behaviour[name="' + name + '"][objectid="' + objectid + '"]', false, true)) : null;
            if (bhvLevel && bhvLevel.length > 0 && bhvLevel[0] !== nbhv) {
                const tp = bhvLevel[0].getAttribute("objecttype") || "moveable";
                if (tp != objecttype) {
                    bhvLevel = null;
                }
            }
            if (!bhvLevel || bhvLevel.length == 0) {
                // not found. Look for a <behaviour> with the same name as the current one and without any of the objectid / objecttype attributes
                bhvLevel = jQuery(this.confMgr.param('behaviour[name="' + name + '"]', false, true));
                if (bhvLevel.length > 0 && bhvLevel[0] !== nbhv) {
                    if (bhvLevel[0].getAttribute("objectid") || bhvLevel[0].getAttribute("objecttype")) {
                        bhvLevel = null;
                    }
                }
            }
    
            // merge the data found in the level section (if any)
            nbhv = Utils.domNodeToJSon(nbhv);
    
            if (bhvLevel && bhvLevel.length > 0) {
                bhvLevel[0].__consumed = true;
                bhvLevel = Utils.domNodeToJSon(bhvLevel[0]);
                Object.assign(nbhv, bhvLevel);
            }
    
            // create the behaviour
            promises = promises.concat(this.addBehaviour(name, nbhv, objectid === null ? undefined : objectid, objecttype === null ? undefined : objecttype) || []);
        }

        return promises;
    }

}
