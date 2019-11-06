import Engine from "../Proxy/Engine";
import { IMesh } from "../Proxy/IMesh";
import { IMeshBuilder } from "../Proxy/IMeshBuilder";
import { IScene } from "../Proxy/IScene";

import IGameData from "../Player/IGameData";
import { ObjectManager } from "../Player/ObjectManager";
import { Ponytail } from "../Behaviour/Ponytail";
import { ShaderManager } from "../ShaderManager";
import { Layer, LAYER } from "../Player/Layer";
import { BONE, MASK } from "../Player/Skeleton";
import { Commands } from "../Animation/Commands";
import { CommandDispatchMode } from "../Animation/CommandDispatch";
import TrackInstance from "../Animation/TrackInstance";

declare var glMatrix: any;

export default class CutSceneHelper {

    private sceneData:      any;
    private gameData:       IGameData;
    private objMgr:         ObjectManager;
    private shdMgr:         ShaderManager;
    private scene:          IScene;

    private _holeDoneR1:    any;
    private _holeDoneR2:    any;
    private _holeNotDoneR1: any;
    private _holeNotDoneR2: any;
    private _holeDone:      boolean;

    constructor(gameData: IGameData, lara: IMesh) {
        this.gameData = gameData;
        this.sceneData = gameData.sceneData;
        this.objMgr = gameData.objMgr;
        this.shdMgr = gameData.shdMgr;
        this.scene = gameData.sceneRender;

        this._holeDone = false;
    }

