import Engine from "../Proxy/Engine";

import { IScene } from "../Proxy/IScene";
import { IRenderer } from "../Proxy/IRenderer";

import Browser from "../Utils/Browser";
import IGameData from "./IGameData";
import { baseFrameRate, ObjectID } from "../Constants";
import { RawLevel } from "../Loading/LevelLoader";
import { AnimationManager } from "../Animation/AnimationManager";
import { BehaviourManager } from "../Behaviour/BehaviourManager";
import { ObjectManager } from "./ObjectManager";
import { MaterialManager } from "./MaterialManager";
import { TRLevel } from "./TRLevel";
import { Panel } from "../Utils/Panel";

declare var Stats: any;

export default class Play {

    private gameData: IGameData;
    private renderer: IRenderer;
    private stats: any;

    constructor(container: Element) {
        this.gameData = {
            "container": container,

            "curRoom": -1,
            "camera": <any>null,

            "sceneRender": <any>null,
            "sceneBackground": <any>null,
            "sceneData": null,

            "singleRoomMode": false,

            "panel": <any>null,

            "bhvMgr": <any>null,
            "objMgr": <any>null,
            "matMgr": <any>null,
            "confMgr": <any>null,
            "trlvl":  <any>null,
            "anmMgr": <any>null,

            "startTime": -1,
            "lastTime": -1,
            "quantum": 1 / baseFrameRate,
            "quantumTime": -1,
            "quantumRnd": 0,

            "flickerColor" : [1.2, 1.2, 1.2],
            "unitVec3" : [1.0, 1.0, 1.0],
            "globalTintColor":  null,

            "fps": 0
        };

        this.renderer = Engine.createRenderer(this.gameData.container);
        this.renderer.setSize(jQuery(this.gameData.container).width() as number, jQuery(this.gameData.container).height() as number);

        this.gameData.panel = new Panel(this.gameData.container, this.gameData, this.renderer);
        this.gameData.panel.hide();

        this.stats = new Stats();
        this.stats.domElement.style.position = 'absolute';
        this.stats.domElement.style.top = '0px';
        this.stats.domElement.style.right = '0px';
        this.stats.domElement.style.zIndex = 100;

        this.gameData.container.append(this.stats.domElement);

        Browser.bindRequestPointerLock(document.body);
        Browser.bindRequestFullscreen(document.body);
    }

