Object.assign( TRN.Behaviours.CutScene.prototype, {

    makeTR4Cutscene : function(icutscene) {
        const cutscene = [];
        jQuery.ajax({
            type: "GET",
            url: 'TRN/level/tr4/TR4_cutscenes/cut' + icutscene + '.json',
            dataType: "json",
            cache: false,
            async: false
        }).done(function(data) { cutscene.push(data); });

        cutscene[0].index = icutscene;

        if (cutscene[0].index == 1) {
            jQuery.ajax({
                type: "GET",
                url: 'TRN/level/tr4/TR4_cutscenes/cut' + (icutscene+1) + '.json',
                dataType: "json",
                cache: false,
                async: false
            }).done(function(data) { cutscene.push(data); });

            cutscene[1].index = icutscene+1;
        }

        // get the sound for this cut scene
        const promiseSound = cutscene[0].info.audio ? TRN.Helper.loadSoundAsync(this.sceneData.soundPath + cutscene[0].info.audio + '.aac') : Promise.resolve(null);

        this.makeCutsceneData(cutscene);

        return promiseSound;
    },

    makeCutsceneData : function(cutscenes) {

        const ocs = this.cutscene,
              cutscene = cutscenes[0];

        ocs.position.x = cutscene.originX;
        ocs.position.y = -cutscene.originY;
        ocs.position.z = -cutscene.originZ;
        ocs.quaternion.x = ocs.quaternion.y = ocs.quaternion.z = 0;
        ocs.quaternion.z = 1;

        // hide moveables (except Lara) that are already in the level and that are referenced in the cutscene (we will create them later)
        const idInCutscenes = {};
        for (let ac = 0; ac < cutscene.actors.length; ++ac) {
            const id = cutscene.actors[ac].slotNumber;
            idInCutscenes[id] = true;
        }

        for (let objID in  this.sceneData.objects) {
            const objData = this.sceneData.objects[objID];
            if (objData.type == 'moveable' && objData.roomIndex != -1 && objData.objectid != TRN.ObjectID.Lara && objData.objectid in idInCutscenes) {
                objData.visible = false;
                this.scene.getObjectByName(objID).visible = false;
            }
        }

        const lara = this.objMgr.objectList['moveable'][TRN.ObjectID.Lara][0],
              laraRoomIndex = this.sceneData.objects[lara.name].roomIndex;

        // create moveable instances used in cutscene
        const actorMoveables = [];

        for (let ac = 0; ac < cutscene.actors.length; ++ac) {
            const id = cutscene.actors[ac].slotNumber;
            let mvb = lara;

            if (id != TRN.ObjectID.Lara) {
                mvb = this.objMgr.createMoveable(id, laraRoomIndex, undefined, true, false);
            }

            actorMoveables.push(mvb);

            mvb.position.set(ocs.position.x, ocs.position.y, ocs.position.z);
            mvb.quaternion.set(0, 0, 0, 1);
        }

        // create actor frames
        for (let ac = 0; ac < cutscene.actors.length; ++ac) {
            const actor = cutscene.actors[ac],
                  animation = this.makeAnimationForActor(cutscene, actor, "anim_cutscene_actor" + ac);

            this.sceneData.objects[actorMoveables[ac].name].animationStartIndex = this.sceneData.animTracks.length;

            const oanimation = TRN.Animation.addTrack(animation, this.sceneData.animTracks);
            
            if (cutscene.index == 1 && ac == 0) {
                // special case for cutscene #1: we add the animation for cutscene #2 as #1+#2 is really the same cutscene
                const animationCont = this.makeAnimationForActor(cutscenes[1], cutscenes[1].actors[ac], "anim_cutscene2_actor" + ac);

                oanimation.nextTrack = this.sceneData.animTracks.length;
                animationCont.nextTrack = this.sceneData.animTracks.length-1;

                TRN.Animation.addTrack(animationCont, this.sceneData.animTracks);
            }
        }

        // create camera frames
        let frames = this.makeAnimationForCamera(cutscene);

        if (cutscene.index == 1) {
            frames = frames.concat(this.makeAnimationForCamera(cutscenes[1]));
        }

        ocs.frames = frames;

        this.prepareLevel(this.confMgr.trversion, this.confMgr.levelName, cutscene.index, actorMoveables);
    },

    makeAnimationForActor : function(cutscene, actor, animName) {

        function makeQuaternion(angleX, angleY, angleZ) {

            angleX = 2 * Math.PI * (angleX % 1024) / 1024.0,
            angleY = 2 * Math.PI * (angleY % 1024) / 1024.0,
            angleZ = 2 * Math.PI * (angleZ % 1024) / 1024.0;
    
            const qx = glMatrix.quat.create(), 
                  qy = glMatrix.quat.create(), 
                  qz = glMatrix.quat.create();
    
            glMatrix.quat.setAxisAngle(qx, [1,0,0], angleX);
            glMatrix.quat.setAxisAngle(qy, [0,1,0], -angleY);
            glMatrix.quat.setAxisAngle(qz, [0,0,1], -angleZ);
    
            glMatrix.quat.multiply(qy, qy, qx);
            glMatrix.quat.multiply(qy, qy, qz);
    
            return qy;
        }

        var animation = {
            "fps": 30,
            "frameRate": 1,
            "keys": [],
            "name": animName,
            "nextTrack": this.sceneData.animTracks.length,
            "nextTrackFrame": 0,
            "numFrames": cutscene.numFrames,
            "numKeys": cutscene.numFrames,
            "frameStart": 0,
            "commands": []
        };

        const CST0 = 3;

        const prev = [];
        for (let m = 0; m < actor.meshes.length; ++m) {
            const mesh = actor.meshes[m],
                  posHdr = mesh.positionHeader;
                  rotHdr = mesh.rotationHeader;

            prev.push({
                "position": {
                    x: posHdr ? posHdr.startPosX*CST0 : 0,
                    y: posHdr ? -posHdr.startPosY*CST0 : 0,
                    z: posHdr ? -posHdr.startPosZ*CST0 : 0
                },
                "rotation": {
                    x: rotHdr.startRotX % 1024,
                    y: rotHdr.startRotY % 1024,
                    z: rotHdr.startRotZ % 1024
                }
            });
        }

        let realNumFrames = 0;
        for (let d = 0; d < cutscene.numFrames; ++d) {
            const key = {
                "time": d,
                "data": [],
                "boundingBox": {
                    xmin: -1e7, ymin: -1e7, zmin: -1e7,
                    xmax:  1e7, ymax:  1e7, zmax:  1e7
                }
            };

            let addKey = true;

            for (let m = 0; m < actor.meshes.length; ++m) {
                const mesh = actor.meshes[m],
                      posData = mesh.positionData,
                      rotData = mesh.rotationData;

                if (rotData.length <= d) {
                    addKey = false;
                    break;
                }

                let transX = 0, 
                    transY = 0, 
                    transZ = 0;

                if (posData) {
                    transX =  posData.dx[d]*CST0;
                    transY = -posData.dy[d]*CST0;
                    transZ = -posData.dz[d]*CST0;
                }

                const cur = {
                    "position": {
                        x: transX + prev[m].position.x,
                        y: transY + prev[m].position.y,
                        z: transZ + prev[m].position.z
                    },
                    "rotation": {
                        x: (rotData.dx[d] + prev[m].rotation.x) % 1024, 
                        y: (rotData.dy[d] + prev[m].rotation.y) % 1024, 
                        z: (rotData.dz[d] + prev[m].rotation.z) % 1024
                    }
                };

                const quat = makeQuaternion(cur.rotation.x, cur.rotation.y, cur.rotation.z);

                key.data.push({
                    "position": 	{ x:cur.position.x, y:cur.position.y, z:cur.position.z },
                    "quaternion":	{ x:quat[0], y:quat[1], z:quat[2], w:quat[3] }
                });

                prev[m] = cur;
            }

            if (addKey) {
                realNumFrames = d;
                animation.keys.push(key);
            }
        }

        animation.numFrames = realNumFrames;

        return animation;
    },

    makeAnimationForCamera : function(cutscene) {
        // create camera frames
        const frames = [], 
              ocam = cutscene.camera, 
              CST = 2;

        let prev = {
            posX:       ocam.cameraHeader.startPosX*CST,    posY:       ocam.cameraHeader.startPosY*CST,    posZ:       ocam.cameraHeader.startPosZ*CST,
            targetX:    ocam.targetHeader.startPosX*CST,    targetY:    ocam.targetHeader.startPosY*CST,    targetZ:    ocam.targetHeader.startPosZ*CST
        };

        for (let d = 0; d < cutscene.numFrames; ++d) {
            if (ocam.cameraPositionData.dx.length <= d) {
                break;
            }
            const cur = {
                fov: 13000,
                roll: 0,
                
                posX: ocam.cameraPositionData.dx[d]*CST + prev.posX,
                posY: ocam.cameraPositionData.dy[d]*CST + prev.posY,
                posZ: ocam.cameraPositionData.dz[d]*CST + prev.posZ,

                targetX: ocam.targetPositionData.dx[d]*CST + prev.targetX,
                targetY: ocam.targetPositionData.dy[d]*CST + prev.targetY,
                targetZ: ocam.targetPositionData.dz[d]*CST + prev.targetZ
            };
            frames.push(cur);
            prev = cur;
        }

        return frames;
    }

});