    public prepareLevel(trVersion: string, levelName: string, csIndex: number, actorMoveables: Array<any>): Array<Promise<void>> {
        const promises: Array<Promise<any>> = [];

        if (trVersion == 'TR2') {
            if (levelName == 'cut3.tr2') {
                // bad guys are not at the right location
                const black = (this.objMgr.objectList['moveable'][98] as Array<IMesh>)[0],
                      red = (this.objMgr.objectList['moveable'][97] as Array<IMesh>)[0];

                black.setQuaternion([0, 1, 0, 0]); // 180 deg rotation
                black.setPosition([16900, -5632, -7680]);

                red.setPosition([20000, -5632, -10700]);
            }
        }

        switch (csIndex) {
            case 1: {
                // Handle the shovel / Make a hole in the ground / Add a fade-in/out between animation #1 and #2 (so that we don't see the hole pop...)
                const lara = actorMoveables[0],
                      data = this.sceneData.objects[lara.name],
                      track1 = this.sceneData.animTracks[this.sceneData.objects[lara.name].animationStartIndex],
                      track2 = this.sceneData.animTracks[this.sceneData.objects[lara.name].animationStartIndex + 1];

                const meshShovel = this.objMgr.createMoveable(417, data.roomIndex, undefined, true, data.skeleton);

                data.layer.setMesh(LAYER.MESHSWAP, meshShovel, 0);

                this.prepareHole();
                this._holeDone = true;
                this.cs1MakeHole(CommandDispatchMode.NORMAL);

                track1.setCommands([
                    { cmd: Commands.ANIMCMD_MISCACTIONONFRAME , params: [24,  Commands.Misc.ANIMCMD_MISC_CUSTOMFUNCTION, () => data.layer.updateMask(LAYER.MESHSWAP, MASK.ARM_L3)] },
                    { cmd: Commands.ANIMCMD_MISCACTIONONFRAME , params: [230, Commands.Misc.ANIMCMD_MISC_CUSTOMFUNCTION, (action: number, obj: IMesh, mode: CommandDispatchMode) => this.fadeOut(1.0, mode)] }
                ], 0);

                track2.setCommands([
                    { cmd: Commands.ANIMCMD_MISCACTIONONFRAME , params: [27,  Commands.Misc.ANIMCMD_MISC_CUSTOMFUNCTION, (action: number, obj: IMesh, mode: CommandDispatchMode) => this.cs1MakeHole(mode)] },
                    { cmd: Commands.ANIMCMD_MISCACTIONONFRAME , params: [30,  Commands.Misc.ANIMCMD_MISC_CUSTOMFUNCTION, (action: number, obj: IMesh, mode: CommandDispatchMode) => this.fadeIn(1.0, mode)] },
                    { cmd: Commands.ANIMCMD_MISCACTIONONFRAME , params: [147, Commands.Misc.ANIMCMD_MISC_CUSTOMFUNCTION, () => data.layer.updateMask(LAYER.MESHSWAP, MASK.ARM_L3)] }
                ], 0);

                break;
            }

            case 2: {
                // Handle the shovel
                const lara = actorMoveables[0],
                      data = this.sceneData.objects[lara.name],
                      track1 = this.sceneData.animTracks[this.sceneData.objects[lara.name].animationStartIndex];

                const meshShovel = this.objMgr.createMoveable(417, data.roomIndex, undefined, true, data.skeleton);

                data.layer.setMesh(LAYER.MESHSWAP, meshShovel, 0);

                this.prepareHole();

                track1.setCommands([
                    { cmd: Commands.ANIMCMD_MISCACTIONONFRAME , params: [0,   Commands.Misc.ANIMCMD_MISC_CUSTOMFUNCTION, () => data.layer.updateMask(LAYER.MESHSWAP, MASK.ARM_L3)] },
                    { cmd: Commands.ANIMCMD_MISCACTIONONFRAME , params: [147, Commands.Misc.ANIMCMD_MISC_CUSTOMFUNCTION, () => data.layer.updateMask(LAYER.MESHSWAP, MASK.ARM_L3)] }
                ], 0);

                break;
            }

            case 4: {
                // Handle the pistols visibility + fire during the fight with the scorpion
                const lara = actorMoveables[0],
                      trackL = this.sceneData.animTracks[this.sceneData.objects[lara.name].animationStartIndex],
                      commandsL: Array<any> = [];

                trackL.setCommands(commandsL, 0);

                commandsL.push(
                    { cmd: Commands.ANIMCMD_MISCACTIONONFRAME , params: [0,   Commands.Misc.ANIMCMD_MISC_GETLEFTGUN] },
                    { cmd: Commands.ANIMCMD_MISCACTIONONFRAME , params: [0,   Commands.Misc.ANIMCMD_MISC_GETRIGHTGUN] },
                    { cmd: Commands.ANIMCMD_MISCACTIONONFRAME , params: [12,  Commands.Misc.ANIMCMD_MISC_FIRERIGHTGUN] },
                    { cmd: Commands.ANIMCMD_MISCACTIONONFRAME , params: [55,  Commands.Misc.ANIMCMD_MISC_FIRELEFTGUN] },
                    { cmd: Commands.ANIMCMD_MISCACTIONONFRAME , params: [70,  Commands.Misc.ANIMCMD_MISC_FIRERIGHTGUN] },
                    { cmd: Commands.ANIMCMD_MISCACTIONONFRAME , params: [80,  Commands.Misc.ANIMCMD_MISC_FIRELEFTGUN] },
                    { cmd: Commands.ANIMCMD_MISCACTIONONFRAME , params: [100,  Commands.Misc.ANIMCMD_MISC_FIRERIGHTGUN] },
                    { cmd: Commands.ANIMCMD_MISCACTIONONFRAME , params: [110,  Commands.Misc.ANIMCMD_MISC_FIRELEFTGUN] },
                    { cmd: Commands.ANIMCMD_MISCACTIONONFRAME , params: [120,  Commands.Misc.ANIMCMD_MISC_FIRERIGHTGUN] },
                    { cmd: Commands.ANIMCMD_MISCACTIONONFRAME , params: [130,  Commands.Misc.ANIMCMD_MISC_FIRELEFTGUN] },
                    { cmd: Commands.ANIMCMD_MISCACTIONONFRAME , params: [140,  Commands.Misc.ANIMCMD_MISC_FIRERIGHTGUN] },
                    { cmd: Commands.ANIMCMD_MISCACTIONONFRAME , params: [150,  Commands.Misc.ANIMCMD_MISC_FIRELEFTGUN] },
                    { cmd: Commands.ANIMCMD_MISCACTIONONFRAME , params: [160,  Commands.Misc.ANIMCMD_MISC_FIRERIGHTGUN] },
                    { cmd: Commands.ANIMCMD_MISCACTIONONFRAME , params: [170,  Commands.Misc.ANIMCMD_MISC_FIRELEFTGUN] },
                    { cmd: Commands.ANIMCMD_MISCACTIONONFRAME , params: [200,  Commands.Misc.ANIMCMD_MISC_FIRERIGHTGUN] },
                    { cmd: Commands.ANIMCMD_MISCACTIONONFRAME , params: [210,  Commands.Misc.ANIMCMD_MISC_FIRELEFTGUN] },
                    { cmd: Commands.ANIMCMD_MISCACTIONONFRAME , params: [220,  Commands.Misc.ANIMCMD_MISC_FIRERIGHTGUN] },
                    { cmd: Commands.ANIMCMD_MISCACTIONONFRAME , params: [230,  Commands.Misc.ANIMCMD_MISC_FIRELEFTGUN] },
                    { cmd: Commands.ANIMCMD_MISCACTIONONFRAME , params: [320, Commands.Misc.ANIMCMD_MISC_GETLEFTGUN] },
                    { cmd: Commands.ANIMCMD_MISCACTIONONFRAME , params: [320, Commands.Misc.ANIMCMD_MISC_GETRIGHTGUN] }
                );

                // Make speaking heads
                const aziz = actorMoveables[1],
                      azizHeadIds = [21, 22],
                      commandsA: Array<any> = [],
                      trackA = this.sceneData.animTracks[this.sceneData.objects[aziz.name].animationStartIndex];

                this.makeLayeredMesh(aziz);

                trackA.setCommands(commandsA, 0);

                this.setHeads(aziz, commandsA, azizHeadIds, 16 * 30, 28 * 30, 3, 1 << 8);

                break;
            }

            case 5: {
                // Show bagpack
                const lara = actorMoveables[0],
                      data = this.sceneData.objects[lara.name],
                      track1 = this.sceneData.animTracks[this.sceneData.objects[lara.name].animationStartIndex];

                const laraBagpack = this.objMgr.createMoveable(1, -1, undefined, true, data.skeleton) as IMesh,
                      meshb = Engine.makeMeshBuilder(laraBagpack);

                meshb.replaceSkinIndices({1: BONE.CHEST});
                data.layer.setMeshBuilder(LAYER.MESHSWAP, meshb, 0);

                track1.setCommands([
                    { cmd: Commands.ANIMCMD_MISCACTIONONFRAME , params: [1350,   Commands.Misc.ANIMCMD_MISC_CUSTOMFUNCTION, () => data.layer.updateMask(LAYER.MESHSWAP, MASK.CHEST)] }
                ], 0);

                break;
            }

            case 6: {
                // Make speaking heads
                const vonCroy = actorMoveables[1],
                      vonCroyHeadIds = [21, 22],
                      commandsVC: Array<any> = [],
                      trackVC = this.sceneData.animTracks[this.sceneData.objects[vonCroy.name].animationStartIndex];

                this.makeLayeredMesh(vonCroy);

                this.setHeads(vonCroy, commandsVC, vonCroyHeadIds, 0 * 30, 6 * 30 + 15, 3, 1 << 21);

                trackVC.setCommands(commandsVC, 0);

                const lara = actorMoveables[0],
                      laraHeadIds = [17, 18, 19, 20],
                      commandsL: Array<any> = [],
                      trackL = this.sceneData.animTracks[this.sceneData.objects[lara.name].animationStartIndex];

                this.setHeads(lara, commandsL, laraHeadIds, 9 * 30 - 10, 12 * 30, 3);

                trackL.setCommands(commandsL, 0);

                break;
            }

            case 7:
            case 8:
            case 9: {
                // Add volumetric fog in the rooms / objects
                const rooms  = new Set([0, 1, 2, 3, 4, 5, 6, 7, 8, 110, 111, 112, 113, 114, 115, 116, 117, 122, 123]),
                      shader = this.shdMgr.getFragmentShader("TR_volumetric_fog");

                const setShader = (obj: IMesh) => {
                    const materials = obj.materials;
                    for (let m = 0; m < materials.length; ++m) {
                        const material = materials[m];

                        promises.push(shader.then((shd) => material.fragmentShader = shd));

                        material.uniforms.volFogCenter = { "type": "f3", "value": [52500.0, 3140.0, -49460.0] };
                        material.uniforms.volFogRadius = { "type": "f",  "value": 6000 };
                        material.uniforms.volFogColor =  { "type": "f3", "value": [0.1, 0.75, 0.3] };
                    }
                };

                this.scene.traverse((obj) => {
                    const data = this.sceneData.objects[obj.name];

                    if (data && rooms.has(data.roomIndex) || actorMoveables.indexOf(obj) >= 0) {
                        setShader(obj);
                    }
                });

                const ponytail = this.gameData.bhvMgr.getBehaviour("Ponytail") as Array<Ponytail>;
                if (ponytail && ponytail.length > 0) {
                    ponytail[0].braids.forEach((braid) => setShader(braid.model));
                }

                // Make speaking heads
                const vonCroy = actorMoveables[1],
                      vonCroyHeadIds = [21, 22],
                      commandsVC: Array<any> = [],
                      trackVC = this.sceneData.animTracks[this.sceneData.objects[vonCroy.name].animationStartIndex];

                this.makeLayeredMesh(vonCroy);

                trackVC.setCommands(commandsVC, 0);

                const lara = actorMoveables[0],
                      laraHeadIds = [17, 18, 19, 20],
                      commandsL: Array<any> = [],
                      trackL = this.sceneData.animTracks[this.sceneData.objects[lara.name].animationStartIndex];

                trackL.setCommands(commandsL, 0);

                switch (csIndex) {
                    case 7: {
                        this.setHeads(vonCroy, commandsVC, vonCroyHeadIds, 13 * 30, 21 * 30, 3, 1 << 21, setShader);
                        this.setHeads(lara, commandsL, laraHeadIds, 22 * 30 + 10, 29 * 30, 3, MASK.HEAD, setShader);
                        break;
                    }

                    case 8: {
                        this.setHeads(vonCroy, commandsVC, vonCroyHeadIds, 10 * 30 + 10, 13 * 30, 3, 1 << 21, setShader);
                        break;
                    }

                    case 9: {
                        this.setHeads(vonCroy, commandsVC, vonCroyHeadIds, 0 * 30, 5 * 30, 3, 1 << 21, setShader);
                        this.setHeads(vonCroy, commandsVC, vonCroyHeadIds, 12 * 30, 28 * 30, 3, 1 << 21, setShader);
                        this.setHeads(vonCroy, commandsVC, vonCroyHeadIds, 32 * 30 + 24, 38 * 30, 3, 1 << 21, setShader);
                        this.setHeads(lara, commandsL, laraHeadIds, 39 * 30 + 10, 42 * 30, 3, MASK.HEAD, setShader);
                        this.setHeads(vonCroy, commandsVC, vonCroyHeadIds, 65 * 30, 69 * 30, 3, 1 << 21, setShader);
                        this.setHeads(lara, commandsL, laraHeadIds, 90 * 30, 92 * 30 + 10, 3, MASK.HEAD, setShader);
                        this.setHeads(lara, commandsL, laraHeadIds, 100 * 30 + 18, 101 * 30, 3, MASK.HEAD, setShader);
                        break;
                    }
                }

                break;
            }

            case 10: {
                // Scroll that Lara is reading is not well positionned at start - move and rotate it
                const oscroll = (this.objMgr.objectList['staticmesh'][20] as Array<IMesh>)[2],
                      q = glMatrix.quat.create();

                glMatrix.quat.setAxisAngle(q, [0, 1, 0], glMatrix.glMatrix.toRadian(60));

                oscroll.setQuaternion(q);
                oscroll.setPosition([oscroll.position[0] + 850, oscroll.position[1], oscroll.position[2]]);

                oscroll.matrixAutoUpdate = false;

                // Make speaking heads
                const vonCroy = actorMoveables[1],
                      vonCroyHeadIds = [21, 22],
                      commandsVC: Array<any> = [],
                      trackVC = this.sceneData.animTracks[this.sceneData.objects[vonCroy.name].animationStartIndex];

                this.makeLayeredMesh(vonCroy);

                trackVC.setCommands(commandsVC, 0);

                const lara = actorMoveables[0],
                      laraHeadIds = [17, 18, 19, 20],
                      commandsL: Array<any> = [],
                      trackL = this.sceneData.animTracks[this.sceneData.objects[lara.name].animationStartIndex];

                trackL.setCommands(commandsL, 0);

                this.setHeads(vonCroy, commandsVC, vonCroyHeadIds, 32 * 30, 40 * 30 + 15, 3, 1 << 21);
                this.setHeads(lara, commandsL, laraHeadIds, 41 * 30 + 10, 43 * 30 + 15, 3);
                this.setHeads(vonCroy, commandsVC, vonCroyHeadIds, 44 * 30 + 10, 57 * 30 + 24, 3, 1 << 21);
                this.setHeads(lara, commandsL, laraHeadIds, 58 * 30 + 10, 62 * 30 - 10, 3);
                this.setHeads(lara, commandsL, laraHeadIds, 62 * 30 + 10, 67 * 30, 3);
                this.setHeads(vonCroy, commandsVC, vonCroyHeadIds, 67 * 30 + 10, 77 * 30, 3, 1 << 21);

                break;
            }

            case 11: {
                // Make speaking heads
                const aziz = actorMoveables[2],
                      azizHeadIds = [21, 22],
                      commandsA: Array<any> = [],
                      trackA = this.sceneData.animTracks[this.sceneData.objects[aziz.name].animationStartIndex];

                this.makeLayeredMesh(aziz);

                trackA.setCommands(commandsA, 0);

                const lara = actorMoveables[0],
                      laraHeadIds = [17, 18, 19, 20],
                      commandsL: Array<any> = [],
                      trackL = this.sceneData.animTracks[this.sceneData.objects[lara.name].animationStartIndex];

                trackL.setCommands(commandsL, 0);

                this.setHeads(aziz, commandsA, azizHeadIds, 38 * 30, 39 * 30, 3);
                this.setHeads(lara, commandsL, laraHeadIds, 40 * 30 + 10, 46 * 30, 3);
                this.setHeads(aziz, commandsA, azizHeadIds, 50 * 30, 55 * 30, 3);
                this.setHeads(lara, commandsL, laraHeadIds, 55 * 30 + 20, 56 * 30 + 10, 3);
                this.setHeads(aziz, commandsA, azizHeadIds, 58 * 30 + 15, 63 * 30, 3);
                this.setHeads(lara, commandsL, laraHeadIds, 64 * 30, 64 * 30 + 15, 3);

                break;
            }

            case 15: {
                // Make speaking heads
                const lara = actorMoveables[0],
                      laraHeadIds = [17, 18, 19, 20],
                      commandsL: Array<any> = [],
                      trackL = this.sceneData.animTracks[this.sceneData.objects[lara.name].animationStartIndex];

                trackL.setCommands(commandsL, 0);

                const vonCroy = actorMoveables[1],
                      vonCroyHeadIds = [21, 22],
                      commandsVC: Array<any> = [],
                      trackVC = this.sceneData.animTracks[this.sceneData.objects[vonCroy.name].animationStartIndex];

                this.makeLayeredMesh(vonCroy);

                trackVC.setCommands(commandsVC, 0);

                this.setHeads(vonCroy, commandsVC, vonCroyHeadIds, 10 * 30, 22 * 30, 3, 1 << 21);
                this.setHeads(lara, commandsL, laraHeadIds, 22 * 30 + 15, 23 * 30 + 15, 3);
                this.setHeads(vonCroy, commandsVC, vonCroyHeadIds, 24 * 30, 43 * 30 + 15, 3, 1 << 21);
                this.setHeads(lara, commandsL, laraHeadIds, 44 * 30 - 8, 46 * 30, 3);
                this.setHeads(lara, commandsL, laraHeadIds, 60 * 30 - 10, 61 * 30, 3);

                break;
            }

            case 16: {
                // Make speaking heads
                const jeanYves = actorMoveables[3],
                      jeanYvesHeadIds = [23, 24],
                      commandsJY: Array<any> = [],
                      trackJY = this.sceneData.animTracks[this.sceneData.objects[jeanYves.name].animationStartIndex];

                this.makeLayeredMesh(jeanYves);

                trackJY.setCommands(commandsJY, 0);

                const lara = actorMoveables[0],
                      laraHeadIds = [17, 18, 19, 20],
                      commandsL: Array<any> = [],
                      trackL = this.sceneData.animTracks[this.sceneData.objects[lara.name].animationStartIndex];

                trackL.setCommands(commandsL, 0);

                const vonCroy = actorMoveables[1],
                      vonCroyHeadIds = [21, 22],
                      commandsVC: Array<any> = [],
                      trackVC = this.sceneData.animTracks[this.sceneData.objects[vonCroy.name].animationStartIndex];

                this.makeLayeredMesh(vonCroy);

                trackVC.setCommands(commandsVC, 0);

                this.setHeads(jeanYves, commandsJY, jeanYvesHeadIds, 3 * 30, 4 * 30, 3, 1 << 18);
                this.setHeads(jeanYves, commandsJY, jeanYvesHeadIds, 6 * 30 - 10, 10 * 30, 3, 1 << 18);
                this.setHeads(lara, commandsL, laraHeadIds, 13 * 30 - 10, 16 * 30, 3);
                this.setHeads(jeanYves, commandsJY, jeanYvesHeadIds, 17 * 30, 26 * 30, 3, 1 << 18);
                this.setHeads(jeanYves, commandsJY, jeanYvesHeadIds, 27 * 30, 33 * 30, 3, 1 << 18);
                this.setHeads(lara, commandsL, laraHeadIds, 34 * 30, 35 * 30, 3);
                this.setHeads(lara, commandsL, laraHeadIds, 35 * 30 + 15, 39 * 30, 3);
                this.setHeads(vonCroy, commandsVC, vonCroyHeadIds, 53 * 30, 66 * 30, 3, 1 << 21);

                break;
            }

            case 17: {
                // Make speaking heads
                const jeanYves = actorMoveables[1],
                      jeanYvesHeadIds = [23, 24],
                      commandsJY: Array<any> = [],
                      trackJY = this.sceneData.animTracks[this.sceneData.objects[jeanYves.name].animationStartIndex];

                this.makeLayeredMesh(jeanYves);

                this.setHeads(jeanYves, commandsJY, jeanYvesHeadIds, 1 * 30, 2 * 30, 3, 1 << 18);
                this.setHeads(jeanYves, commandsJY, jeanYvesHeadIds, 8 * 30 + 20, 9 * 30, 3, 1 << 18);
                this.setHeads(jeanYves, commandsJY, jeanYvesHeadIds, 13 * 30, 16 * 30, 3, 1 << 18);
                this.setHeads(jeanYves, commandsJY, jeanYvesHeadIds, 23 * 30, 26 * 30, 3, 1 << 18);

                trackJY.setCommands(commandsJY, 0);

                break;
            }

            case 18: {
                // Make speaking heads
                const jeanYves = actorMoveables[1],
                      jeanYvesHeadIds = [23, 24],
                      commandsJY: Array<any> = [],
                      trackJY = this.sceneData.animTracks[this.sceneData.objects[jeanYves.name].animationStartIndex];

                this.makeLayeredMesh(jeanYves);

                this.setHeads(jeanYves, commandsJY, jeanYvesHeadIds, 2 * 30 + 24, 8 * 30, 3, 1 << 18);
                this.setHeads(jeanYves, commandsJY, jeanYvesHeadIds, 11 * 30, 19 * 30, 3, 1 << 18);

                trackJY.setCommands(commandsJY, 0);

                break;
            }

            case 19: {
                // Make speaking heads
                const jeanYves = actorMoveables[1],
                      jeanYvesHeadIds = [23, 24],
                      commandsJY: Array<any> = [],
                      trackJY = this.sceneData.animTracks[this.sceneData.objects[jeanYves.name].animationStartIndex];

                this.makeLayeredMesh(jeanYves);

                this.setHeads(jeanYves, commandsJY, jeanYvesHeadIds, 9 * 30 + 24, 15 * 30 + 20, 3, 1 << 18);
                this.setHeads(jeanYves, commandsJY, jeanYvesHeadIds, 17 * 30, 26 * 30, 3, 1 << 18);
                this.setHeads(jeanYves, commandsJY, jeanYvesHeadIds, 27 * 30 + 15, 29 * 30 - 10, 3, 1 << 18);
                this.setHeads(jeanYves, commandsJY, jeanYvesHeadIds, 30 * 30 - 10, 33 * 30, 3, 1 << 18);
                this.setHeads(jeanYves, commandsJY, jeanYvesHeadIds, 34 * 30, 43 * 30, 3, 1 << 18);
                this.setHeads(jeanYves, commandsJY, jeanYvesHeadIds, 44 * 30 + 10, 48 * 30, 3, 1 << 18);

                trackJY.setCommands(commandsJY, 0);

                break;
            }

            case 20: {
                // Make speaking heads
                const jeanYves = actorMoveables[1],
                      jeanYvesHeadIds = [23, 24],
                      commandsJY: Array<any> = [],
                      trackJY = this.sceneData.animTracks[this.sceneData.objects[jeanYves.name].animationStartIndex];

                this.makeLayeredMesh(jeanYves);

                this.setHeads(jeanYves, commandsJY, jeanYvesHeadIds, 5 * 30, 10 * 30, 3, 1 << 18);
                this.setHeads(jeanYves, commandsJY, jeanYvesHeadIds, 11 * 30 - 10, 14 * 30 - 10, 3, 1 << 18);
                this.setHeads(jeanYves, commandsJY, jeanYvesHeadIds, 14 * 30 + 10, 17 * 30, 3, 1 << 18);
                this.setHeads(jeanYves, commandsJY, jeanYvesHeadIds, 24 * 30, 27 * 30 - 6, 3, 1 << 18);
                this.setHeads(jeanYves, commandsJY, jeanYvesHeadIds, 27 * 30 + 6, 28 * 30 - 8, 3, 1 << 18);
                this.setHeads(jeanYves, commandsJY, jeanYvesHeadIds, 29 * 30, 31 * 30, 3, 1 << 18);

                trackJY.setCommands(commandsJY, 0);

                break;
            }

            case 21: {
                // Handle the pole
                const lara = actorMoveables[0],
                      data = this.sceneData.objects[lara.name],
                      track1 = this.sceneData.animTracks[this.sceneData.objects[lara.name].animationStartIndex];

                const meshPole = this.objMgr.createMoveable(417, data.roomIndex, undefined, true, data.skeleton);

                data.layer.setMesh(LAYER.MESHSWAP, meshPole, 0);

                track1.setCommands([
                    { cmd: Commands.ANIMCMD_MISCACTIONONFRAME , params: [0,   Commands.Misc.ANIMCMD_MISC_CUSTOMFUNCTION, () => data.layer.updateMask(LAYER.MESHSWAP, MASK.ARM_R3)] },
                    { cmd: Commands.ANIMCMD_MISCACTIONONFRAME , params: [560, Commands.Misc.ANIMCMD_MISC_CUSTOMFUNCTION, () => data.layer.updateMask(LAYER.MESHSWAP, MASK.ARM_R3)] }
                ], 0);

                break;
            }

            case 23: {
                // Handle the visibility of the ankh
                const lara = actorMoveables[0],
                      track1 = this.sceneData.animTracks[this.sceneData.objects[lara.name].animationStartIndex];

                const seth = (this.objMgr.objectList['moveable'][345] as Array<IMesh>)[0],
                      layer = this.sceneData.objects[seth.name].layer as Layer;

                layer.updateMask(LAYER.MAIN, 1 << 11);

                track1.setCommands([
                    { cmd: Commands.ANIMCMD_MISCACTIONONFRAME , params: [555, Commands.Misc.ANIMCMD_MISC_CUSTOMFUNCTION, () => layer.updateMask(LAYER.MAIN, 1 << 11)] },
                    { cmd: Commands.ANIMCMD_MISCACTIONONFRAME , params: [655, Commands.Misc.ANIMCMD_MISC_CUSTOMFUNCTION, () => layer.updateMask(LAYER.MAIN, 1 << 11)] }
                ], 0);

                break;
            }

            case 24: {
                // Handle the pistols visibility during the dialog with the wounded guy
                const lara = actorMoveables[0],
                      laraHeadIds = [17, 18, 19, 20],
                      commandsL: Array<any> = [],
                      track1 = this.sceneData.animTracks[this.sceneData.objects[lara.name].animationStartIndex];

                track1.setCommands(commandsL, 0);

                commandsL.push(
                    { cmd: Commands.ANIMCMD_MISCACTIONONFRAME , params: [0,   Commands.Misc.ANIMCMD_MISC_GETLEFTGUN] },
                    { cmd: Commands.ANIMCMD_MISCACTIONONFRAME , params: [0,   Commands.Misc.ANIMCMD_MISC_GETRIGHTGUN] }
                );

                this.setHeads(lara, commandsL, laraHeadIds, 3 * 30 - 10, 5 * 30 + 15, 3);
                this.setHeads(lara, commandsL, laraHeadIds, 17 * 30 - 10, 551, 3);

                commandsL.push(
                    { cmd: Commands.ANIMCMD_MISCACTIONONFRAME , params: [552, Commands.Misc.ANIMCMD_MISC_GETLEFTGUN] },
                    { cmd: Commands.ANIMCMD_MISCACTIONONFRAME , params: [552, Commands.Misc.ANIMCMD_MISC_GETRIGHTGUN] }
                );

                this.setHeads(lara, commandsL, laraHeadIds, 553, 22 * 30, 3);
                this.setHeads(lara, commandsL, laraHeadIds, 53 * 30, 53 * 30 + 22, 3);
                this.setHeads(lara, commandsL, laraHeadIds, 59 * 30, 60 * 30 + 4, 3);

                // Make speaking heads
                const aziz = actorMoveables[1],
                      azizHeadIds = [21, 22],
                      commandsA: Array<any> = [],
                      trackA = this.sceneData.animTracks[this.sceneData.objects[aziz.name].animationStartIndex];

                this.makeLayeredMesh(aziz);

                trackA.setCommands(commandsA, 0);

                this.setHeads(aziz, commandsA, azizHeadIds, 23 * 30, 32 * 30, 3);
                this.setHeads(aziz, commandsA, azizHeadIds, 38 * 30, 52 * 30, 3);
                this.setHeads(aziz, commandsA, azizHeadIds, 56 * 30, 59 * 30 - 10, 3);
                this.setHeads(aziz, commandsA, azizHeadIds, 61 * 30, 70 * 30, 3);

                break;
            }

            case 25: {
                // Make speaking heads
                const aziz = actorMoveables[1],
                      azizHeadIds = [21, 22],
                      commandsA: Array<any> = [],
                      trackA = this.sceneData.animTracks[this.sceneData.objects[aziz.name].animationStartIndex];

                this.makeLayeredMesh(aziz);

                trackA.setCommands(commandsA, 0);

                const lara = actorMoveables[0],
                      laraHeadIds = [17, 18, 19, 20],
                      commandsL: Array<any> = [],
                      trackL = this.sceneData.animTracks[this.sceneData.objects[lara.name].animationStartIndex];

                trackL.setCommands(commandsL, 0);

                this.setHeads(aziz, commandsA, azizHeadIds, 9 * 30 + 20, 15 * 30, 3);
                this.setHeads(aziz, commandsA, azizHeadIds, 19 * 30 + 20, 20 * 30, 3);
                this.setHeads(aziz, commandsA, azizHeadIds, 20 * 30, 32 * 30, 3);
                this.setHeads(lara, commandsL, laraHeadIds, 32 * 30, 35 * 30 + 10, 3);
                this.setHeads(aziz, commandsA, azizHeadIds, 36 * 30 + 15, 38 * 30 + 15, 3);
                this.setHeads(aziz, commandsA, azizHeadIds, 40 * 30, 43 * 30, 3);
                this.setHeads(lara, commandsL, laraHeadIds, 43 * 30 + 18, 44 * 30 + 10, 3);
                this.setHeads(aziz, commandsA, azizHeadIds, 49 * 30, 68 * 30, 3);
                this.setHeads(lara, commandsL, laraHeadIds, 68 * 30 + 15, 72 * 30 + 10, 3);
                this.setHeads(aziz, commandsA, azizHeadIds, 74 * 30 - 10, 76 * 30, 3);
                this.setHeads(aziz, commandsA, azizHeadIds, 77 * 30 + 15, 93 * 30 + 15, 3);
                this.setHeads(lara, commandsL, laraHeadIds, 94 * 30, 95 * 30, 3);
                this.setHeads(aziz, commandsA, azizHeadIds, 98 * 30, 111 * 30, 3);

                break;
            }

            case 26: {
                // Make speaking heads
                const aziz = actorMoveables[1],
                      azizHeadIds = [21, 22],
                      commandsA: Array<any> = [],
                      trackA = this.sceneData.animTracks[this.sceneData.objects[aziz.name].animationStartIndex];

                this.makeLayeredMesh(aziz);

                trackA.setCommands(commandsA, 0);

                this.setHeads(aziz, commandsA, azizHeadIds, 3 * 30 + 10, 14 * 30 + 10, 3);

                break;
            }
        }

        return promises;
    }

