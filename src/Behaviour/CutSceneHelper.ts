import Engine from "../Proxy/Engine";
import { IMesh } from "../Proxy/IMesh";
import { IScene } from "../Proxy/IScene";

import IGameData from "../Player/IGameData";
import { ObjectManager } from "../Player/ObjectManager";
import { Ponytail } from "../Behaviour/Ponytail";
import { ShaderManager } from "../ShaderManager";
import { LAYER } from "../Player/Layer";
import { MASK } from "../Player/Skeleton";
import { Commands } from "../Animation/Commands";

declare var glMatrix: any;

export default class CutSceneHelper {

    private sceneData:  any;
    private gameData:   IGameData;
    private objMgr:     ObjectManager;
    private shdMgr:     ShaderManager;
    private scene:      IScene;

    constructor(gameData: IGameData) {
        this.gameData = gameData;
        this.sceneData = gameData.sceneData;
        this.objMgr = gameData.objMgr;
        this.shdMgr = gameData.shdMgr;
        this.scene = gameData.sceneRender;
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

                track1.setCommands([
                    { cmd: Commands.ANIMCMD_MISCACTIONONFRAME , params: [24,  Commands.Misc.ANIMCMD_MISC_CUSTOMFUNCTION, () => data.layer.updateMask(LAYER.MESHSWAP, MASK.ARM_L3)] },
                    { cmd: Commands.ANIMCMD_MISCACTIONONFRAME , params: [230, Commands.Misc.ANIMCMD_MISC_CUSTOMFUNCTION, () => this.fadeOut(1.0)] }
                ], 0);

                track2.setCommands([
                    { cmd: Commands.ANIMCMD_MISCACTIONONFRAME , params: [27,  Commands.Misc.ANIMCMD_MISC_CUSTOMFUNCTION, this.cs1MakeHole.bind(this)] },
                    { cmd: Commands.ANIMCMD_MISCACTIONONFRAME , params: [30,  Commands.Misc.ANIMCMD_MISC_CUSTOMFUNCTION, () => this.fadeIn(1.0)] },
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

                track1.setCommands([
                    { cmd: Commands.ANIMCMD_MISCACTIONONFRAME , params: [0,   Commands.Misc.ANIMCMD_MISC_CUSTOMFUNCTION, this.cs1MakeHole.bind(this)] },
                    { cmd: Commands.ANIMCMD_MISCACTIONONFRAME , params: [0,   Commands.Misc.ANIMCMD_MISC_CUSTOMFUNCTION, () => data.layer.updateMask(LAYER.MESHSWAP, MASK.ARM_L3)] },
                    { cmd: Commands.ANIMCMD_MISCACTIONONFRAME , params: [147, Commands.Misc.ANIMCMD_MISC_CUSTOMFUNCTION, () => data.layer.updateMask(LAYER.MESHSWAP, MASK.ARM_L3)] }
                ], 0);

                break;
            }

            case 4: {
                // Handle the pistols visibility during the fight with the scorpion
                const lara = actorMoveables[0],
                      track1 = this.sceneData.animTracks[this.sceneData.objects[lara.name].animationStartIndex];

                track1.setCommands([
                    { cmd: Commands.ANIMCMD_MISCACTIONONFRAME , params: [0,   Commands.Misc.ANIMCMD_MISC_GETLEFTGUN] },
                    { cmd: Commands.ANIMCMD_MISCACTIONONFRAME , params: [0,   Commands.Misc.ANIMCMD_MISC_GETRIGHTGUN] },
                    { cmd: Commands.ANIMCMD_MISCACTIONONFRAME , params: [320, Commands.Misc.ANIMCMD_MISC_GETLEFTGUN] },
                    { cmd: Commands.ANIMCMD_MISCACTIONONFRAME , params: [320, Commands.Misc.ANIMCMD_MISC_GETRIGHTGUN] }
                ], 0);

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
                }

                this.scene.traverse((obj) => {
                    const data = this.sceneData.objects[obj.name];

                    if (data && rooms.has(data.roomIndex) || actorMoveables.indexOf(obj) >= 0) {
                        setShader(obj);
                    }
                });

                (this.gameData.bhvMgr.getBehaviour("Ponytail") as Array<Ponytail>)[0].braids.forEach((braid) => setShader(braid.model));

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
                break;
            }

            case 15: {
                /*const uniforms = [];
                for (let a = 0; a < actorMoveables.length; ++a) {
                    const obj = actorMoveables[a];
                    for (let i = 0; i < obj.material.length; ++i) {
                        const material = obj.material[i];
                        uniforms.push({ a:material.uniforms.tintColor.value, i:0 });
                    }
                }
                this.bhvMgr.addBehaviour('FadeUniformColor',
                    {
                        "colorStart":   [1,1,1],
                        "colorEnd":     [3.5,3.5,3.5],
                        "duration":     3.0,
                        "uniforms":     uniforms
                    });*/
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

            case 24: {
                // Handle the pistols visibility during the dialog with the wounded guy
                const lara = actorMoveables[0],
                      track1 = this.sceneData.animTracks[this.sceneData.objects[lara.name].animationStartIndex];

                track1.setCommands([
                    { cmd: Commands.ANIMCMD_MISCACTIONONFRAME , params: [0,   Commands.Misc.ANIMCMD_MISC_GETLEFTGUN] },
                    { cmd: Commands.ANIMCMD_MISCACTIONONFRAME , params: [0,   Commands.Misc.ANIMCMD_MISC_GETRIGHTGUN] },
                    { cmd: Commands.ANIMCMD_MISCACTIONONFRAME , params: [552, Commands.Misc.ANIMCMD_MISC_GETLEFTGUN] },
                    { cmd: Commands.ANIMCMD_MISCACTIONONFRAME , params: [552, Commands.Misc.ANIMCMD_MISC_GETRIGHTGUN] }
                ], 0);

                break;
            }
        }

        return promises;
    }

    public fadeOut(duration: number): void {
        //this.bhvMgr.addBehaviour('Fade', { "colorStart": [1, 1, 1], "colorEnd": [0, 0, 0], "duration": duration });
        jQuery(this.gameData.container).fadeOut(duration * 1000);
    }

    public fadeIn(duration: number): void {
        //this.bhvMgr.addBehaviour('Fade', { "colorStart": [0, 0, 0], "colorEnd": [1, 1, 1], "duration": duration });
        jQuery(this.gameData.container).fadeIn(duration * 1000);
    }

    // Between cutscene 1 and 2, a hole should appear in the ground to reveal hidden entrance to pyramid
    public cs1MakeHole(): void {
        // First room
        let oroom = this.objMgr.objectList['room'][81] as IMesh,
            data = this.sceneData.objects['room81'];

        if (data.__done) {
            return;
        }

        data.__done = true;

        let mshBld = Engine.makeMeshBuilder(oroom);

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

        // Second room
        oroom = this.objMgr.objectList['room'][80] as IMesh;

        mshBld = Engine.makeMeshBuilder(oroom);

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
    }

}
