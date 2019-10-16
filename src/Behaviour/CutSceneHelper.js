Object.assign( TRN.Behaviours.CutScene.prototype, {

    prepareLevel : function(trVersion, levelName, csIndex, actorMoveables) {
        if (trVersion == 'TR2') {
            if (levelName == 'cut3.tr2') {
                // bad guys are not at the right location
                const black = this.objMgr.objectList['moveable']['98'][0],
                      red = this.objMgr.objectList['moveable']['97'][0];

                black.quaternion.set(0, 1, 0, 0); // 180 deg rotation
                black.position.set(16900, -5632, -7680);

                red.position.set(20000, -5632, -10700);
            }
        }

        switch(csIndex) {
            case 1: {
                // Handle the shovel / Make a hole in the ground / Add a fade-in/out between animation #1 and #2 (so that we don't see the hole pop...)
                const lara = actorMoveables[0],
                      data = this.sceneData.objects[lara.name],
                      track1 = this.sceneData.animTracks[this.sceneData.objects[lara.name].animationStartIndex],
                      track2 = this.sceneData.animTracks[this.sceneData.objects[lara.name].animationStartIndex + 1];
                
                const meshShovel = this.objMgr.createMoveable(417, data.roomIndex, undefined, true, data.skeleton);

                data.layer.setMesh(TRN.Layer.LAYER.MESHSWAP, meshShovel, 0);

                track1.setCommands([
                    { cmd:TRN.Animation.Commands.ANIMCMD_MISCACTIONONFRAME , params: [24,  TRN.Animation.Commands.Misc.ANIMCMD_MISC_CUSTOMFUNCTION, () => data.layer.updateMask(TRN.Layer.LAYER.MESHSWAP, TRN.Layer.MASK.ARM_L3)] },
                    { cmd:TRN.Animation.Commands.ANIMCMD_MISCACTIONONFRAME , params: [230, TRN.Animation.Commands.Misc.ANIMCMD_MISC_CUSTOMFUNCTION, () => this.fadeOut(1.0)] }
                ], 0);

                track2.setCommands([
                    { cmd:TRN.Animation.Commands.ANIMCMD_MISCACTIONONFRAME , params: [27,  TRN.Animation.Commands.Misc.ANIMCMD_MISC_CUSTOMFUNCTION, this.cs1MakeHole.bind(this)] },
                    { cmd:TRN.Animation.Commands.ANIMCMD_MISCACTIONONFRAME , params: [30,  TRN.Animation.Commands.Misc.ANIMCMD_MISC_CUSTOMFUNCTION, () => this.fadeIn(1.0)] },
                    { cmd:TRN.Animation.Commands.ANIMCMD_MISCACTIONONFRAME , params: [147, TRN.Animation.Commands.Misc.ANIMCMD_MISC_CUSTOMFUNCTION, () => data.layer.updateMask(TRN.Layer.LAYER.MESHSWAP, TRN.Layer.MASK.ARM_L3)] }
                ], 0);

                break;
            }

            case 2: {
                // Handle the shovel
                const lara = actorMoveables[0],
                      data = this.sceneData.objects[lara.name],
                      track1 = this.sceneData.animTracks[this.sceneData.objects[lara.name].animationStartIndex];
                
                const meshShovel = this.objMgr.createMoveable(417, data.roomIndex, undefined, true, data.skeleton);

                data.layer.setMesh(TRN.Layer.LAYER.MESHSWAP, meshShovel, 0);

                track1.setCommands([
                    { cmd:TRN.Animation.Commands.ANIMCMD_MISCACTIONONFRAME , params: [0,   TRN.Animation.Commands.Misc.ANIMCMD_MISC_CUSTOMFUNCTION, this.cs1MakeHole.bind(this)] },
                    { cmd:TRN.Animation.Commands.ANIMCMD_MISCACTIONONFRAME , params: [0,   TRN.Animation.Commands.Misc.ANIMCMD_MISC_CUSTOMFUNCTION, () => data.layer.updateMask(TRN.Layer.LAYER.MESHSWAP, TRN.Layer.MASK.ARM_L3)] },
                    { cmd:TRN.Animation.Commands.ANIMCMD_MISCACTIONONFRAME , params: [147, TRN.Animation.Commands.Misc.ANIMCMD_MISC_CUSTOMFUNCTION, () => data.layer.updateMask(TRN.Layer.LAYER.MESHSWAP, TRN.Layer.MASK.ARM_L3)] }
                ], 0);

                break;
            }

            case 4: {
                // Handle the pistols visibility during the fight with the scorpion
                const lara = actorMoveables[0],
                      track1 = this.sceneData.animTracks[this.sceneData.objects[lara.name].animationStartIndex];

                track1.setCommands([
                    { cmd:TRN.Animation.Commands.ANIMCMD_MISCACTIONONFRAME , params: [0,   TRN.Animation.Commands.Misc.ANIMCMD_MISC_GETLEFTGUN] },
                    { cmd:TRN.Animation.Commands.ANIMCMD_MISCACTIONONFRAME , params: [0,   TRN.Animation.Commands.Misc.ANIMCMD_MISC_GETRIGHTGUN] },
                    { cmd:TRN.Animation.Commands.ANIMCMD_MISCACTIONONFRAME , params: [320, TRN.Animation.Commands.Misc.ANIMCMD_MISC_GETLEFTGUN] },
                    { cmd:TRN.Animation.Commands.ANIMCMD_MISCACTIONONFRAME , params: [320, TRN.Animation.Commands.Misc.ANIMCMD_MISC_GETRIGHTGUN] }
                ], 0);

                break;
            }

            case 7:
            case 8:
            case 9: {
                // Add volumetric fog in the rooms / objects
                const rooms  = new Set([0, 1, 2, 3, 4, 5, 6, 7, 8, 110, 111, 112, 113, 114, 115, 116, 117, 122, 123]),
                      shader = this.shdMgr.getFragmentShader("volumetric_fog");

                this.scene.traverse( (obj) => {
                    const data = this.sceneData.objects[obj.name];

                    if (data && rooms.has(data.roomIndex) || actorMoveables.indexOf(obj) >= 0) {
                        const materials = obj.material;
                        for (let m = 0; m < materials.length; ++m) {
                            const material = materials[m];

                            material.fragmentShader = shader;
                            material.uniforms.volFogCenter = { "type": "f3", "value": [52500.0, 3140.0, -49460.0] };
                            material.uniforms.volFogRadius = { "type": "f",  "value": 6000 };
                            material.uniforms.volFogColor =  { "type": "f3", "value": [0.1, 0.75, 0.3] };
                        }
                    }
                });

                break;
            }

            case 10: {
                // Scroll that Lara is reading is not well positionned at start - move and rotate it
                const oscroll = this.objMgr.objectList['staticmesh']['20'][2],
                      q = glMatrix.quat.create();

                glMatrix.quat.setAxisAngle(q, [0,1,0], glMatrix.glMatrix.toRadian(60));

                oscroll.quaternion.set(q[0], q[1], q[2], q[3]);
                oscroll.position.x += 850;

                oscroll.updateMatrix();
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

                data.layer.setMesh(TRN.Layer.LAYER.MESHSWAP, meshPole, 0);

                track1.setCommands([
                    { cmd:TRN.Animation.Commands.ANIMCMD_MISCACTIONONFRAME , params: [0,   TRN.Animation.Commands.Misc.ANIMCMD_MISC_CUSTOMFUNCTION, () => data.layer.updateMask(TRN.Layer.LAYER.MESHSWAP, TRN.Layer.MASK.ARM_R3)] },
                    { cmd:TRN.Animation.Commands.ANIMCMD_MISCACTIONONFRAME , params: [560, TRN.Animation.Commands.Misc.ANIMCMD_MISC_CUSTOMFUNCTION, () => data.layer.updateMask(TRN.Layer.LAYER.MESHSWAP, TRN.Layer.MASK.ARM_R3)] }
                ], 0);

                break;
            }

            case 24: {
                // Handle the pistols visibility during the dialog with the wounded guy
                const lara = actorMoveables[0],
                      track1 = this.sceneData.animTracks[this.sceneData.objects[lara.name].animationStartIndex];

                track1.setCommands([
                    { cmd:TRN.Animation.Commands.ANIMCMD_MISCACTIONONFRAME , params: [0,   TRN.Animation.Commands.Misc.ANIMCMD_MISC_GETLEFTGUN] },
                    { cmd:TRN.Animation.Commands.ANIMCMD_MISCACTIONONFRAME , params: [0,   TRN.Animation.Commands.Misc.ANIMCMD_MISC_GETRIGHTGUN] },
                    { cmd:TRN.Animation.Commands.ANIMCMD_MISCACTIONONFRAME , params: [552, TRN.Animation.Commands.Misc.ANIMCMD_MISC_GETLEFTGUN] },
                    { cmd:TRN.Animation.Commands.ANIMCMD_MISCACTIONONFRAME , params: [552, TRN.Animation.Commands.Misc.ANIMCMD_MISC_GETRIGHTGUN] }
                ], 0);

                break;
            }
        }
    },

    fadeOut : function(duration) {
        this.bhvMgr.addBehaviour('Fade', { "colorStart": [1, 1, 1], "colorEnd": [0, 0, 0], "duration": duration });
        //jQuery(this.gameData.container).fadeout(duration);
    },

    fadeIn : function(duration) {
        this.bhvMgr.addBehaviour('Fade', { "colorStart": [0, 0, 0], "colorEnd": [1, 1, 1], "duration": duration });
        //jQuery(this.gameData.container).fadein(duration);
    },

    // Between cutscene 1 and 2, a hole should appear in the ground to reveal hidden entrance to pyramid
    cs1MakeHole : function() {
        // First room
        let oroom = this.objMgr.objectList['room']['81'],
            data = this.sceneData.objects['room81'];

        if (data.__done) {
            return;
        }

        data.__done = true;

        let mshBld = new TRN.MeshBuilder(oroom);

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
            49,116,117,118,119,120,
        ]));

        mshBld.createFaces(newFaces, 1);

        // Second room
        oroom = this.objMgr.objectList['room']['80'];

        mshBld = new TRN.MeshBuilder(oroom);

        newFaces = [ 
            mshBld.copyFace(126),
            mshBld.copyFace(126),
            mshBld.copyFace(128),
            mshBld.copyFace(128),
            mshBld.copyFace(134),
            mshBld.copyFace(63)
        ];

        mshBld.removeFaces(new Set([ 
            63,126,127,128,129,134
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

});