    protected makeLayeredMesh(mesh: IMesh): void {
        const data = this.sceneData.objects[mesh.name];

        if (!data.layer) {
            data.layer = new Layer(mesh, this.gameData);
        }
    }

    public setHeads(mesh: IMesh, commands: Array<any>, ids: Array<number>, startFrame: number, endFrame: number, frameStep: number = 6, headMask: number = MASK.HEAD, shaderFunc?: (obj: IMesh) => void): void {
        const data = this.sceneData.objects[mesh.name];

        const heads: Array<IMeshBuilder> = [];

        ids.forEach((id) => {
            const head = this.objMgr.createMoveable(id, -1, undefined, true, data.skeleton) as IMesh,
                  meshb = Engine.makeMeshBuilder(head);

            if (shaderFunc) {
                shaderFunc(head);
            }

            meshb.makeSkinIndicesList();
            heads.push(meshb);
        });

        let frame = startFrame,
            frameEnd = endFrame;

        let i = 0;
        while (frame <= frameEnd) {
            let func = (head: IMeshBuilder) => ((action: number, obj: IMesh, mode: CommandDispatchMode) => this.setHead(mode, data.layer, head, headMask));

            commands.push(
                { cmd: Commands.ANIMCMD_MISCACTIONONFRAME , params: [frame, Commands.Misc.ANIMCMD_MISC_CUSTOMFUNCTION, func(heads[i])] }
            );

            frame += frameStep;
            i = (i + 1) % heads.length;
        }

        commands.push(
            { cmd: Commands.ANIMCMD_MISCACTIONONFRAME , params: [frameEnd +  1, Commands.Misc.ANIMCMD_MISC_CUSTOMFUNCTION, (action: number, obj: IMesh, mode: CommandDispatchMode) => this.resetHead(mode, data.layer)] }
        );
    }

