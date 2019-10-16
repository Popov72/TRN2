const noSound = true;

TRN.Behaviours.CutScene = function(nbhv, gameData) {
    this.nbhv = nbhv;
    this.gameData = gameData;
    this.bhvMgr = gameData.bhvMgr;
    this.confMgr = gameData.confMgr;
    this.anmMgr = gameData.anmMgr;
    this.matMgr = gameData.matMgr;
    this.objMgr = gameData.objMgr;
    this.trlvl = gameData.trlvl;
    this.shdMgr = gameData.shdMgr;
    this.scene = gameData.sceneRender;
    this.sceneData = gameData.sceneData;
    this.camera = gameData.camera;
    this.cutscene = this.sceneData.cutScene;
    this.cutSceneEnded = false;
}

TRN.Behaviours.CutScene.prototype = {

    constructor : TRN.Behaviours.CutScene,

    init : async function(lstObjs, resolve) {
        const useAddLights = this.nbhv.useadditionallights === 'true' || this.nbhv.useadditionallights === true, 
              index = this.nbhv.index || 0;

        this.matMgr.useAdditionalLights = useAddLights;
        this.cutscene = {
            "index":    index,
            "curFrame": 0
        };

        // set cutscene origin
        const lara = this.objMgr.objectList['moveable'][TRN.ObjectID.Lara][0];

        this.cutscene.frames = this.trlvl.trlevel.cinematicFrames;
        this.cutscene.position = lara.position;

        const laraQuat = lara.quaternion,
		      laraAngle = this.confMgr.float('behaviour[name="Lara"] > angle');
		if (laraAngle != undefined) {
			const q = glMatrix.quat.create();
            glMatrix.quat.setAxisAngle(q, [0,1,0], glMatrix.glMatrix.toRadian(laraAngle));
            laraQuat.x = q[0];
            laraQuat.y = q[1];
            laraQuat.z = q[2];
            laraQuat.w = q[3];
        }
        
        this.cutscene.quaternion = laraQuat;

        // update position/quaternion for some specific items when we play a cut scene
        const min = this.confMgr.number('cutscene > animminid', true, -1),
              max = this.confMgr.number('cutscene > animmaxid', true, -1),
              ids = this.confMgr.param('cutscene > animids', true),
              oids = new Set().add(TRN.ObjectID.Lara),
              moveables = this.objMgr.objectList['moveable'];

        if (ids) {
            ids.split(",").forEach( (id) => oids.add(parseInt(id)));
        }
        for (let objID in moveables) {
            const lstObj = moveables[objID];
            
            lstObj.forEach( (obj) => {
                const data = this.sceneData.objects[obj.name];

                if (data.objectid >= min && data.objectid <= max || oids.has(data.objectid)) {
                    obj.position.set(this.cutscene.position.x, this.cutscene.position.y, this.cutscene.position.z);
                    obj.quaternion.set(this.cutscene.quaternion.x, this.cutscene.quaternion.y, this.cutscene.quaternion.z, this.cutscene.quaternion.w);
                    if (data.layer) {
                        data.layer.update();
                    }
                }
            });
        }

        let promiseSound = Promise.resolve(null);

        if (index > 0) {
            promiseSound = this.makeTR4Cutscene(parseInt(index));
        } else {
            this.prepareLevel(this.confMgr.trversion, this.confMgr.levelName, 0, null);
            promiseSound = TRN.Helper.loadSoundAsync(this.sceneData.soundPath + this.sceneData.levelShortFileNameNoExt.toUpperCase());
        }

        this.makeObjectList();
        this.registerAnimations();

        return promiseSound.then( (ret) => {
            if (ret != null) {
                if (ret.code < 0) {
                    console.log('Error decoding sound data for cutscene.');
                } else {
                    this.cutscene.sound = ret.sound;
                }
            }
            resolve(TRN.Consts.Behaviour.retKeepBehaviour);
        });
    },

    makeObjectList : function() {
        const moveables = this.objMgr.objectList['moveable'];

        this.objects = {};
        for (let objID in moveables) {
            const lstObj = moveables[objID];
            for (let i = 0; i < lstObj.length; ++i) {
                const obj = lstObj[i],
                      data = this.sceneData.objects[obj.name];

                if (data.dummy || !data.has_anims || !data.visible) continue;

                this.objects[obj.name] = obj;
            }
        }
    },

    // register all animations we will need in the cut scene
    registerAnimations : function() {
        for (let objID in this.objects) {
            const obj = this.objects[objID], 
                  data = this.sceneData.objects[obj.name],
                  registered = {},
                  allTrackInstances = {};
            
            let anmIndex = data.animationStartIndex;

            while (true) {
                if (registered[anmIndex]) break;
                
                registered[anmIndex] = true;

                const track = this.sceneData.animTracks[anmIndex],
                      trackInstance = new TRN.Animation.TrackInstance(track, data.skeleton);

                allTrackInstances[anmIndex] = trackInstance;

                anmIndex = track.nextTrack;
            }

            data.allTrackInstances = allTrackInstances;

            const trackInstance = allTrackInstances[data.animationStartIndex];

            trackInstance.setNextTrackInstance(data.allTrackInstances[trackInstance.track.nextTrack], trackInstance.track.nextTrackFrame);
            trackInstance.setNoInterpolationToNextTrack = true;

            trackInstance.runForward(0);
            trackInstance.interpolate();

            data.trackInstance = trackInstance;

            data.prevTrackInstance = data.trackInstance;
            data.prevTrackInstanceFrame = 0;
        }
    },

    onBeforeRenderLoop : function() {
		if (this.cutscene.sound != null && !noSound) {
			TRN.Helper.startSound(this.cutscene.sound);
        }

        this.gameData.panel.hide();
    },

    frameStarted : function(curTime, delta) {
        if (this.cutSceneEnded) {
            return;
        }

		this.cutscene.curFrame += TRN.baseFrameRate * delta;

        // Update camera
		const t = this.cutscene.curFrame - Math.floor(this.cutscene.curFrame),
		      cfrmA = Math.min(Math.floor(this.cutscene.curFrame), this.cutscene.frames.length-2),
		      cfrmB = Math.min(cfrmA+1, this.cutscene.frames.length-1);

		if (cfrmA < this.cutscene.frames.length-2) {
            const bhvCtrl = this.bhvMgr.getBehaviour("BasicControl")[0];
			if (!bhvCtrl.captureMouse) {
				const frm1 = this.cutscene.frames[cfrmA],
				      frm2 = this.cutscene.frames[cfrmB],
                      maxDelta = 512.0 * 512.0, 
                      fovMult = 60.0 / 16384.0, 
                      rollMult = -90.0 / 16384.0;

                const dp = (new THREE.Vector3(frm1.posX, -frm1.posY, -frm1.posZ)).sub(new THREE.Vector3(frm2.posX, -frm2.posY, -frm1.posZ)).lengthSq(),
                      dt = (new THREE.Vector3(frm1.targetX, -frm1.targetY, -frm1.targetZ)).sub(new THREE.Vector3(frm2.targetX, -frm2.targetY, -frm1.targetZ)).lengthSq();
                
                const eyePos = new THREE.Vector3(frm1.posX, -frm1.posY, -frm1.posZ),
                      lkat = new THREE.Vector3(frm1.targetX, -frm1.targetY, -frm1.targetZ);
                
                let fov = frm1.fov * fovMult,
				    roll = frm1.roll * rollMult;

                if (dp <= maxDelta && dt <= maxDelta) {
                    eyePos.lerp(new THREE.Vector3(frm2.posX, -frm2.posY, -frm2.posZ), t);
                    lkat.lerp(new THREE.Vector3(frm2.targetX, -frm2.targetY, -frm2.targetZ), t);
                    fov = TRN.Helper.lerp(frm1.fov * fovMult, frm2.fov * fovMult, t);
                    roll = TRN.Helper.lerp(frm1.roll * rollMult, frm2.roll * rollMult, t);
                }

				const q = this.cutscene.quaternion.clone();

				lkat.applyQuaternion(q);

				this.camera.fov = fov;
				this.camera.position.set(eyePos.x, eyePos.y, eyePos.z);
				this.camera.position.applyQuaternion(q);
				this.camera.lookAt(lkat);
                this.camera.position.add(this.cutscene.position);
				this.camera.quaternion.multiplyQuaternions(q.setFromAxisAngle( {x:0,y:1,z:0}, THREE.Math.degToRad(roll) ), this.camera.quaternion);
				this.camera.updateProjectionMatrix();
			}

		} else {
            this.cutSceneEnded = true;
            this.anmMgr.pause(true);
		}
    },

    frameEnded : function(curTime, delta) {
        // Update object lights (only in TR4 cutscenes)
        if (this.cutscene.index <= 0) {
            return;
        }

        for (let objID in this.objects) {
            const obj = this.objects[objID], 
                    data = this.sceneData.objects[obj.name];

            const pos = { x:obj.position.x, y:obj.position.y, z:obj.position.z };

            pos.x += data.skeleton.bones[0].position.x;
            pos.y += data.skeleton.bones[0].position.y;
            pos.z += data.skeleton.bones[0].position.z;

            //const roomObj = this.trlvl.getRoomByPos(pos);
            const roomObj = this.objMgr.getRoomByPos(pos);

            if (roomObj >= 0 && roomObj != data.roomIndex) {
                const dataCurRoom = this.sceneData.objects['room' + data.roomIndex], 
                        curRoomLights = this.matMgr.useAdditionalLights ? dataCurRoom.lightsExt : dataCurRoom.lights,
                        curLIdx = this.matMgr.getFirstDirectionalLight(curRoomLights);
                const dataNewRoom = this.sceneData.objects['room' + roomObj],
                        newRoomLights = this.matMgr.useAdditionalLights ? dataNewRoom.lightsExt : dataNewRoom.lights,
                        newLIdx = this.matMgr.getFirstDirectionalLight(newRoomLights);

                data.roomIndex = roomObj;

                this.matMgr.setUniformsFromRoom(obj, roomObj);

                if (data.layer) {
                    data.layer.setRoom(roomObj);
                }

                if (curLIdx >= 0 && newLIdx >= 0) {
                    const uniforms = [];
                    for (let i = 0; i < obj.material.length; ++i) {
                        const material = obj.material[i];
                        uniforms.push({ a:material.uniforms.directionalLight_color.value, i:0 });
                    }
                    this.bhvMgr.addBehaviour('FadeUniformColor', 
                        { 
                            "colorStart":   curRoomLights[curLIdx].color, 
                            "colorEnd":     newRoomLights[newLIdx].color, 
                            "duration":     1.0,
                            "uniforms":     uniforms
                        });
                }
            }
        }
    }
}