    public async initialize(sceneJSON: RawLevel, scene: IScene) {
        this.gameData.sceneData = sceneJSON.data;
        this.gameData.sceneRender = scene;
        this.gameData.sceneBackground = this.renderer.createScene();

        Engine.activeScene = scene;

        const camera = this.gameData.sceneRender.getCamera();

        if (camera !== undefined) {
            this.gameData.camera = camera;
        } else {
            console.log("Can't find camera!");
        }

        //camera.setPosition([70469,7070,-39321]);
        //camera.setQuaternion([0.18415,-0.58809,-0.13972,-0.77506]);

        camera.setPosition([32751, -827, -55979]);
        camera.setQuaternion([0.20377, 0.22280, 0.04768, -0.95214]);

        this.gameData.confMgr = this.gameData.sceneData.trlevel.confMgr;
        this.gameData.bhvMgr  = new BehaviourManager();
        this.gameData.matMgr  = new MaterialManager();
        this.gameData.objMgr  = new ObjectManager();
        this.gameData.trlvl   = new TRLevel();
        this.gameData.anmMgr  = new AnimationManager();
        this.gameData.shdMgr  = Engine.getShaderMgr();

        this.gameData.bhvMgr.initialize(this.gameData);
        this.gameData.matMgr.initialize(this.gameData);
        this.gameData.objMgr.initialize(this.gameData);
        this.gameData.trlvl.initialize(this.gameData);
        this.gameData.anmMgr.initialize(this.gameData);

        delete this.gameData.sceneData.trlevel.confMgr;
        delete this.gameData.sceneData.trlevel;

        ObjectID.Lara  = this.gameData.confMgr.number('lara > id', true, 0);

        const isCutScene = this.gameData.confMgr.param('', false, true).attr('type') == 'cutscene',
              cutsceneIndex = this.gameData.sceneData.rversion == 'TR4' && Browser.QueryString.cutscene != undefined ? parseInt(Browser.QueryString.cutscene) : -1;

        this.gameData.isCutscene = isCutScene || cutsceneIndex > 0;

        const tintColor = this.gameData.confMgr.color('globaltintcolor', true);

        if (tintColor != null) {
            this.gameData.globalTintColor = [tintColor.r, tintColor.g, tintColor.b];
        }

        if (this.gameData.sceneData.rversion != 'TR4') {
            jQuery('#nobumpmapping').prop('disabled', 'disabled');
        }

        if (Browser.QueryString.pos) {
            const vals = Browser.QueryString.pos.split(',');
            this.gameData.camera.setPosition([parseFloat(vals[0]), parseFloat(vals[1]), parseFloat(vals[2])]);
        }

        if (Browser.QueryString.rot) {
            const vals = Browser.QueryString.rot.split(',');
            this.gameData.camera.setQuaternion([parseFloat(vals[0]), parseFloat(vals[1]), parseFloat(vals[2]), parseFloat(vals[3])]);
        }

        this.gameData.trlvl.createObjectsInLevel();

        // create behaviours
        let allPromises: Array<Promise<void>> = this.gameData.bhvMgr.loadBehaviours() || [];

        allPromises = allPromises.concat(this.gameData.bhvMgr.addBehaviour('Sprite') || []);
        allPromises = allPromises.concat(this.gameData.bhvMgr.addBehaviour('AnimatedTexture', undefined, undefined, undefined, this.gameData.objMgr.collectObjectsWithAnimatedTextures()) || []);

        if (cutsceneIndex >= 0) {
            allPromises = allPromises.concat(this.gameData.bhvMgr.addBehaviour('CutScene', { "index": cutsceneIndex, "useadditionallights": true }) || []);
        }

        await Promise.all(allPromises);

        // set uniforms on objects
        this.gameData.sceneRender.traverse((obj) => {
            const data = this.gameData.sceneData.objects[obj.name];

            if (!data || data.roomIndex < 0) { return; }

            this.gameData.matMgr.setUniformsFromRoom(obj, data.roomIndex);
        });

        return Promise.resolve();
    }

    public play(): void {
        this.gameData.panel.show();
        this.gameData.panel.updateFromParent();

        window.addEventListener('resize', this.onWindowResize.bind(this), false);

        this.gameData.startTime = this.gameData.quantumTime = (new Date()).getTime() / 1000.0;

        this.gameData.bhvMgr.onBeforeRenderLoop();

        this.renderLoop();

        this.onWindowResize();
    }

    private renderLoop(): void {
        requestAnimationFrame(this.renderLoop.bind(this));

        let curTime = (new Date()).getTime() / 1000.0,
            delta = curTime - this.gameData.lastTime;

        this.gameData.lastTime = curTime;

        if (curTime - this.gameData.quantumTime > this.gameData.quantum) {
            this.gameData.quantumRnd = Math.random();
            this.gameData.quantumTime = curTime;
        }

        curTime = curTime - this.gameData.startTime;

        if (delta > 0.1) { delta = 0.1; }

        this.gameData.fps = delta ? 1 / delta : 60;

        this.gameData.bhvMgr.frameStarted(curTime, delta);

        this.gameData.anmMgr.animateObjects(delta);

        this.gameData.camera.updateMatrixWorld();

        this.gameData.objMgr.updateObjects(curTime);

        this.gameData.bhvMgr.frameEnded(curTime, delta);

        this.render();
    }

    private render(): void {
        this.renderer.clear();

        this.renderer.render(this.gameData.sceneBackground, this.gameData.camera);

        this.renderer.render(this.gameData.sceneRender, this.gameData.camera);

        this.stats.update();

        this.gameData.panel.showInfo();
    }

    private onWindowResize(): void {
        const w = jQuery(this.gameData.container).width() as number,
              h = jQuery(this.gameData.container).height() as number;
        this.gameData.camera.aspect = w / h;
        this.gameData.camera.updateProjectionMatrix();

        this.renderer.setSize(w, h);

        this.render();
    }

}