    protected setHead(mode: CommandDispatchMode, layer: Layer, head: IMeshBuilder, headMask: number): void {
        switch (mode) {
            case CommandDispatchMode.UNDO_END: {
                if (layer.getMeshBuilder(LAYER.MESHSWAP)) {
                    layer.setMask(layer.getMeshBuilder(LAYER.MESHSWAP) as IMeshBuilder, 0);
                }
                layer.setMask(layer.getMeshBuilder(LAYER.MAIN) as IMeshBuilder, MASK.ALL);
                break;
            }

            case CommandDispatchMode.NORMAL: {
                if (layer.getMeshBuilder(LAYER.MESHSWAP)) {
                    layer.setMask(layer.getMeshBuilder(LAYER.MESHSWAP) as IMeshBuilder, 0);
                }
                layer.setMeshBuilder(LAYER.MESHSWAP, head, 0);
                layer.setMask(head, headMask);
                //layer.setMask(layer.getMeshBuilder(LAYER.MAIN) as IMeshBuilder, MASK.ALL & ~headMask);
                layer.setRoom(this.gameData.sceneData.objects[(layer.getMeshBuilder(LAYER.MAIN) as IMeshBuilder).mesh.name].roomIndex);
                break;
            }
        }
    }

    protected resetHead(mode: CommandDispatchMode, layer: Layer): void {
        switch (mode) {
            case CommandDispatchMode.NORMAL: {
                if (layer.getMeshBuilder(LAYER.MESHSWAP)) {
                    layer.setMask(layer.getMeshBuilder(LAYER.MESHSWAP) as IMeshBuilder, 0);
                }
                layer.setMask(layer.getMeshBuilder(LAYER.MAIN) as IMeshBuilder,     MASK.ALL);
                break;
            }
        }
    }

