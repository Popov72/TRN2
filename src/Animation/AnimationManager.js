TRN.AnimationManager = function() {
    this.paused = false;
}

TRN.AnimationManager.prototype = {

    constructor : TRN.AnimationManager,

    initialize : function(gameData) {
        this.gameData = gameData;
        this.sceneData = gameData.sceneData;
        this.matMgr = gameData.matMgr;
        this.objMgr = gameData.objMgr;
        this.trversion = gameData.confMgr.trversion;
    
        this.makeTracks();
    },

    pause : function(pause) {
        this.paused = pause;
    },

    makeTracks : function() {
        var animTracks = [];

        // create one track per animation
        for (var t = 0; t < this.sceneData.animTracks.length; ++t) {
            TRN.Animation.addTrack(this.sceneData.animTracks[t], animTracks);
        }

        this.sceneData.animTracks = animTracks;
    },

    setAnimation : function (obj, animIndex, desynchro) {
        var data = this.sceneData.objects[obj.name],
            track = this.sceneData.animTracks[animIndex + data.animationStartIndex],
            trackInstance = track ? new TRN.Animation.TrackInstance(track, data.skeleton) : null;

        if (trackInstance) {
            trackInstance.setNextTrackInstance(trackInstance, track.nextTrackFrame);

            trackInstance.runForward(desynchro ? Math.random()*track.getLength() : 0);
            trackInstance.interpolate();

            data.trackInstance = trackInstance;
            data.prevTrackInstance = data.trackInstance;
            data.prevTrackInstanceFrame = 0;
        }

        return trackInstance;
    },

	animateObjects : function(delta) {
        if (this.paused) {
            return;
        }

        var animatables = this.objMgr.objectList['moveable'];

		for (var objID in animatables) {
            var lstObj = animatables[objID];
            
            for (var i = 0; i < lstObj.length; ++i) {
                var obj = lstObj[i];

                data = this.sceneData.objects[obj.name];

                if (data.has_anims && data.trackInstance && (obj.visible || this.gameData.isCutscene)) {
                    if (!data.trackInstance.runForward(delta)) {
                        // it's the end of the current track and we are in a cut scene => we link to the next track
                        var trackInstance = data.trackInstance;

                        var nextTrackFrame = trackInstance.track.nextTrackFrame + trackInstance.param.curFrame - trackInstance.track.numFrames;//trackInstance.param.interpFactor;
                        
                        trackInstance = data.allTrackInstances[trackInstance.track.nextTrack];
                        data.trackInstance = trackInstance;

                        trackInstance.setNextTrackInstance(data.allTrackInstances[trackInstance.track.nextTrack], trackInstance.track.nextTrackFrame);
                        trackInstance.setCurrentFrame(nextTrackFrame);

                        trackInstance.setNoInterpolationToNextTrack = this.gameData.isCutscene;
                    }

                    if (data.trackInstance != data.prevTrackInstance) {
                        this.processAnimCommands(data.prevTrackInstance, data.prevTrackInstanceFrame, 1e10, obj);
                        this.processAnimCommands(data.trackInstance, 0, data.trackInstance.param.curFrame, obj);
                    } else {
                        var frm1 = data.prevTrackInstanceFrame, frm2 = data.trackInstance.param.curFrame;
                        if (frm1 > frm2) {
                            // we have looped in the same animation
                            this.processAnimCommands(data.trackInstance, frm1, 1e10, obj);
                            this.processAnimCommands(data.trackInstance, 0, frm2, obj);
                        } else {
                            this.processAnimCommands(data.trackInstance, frm1, frm2, obj);
                        }
                    }

                    data.visible = obj.visible;

                    data.prevTrackInstance = data.trackInstance;
                    data.prevTrackInstanceFrame = data.trackInstance.param.curFrame;

                    data.trackInstance.interpolate();

                    var boundingBox = data.trackInstance.track.keys[data.trackInstance.param.curKey].boundingBox;

                    boundingBox.getBoundingSphere(obj.geometry.boundingSphere);
                    obj.geometry.boundingBox = boundingBox;

                    if (data.layer) {
                        data.layer.update();
                        data.layer.setBoundingObjects();
                    }

                    if (obj.boxHelper) {
                        obj.boxHelper.box = boundingBox;
                    }
                }
            }
		}
	},

	processAnimCommands : function (trackInstance, prevFrame, curFrame, obj) {

		var commands = trackInstance.track.commands;

		for (var i = 0; i < commands.length; ++i) {
			var command = commands[i];

			switch (command.cmd) {

				case TRN.Animation.Commands.ANIMCMD_MISCACTIONONFRAME: {

					var frame = command.params[0] - commands.frameStart, action = command.params[1];
					if (frame < prevFrame || frame >= curFrame) { continue; }

					//console.log(action,'done for frame',frame,obj.name)

					switch (action) {

						case TRN.Animation.Commands.Misc.ANIMCMD_MISC_COLORFLASH: {
							this.gameData.globalTintColor[0] = this.gameData.globalTintColor[1] = this.gameData.globalTintColor[2] = (this.gameData.globalTintColor[0] < 0.5 ? 1.0 : 0.1);
							break;
						}

						case TRN.Animation.Commands.Misc.ANIMCMD_MISC_GETLEFTGUN: {
                            const layer = this.sceneData.objects[obj.name].layer;

                            if (this.trversion == 'TR4') {
                                layer.updateMask(TRN.Layer.LAYER.HOLSTER_EMPTY, TRN.Layer.MASK.LEG_L1);
                                layer.updateMask(TRN.Layer.LAYER.HOLSTER_FULL,  TRN.Layer.MASK.LEG_L1);
                                layer.updateMask(TRN.Layer.LAYER.WEAPON,        TRN.Layer.MASK.ARM_L3);
                    
                            } else {
                                layer.updateMask(TRN.Layer.LAYER.WEAPON, TRN.Layer.MASK.LEG_L1 | TRN.Layer.MASK.ARM_L3);
                                layer.updateMask(TRN.Layer.LAYER.MAIN,   TRN.Layer.MASK.LEG_L1 | TRN.Layer.MASK.ARM_L3);
                            }

                            layer.setRoom(this.gameData.sceneData.objects[obj.name].roomIndex);

							break;
						}

						case TRN.Animation.Commands.Misc.ANIMCMD_MISC_GETRIGHTGUN: {
                            const layer = this.sceneData.objects[obj.name].layer;

                            if (this.trversion == 'TR4') {
                                layer.updateMask(TRN.Layer.LAYER.HOLSTER_EMPTY, TRN.Layer.MASK.LEG_R1);
                                layer.updateMask(TRN.Layer.LAYER.HOLSTER_FULL,  TRN.Layer.MASK.LEG_R1);
                                layer.updateMask(TRN.Layer.LAYER.WEAPON,        TRN.Layer.MASK.ARM_R3);
                            } else {
                                layer.updateMask(TRN.Layer.LAYER.WEAPON, TRN.Layer.MASK.LEG_R1 | TRN.Layer.MASK.ARM_R3);
                                layer.updateMask(TRN.Layer.LAYER.MAIN,   TRN.Layer.MASK.LEG_R1 | TRN.Layer.MASK.ARM_R3);
                            }

                            layer.setRoom(this.gameData.sceneData.objects[obj.name].roomIndex);

							break;
						}

						case TRN.Animation.Commands.Misc.ANIMCMD_MISC_MESHSWAP1:
						case TRN.Animation.Commands.Misc.ANIMCMD_MISC_MESHSWAP2:
						case TRN.Animation.Commands.Misc.ANIMCMD_MISC_MESHSWAP3: {
                            var idx = action - TRN.Animation.Commands.Misc.ANIMCMD_MISC_MESHSWAP1 + 1;
                            
							var oswap = this.objMgr.objectList['moveable'][TRN.ObjectID['meshswap' + idx]];

							if (oswap) {
                                const layer = this.sceneData.objects[obj.name].layer;

                                if (layer.isEmpty(TRN.Layer.LAYER.MESHSWAP) || layer.getMesh(TRN.Layer.LAYER.MESHSWAP) != oswap[0]) {
                                    layer.setMesh(TRN.Layer.LAYER.MESHSWAP, oswap[0], 0);
                                }

                                layer.updateMask(TRN.Layer.LAYER.MESHSWAP,  TRN.Layer.MASK.ALL);
                                layer.updateMask(TRN.Layer.LAYER.MAIN,      TRN.Layer.MASK.ALL);
    
                                layer.setRoom(this.gameData.sceneData.objects[obj.name].roomIndex);
							} else {
								console.log('Could not apply anim command meshswap (' , action, '): object meshswap' + idx + ' not found.');
                            }
                            
							break;
						}

						case TRN.Animation.Commands.Misc.ANIMCMD_MISC_HIDEOBJECT: {
							obj.visible = false;
							break;
						}

						case TRN.Animation.Commands.Misc.ANIMCMD_MISC_SHOWOBJECT: {
							obj.visible = true;
							break;
                        }
                        
                        case TRN.Animation.Commands.Misc.ANIMCMD_MISC_CUSTOMFUNCTION: {
                            //console.log('custom function at frame #', curFrame, ' (' + frame + ')');
                            command.params[2]();
                            break;
                        }
					}

					break;
				}
			}
		}
	}
}