    public fadeOut(duration: number, mode: CommandDispatchMode): void {
        if (mode === CommandDispatchMode.NORMAL) {
            jQuery(this.gameData.container).fadeOut(duration * 1000);
        } else if (mode === CommandDispatchMode.UNDO) {
            jQuery(this.gameData.container).stop();
            jQuery(this.gameData.container).fadeIn(0);
        }
    }

    public fadeIn(duration: number, mode: CommandDispatchMode): void {
        if (mode === CommandDispatchMode.NORMAL) {
            jQuery(this.gameData.container).fadeIn(duration * 1000);
        }
    }

    // Between cutscene 1 and 2, a hole should appear in the ground to reveal hidden entrance to pyramid
    public cs1MakeHole(mode: CommandDispatchMode): void {
        let stateR1 = this._holeDone ? this._holeNotDoneR1 : this._holeDoneR1,
            stateR2 = this._holeDone ? this._holeNotDoneR2 : this._holeDoneR2;

        let oroom = this.objMgr.objectList['room'][81] as IMesh;
        let mshBld = Engine.makeMeshBuilder(oroom);

        mshBld.setIndexAndGroupsState(stateR1);

        oroom = this.objMgr.objectList['room'][80] as IMesh;
        mshBld = Engine.makeMeshBuilder(oroom);

        mshBld.setIndexAndGroupsState(stateR2);

        this._holeDone = !this._holeDone;
    }

    protected prepareHole(): void {
        // First room
        let oroom = this.objMgr.objectList['room'][81] as IMesh;

        let mshBld = Engine.makeMeshBuilder(oroom);

        this._holeNotDoneR1 = mshBld.getIndexAndGroupState();

        let newFaces = [
            mshBld.copyFace(118),
            mshBld.copyFace(120),
            mshBld.copyFace(120),
            mshBld.copyFace(118),
            mshBld.copyFace(117),
            mshBld.copyFace(49)
        ];

        newFaces[0].v1[0] = newFaces[0].v3[0];
        newFaces[0].v1[2] = newFaces[0].v3[2];
        newFaces[0].uv1 = [newFaces[4].uv1[0], newFaces[4].uv2[1]];
        newFaces[0].uv2 = [newFaces[4].uv2[0], newFaces[4].uv2[1]];
        newFaces[0].uv3 = [newFaces[4].uv1[0], newFaces[4].uv1[1]];

        newFaces[1].v1[0] = newFaces[1].v3[0];
        newFaces[1].v1[2] = newFaces[1].v3[2];

        newFaces[2].v2[0] = newFaces[2].v3[0];
        newFaces[2].v2[2] = newFaces[2].v3[2];
        newFaces[2].uv1 = [newFaces[5].uv1[0], newFaces[5].uv1[1]];
        newFaces[2].uv2 = [newFaces[5].uv2[0], newFaces[5].uv1[1]];
        newFaces[2].uv3 = [newFaces[5].uv2[0], newFaces[5].uv2[1]];

        newFaces[3].v2[0] = newFaces[3].v3[0];
        newFaces[3].v2[2] = newFaces[3].v3[2];

        mshBld.removeFaces(new Set([
            49, 116, 117, 118, 119, 120,
        ]));

        mshBld.createFaces(newFaces, 1);

        this._holeDoneR1 = mshBld.getIndexAndGroupState();

        // Second room
        oroom = this.objMgr.objectList['room'][80] as IMesh;

        mshBld = Engine.makeMeshBuilder(oroom);

        this._holeNotDoneR2 = mshBld.getIndexAndGroupState();

        newFaces = [
            mshBld.copyFace(126),
            mshBld.copyFace(126),
            mshBld.copyFace(128),
            mshBld.copyFace(128),
            mshBld.copyFace(134),
            mshBld.copyFace(63)
        ];

        mshBld.removeFaces(new Set([
            63, 126, 127, 128, 129, 134
        ]));

        newFaces[0].v1[0] = newFaces[0].v3[0];
        newFaces[0].v1[2] = newFaces[0].v3[2];

        newFaces[1].v2[0] = newFaces[1].v3[0];
        newFaces[1].v2[2] = newFaces[1].v3[2];
        newFaces[1].uv1 = [newFaces[4].uv1[0], newFaces[4].uv1[1]];
        newFaces[1].uv2 = [newFaces[4].uv2[0], newFaces[4].uv1[1]];
        newFaces[1].uv3 = [newFaces[4].uv2[0], newFaces[4].uv2[1]];

        newFaces[2].v2[0] = newFaces[2].v3[0];
        newFaces[2].v2[2] = newFaces[2].v3[2];

        newFaces[3].v1[0] = newFaces[3].v3[0];
        newFaces[3].v1[2] = newFaces[3].v3[2];
        newFaces[3].uv1 = [newFaces[5].uv1[0], newFaces[5].uv2[1]];
        newFaces[3].uv2 = [newFaces[5].uv2[0], newFaces[5].uv2[1]];
        newFaces[3].uv3 = [newFaces[5].uv1[0], newFaces[5].uv1[1]];

        mshBld.createFaces(newFaces, 2);

        this._holeDoneR2 = mshBld.getIndexAndGroupState();
    }

}
