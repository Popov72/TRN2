/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/TRN.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "../src/Animation/AnimationManager.ts":
/*!********************************************!*\
  !*** ../src/Animation/AnimationManager.ts ***!
  \********************************************/
/*! exports provided: AnimationManager */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AnimationManager", function() { return AnimationManager; });
/* harmony import */ var _Animation_Track__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Animation/Track */ "../src/Animation/Track.ts");
/* harmony import */ var _Animation_TrackInstance__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Animation/TrackInstance */ "../src/Animation/TrackInstance.ts");
/* harmony import */ var _Commands__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Commands */ "../src/Animation/Commands.ts");
/* harmony import */ var _CommandDispatch__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./CommandDispatch */ "../src/Animation/CommandDispatch.ts");




var AnimationManager = /** @class */ (function () {
    function AnimationManager() {
        this.paused = false;
        this.gameData = null;
        this.matMgr = null;
        this.objMgr = null;
        this._commandDispatch = null;
        this._animatedObjects = null;
    }
    AnimationManager.prototype.initialize = function (gameData) {
        this.gameData = gameData;
        this.sceneData = gameData.sceneData;
        this.matMgr = gameData.matMgr;
        this.objMgr = gameData.objMgr;
        this._commandDispatch = new _CommandDispatch__WEBPACK_IMPORTED_MODULE_3__["default"](gameData, gameData.confMgr.trversion);
        this.makeTracks();
    };
    AnimationManager.prototype.pause = function (pause) {
        this.paused = pause;
    };
    AnimationManager.prototype.makeTracks = function () {
        var animTracks = [];
        // create one track per animation
        for (var t = 0; t < this.sceneData.animTracks.length; ++t) {
            var track = _Animation_Track__WEBPACK_IMPORTED_MODULE_0__["default"].createTrack(this.sceneData.animTracks[t]);
            animTracks.push(track);
        }
        this.sceneData.animTracks = animTracks;
    };
    AnimationManager.prototype.setAnimation = function (obj, animIndex, desynchro) {
        if (desynchro === void 0) { desynchro = false; }
        var data = this.sceneData.objects[obj.name], track = this.sceneData.animTracks[animIndex + data.animationStartIndex], trackInstance = track ? new _Animation_TrackInstance__WEBPACK_IMPORTED_MODULE_1__["default"](track, data.skeleton) : null;
        if (trackInstance) {
            trackInstance.setNextTrackInstance(trackInstance, track.nextTrackFrame);
            trackInstance.runForward(desynchro ? Math.random() * track.getLength() : 0);
            trackInstance.interpolate();
            data.trackInstance = trackInstance;
            data.prevTrackInstance = data.trackInstance;
            data.prevTrackInstanceFrame = 0;
        }
        return trackInstance;
    };
    AnimationManager.prototype.setAnimatedObjects = function (objs) {
        var meshes = [];
        this._animatedObjects = { 0: meshes };
        for (var name_1 in objs) {
            meshes.push(objs[name_1]);
        }
    };
    AnimationManager.prototype.animateObjects = function (delta) {
        if (this.paused) {
            return;
        }
        var animatables = this._animatedObjects || this.objMgr.objectList['moveable'];
        var numAnimatedObjects = 0;
        for (var objID in animatables) {
            var lstObj = animatables[objID];
            for (var i = 0; i < lstObj.length; ++i) {
                var obj = lstObj[i], data = this.sceneData.objects[obj.name];
                if (data.has_anims && data.trackInstance && (obj.visible || this.gameData.isCutscene)) {
                    numAnimatedObjects++;
                    var nextTrackFrame = data.trackInstance.track.nextTrackFrame;
                    if (!data.trackInstance.runForward(delta)) {
                        if (data.trackInstance.track.nextTrack == -1) {
                            continue;
                        }
                        // it's the end of the current track and we are in a cut scene (because animations that are not in a cutscene loop on themselves, and so .runFoward won't return false for them) => we link to the next track
                        var trackInstance = data.trackInstance, curTrackInstance = trackInstance;
                        trackInstance = data.allTrackInstances[trackInstance.track.nextTrack];
                        data.trackInstance = trackInstance;
                        if (trackInstance.track.nextTrack != -1) {
                            trackInstance.setNextTrackInstance(data.allTrackInstances[trackInstance.track.nextTrack], trackInstance.track.nextTrackFrame);
                        }
                        trackInstance.setCurrentFrame(nextTrackFrame + curTrackInstance.param.curFrame - curTrackInstance.track.numFrames);
                    }
                    if (data.trackInstance != data.prevTrackInstance) {
                        this.processAnimCommands(data.prevTrackInstance, data.prevTrackInstanceFrame, 1e10, obj);
                        this.processAnimCommands(data.trackInstance, nextTrackFrame, data.trackInstance.param.curFrame, obj);
                    }
                    else {
                        var frm1 = data.prevTrackInstanceFrame, frm2 = data.trackInstance.param.curFrame;
                        if (frm1 > frm2) {
                            // we have looped in the same animation
                            this.processAnimCommands(data.trackInstance, frm1, 1e10, obj);
                            this.processAnimCommands(data.trackInstance, nextTrackFrame, frm2, obj);
                        }
                        else {
                            this.processAnimCommands(data.trackInstance, frm1, frm2, obj);
                        }
                    }
                    data.visible = obj.visible;
                    data.prevTrackInstance = data.trackInstance;
                    data.prevTrackInstanceFrame = data.trackInstance.param.curFrame;
                    data.trackInstance.interpolate();
                    var boundingBox = data.trackInstance.track.keys[data.trackInstance.param.curKey].boundingBox;
                    obj.setBoundingBox(boundingBox);
                    if (data.layer) {
                        data.layer.update();
                        data.layer.setBoundingObjects();
                    }
                }
            }
        }
        this.gameData.numAnimatedObjects = numAnimatedObjects;
    };
    // Undo animation commands that have been done up to the 'futureFrame' point in time
    AnimationManager.prototype.undoAnimCommands = function (futureFrame, objects) {
        this._commandDispatch.startUndoMode();
        for (var objID in objects) {
            var obj = objects[objID], data = this.sceneData.objects[obj.name], allTrackInstances = data.allTrackInstances;
            var trackInstance = data.trackInstance;
            var frame = 0, nextTrackFrame = 0;
            while (frame < futureFrame) {
                if (frame - nextTrackFrame + trackInstance.track.numFrames >= futureFrame) {
                    this.processAnimCommands(trackInstance, nextTrackFrame, futureFrame - frame + nextTrackFrame, obj, _CommandDispatch__WEBPACK_IMPORTED_MODULE_3__["CommandDispatchMode"].UNDO);
                    break;
                }
                this.processAnimCommands(trackInstance, nextTrackFrame, trackInstance.track.numFrames, obj, _CommandDispatch__WEBPACK_IMPORTED_MODULE_3__["CommandDispatchMode"].UNDO);
                frame += trackInstance.track.numFrames;
                if (trackInstance.track.nextTrack == -1) {
                    break;
                }
                nextTrackFrame = trackInstance.track.nextTrackFrame;
                trackInstance = allTrackInstances[trackInstance.track.nextTrack];
            }
        }
        this._commandDispatch.endUndoMode();
    };
    // replay animations up to 'futureFrame' point in time
    AnimationManager.prototype.fastForward = function (futureFrame, objects) {
        for (var objID in objects) {
            var obj = objects[objID], data = this.sceneData.objects[obj.name], allTrackInstances = data.allTrackInstances;
            var trackInstance = data.trackInstance;
            var frame = 0, nextTrackFrame = 0;
            while (frame < futureFrame) {
                if (frame - nextTrackFrame + trackInstance.track.numFrames >= futureFrame) {
                    trackInstance.setCurrentFrame(futureFrame - frame + nextTrackFrame);
                    this.processAnimCommands(trackInstance, nextTrackFrame, futureFrame - frame + nextTrackFrame, obj, _CommandDispatch__WEBPACK_IMPORTED_MODULE_3__["CommandDispatchMode"].FAST);
                    break;
                }
                this.processAnimCommands(trackInstance, nextTrackFrame, trackInstance.track.numFrames, obj, _CommandDispatch__WEBPACK_IMPORTED_MODULE_3__["CommandDispatchMode"].FAST);
                frame += trackInstance.track.numFrames;
                if (trackInstance.track.nextTrack == -1) {
                    break;
                }
                nextTrackFrame = trackInstance.track.nextTrackFrame;
                trackInstance = allTrackInstances[trackInstance.track.nextTrack];
                data.trackInstance = trackInstance;
                trackInstance.setCurrentFrame(nextTrackFrame);
                if (trackInstance.track.nextTrack != -1) {
                    trackInstance.setNextTrackInstance(allTrackInstances[trackInstance.track.nextTrack], trackInstance.track.nextTrackFrame);
                }
                trackInstance.noInterpolationToNextTrack = this.gameData.isCutscene;
            }
            data.prevTrackInstance = trackInstance;
            data.prevTrackInstanceFrame = data.trackInstance.param.curFrame;
            trackInstance.interpolate();
            var boundingBox = trackInstance.track.keys[trackInstance.param.curKey].boundingBox;
            obj.setBoundingBox(boundingBox);
            if (data.layer) {
                data.layer.update();
                data.layer.setBoundingObjects();
            }
        }
    };
    AnimationManager.prototype.processAnimCommands = function (trackInstance, prevFrame, curFrame, obj, mode) {
        if (mode === void 0) { mode = _CommandDispatch__WEBPACK_IMPORTED_MODULE_3__["CommandDispatchMode"].NORMAL; }
        var commands = trackInstance.track.commands;
        for (var i = 0; i < commands.length; ++i) {
            var command = commands[i];
            switch (command.cmd) {
                case _Commands__WEBPACK_IMPORTED_MODULE_2__["Commands"].ANIMCMD_MISCACTIONONFRAME: {
                    var frame = command.params[0] - trackInstance.track.commandsFrameStart, action = command.params[1], customParam = command.params[2];
                    if (frame < prevFrame || frame >= curFrame) {
                        continue;
                    }
                    //console.log(action,'done for frame',frame,obj.name)
                    this._commandDispatch.dispatch(action, customParam, obj, mode, trackInstance);
                    break;
                }
            }
        }
    };
    return AnimationManager;
}());



/***/ }),

/***/ "../src/Animation/CommandDispatch.ts":
/*!*******************************************!*\
  !*** ../src/Animation/CommandDispatch.ts ***!
  \*******************************************/
/*! exports provided: CommandDispatchMode, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CommandDispatchMode", function() { return CommandDispatchMode; });
/* harmony import */ var _Commands__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Commands */ "../src/Animation/Commands.ts");
/* harmony import */ var _Constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Constants */ "../src/Constants.ts");
/* harmony import */ var _Player_Layer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Player/Layer */ "../src/Player/Layer.ts");
/* harmony import */ var _Player_Skeleton__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../Player/Skeleton */ "../src/Player/Skeleton.ts");




var CommandDispatchMode;
(function (CommandDispatchMode) {
    CommandDispatchMode[CommandDispatchMode["NORMAL"] = 0] = "NORMAL";
    CommandDispatchMode[CommandDispatchMode["UNDO"] = 1] = "UNDO";
    CommandDispatchMode[CommandDispatchMode["FAST"] = 2] = "FAST";
    CommandDispatchMode[CommandDispatchMode["UNDO_END"] = 3] = "UNDO_END";
})(CommandDispatchMode || (CommandDispatchMode = {}));
var CommandDispatch = /** @class */ (function () {
    function CommandDispatch(gameData, trversion) {
        this.gameData = gameData;
        this.trversion = trversion;
        this.sceneData = gameData.sceneData;
        this.objMgr = gameData.objMgr;
        gameData.bhvMgr.addBehaviour("DynamicLight");
        this.dynLight = gameData.bhvMgr.getBehaviour("DynamicLight")[0];
        this.dynLight.color = [0, 0, 0];
        this.dynLight.fadeout = 4096;
        this.dispatchMap = {};
        this.undoMap = {};
        this.dispatchMap[_Commands__WEBPACK_IMPORTED_MODULE_0__["Commands"].Misc.ANIMCMD_MISC_COLORFLASH] = this.colorFlash.bind(this);
        this.dispatchMap[_Commands__WEBPACK_IMPORTED_MODULE_0__["Commands"].Misc.ANIMCMD_MISC_GETLEFTGUN] = this.getLeftGun.bind(this);
        this.dispatchMap[_Commands__WEBPACK_IMPORTED_MODULE_0__["Commands"].Misc.ANIMCMD_MISC_GETRIGHTGUN] = this.getRightGun.bind(this);
        this.dispatchMap[_Commands__WEBPACK_IMPORTED_MODULE_0__["Commands"].Misc.ANIMCMD_MISC_FIRELEFTGUN] = this.fireLeftGun.bind(this);
        this.dispatchMap[_Commands__WEBPACK_IMPORTED_MODULE_0__["Commands"].Misc.ANIMCMD_MISC_FIRERIGHTGUN] = this.fireRightGun.bind(this);
        this.dispatchMap[_Commands__WEBPACK_IMPORTED_MODULE_0__["Commands"].Misc.ANIMCMD_MISC_MESHSWAP1] = this.meshSwap.bind(this);
        this.dispatchMap[_Commands__WEBPACK_IMPORTED_MODULE_0__["Commands"].Misc.ANIMCMD_MISC_MESHSWAP2] = this.meshSwap.bind(this);
        this.dispatchMap[_Commands__WEBPACK_IMPORTED_MODULE_0__["Commands"].Misc.ANIMCMD_MISC_MESHSWAP3] = this.meshSwap.bind(this);
        this.dispatchMap[_Commands__WEBPACK_IMPORTED_MODULE_0__["Commands"].Misc.ANIMCMD_MISC_HIDEOBJECT] = this.hideObject.bind(this);
        this.dispatchMap[_Commands__WEBPACK_IMPORTED_MODULE_0__["Commands"].Misc.ANIMCMD_MISC_SHOWOBJECT] = this.showObject.bind(this);
        this.dispatchMap[_Commands__WEBPACK_IMPORTED_MODULE_0__["Commands"].Misc.ANIMCMD_MISC_DYN_ON] = this.dynamicLightOn.bind(this);
        this.dispatchMap[_Commands__WEBPACK_IMPORTED_MODULE_0__["Commands"].Misc.ANIMCMD_MISC_DYN_OFF] = this.dynamicLightOff.bind(this);
        this.dispatchMap[_Commands__WEBPACK_IMPORTED_MODULE_0__["Commands"].Misc.ANIMCMD_MISC_RESETHAIR] = this.resetHair.bind(this);
        this.dispatchMap[_Commands__WEBPACK_IMPORTED_MODULE_0__["Commands"].Misc.ANIMCMD_MISC_CUSTOMFUNCTION] = this.customFunction.bind(this);
        this.dispatchMap[_Commands__WEBPACK_IMPORTED_MODULE_0__["Commands"].Misc.ANIMCMD_MISC_SETINTERPOLATION] = this.setInterpolation.bind(this);
    }
    CommandDispatch.prototype.startUndoMode = function () {
        this.undoMap = {};
        for (var id in this.dispatchMap) {
            this.undoMap[id] = {
                "count": 0,
                "firstAction": -1,
            };
        }
    };
    CommandDispatch.prototype.endUndoMode = function () {
        for (var id in this.dispatchMap) {
            this.dispatchMap[id].call(this, parseInt(id), undefined, undefined, CommandDispatchMode.UNDO_END, undefined);
        }
    };
    CommandDispatch.prototype.dispatch = function (action, customParam, obj, mode, trackInstance) {
        var func = this.dispatchMap[action];
        if (!func) {
            //console.log(`Misc anim command "${action}" not implemented`, obj);
        }
        else {
            func(action, customParam, obj, mode, trackInstance);
        }
    };
    CommandDispatch.prototype.colorFlash = function (action, customParam, obj, mode, trackInstance) {
        switch (mode) {
            case CommandDispatchMode.UNDO_END: {
                break;
            }
            default: {
                this.gameData.globalTintColor[0] =
                    this.gameData.globalTintColor[1] =
                        this.gameData.globalTintColor[2] =
                            (this.gameData.globalTintColor[0] < 0.5 ? 1.0 : 0.1);
                break;
            }
        }
    };
    CommandDispatch.prototype.getLeftGun = function (action, customParam, obj, mode, trackInstance) {
        switch (mode) {
            case CommandDispatchMode.UNDO_END: {
                break;
            }
            default: {
                this.getGun(_Player_Skeleton__WEBPACK_IMPORTED_MODULE_3__["MASK"].LEG_L1, _Player_Skeleton__WEBPACK_IMPORTED_MODULE_3__["MASK"].ARM_L3, obj, trackInstance);
                break;
            }
        }
    };
    CommandDispatch.prototype.getRightGun = function (action, customParam, obj, mode, trackInstance) {
        switch (mode) {
            case CommandDispatchMode.UNDO_END: {
                break;
            }
            default: {
                this.getGun(_Player_Skeleton__WEBPACK_IMPORTED_MODULE_3__["MASK"].LEG_R1, _Player_Skeleton__WEBPACK_IMPORTED_MODULE_3__["MASK"].ARM_R3, obj, trackInstance);
                break;
            }
        }
    };
    CommandDispatch.prototype.getGun = function (maskLeg, maskArm, obj, trackInstance) {
        var layer = this.sceneData.objects[obj.name].layer;
        if (this.trversion == 'TR4') {
            layer.updateMask(_Player_Layer__WEBPACK_IMPORTED_MODULE_2__["LAYER"].HOLSTER_EMPTY, maskLeg);
            layer.updateMask(_Player_Layer__WEBPACK_IMPORTED_MODULE_2__["LAYER"].HOLSTER_FULL, maskLeg);
            layer.updateMask(_Player_Layer__WEBPACK_IMPORTED_MODULE_2__["LAYER"].WEAPON, maskArm);
        }
        else {
            layer.updateMask(_Player_Layer__WEBPACK_IMPORTED_MODULE_2__["LAYER"].WEAPON, maskLeg | maskArm);
            layer.updateMask(_Player_Layer__WEBPACK_IMPORTED_MODULE_2__["LAYER"].MAIN, maskLeg | maskArm);
        }
        layer.setRoom(this.gameData.sceneData.objects[obj.name].roomIndex);
    };
    CommandDispatch.prototype.fireLeftGun = function (action, customParam, obj, mode, trackInstance) {
        if (mode === CommandDispatchMode.NORMAL) {
            this.gameData.bhvMgr.addBehaviour('MuzzleFlash', { "bone": _Player_Skeleton__WEBPACK_IMPORTED_MODULE_3__["BONE"].ARM_L3 });
        }
    };
    CommandDispatch.prototype.fireRightGun = function (action, customParam, obj, mode, trackInstance) {
        if (mode === CommandDispatchMode.NORMAL) {
            this.gameData.bhvMgr.addBehaviour('MuzzleFlash', { "bone": _Player_Skeleton__WEBPACK_IMPORTED_MODULE_3__["BONE"].ARM_R3 });
        }
    };
    CommandDispatch.prototype.meshSwap = function (action, customParam, obj, mode, trackInstance) {
        switch (mode) {
            case CommandDispatchMode.UNDO_END: {
                break;
            }
            default: {
                var idx = action - _Commands__WEBPACK_IMPORTED_MODULE_0__["Commands"].Misc.ANIMCMD_MISC_MESHSWAP1 + 1;
                var oswap = this.objMgr.objectList['moveable'][_Constants__WEBPACK_IMPORTED_MODULE_1__["ObjectID"]['meshswap' + idx]];
                if (oswap && Array.isArray(oswap)) {
                    var layer = this.sceneData.objects[obj.name].layer;
                    if (layer.isEmpty(_Player_Layer__WEBPACK_IMPORTED_MODULE_2__["LAYER"].MESHSWAP) || layer.getMesh(_Player_Layer__WEBPACK_IMPORTED_MODULE_2__["LAYER"].MESHSWAP) != oswap[0]) {
                        layer.setMesh(_Player_Layer__WEBPACK_IMPORTED_MODULE_2__["LAYER"].MESHSWAP, oswap[0], 0);
                    }
                    layer.updateMask(_Player_Layer__WEBPACK_IMPORTED_MODULE_2__["LAYER"].MESHSWAP, _Player_Skeleton__WEBPACK_IMPORTED_MODULE_3__["MASK"].ALL);
                    layer.updateMask(_Player_Layer__WEBPACK_IMPORTED_MODULE_2__["LAYER"].MAIN, _Player_Skeleton__WEBPACK_IMPORTED_MODULE_3__["MASK"].ALL);
                    layer.setRoom(this.gameData.sceneData.objects[obj.name].roomIndex);
                }
                else {
                    console.log('Could not apply anim command meshswap (', action, '): object meshswap' + idx + ' not found.');
                }
                break;
            }
        }
    };
    CommandDispatch.prototype.hideObject = function (action, customParam, obj, mode, trackInstance) {
        switch (mode) {
            case CommandDispatchMode.UNDO: {
                var counters = this.undoMap[action].counters;
                if (!counters) {
                    counters = {};
                    this.undoMap[action].counters = counters;
                }
                var counter = counters[obj.name];
                if (!counter) {
                    counter = counters[obj.name] = {
                        "obj": obj,
                        "count": 0,
                        "firstAction": -1,
                    };
                }
                counter.count++;
                if (counter.firstAction < 0) {
                    counter.firstAction = 0;
                }
                break;
            }
            case CommandDispatchMode.UNDO_END: {
                for (var name_1 in this.undoMap[action].counters) {
                    var counter = this.undoMap[action].counters[name_1];
                    if (counter.count > 0) {
                        counter.obj.visible = counter.firstAction === 0;
                    }
                }
                break;
            }
            default: {
                obj.visible = false;
                break;
            }
        }
    };
    CommandDispatch.prototype.showObject = function (action, customParam, obj, mode, trackInstance) {
        switch (mode) {
            case CommandDispatchMode.UNDO: {
                var counters = this.undoMap[action].counters;
                if (!counters) {
                    counters = {};
                    this.undoMap[action].counters = counters;
                }
                var counter = counters[obj.name];
                if (!counter) {
                    counter = counters[obj.name] = {
                        "obj": obj,
                        "count": 0,
                        "firstAction": -1,
                    };
                }
                counter.count++;
                if (counter.firstAction < 0) {
                    counter.firstAction = 1;
                }
                break;
            }
            case CommandDispatchMode.NORMAL:
            case CommandDispatchMode.FAST: {
                obj.visible = true;
                break;
            }
        }
    };
    CommandDispatch.prototype.resetHair = function (action, customParam, obj, mode, trackInstance) {
        var ponytail = this.gameData.bhvMgr.getBehaviour("Ponytail");
        if (ponytail && ponytail.length > 0 && mode === CommandDispatchMode.NORMAL) {
            ponytail[0].reset();
            ponytail[0].preWarm();
        }
    };
    CommandDispatch.prototype.dynamicLightOn = function (action, customParam, obj, mode, trackInstance) {
        switch (mode) {
            case CommandDispatchMode.UNDO: {
                this.undoMap[action].count++;
                if (this.undoMap[action].firstAction < 0) {
                    this.undoMap[action].firstAction = 0;
                }
                break;
            }
            case CommandDispatchMode.UNDO_END: {
                if (this.undoMap[action].count > 0) {
                    this.dynLight.color = this.undoMap[action].firstAction === 0 ? [0, 0, 0] : [2.8, 2.8, 2.8];
                }
                break;
            }
            default: {
                this.dynLight.color = [2.8, 2.8, 2.8];
                this.dynLight.position = obj.position;
                break;
            }
        }
    };
    CommandDispatch.prototype.dynamicLightOff = function (action, customParam, obj, mode, trackInstance) {
        switch (mode) {
            case CommandDispatchMode.UNDO: {
                this.undoMap[_Commands__WEBPACK_IMPORTED_MODULE_0__["Commands"].Misc.ANIMCMD_MISC_DYN_ON].count++;
                if (this.undoMap[_Commands__WEBPACK_IMPORTED_MODULE_0__["Commands"].Misc.ANIMCMD_MISC_DYN_ON].firstAction < 0) {
                    this.undoMap[_Commands__WEBPACK_IMPORTED_MODULE_0__["Commands"].Misc.ANIMCMD_MISC_DYN_ON].firstAction = 1;
                }
                break;
            }
            case CommandDispatchMode.NORMAL:
            case CommandDispatchMode.FAST: {
                this.dynLight.color = [0, 0, 0];
                break;
            }
        }
    };
    CommandDispatch.prototype.customFunction = function (action, customParam, obj, mode, trackInstance) {
        if (customParam) {
            customParam(action, obj, mode);
        }
    };
    CommandDispatch.prototype.setInterpolation = function (action, customParam, obj, mode, trackInstance) {
        if (mode === CommandDispatchMode.NORMAL || mode === CommandDispatchMode.FAST) {
            trackInstance.activateInterpolation = customParam;
        }
    };
    return CommandDispatch;
}());
/* harmony default export */ __webpack_exports__["default"] = (CommandDispatch);


/***/ }),

/***/ "../src/Animation/Commands.ts":
/*!************************************!*\
  !*** ../src/Animation/Commands.ts ***!
  \************************************/
/*! exports provided: Commands */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Commands", function() { return Commands; });
var Commands = {
    ANIMCMD_POSITIONREF3: 1,
    ANIMCMD_POSITIONREF2: 2,
    ANIMCMD_SLAVEANIM: 3,
    ANIMCMD_DEATHANIM: 4,
    ANIMCMD_PLAYSOUNDONFRAME: 5,
    ANIMCMD_MISCACTIONONFRAME: 6
};
Commands.numParams = {
    1: 3,
    2: 2,
    3: 0,
    4: 0,
    5: 2,
    6: 2
};
Commands.Misc = {
    ANIMCMD_MISC_REVERTCAMERA: 0,
    ANIMCMD_MISC_SHAKESCREEN_SOFT: 1,
    ANIMCMD_MISC_UNK6: 2,
    ANIMCMD_MISC_MAKEBUBBLE: 3,
    ANIMCMD_MISC_UNK7: 4,
    ANIMCMD_MISC_UNK13: 5,
    ANIMCMD_MISC_UNK14: 6,
    ANIMCMD_MISC_SHAKESCREEN_HARD: 7,
    ANIMCMD_MISC_GETCROWBAR: 8,
    ANIMCMD_MISC_REACTIVATEACTIONKEY: 12,
    ANIMCMD_MISC_COLORFLASH: 13,
    ANIMCMD_MISC_GETRIGHTGUN: 14,
    ANIMCMD_MISC_GETLEFTGUN: 15,
    ANIMCMD_MISC_FIRERIGHTGUN: 16,
    ANIMCMD_MISC_FIRELEFTGUN: 17,
    ANIMCMD_MISC_MESHSWAP1: 18,
    ANIMCMD_MISC_MESHSWAP2: 19,
    ANIMCMD_MISC_MESHSWAP3: 20,
    ANIMCMD_MISC_HIDEOBJECT: 21,
    ANIMCMD_MISC_SHOWOBJECT: 22,
    ANIMCMD_MISC_DYN_ON: 23,
    ANIMCMD_MISC_DYN_OFF: 24,
    ANIMCMD_MISC_RESETHAIR: 26,
    ANIMCMD_MISC_ADDITIONALSOUND1: -32736,
    ANIMCMD_MISC_PLAYSTEPSOUND: 32,
    ANIMCMD_MISC_GETWATERSKIN: 43,
    ANIMCMD_MISC_PUTBACKWATERSKIN: 44,
    ANIMCMD_MISC_ADDITIONALSOUND2: 16416,
    ANIMCMD_MISC_CUSTOMFUNCTION: -1,
    ANIMCMD_MISC_SETINTERPOLATION: -2,
};


/***/ }),

/***/ "../src/Animation/Key.ts":
/*!*******************************!*\
  !*** ../src/Animation/Key.ts ***!
  \*******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
var Key = /** @class */ (function () {
    function Key(time, boundingBox) {
        this.time = time;
        this.boundingBox = boundingBox;
        this.data = [];
    }
    Key.prototype.addData = function (pos, rot) {
        this.data.push({
            "position": pos,
            "quaternion": rot,
        });
    };
    return Key;
}());
/* harmony default export */ __webpack_exports__["default"] = (Key);


/***/ }),

/***/ "../src/Animation/Track.ts":
/*!*********************************!*\
  !*** ../src/Animation/Track.ts ***!
  \*********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Utils_Box3__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Utils/Box3 */ "../src/Utils/Box3.ts");
/* harmony import */ var _Key__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Key */ "../src/Animation/Key.ts");


var Track = /** @class */ (function () {
    function Track(numKeys, numFrames, frameRate, animFPS, id) {
        this.numKeys = numKeys;
        this.numFrames = numFrames;
        this.frameRate = frameRate;
        this.animFPS = animFPS;
        this.id = id;
        this.nextTrack = 0;
        this.nextTrackFrame = 0;
        this.remainingFrames = numFrames - Math.floor((numFrames - 1) / frameRate) * frameRate;
        this.numDataPerKey = 99999;
        this.boundingBox = new _Utils_Box3__WEBPACK_IMPORTED_MODULE_0__["Box3"]();
        this.commandsFrameStart = 0;
        if (typeof (id) == 'undefined') {
            this.id = 'track' + (++Track._counter);
        }
        this.keys = [];
        this._commands = [];
    }
    Track.createTrack = function (trackJSON) {
        var keys = trackJSON.keys;
        var track = new Track(trackJSON.numKeys, trackJSON.numFrames, trackJSON.frameRate, trackJSON.fps, trackJSON.name);
        track.setNextTrack(trackJSON.nextTrack, trackJSON.nextTrackFrame);
        track.setCommands(trackJSON.commands, trackJSON.frameStart);
        for (var k = 0; k < keys.length; ++k) {
            var keyJSON = keys[k], dataJSON = keyJSON.data, bbox = keyJSON.boundingBox;
            var boundingBox = new _Utils_Box3__WEBPACK_IMPORTED_MODULE_0__["Box3"]([bbox.xmin, bbox.ymin, bbox.zmin], [bbox.xmax, bbox.ymax, bbox.zmax]);
            var key = new _Key__WEBPACK_IMPORTED_MODULE_1__["default"](keyJSON.time, boundingBox);
            for (var d = 0; d < dataJSON.length; ++d) {
                key.addData([dataJSON[d].position.x, dataJSON[d].position.y, dataJSON[d].position.z], [dataJSON[d].quaternion.x, dataJSON[d].quaternion.y, dataJSON[d].quaternion.z, dataJSON[d].quaternion.w]);
            }
            track.addKey(key);
        }
        return track;
    };
    Object.defineProperty(Track.prototype, "commands", {
        get: function () {
            return this._commands;
        },
        enumerable: true,
        configurable: true
    });
    Track.prototype.addKey = function (key) {
        this.keys.push(key);
        this.numDataPerKey = Math.min(this.numDataPerKey, key.data.length);
        this.boundingBox.union(key.boundingBox);
    };
    Track.prototype.getLength = function () {
        return this.numFrames / this.animFPS;
    };
    Track.prototype.setNextTrack = function (track, frame) {
        this.nextTrack = track;
        this.nextTrackFrame = frame;
    };
    Track.prototype.setCommands = function (commands, frameStart) {
        this._commands = commands;
        this.commandsFrameStart = frameStart;
    };
    Track._counter = 0;
    return Track;
}());
/* harmony default export */ __webpack_exports__["default"] = (Track);


/***/ }),

/***/ "../src/Animation/TrackInstance.ts":
/*!*****************************************!*\
  !*** ../src/Animation/TrackInstance.ts ***!
  \*****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Proxy_Engine__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Proxy/Engine */ "../src/Proxy/Engine.ts");

var TrackInstance = /** @class */ (function () {
    function TrackInstance(track, skeleton) {
        this._track = track;
        this.skeleton = skeleton;
        this.overallSpeed = 1.0;
        this.activateInterpolation = true;
        this.nextTrackInstance = null;
        this.nextTrackInstanceFrame = 0;
        this.noInterpolationToNextTrack = false;
        this.noInterpolationToNextTrackValue = 0.0;
        this.interpolatedData = null;
        this.param = this.paramSave = {
            curKey: 0,
            curFrame: 0.0,
            interpFactor: 0.0,
            nextKeyIsInCurrentTrack: true
        };
        this.pushState();
    }
    Object.defineProperty(TrackInstance.prototype, "track", {
        get: function () {
            return this._track;
        },
        enumerable: true,
        configurable: true
    });
    TrackInstance.prototype.pushState = function () {
        this.paramSave = jQuery.extend(true, {}, this.param);
    };
    TrackInstance.prototype.popState = function () {
        this.param = jQuery.extend(true, {}, this.paramSave);
    };
    TrackInstance.prototype.setNextTrackInstance = function (trackInstance, frame) {
        if (frame >= trackInstance._track.numFrames) {
            frame = 0;
        }
        this.nextTrackInstance = trackInstance;
        this.nextTrackInstanceFrame = frame;
    };
    TrackInstance.prototype.makeCache = function () {
        this.interpolatedData = [];
        for (var numData = 0; numData < this._track.numDataPerKey; ++numData) {
            this.interpolatedData.push(_Proxy_Engine__WEBPACK_IMPORTED_MODULE_0__["default"].makeNode("TrackInstance cache node", _Proxy_Engine__WEBPACK_IMPORTED_MODULE_0__["default"].activeScene));
        }
    };
    TrackInstance.prototype.runForward = function (elapsedTime) {
        this.param.curFrame += (elapsedTime * this._track.animFPS) * this.overallSpeed;
        return this.setCurrentFrame(this.param.curFrame);
    };
    TrackInstance.prototype.setCurrentFrame = function (frame) {
        this.param.curFrame = frame;
        // Have we reached the end of the animation ?
        if (this.param.curFrame >= this._track.numFrames) {
            // Yes. Is the next animation not the current one ?
            if (!this.nextTrackInstance || this.nextTrackInstance._track.id != this._track.id) {
                // Yes. The caller must handle this situation
                var curKey_1 = this.param.curFrame / this._track.frameRate;
                this.param.interpFactor = this.activateInterpolation ? curKey_1 - Math.floor(curKey_1) : 0.0;
                this.noInterpolationToNextTrack = false;
                return false;
            }
            // The next animation is the current one (looping). Reset internal variables
            this.param.curFrame -= this._track.numFrames;
            this.param.curFrame += this.nextTrackInstanceFrame;
            // The next test should always fail, but if the frame rate is *very* bad
            // (elapsedTime is huge), it could succeed
            if (this.param.curFrame >= this._track.numFrames) {
                this.param.curFrame = this._track.numFrames - 1;
            }
            this.noInterpolationToNextTrack = false;
        }
        // Calculate the current key
        var curKey = this.param.curFrame / this._track.frameRate;
        this.param.curKey = Math.floor(curKey);
        // Use the next key for the interpolation. Handle the case where the
        // next key is in the next animation and not in the current one
        var nextFrame = Math.floor((this.param.curKey + 1) * this._track.frameRate);
        var speedFactor = 1.0;
        if (nextFrame < this._track.numFrames || (!this.nextTrackInstance && nextFrame >= this._track.numFrames)) {
            // The key to use for the interpolation is the next one in the current animation
            this.param.nextKeyIsInCurrentTrack = true;
        }
        else {
            // The next key is in the next animation
            this.param.nextKeyIsInCurrentTrack = false;
            // speedFactor is used to correctly interpolate the last key of the animation with
            // the first one of the next animation. Indeed, interpolation would fail if the number
            // of frames after the last key of the current animation is not equal to the animation
            // frameRate (which is possible)
            speedFactor = this._track.frameRate / this._track.remainingFrames;
        }
        this.param.interpFactor = this.activateInterpolation ? (curKey - this.param.curKey) * speedFactor : 0.0;
        if (!this.param.nextKeyIsInCurrentTrack && this.noInterpolationToNextTrack) {
            if (this.param.curFrame + this.param.interpFactor >= this._track.numFrames) {
                // the interpolation would be done for a frame outside of the current animation,
                // so return false to notify caller to link to the next animation
                this.param.curFrame += this.param.interpFactor;
                return false;
            }
            this.param.interpFactor = this.noInterpolationToNextTrackValue;
        }
        return true;
    };
    TrackInstance.prototype.interpolate = function (buffer, detectRecursInfinite) {
        if (detectRecursInfinite === void 0) { detectRecursInfinite = false; }
        this._interpolate(buffer, detectRecursInfinite);
        this.skeleton.updateBoneMatrices();
    };
    TrackInstance.prototype._interpolate = function (buffer, detectRecursInfinite) {
        if (detectRecursInfinite === void 0) { detectRecursInfinite = false; }
        if (!this.interpolatedData) {
            this.makeCache();
        }
        var curKey = this.param.curKey;
        var internalBuffer = !buffer;
        if (!buffer) {
            buffer = this.skeleton.bones;
        }
        if (this.param.nextKeyIsInCurrentTrack || this._track.numKeys == 1 || detectRecursInfinite) {
            var nextKey = curKey + 1;
            if (nextKey >= this._track.numKeys) {
                nextKey = this._track.numKeys - 1;
            }
            if (detectRecursInfinite && !this.param.nextKeyIsInCurrentTrack && this._track.numKeys != 1) {
                nextKey = this._track.numKeys - 1;
            }
            for (var numData = 0; numData < this._track.numDataPerKey; ++numData) {
                var dataCurKey = this._track.keys[curKey].data[numData];
                var dataNextKey = this._track.keys[nextKey].data[numData];
                if (!buffer[numData] || !dataCurKey || !dataNextKey) {
                    continue;
                } // without this line, the lost artifact TR3 levels bug
                var newpos = [
                    dataCurKey.position[0] + (dataNextKey.position[0] - dataCurKey.position[0]) * this.param.interpFactor,
                    dataCurKey.position[1] + (dataNextKey.position[1] - dataCurKey.position[1]) * this.param.interpFactor,
                    dataCurKey.position[2] + (dataNextKey.position[2] - dataCurKey.position[2]) * this.param.interpFactor
                ];
                if (internalBuffer) {
                    buffer[numData].setPosition([
                        newpos[0] + this.skeleton.bonesStartingPos[numData].pos_init[0],
                        newpos[1] + this.skeleton.bonesStartingPos[numData].pos_init[1],
                        newpos[2] + this.skeleton.bonesStartingPos[numData].pos_init[2]
                    ]);
                }
                else {
                    buffer[numData].setPosition(newpos);
                }
                var q = buffer[numData].quaternion;
                glMatrix.quat.slerp(q, dataCurKey.quaternion, dataNextKey.quaternion, this.param.interpFactor);
                buffer[numData].setQuaternion(q);
            }
        }
        else {
            this.nextTrackInstance.pushState();
            this.nextTrackInstance.setCurrentFrame(this.nextTrackInstanceFrame);
            this.nextTrackInstance._interpolate(this.interpolatedData, true);
            this.nextTrackInstance.popState();
            for (var numData = 0; numData < this._track.numDataPerKey; ++numData) {
                var dataCurKey = this._track.keys[curKey].data[numData];
                var dataNextKey = this.interpolatedData[numData];
                if (!buffer[numData] || !dataCurKey || !dataNextKey) {
                    continue;
                } // without this line, the lost artifact TR3 levels bug
                var newpos = [
                    dataCurKey.position[0] + (dataNextKey.position[0] - dataCurKey.position[0]) * this.param.interpFactor,
                    dataCurKey.position[1] + (dataNextKey.position[1] - dataCurKey.position[1]) * this.param.interpFactor,
                    dataCurKey.position[2] + (dataNextKey.position[2] - dataCurKey.position[2]) * this.param.interpFactor
                ];
                if (internalBuffer) {
                    buffer[numData].setPosition([
                        newpos[0] + this.skeleton.bonesStartingPos[numData].pos_init[0],
                        newpos[1] + this.skeleton.bonesStartingPos[numData].pos_init[1],
                        newpos[2] + this.skeleton.bonesStartingPos[numData].pos_init[2]
                    ]);
                }
                else {
                    buffer[numData].setPosition(newpos);
                }
                var q = buffer[numData].quaternion;
                glMatrix.quat.slerp(q, dataCurKey.quaternion, dataNextKey.quaternion, this.param.interpFactor);
                buffer[numData].setQuaternion(q);
            }
        }
    };
    return TrackInstance;
}());
/* harmony default export */ __webpack_exports__["default"] = (TrackInstance);


/***/ }),

/***/ "../src/Behaviour/AnimatedTexture.ts":
/*!*******************************************!*\
  !*** ../src/Behaviour/AnimatedTexture.ts ***!
  \*******************************************/
/*! exports provided: AnimatedTexture */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AnimatedTexture", function() { return AnimatedTexture; });
/* harmony import */ var _Behaviour__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Behaviour */ "../src/Behaviour/Behaviour.ts");
/* harmony import */ var _BehaviourManager__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./BehaviourManager */ "../src/Behaviour/BehaviourManager.ts");
/* harmony import */ var _Player_Sequence__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Player/Sequence */ "../src/Player/Sequence.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();



var AnimatedTexture = /** @class */ (function (_super) {
    __extends(AnimatedTexture, _super);
    function AnimatedTexture(nbhv, gameData, objectid, objecttype) {
        var _this = _super.call(this, nbhv, gameData, objectid, objecttype) || this;
        _this.name = AnimatedTexture.name;
        _this.animatedTextures = gameData.sceneData.animatedTextures;
        _this.textures = gameData.sceneData.textures;
        _this.matList = null;
        return _this;
    }
    AnimatedTexture.prototype.init = function (lstObjs) {
        if (lstObjs == null || lstObjs.length == 0 || !this.animatedTextures) {
            return [_Behaviour__WEBPACK_IMPORTED_MODULE_0__["BehaviourRetCode"].dontKeepBehaviour, null];
        }
        // initialize the animated textures
        for (var i = 0; i < this.animatedTextures.length; ++i) {
            var animTexture = this.animatedTextures[i];
            animTexture.progressor = new _Player_Sequence__WEBPACK_IMPORTED_MODULE_2__["default"](animTexture.animcoords.length, 1.0 / animTexture.animspeed);
        }
        // collect the materials we will have to update each frame
        var lstMaterials = [];
        for (var i = 0; i < lstObjs.length; ++i) {
            var obj = lstObjs[i];
            var materials = obj.materials;
            for (var m = 0; m < materials.length; ++m) {
                var material = materials[m], userData = material.userData;
                if (!userData || !userData.animatedTexture) {
                    continue;
                }
                var animTexture = this.animatedTextures[userData.animatedTexture.idxAnimatedTexture];
                if (!animTexture.scrolltexture) {
                    lstMaterials.push(material);
                }
            }
        }
        this.matList = lstMaterials;
        return [_Behaviour__WEBPACK_IMPORTED_MODULE_0__["BehaviourRetCode"].keepBehaviour, null];
    };
    AnimatedTexture.prototype.onFrameStarted = function (curTime, delta) {
        for (var i = 0; i < this.animatedTextures.length; ++i) {
            var animTexture = this.animatedTextures[i];
            animTexture.progressor.update(delta);
        }
    };
    AnimatedTexture.prototype.onFrameEnded = function (curTime, delta) {
        for (var i = 0; i < this.matList.length; ++i) {
            var material = this.matList[i], userData = material.userData, animTexture = this.animatedTextures[userData.animatedTexture.idxAnimatedTexture], coords = animTexture.animcoords[(animTexture.progressor.currentTile + userData.animatedTexture.pos) % animTexture.animcoords.length];
            material.uniforms.map.value = this.textures[coords.texture];
            material.uniforms.offsetRepeat.value[0] = coords.minU - userData.animatedTexture.minU;
            material.uniforms.offsetRepeat.value[1] = coords.minV - userData.animatedTexture.minV;
            material.uniformsUpdated(["map", "offsetRepeat"]);
        }
    };
    return AnimatedTexture;
}(_Behaviour__WEBPACK_IMPORTED_MODULE_0__["Behaviour"]));

_BehaviourManager__WEBPACK_IMPORTED_MODULE_1__["BehaviourManager"].registerFactory(AnimatedTexture);


/***/ }),

/***/ "../src/Behaviour/BasicControl.ts":
/*!****************************************!*\
  !*** ../src/Behaviour/BasicControl.ts ***!
  \****************************************/
/*! exports provided: BasicControl */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BasicControl", function() { return BasicControl; });
/* harmony import */ var _BehaviourManager__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./BehaviourManager */ "../src/Behaviour/BehaviourManager.ts");
/* harmony import */ var _Behaviour__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Behaviour */ "../src/Behaviour/Behaviour.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();


var BasicControl = /** @class */ (function (_super) {
    __extends(BasicControl, _super);
    function BasicControl(nbhv, gameData, objectid, objecttype) {
        var _this = _super.call(this, nbhv, gameData, objectid, objecttype) || this;
        _this.name = BasicControl.name;
        _this.STATES = { FASTER: 0, FORWARD: 1, LEFT: 2, RIGHT: 3, BACKWARD: 4, UP: 5, DOWN: 6, ROTY: 7, ROTNY: 8, ROTX: 9, ROTNX: 10, SLOWER: 11 };
        _this.KEYS = { MOUSENX: 300, MOUSEX: 301, MOUSENY: 302, MOUSEY: 303 };
        _this.enabled = true;
        _this._captureMouse = false;
        _this.object = null;
        _this.xSign = 1;
        _this.domElement = null;
        _this.states = {
            16: { state: _this.STATES.FASTER, on: false },
            17: { state: _this.STATES.SLOWER, on: false },
            90: { state: _this.STATES.FORWARD, on: false },
            38: { state: _this.STATES.FORWARD, on: false },
            81: { state: _this.STATES.LEFT, on: false },
            68: { state: _this.STATES.RIGHT, on: false },
            83: { state: _this.STATES.BACKWARD, on: false },
            40: { state: _this.STATES.BACKWARD, on: false },
            32: { state: _this.STATES.UP, on: false },
            88: { state: _this.STATES.DOWN, on: false },
            37: { state: _this.STATES.ROTY, on: false },
            39: { state: _this.STATES.ROTNY, on: false } // CURSOR RIGHT
        };
        _this.states[_this.KEYS.MOUSENX] = { state: _this.STATES.ROTY, on: false }; // mouse move -X
        _this.states[_this.KEYS.MOUSEX] = { state: _this.STATES.ROTNY, on: false }; // mouse move +X
        _this.states[_this.KEYS.MOUSENY] = { state: _this.STATES.ROTX, on: false }; // mouse move -Y
        _this.states[_this.KEYS.MOUSEY] = { state: _this.STATES.ROTNX, on: false }; // mouse move +Y
        _this.factor = 1.0;
        _this.moveFactor = 0;
        _this.rotFactor = 0;
        _this.mouseRotFactor = 0;
        _this._mouseX = -1;
        _this._mouseY = -1;
        _this._mouseDeltaX = _this._mouseDeltaY = 0;
        return _this;
    }
    Object.defineProperty(BasicControl.prototype, "captureMouse", {
        get: function () {
            return this._captureMouse;
        },
        enumerable: true,
        configurable: true
    });
    BasicControl.prototype.init = function (lstObjs) {
        if (lstObjs == null) {
            return [_Behaviour__WEBPACK_IMPORTED_MODULE_1__["BehaviourRetCode"].dontKeepBehaviour, null];
        }
        var domElement = document.body, object = lstObjs[0], scale = this.nbhv.scale;
        this.domElement = domElement;
        this.object = object;
        this.moveFactor = scale && scale.move ? parseFloat(scale.move) : 6000;
        this.rotFactor = scale && scale.rotation ? parseFloat(scale.rotation) : 100;
        this.mouseRotFactor = scale && scale.mouserotation ? parseFloat(scale.mouserotation) : 10;
        var prefix = ['', 'webkit', 'moz'];
        for (var i = 0; i < prefix.length; ++i) {
            document.addEventListener(prefix[i] + "pointerlockchange", this.pointerLockChange.bind(this), false);
            document.addEventListener(prefix[i] + "pointerlocklost", this.pointerLockChange.bind(this), false);
        }
        this.domElement.addEventListener('contextmenu', function (event) { event.preventDefault(); }, false);
        this.domElement.addEventListener('keydown', this.keydown.bind(this), false);
        this.domElement.addEventListener('keyup', this.keyup.bind(this), false);
        this.domElement.addEventListener('mousemove', this.mousemove.bind(this), false);
        this.domElement.addEventListener('mousedown', this.mousedown.bind(this), false);
        return [_Behaviour__WEBPACK_IMPORTED_MODULE_1__["BehaviourRetCode"].keepBehaviour, null];
    };
    BasicControl.prototype.onFrameStarted = function (curTime, delta) {
        if (this.object === null) {
            return;
        }
        var rotX = 0.0, rotY = 0.0, translate = [0, 0, 0];
        var moveScale = this.factor * this.moveFactor * delta;
        var rotScale = this.factor * this.rotFactor * delta;
        var rotMouseScale = this.factor * this.mouseRotFactor * delta;
        for (var state in this.states) {
            var ostate = this.states[state], isMouse = state >= 300;
            if (!ostate.on) {
                continue;
            }
            switch (ostate.state) {
                case this.STATES.FASTER:
                    moveScale *= 3;
                    rotScale *= 3;
                    rotMouseScale *= 3;
                    break;
                case this.STATES.SLOWER:
                    moveScale /= 6;
                    rotScale /= 6;
                    rotMouseScale /= 6;
                    break;
                case this.STATES.FORWARD:
                    translate[2] = -moveScale * this.xSign;
                    break;
                case this.STATES.BACKWARD:
                    translate[2] = moveScale * this.xSign;
                    break;
                case this.STATES.LEFT:
                    translate[0] = -moveScale * this.xSign;
                    break;
                case this.STATES.RIGHT:
                    translate[0] = moveScale * this.xSign;
                    break;
                case this.STATES.UP:
                    translate[1] = moveScale;
                    break;
                case this.STATES.DOWN:
                    translate[1] = -moveScale;
                    break;
                case this.STATES.ROTY:
                    if (isMouse) {
                        rotY -= this._mouseDeltaX * rotMouseScale;
                    }
                    else {
                        rotY += rotScale;
                    }
                    break;
                case this.STATES.ROTNY:
                    if (isMouse) {
                        rotY -= this._mouseDeltaX * rotMouseScale;
                    }
                    else {
                        rotY -= rotScale;
                    }
                    break;
                case this.STATES.ROTX:
                    if (isMouse) {
                        rotX -= this._mouseDeltaY * rotMouseScale;
                    }
                    else {
                        rotX += rotScale;
                    }
                    break;
                case this.STATES.ROTNX:
                    if (isMouse) {
                        rotX -= this._mouseDeltaY * rotMouseScale;
                    }
                    else {
                        rotX -= rotScale;
                    }
                    break;
            }
        }
        this._mouseDeltaX = this._mouseDeltaY = 0;
        if (this.states[this.KEYS.MOUSENX]) {
            this.states[this.KEYS.MOUSENX].on = false;
        }
        if (this.states[this.KEYS.MOUSEX]) {
            this.states[this.KEYS.MOUSEX].on = false;
        }
        if (this.states[this.KEYS.MOUSENY]) {
            this.states[this.KEYS.MOUSENY].on = false;
        }
        if (this.states[this.KEYS.MOUSEY]) {
            this.states[this.KEYS.MOUSEY].on = false;
        }
        if (rotX == 0 && rotY == 0 && translate[0] == 0 && translate[1] == 0 && translate[2] == 0) {
            return;
        }
        var q = [0, 0, 0, 0];
        var quat = this.object.quaternion;
        glMatrix.quat.setAxisAngle(q, [0, 1, 0], glMatrix.glMatrix.toRadian(rotY));
        glMatrix.quat.mul(quat, q, quat);
        var v = [this.xSign, 0, 0];
        glMatrix.vec3.transformQuat(v, v, quat);
        glMatrix.quat.setAxisAngle(q, v, glMatrix.glMatrix.toRadian(rotX));
        glMatrix.quat.mul(quat, q, quat);
        glMatrix.vec3.transformQuat(v, translate, quat);
        this.object.setQuaternion(quat);
        var pos = this.object.position;
        this.object.setPosition([pos[0] + v[0], pos[1] + v[1], pos[2] + v[2]]);
    };
    BasicControl.prototype.pointerLockChange = function () {
        var locked = document.pointerLockElement == this.domElement;
        this._captureMouse = locked;
    };
    BasicControl.prototype.keydown = function (event) {
        if (this.enabled === false) {
            return;
        }
        if (this.states[event.keyCode]) {
            this.states[event.keyCode].on = true;
            event.preventDefault();
            event.stopPropagation();
        }
    };
    BasicControl.prototype.keyup = function (event) {
        if (this.enabled === false) {
            return;
        }
        if (this.states[event.keyCode]) {
            this.states[event.keyCode].on = false;
            event.preventDefault();
            event.stopPropagation();
        }
    };
    BasicControl.prototype.mousemove = function (_event) {
        var event = _event;
        if (event.event) {
            event = event.event;
        }
        if (document.pointerLockElement) {
            var mx = event.movementX /* || event.webkitMovementX || event.mozMovementX || 0*/;
            var my = event.movementY /* || event.webkitMovementY || event.mozMovementY || 0*/;
            this._mouseDeltaX = mx;
            this._mouseDeltaY = my;
        }
        else {
            if (this.enabled === false || !this._captureMouse) {
                return;
            }
            var curMouseX = event.clientX;
            var curMouseY = event.clientY;
            this._mouseDeltaX = this._mouseX == -1 ? 0 : curMouseX - this._mouseX;
            this._mouseDeltaY = this._mouseY == -1 ? 0 : curMouseY - this._mouseY;
            this._mouseX = curMouseX;
            this._mouseY = curMouseY;
        }
        if (this.states[this.KEYS.MOUSENX]) {
            this.states[this.KEYS.MOUSENX].on = this._mouseDeltaX < 0;
        }
        if (this.states[this.KEYS.MOUSEX]) {
            this.states[this.KEYS.MOUSEX].on = this._mouseDeltaX > 0;
        }
        if (this.states[this.KEYS.MOUSENY]) {
            this.states[this.KEYS.MOUSENY].on = this._mouseDeltaY < 0;
        }
        if (this.states[this.KEYS.MOUSEY]) {
            this.states[this.KEYS.MOUSEY].on = this._mouseDeltaY > 0;
        }
    };
    BasicControl.prototype.mousedown = function (_event) {
        var event = _event;
        if (event.event) {
            event = event.event;
        }
        if (event.button == 2) {
            this._captureMouse = !this._captureMouse;
            this._mouseX = -1;
            this._mouseY = -1;
            if (this._captureMouse) {
                if (this.domElement.requestPointerLock) {
                    this.domElement.requestPointerLock();
                }
            }
            else {
                if (document.exitPointerLock) {
                    document.exitPointerLock();
                }
            }
        }
    };
    return BasicControl;
}(_Behaviour__WEBPACK_IMPORTED_MODULE_1__["Behaviour"]));

_BehaviourManager__WEBPACK_IMPORTED_MODULE_0__["BehaviourManager"].registerFactory(BasicControl);


/***/ }),

/***/ "../src/Behaviour/Behaviour.ts":
/*!*************************************!*\
  !*** ../src/Behaviour/Behaviour.ts ***!
  \*************************************/
/*! exports provided: BehaviourRetCode, Behaviour */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BehaviourRetCode", function() { return BehaviourRetCode; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Behaviour", function() { return Behaviour; });
var BehaviourRetCode;
(function (BehaviourRetCode) {
    BehaviourRetCode[BehaviourRetCode["keepBehaviour"] = 0] = "keepBehaviour";
    BehaviourRetCode[BehaviourRetCode["dontKeepBehaviour"] = 1] = "dontKeepBehaviour";
})(BehaviourRetCode || (BehaviourRetCode = {}));
var Behaviour = /** @class */ (function () {
    function Behaviour(nbhv, gameData, objectid, objecttype) {
        this.name = "";
        this.nbhv = nbhv;
        this.gameData = gameData;
        this.objectid = objectid;
        this.objecttype = objecttype;
    }
    return Behaviour;
}());



/***/ }),

/***/ "../src/Behaviour/BehaviourManager.ts":
/*!********************************************!*\
  !*** ../src/Behaviour/BehaviourManager.ts ***!
  \********************************************/
/*! exports provided: BehaviourManager */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BehaviourManager", function() { return BehaviourManager; });
/* harmony import */ var _Utils_Misc__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Utils/Misc */ "../src/Utils/Misc.ts");
/* harmony import */ var _Behaviour__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Behaviour */ "../src/Behaviour/Behaviour.ts");
var __values = (undefined && undefined.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __read = (undefined && undefined.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (undefined && undefined.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};


var BehaviourManager = /** @class */ (function () {
    function BehaviourManager() {
        this.behaviours = [];
        this.behavioursByName = new Map();
        this.confMgr = null;
        this.objMgr = null;
        this.gameData = null;
    }
    BehaviourManager.registerFactory = function (clss) {
        this.factories.set(clss.name, clss);
    };
    BehaviourManager.prototype.initialize = function (gameData) {
        this.gameData = gameData;
        this.confMgr = gameData.confMgr;
        this.objMgr = gameData.objMgr;
    };
    BehaviourManager.prototype.removeBehaviours = function (obj) {
        var _this = this;
        if (obj.__behaviours) {
            obj.__behaviours.forEach(function (bhv) { return _this.removeBehaviour(bhv); });
            delete obj.__behaviours;
        }
    };
    BehaviourManager.prototype.removeBehaviour = function (bhv) {
        var idx = this.behaviours.indexOf(bhv);
        if (idx !== -1) {
            this.behaviours.splice(idx, 1);
        }
        var lst = this.behavioursByName.get(bhv.name);
        if (lst) {
            idx = lst.indexOf(bhv);
            if (idx !== -1) {
                lst.splice(idx, 1);
            }
        }
    };
    BehaviourManager.prototype.callFunction = function (funcname, params) {
        for (var i = 0; i < this.behaviours.length; ++i) {
            var bhv = this.behaviours[i];
            if (bhv[funcname]) {
                bhv[funcname].apply(bhv, params);
            }
        }
    };
    BehaviourManager.callStatic = function (funcname, params) {
        var e_1, _a;
        var ret = [];
        try {
            for (var _b = __values(BehaviourManager.factories), _c = _b.next(); !_c.done; _c = _b.next()) {
                var _d = __read(_c.value, 2), name_1 = _d[0], clss = _d[1];
                if (clss[funcname]) {
                    var r = clss[funcname].apply(null, params);
                    if (Array.isArray(r)) {
                        ret.push.apply(ret, __spread(r));
                    }
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return ret;
    };
    BehaviourManager.onEngineInitialized = function (gameData) {
        return BehaviourManager.callStatic("onEngineInitialized", [gameData]);
    };
    BehaviourManager.prototype.onBeforeRenderLoop = function () {
        this.callFunction('onBeforeRenderLoop', []);
    };
    BehaviourManager.prototype.onFrameStarted = function (curTime, delta) {
        this.callFunction('onFrameStarted', [curTime, delta]);
    };
    BehaviourManager.prototype.onFrameEnded = function (curTime, delta) {
        this.callFunction('onFrameEnded', [curTime, delta]);
    };
    BehaviourManager.prototype.getBehaviour = function (name) {
        return this.behavioursByName.get(name);
    };
    BehaviourManager.prototype.addBehaviour = function (name, params, objectid, objecttype, _lstObjs) {
        var lstObjs = null;
        if (_lstObjs !== undefined) {
            lstObjs = _lstObjs;
        }
        else {
            var objList = objecttype !== undefined ? (objecttype == 'camera' ? [this.gameData.camera] : this.objMgr.objectList[objecttype]) : null;
            if ((objectid !== undefined || objecttype !== undefined) && (objList === null || objectid === undefined || !objList[objectid])) {
                return null;
            }
            if (objList && objectid !== undefined && objList[objectid]) {
                var objs = objList[objectid];
                if (!Array.isArray(objs)) {
                    lstObjs = [objs];
                }
                else {
                    lstObjs = objs;
                }
            }
        }
        var factory = BehaviourManager.factories.get(name);
        if (factory === undefined) {
            throw "Can't find a factory to create a behaviour with name " + name;
        }
        var obhv = new factory(params, this.gameData, objectid, objecttype);
        var _a = __read(obhv.init(lstObjs), 2), retCode = _a[0], promises = _a[1];
        if (retCode == _Behaviour__WEBPACK_IMPORTED_MODULE_1__["BehaviourRetCode"].keepBehaviour) {
            this.behaviours.push(obhv);
            if (lstObjs) {
                lstObjs.forEach(function (obj) {
                    var lbhv = obj.behaviours;
                    if (!lbhv) {
                        lbhv = [];
                        obj.behaviours = lbhv;
                    }
                    lbhv.push(obhv);
                });
            }
            var blst = this.behavioursByName.get(name);
            if (!blst) {
                blst = [];
                this.behavioursByName.set(name, blst);
            }
            blst.push(obhv);
        }
        return promises;
    };
    BehaviourManager.prototype.loadBehaviours = function () {
        this.behaviours = [];
        this.behavioursByName = new Map();
        var behaviours = jQuery(this.confMgr.globalParam('behaviour', true)), allPromises = this.loadBehavioursSub(behaviours);
        behaviours = jQuery(this.confMgr.param('behaviour', false, true));
        allPromises = allPromises.concat(this.loadBehavioursSub(behaviours));
        return allPromises;
    };
    BehaviourManager.prototype.loadBehavioursSub = function (behaviours) {
        var promises = [];
        for (var bhv = 0; bhv < behaviours.length; ++bhv) {
            var nbhv = behaviours[bhv], name_2 = nbhv.getAttribute("name"), cutsceneOnly = nbhv.getAttribute("cutsceneonly");
            if (nbhv.__consumed || BehaviourManager.factories.get(name_2) === undefined) {
                continue;
            }
            if (cutsceneOnly && cutsceneOnly == "true" && !this.gameData.isCutscene) {
                continue;
            }
            // get the type and id of the object to apply the behaviour to
            var objectid = nbhv.getAttribute('objectid'), objecttype = nbhv.getAttribute('objecttype') || "moveable";
            if (objectid == "" || objectid == null) {
                if (!nbhv.parentNode) {
                    continue;
                }
                objectid = nbhv.parentNode.getAttribute("id");
                objecttype = objectid ? nbhv.parentNode.nodeName : null;
            }
            // get overriden data from the level (if any)
            // look first for a <behaviour> tag with the same objectid and objecttype as the current one
            var bhvLevel = objectid ? jQuery(this.confMgr.param('behaviour[name="' + name_2 + '"][objectid="' + objectid + '"]', false, true)) : null;
            if (bhvLevel && bhvLevel.length > 0 && bhvLevel[0] !== nbhv) {
                var tp = bhvLevel[0].getAttribute("objecttype") || "moveable";
                if (tp != objecttype) {
                    bhvLevel = null;
                }
            }
            if (!bhvLevel || bhvLevel.length == 0) {
                // not found. Look for a <behaviour> with the same name as the current one and without any of the objectid / objecttype attributes
                bhvLevel = jQuery(this.confMgr.param('behaviour[name="' + name_2 + '"]', false, true));
                if (bhvLevel.length > 0 && bhvLevel[0] !== nbhv) {
                    if (bhvLevel[0].getAttribute("objectid") || bhvLevel[0].getAttribute("objecttype")) {
                        bhvLevel = null;
                    }
                }
            }
            // merge the data found in the level section (if any)
            nbhv = _Utils_Misc__WEBPACK_IMPORTED_MODULE_0__["default"].domNodeToJSon(nbhv);
            if (bhvLevel && bhvLevel.length > 0) {
                bhvLevel[0].__consumed = true;
                bhvLevel = _Utils_Misc__WEBPACK_IMPORTED_MODULE_0__["default"].domNodeToJSon(bhvLevel[0]);
                Object.assign(nbhv, bhvLevel);
            }
            // create the behaviour
            promises = promises.concat(this.addBehaviour(name_2, nbhv, objectid === null ? undefined : parseInt(objectid), objecttype === null ? undefined : objecttype) || []);
        }
        return promises;
    };
    BehaviourManager.factories = new Map();
    return BehaviourManager;
}());



/***/ }),

/***/ "../src/Behaviour/CutScene.ts":
/*!************************************!*\
  !*** ../src/Behaviour/CutScene.ts ***!
  \************************************/
/*! exports provided: CutScene */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CutScene", function() { return CutScene; });
/* harmony import */ var _Behaviour__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Behaviour */ "../src/Behaviour/Behaviour.ts");
/* harmony import */ var _BehaviourManager__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./BehaviourManager */ "../src/Behaviour/BehaviourManager.ts");
/* harmony import */ var _Constants__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Constants */ "../src/Constants.ts");
/* harmony import */ var _Utils_Browser__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../Utils/Browser */ "../src/Utils/Browser.ts");
/* harmony import */ var _Utils_Misc__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../Utils/Misc */ "../src/Utils/Misc.ts");
/* harmony import */ var _Animation_TrackInstance__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../Animation/TrackInstance */ "../src/Animation/TrackInstance.ts");
/* harmony import */ var _CutSceneHelper__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./CutSceneHelper */ "../src/Behaviour/CutSceneHelper.ts");
/* harmony import */ var _CutSceneTR4__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./CutSceneTR4 */ "../src/Behaviour/CutSceneTR4.ts");
/* harmony import */ var _CutSceneControl__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./CutSceneControl */ "../src/Behaviour/CutSceneControl.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __read = (undefined && undefined.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (undefined && undefined.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};









var FRAME_DURATION = 1 / _Constants__WEBPACK_IMPORTED_MODULE_2__["baseFrameRate"];
var CutScene = /** @class */ (function (_super) {
    __extends(CutScene, _super);
    function CutScene(nbhv, gameData, objectid, objecttype) {
        var _this = _super.call(this, nbhv, gameData, objectid, objecttype) || this;
        _this.name = CutScene.name;
        _this.sceneData = gameData.sceneData;
        _this.bhvMgr = gameData.bhvMgr;
        _this.confMgr = gameData.confMgr;
        _this.anmMgr = gameData.anmMgr;
        _this.objMgr = gameData.objMgr;
        _this.matMgr = gameData.matMgr;
        _this.trlvl = gameData.trlvl;
        _this.sceneData = gameData.sceneData;
        _this.camera = gameData.camera;
        _this.cutscene = _this.sceneData.cutScene;
        _this.cutSceneEnded = false;
        _this.objects = {};
        _this.bhvCtrl = null;
        _this.helper = null;
        _this.lara = null;
        _this.soundStarted = false;
        _this._volume = _this._volumeSaved = 0;
        _this._muted = false;
        _this.cutscene = {
            "index": 0,
            "curFrame": 0,
            "frames": null,
            "position": [0, 0, 0],
            "quaternion": [0, 0, 0, 0],
            "sound": null,
            "soundbuffer": null,
            "gainNode": null,
            "objects": null,
        };
        _this.control = new _CutSceneControl__WEBPACK_IMPORTED_MODULE_8__["default"](_this, gameData);
        return _this;
    }
    CutScene.prototype.init = function (lstObjs) {
        var _this = this;
        var useAddLights = this.nbhv.useadditionallights === 'true' || this.nbhv.useadditionallights === true, index = this.nbhv.index || 0, promises = [];
        this.matMgr.useAdditionalLights = useAddLights;
        this.cutscene.index = index;
        // set cutscene origin
        this.lara = this.bhvMgr.getBehaviour("Lara")[0].getObject(); //(this.objMgr.objectList['moveable'][ObjectID.Lara] as Array<IMesh>)[0];
        this.helper = new _CutSceneHelper__WEBPACK_IMPORTED_MODULE_6__["default"](this.gameData, this.lara);
        this.cutscene.frames = this.trlvl.trlevel.cinematicFrames;
        this.cutscene.position = this.lara.position;
        var laraQuat = this.lara.quaternion, laraAngle = this.confMgr.float('behaviour[name="Lara"] > angle');
        if (laraAngle != -Infinity) {
            var q = glMatrix.quat.create();
            glMatrix.quat.setAxisAngle(q, [0, 1, 0], glMatrix.glMatrix.toRadian(laraAngle));
            laraQuat = q;
        }
        this.cutscene.quaternion = laraQuat;
        // update position/quaternion for some specific items when we play a cut scene
        var min = this.confMgr.number('cutscene > animminid', true, -1), max = this.confMgr.number('cutscene > animmaxid', true, -1), ids = this.confMgr.param('cutscene > animids', true), oids = new Set().add(_Constants__WEBPACK_IMPORTED_MODULE_2__["ObjectID"].Lara), moveables = this.objMgr.objectList['moveable'];
        if (ids) {
            ids.split(",").forEach(function (id) { return oids.add(parseInt(id)); });
        }
        for (var objID in moveables) {
            var lstObj = moveables[objID];
            lstObj.forEach(function (obj) {
                var data = _this.sceneData.objects[obj.name];
                if (data.objectid >= min && data.objectid <= max || oids.has(data.objectid)) {
                    obj.setPosition(_this.cutscene.position);
                    obj.setQuaternion(_this.cutscene.quaternion);
                    if (data.layer) {
                        data.layer.update();
                    }
                }
            });
        }
        if (index > 0) {
            var tr4Promise = new _CutSceneTR4__WEBPACK_IMPORTED_MODULE_7__["default"](this.gameData, this.cutscene, this.helper, this.lara).makeTR4Cutscene(parseInt(index));
            promises.push(tr4Promise.then(function () {
                _this.objects = _this.cutscene.objects;
                //this.anmMgr.setAnimatedObjects(this.objects); // have the animation manager animates all objects and not only the ones from the cutscene, to get correct bounding boxes
                _this.registerAnimations();
                _this.resetHair();
                _this.control.init();
            }));
        }
        else {
            promises.push.apply(promises, __spread(this.helper.prepareLevel(this.confMgr.trversion, this.confMgr.levelName, 0, [])));
            promises.push(_Utils_Misc__WEBPACK_IMPORTED_MODULE_4__["default"].loadSoundAsync(this.gameData.relpath + this.sceneData.soundPath + this.sceneData.levelShortFileNameNoExt.toUpperCase()).then(function (ret) {
                if (!ret || ret.code < 0) {
                    console.log('Error decoding sound data for cutscene.');
                }
                else {
                    _this.cutscene.sound = ret.sound;
                    _this.cutscene.soundbuffer = ret.soundbuffer;
                }
            }));
            this.makeObjectList();
            this.registerAnimations();
            this.resetHair();
            this.control.init();
        }
        return [_Behaviour__WEBPACK_IMPORTED_MODULE_0__["BehaviourRetCode"].keepBehaviour, promises];
    };
    CutScene.prototype.resetHair = function () {
        var ponytail = this.bhvMgr.getBehaviour("Ponytail") ? this.bhvMgr.getBehaviour("Ponytail")[0] : null;
        if (ponytail) {
            ponytail.reset();
            ponytail.preWarm();
        }
    };
    CutScene.prototype.makeObjectList = function () {
        var moveables = this.objMgr.objectList['moveable'];
        this.objects = {};
        for (var objID in moveables) {
            var lstObj = moveables[objID];
            for (var i = 0; i < lstObj.length; ++i) {
                var obj = lstObj[i], data = this.sceneData.objects[obj.name];
                if (data.dummy || !data.has_anims || !data.visible) {
                    continue;
                }
                this.objects[obj.name] = obj;
            }
        }
    };
    // register all animations we will need in the cut scene
    CutScene.prototype.registerAnimations = function () {
        for (var objID in this.objects) {
            var obj = this.objects[objID], data = this.sceneData.objects[obj.name], registered = {}, allTrackInstances = {};
            var anmIndex = data.animationStartIndex;
            while (true) {
                if (anmIndex == -1 || registered[anmIndex]) {
                    break;
                }
                registered[anmIndex] = true;
                var track = this.sceneData.animTracks[anmIndex], trackInstance_1 = new _Animation_TrackInstance__WEBPACK_IMPORTED_MODULE_5__["default"](track, data.skeleton);
                trackInstance_1.noInterpolationToNextTrack = true;
                allTrackInstances[anmIndex] = trackInstance_1;
                anmIndex = track.nextTrack;
            }
            data.allTrackInstances = allTrackInstances;
            var trackInstance = allTrackInstances[data.animationStartIndex];
            if (trackInstance.track.nextTrack != -1) {
                trackInstance.setNextTrackInstance(data.allTrackInstances[trackInstance.track.nextTrack], trackInstance.track.nextTrackFrame);
            }
            trackInstance.setNoInterpolationToNextTrack = true;
            trackInstance.runForward(0);
            trackInstance.interpolate();
            data.trackInstance = trackInstance;
            data.prevTrackInstance = data.trackInstance;
            data.prevTrackInstanceFrame = 0;
        }
    };
    CutScene.prototype.reset = function (resetCamera) {
        if (resetCamera === void 0) { resetCamera = true; }
        // Reset all animations
        this.registerAnimations();
        this.anmMgr.undoAnimCommands(this.cutscene.curFrame, this.objects);
        this.cutscene.curFrame = 0;
        this.cutSceneEnded = false;
        if (resetCamera) {
            this.update(0, 0);
        }
    };
    Object.defineProperty(CutScene.prototype, "volume", {
        get: function () {
            return this._volume;
        },
        set: function (v) {
            this._volume = v;
            if (this.cutscene.gainNode) {
                this.cutscene.gainNode.gain.value = v;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CutScene.prototype, "muted", {
        get: function () {
            return this._muted;
        },
        set: function (m) {
            if (m && this._muted || !m && !this._muted) {
                return;
            }
            if (m) {
                this._muted = true;
                this._volumeSaved = this._volume;
                this.volume = 0;
            }
            else {
                this._muted = false;
                this.volume = this._volumeSaved;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CutScene.prototype, "duration", {
        get: function () {
            return this.cutscene.frames.length * FRAME_DURATION;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CutScene.prototype, "currentTime", {
        get: function () {
            return this.cutscene.curFrame * FRAME_DURATION;
        },
        set: function (t) {
            this.fastForward(t * _Constants__WEBPACK_IMPORTED_MODULE_2__["baseFrameRate"]);
        },
        enumerable: true,
        configurable: true
    });
    CutScene.prototype.fastForward = function (futureFrame) {
        this.reset(false);
        this.anmMgr.fastForward(futureFrame, this.objects);
        this.cutscene.curFrame = futureFrame;
        this.update(0, 0); // reset camera
        this.resetHair();
    };
    CutScene.prototype.showController = function () {
        this.control.bindEvents();
    };
    CutScene.prototype.stopSound = function () {
        if (this.cutscene.sound) {
            this.cutscene.sound.stop();
        }
    };
    CutScene.prototype.startSound = function (time) {
        if (this.cutscene.sound) {
            if (!time) {
                time = this.currentTime;
            }
            this.cutscene.sound.stop();
            this.cutscene.sound = _Utils_Browser__WEBPACK_IMPORTED_MODULE_3__["default"].AudioContext.createBufferSource();
            this.cutscene.sound.buffer = this.cutscene.soundbuffer;
            this.cutscene.sound.connect(this.cutscene.gainNode);
            this.cutscene.sound.start(0, time);
        }
    };
    CutScene.prototype.onBeforeRenderLoop = function () {
        this.gameData.panel.hide();
        this.bhvCtrl = this.bhvMgr.getBehaviour("BasicControl")[0];
    };
    CutScene.prototype.onFrameStarted = function (curTime, delta) {
        if (this.cutSceneEnded || this.control.paused) {
            return;
        }
        if (!this.soundStarted && this.cutscene.sound != null && !this.gameData.singleFrame) {
            this.soundStarted = true;
            this.cutscene.gainNode = _Utils_Browser__WEBPACK_IMPORTED_MODULE_3__["default"].AudioContext.createGain();
            this.volume = this.volume;
            this.cutscene.gainNode.connect(_Utils_Browser__WEBPACK_IMPORTED_MODULE_3__["default"].AudioContext.destination);
            this.cutscene.sound.connect(this.cutscene.gainNode);
            this.cutscene.sound.start();
        }
        this.update(curTime, delta);
    };
    CutScene.prototype.update = function (curTime, delta) {
        this.cutscene.curFrame += _Constants__WEBPACK_IMPORTED_MODULE_2__["baseFrameRate"] * delta;
        this.control.updateTime(this.cutscene.curFrame * FRAME_DURATION);
        // Update camera
        var t = this.cutscene.curFrame - Math.floor(this.cutscene.curFrame), cfrmA = Math.min(Math.floor(this.cutscene.curFrame), this.cutscene.frames.length - 2), cfrmB = Math.min(cfrmA + 1, this.cutscene.frames.length - 1);
        if (cfrmA < this.cutscene.frames.length - 3) {
            if (!this.bhvCtrl.captureMouse) {
                var frm1 = this.cutscene.frames[cfrmA], frm2 = this.cutscene.frames[cfrmB], maxDelta = 512.0 * 512.0, fovMult = 60.0 / 16384.0, rollMult = -90.0 / 16384.0;
                var eyePos = [frm1.posX, -frm1.posY, -frm1.posZ], eyePos2 = [frm2.posX, -frm2.posY, -frm2.posZ], lkat = [frm1.targetX, -frm1.targetY, -frm1.targetZ], lkat2 = [frm2.targetX, -frm2.targetY, -frm2.targetZ];
                var odp = [0, 0, 0], odt = [0, 0, 0];
                glMatrix.vec3.sub(odp, eyePos, eyePos2);
                glMatrix.vec3.sub(odt, lkat, lkat2);
                var dp = glMatrix.vec3.squaredLength(odp), dt = glMatrix.vec3.squaredLength(odt);
                var fov = frm1.fov * fovMult, roll = frm1.roll * rollMult;
                if (dp <= maxDelta && dt <= maxDelta) {
                    glMatrix.vec3.lerp(eyePos, eyePos, eyePos2, t);
                    glMatrix.vec3.lerp(lkat, lkat, lkat2, t);
                    fov = _Utils_Misc__WEBPACK_IMPORTED_MODULE_4__["default"].lerp(frm1.fov * fovMult, frm2.fov * fovMult, t);
                    roll = _Utils_Misc__WEBPACK_IMPORTED_MODULE_4__["default"].lerp(frm1.roll * rollMult, frm2.roll * rollMult, t);
                }
                var q = this.cutscene.quaternion.slice();
                glMatrix.vec3.transformQuat(lkat, lkat, q);
                glMatrix.vec3.transformQuat(eyePos, eyePos, q);
                this.camera.fov = fov;
                this.camera.setPosition(eyePos);
                this.camera.lookAt(lkat);
                this.camera.setPosition([this.camera.position[0] + this.cutscene.position[0], this.camera.position[1] + this.cutscene.position[1], this.camera.position[2] + this.cutscene.position[2]]);
                var qcam = this.camera.quaternion;
                glMatrix.quat.setAxisAngle(q, [0, 1, 0], glMatrix.glMatrix.toRadian(roll));
                glMatrix.quat.mul(qcam, q, qcam);
                this.camera.setQuaternion(qcam);
                this.camera.updateProjectionMatrix();
            }
        }
        else {
            this.cutSceneEnded = true;
            this.anmMgr.pause(true);
            this.control.finished();
        }
    };
    CutScene.prototype.onFrameEnded = function (curTime, delta) {
        // Update object lights (only in TR4 cutscenes)
        if (this.cutscene.index <= 0 || this.control.paused) {
            return;
        }
        for (var objID in this.objects) {
            var obj = this.objects[objID], data = this.sceneData.objects[obj.name];
            var pos = obj.position;
            pos[0] += data.skeleton.bones[0].position[0];
            pos[1] += data.skeleton.bones[0].position[1];
            pos[2] += data.skeleton.bones[0].position[2];
            var roomObj = this.objMgr.getRoomByPos(pos);
            if (roomObj >= 0 && roomObj != data.roomIndex) {
                this.objMgr.changeRoomMembership(obj, data.roomIndex, roomObj);
            }
        }
    };
    return CutScene;
}(_Behaviour__WEBPACK_IMPORTED_MODULE_0__["Behaviour"]));

_BehaviourManager__WEBPACK_IMPORTED_MODULE_1__["BehaviourManager"].registerFactory(CutScene);


/***/ }),

/***/ "../src/Behaviour/CutSceneControl.ts":
/*!*******************************************!*\
  !*** ../src/Behaviour/CutSceneControl.ts ***!
  \*******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! jquery */ "jquery");
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(jquery__WEBPACK_IMPORTED_MODULE_0__);

/*
*
** Heavily based on http://www.inwebson.com/html5/custom-html5-video-controls-with-jquery/ by Kenny
*
*/
var CutSceneControl = /** @class */ (function () {
    function CutSceneControl(cutscene, gameData) {
        this._gameData = gameData;
        this._cutscene = cutscene;
        this._volumeDrag = false;
        this._timeDrag = false;
        this._paused = false;
        this._pausedSave = false;
        this._ended = false;
    }
    CutSceneControl.prototype.init = function () {
        jquery__WEBPACK_IMPORTED_MODULE_0___default()("<style type=\"text/css\" media=\"all\">@import \"" + this._gameData.relpath + "resources/css/cccontrol.css\";</style>").appendTo(jquery__WEBPACK_IMPORTED_MODULE_0___default()(document.body));
        return fetch(this._gameData.relpath + 'resources/template/cccontrol.html').then(function (response) {
            return response.text().then(function (html) {
                jquery__WEBPACK_IMPORTED_MODULE_0___default()(document.body).append(html);
            });
        });
    };
    Object.defineProperty(CutSceneControl.prototype, "paused", {
        get: function () {
            return this._paused;
        },
        enumerable: true,
        configurable: true
    });
    CutSceneControl.prototype.bindEvents = function () {
        var _this = this;
        // Handle showing/clicking on big button to start replay
        jquery__WEBPACK_IMPORTED_MODULE_0___default()(document.body)
            .append('<div id="init"></div>')
            .on('click', (function (obj) { return function () {
            jquery__WEBPACK_IMPORTED_MODULE_0___default()('#init').remove();
            jquery__WEBPACK_IMPORTED_MODULE_0___default()('.btnPlay').addClass('paused');
            obj.off('click');
            obj.on('click', (function (ctrl) {
                return function (e) {
                    if (e.which == 1) {
                        ctrl.playPause();
                    }
                    return false;
                };
            })(_this));
            _this.bindControlEvents();
            _this._gameData.play.play();
        }; })(jquery__WEBPACK_IMPORTED_MODULE_0___default()(document.body)));
        jquery__WEBPACK_IMPORTED_MODULE_0___default()('#init').fadeIn(200);
        // Visibility of the control bar
        jquery__WEBPACK_IMPORTED_MODULE_0___default()('.control')
            .hover(function () {
            jquery__WEBPACK_IMPORTED_MODULE_0___default()('.control').stop().animate({ 'bottom': 0 }, 500);
            jquery__WEBPACK_IMPORTED_MODULE_0___default()('.caption').stop().animate({ 'top': 0 }, 500);
        }, function () {
            if (!_this._volumeDrag && !_this._timeDrag) {
                jquery__WEBPACK_IMPORTED_MODULE_0___default()('.control').stop().animate({ 'bottom': -45 }, 500);
                jquery__WEBPACK_IMPORTED_MODULE_0___default()('.caption').stop().animate({ 'top': -45 }, 500);
            }
        }).on('click', function (e) { e.stopPropagation(); return false; });
        // Set video properties
        jquery__WEBPACK_IMPORTED_MODULE_0___default()('.current').text(this.timeFormat(0));
        jquery__WEBPACK_IMPORTED_MODULE_0___default()('.duration').text(this.timeFormat(this._cutscene.duration));
        this.updateVolume(0, 0.7);
        // Fullscreen button clicked
        jquery__WEBPACK_IMPORTED_MODULE_0___default()('.btnFS').on('click', function () {
            if (document.fullscreenElement != null) {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                }
            }
            else if (document.body.requestFullscreen) {
                document.body.requestFullscreen();
            }
            return false;
        });
        // Sound button clicked
        jquery__WEBPACK_IMPORTED_MODULE_0___default()('.sound').click((function (obj) { return function () {
            _this._cutscene.muted = !_this._cutscene.muted;
            obj.toggleClass('muted');
            if (_this._cutscene.muted) {
                jquery__WEBPACK_IMPORTED_MODULE_0___default()('.volumeBar').css('width', 0);
            }
            else {
                jquery__WEBPACK_IMPORTED_MODULE_0___default()('.volumeBar').css('width', (_this._cutscene.volume * 100) + '%');
            }
            return false;
        }; })(jquery__WEBPACK_IMPORTED_MODULE_0___default()('.sound')));
        // Volume bar event
        jquery__WEBPACK_IMPORTED_MODULE_0___default()('.volume').on('mousedown', (function (ctrl) {
            return function (e) {
                ctrl._volumeDrag = true;
                ctrl._cutscene.muted = false;
                jquery__WEBPACK_IMPORTED_MODULE_0___default()('.sound').removeClass('muted');
                ctrl.updateVolume(e.pageX, 0);
                e.stopPropagation();
                return false;
            };
        })(this)).on('click', function (e) { return false; });
        jquery__WEBPACK_IMPORTED_MODULE_0___default()(document).on('mouseup', (function (ctrl) {
            return function (e) {
                if (ctrl._volumeDrag) {
                    ctrl._volumeDrag = false;
                    ctrl.updateVolume(e.pageX, 0);
                }
            };
        })(this));
        jquery__WEBPACK_IMPORTED_MODULE_0___default()(document).on('mousemove', (function (ctrl) {
            return function (e) {
                if (ctrl._volumeDrag) {
                    ctrl.updateVolume(e.pageX, 0);
                }
            };
        })(this));
        jquery__WEBPACK_IMPORTED_MODULE_0___default()('.control').css('display', 'block');
    };
    CutSceneControl.prototype.bindControlEvents = function () {
        var _this = this;
        var DEMO = {
            INI: {
                MOUSE_IDLE: 3000
            },
            hideMouse: function () {
                jquery__WEBPACK_IMPORTED_MODULE_0___default()(document.body).css('cursor', 'none');
                jquery__WEBPACK_IMPORTED_MODULE_0___default()(document.body).on("mousemove", DEMO.waitThenHideMouse);
            },
            waitThenHideMouse: function () {
                jquery__WEBPACK_IMPORTED_MODULE_0___default()(document.body).css('cursor', 'default');
                jquery__WEBPACK_IMPORTED_MODULE_0___default()(document.body).off("mousemove", DEMO.waitThenHideMouse);
                setTimeout(DEMO.hideMouse, DEMO.INI.MOUSE_IDLE);
            },
            showMouse: function () {
                jquery__WEBPACK_IMPORTED_MODULE_0___default()(document.body).off("mousemove", DEMO.waitThenHideMouse);
                jquery__WEBPACK_IMPORTED_MODULE_0___default()(document.body).css('cursor', 'default');
            },
        };
        DEMO.waitThenHideMouse();
        // Play button clicked
        jquery__WEBPACK_IMPORTED_MODULE_0___default()('.btnPlay').on('click', this.playPause.bind(this));
        // Stop button clicked
        jquery__WEBPACK_IMPORTED_MODULE_0___default()('.btnStop').on('click', function () {
            jquery__WEBPACK_IMPORTED_MODULE_0___default()('.btnPlay').removeClass('paused');
            _this.updatebar(jquery__WEBPACK_IMPORTED_MODULE_0___default()('.progress').offset().left);
            if (!_this._paused || _this._ended) {
                _this.playPause();
            }
            _this._cutscene.reset();
            return false;
        });
        // When video timebar is clicked
        jquery__WEBPACK_IMPORTED_MODULE_0___default()('.progress').on('mousedown', (function (ctrl) {
            return function (e) {
                ctrl._timeDrag = true;
                ctrl._cutscene.stopSound();
                ctrl._pausedSave = ctrl._paused;
                if (!ctrl._paused) {
                    ctrl._gameData.anmMgr.pause(true);
                    ctrl._paused = true;
                }
                ctrl.updatebar(e.pageX);
                return false;
            };
        })(this));
        jquery__WEBPACK_IMPORTED_MODULE_0___default()(document).on('mouseup', (function (ctrl) {
            return function (e) {
                if (ctrl._timeDrag) {
                    ctrl._timeDrag = false;
                    ctrl.updatebar(e.pageX);
                    if (ctrl._ended) {
                        ctrl._ended = false;
                    }
                    ctrl._paused = ctrl._pausedSave;
                    if (!ctrl._paused) {
                        ctrl._cutscene.startSound();
                        ctrl._gameData.anmMgr.pause(false);
                    }
                }
            };
        })(this));
        jquery__WEBPACK_IMPORTED_MODULE_0___default()(document).on('mousemove', (function (ctrl) {
            return function (e) {
                if (ctrl._timeDrag) {
                    ctrl.updatebar(e.pageX);
                }
            };
        })(this));
    };
    CutSceneControl.prototype.updateTime = function (currentTime) {
        var maxduration = this._cutscene.duration, perc = 100 * currentTime / maxduration;
        jquery__WEBPACK_IMPORTED_MODULE_0___default()('.timeBar').css('width', perc + '%');
        jquery__WEBPACK_IMPORTED_MODULE_0___default()('.current').text(this.timeFormat(currentTime));
    };
    CutSceneControl.prototype.finished = function () {
        this.updateTime(this._cutscene.duration);
        jquery__WEBPACK_IMPORTED_MODULE_0___default()('.btnPlay').removeClass('paused');
        this._ended = this._paused = true;
    };
    CutSceneControl.prototype.playPause = function () {
        if (this._paused || this._ended) {
            if (this._ended) {
                this.updatebar(jquery__WEBPACK_IMPORTED_MODULE_0___default()('.progress').offset().left);
                this._cutscene.reset();
                this._ended = false;
            }
            jquery__WEBPACK_IMPORTED_MODULE_0___default()('.btnPlay').addClass('paused');
            this._gameData.anmMgr.pause(false);
            this._paused = false;
            this._cutscene.startSound();
        }
        else {
            jquery__WEBPACK_IMPORTED_MODULE_0___default()('.btnPlay').removeClass('paused');
            this._gameData.anmMgr.pause(true);
            this._paused = true;
            this._cutscene.stopSound();
        }
        return false;
    };
    CutSceneControl.prototype.updatebar = function (x) {
        var progress = jquery__WEBPACK_IMPORTED_MODULE_0___default()('.progress');
        // calculate drag position
        // and update video currenttime
        // as well as progress bar
        var maxduration = this._cutscene.duration;
        var position = x - progress.offset().left;
        var percentage = 100 * position / progress.width();
        if (percentage > 100) {
            percentage = 100;
        }
        if (percentage < 0) {
            percentage = 0;
        }
        var newTime = maxduration * percentage / 100;
        this._cutscene.currentTime = newTime;
    };
    CutSceneControl.prototype.updateVolume = function (x, vol) {
        var volume = jquery__WEBPACK_IMPORTED_MODULE_0___default()('.volume');
        var percentage;
        // if volume have been specified then direct update volume
        if (vol) {
            percentage = vol * 100;
        }
        else {
            var position = x - volume.offset().left;
            percentage = 100 * position / volume.width();
        }
        if (percentage > 100) {
            percentage = 100;
        }
        if (percentage < 0) {
            percentage = 0;
        }
        // update volume bar and video volume
        jquery__WEBPACK_IMPORTED_MODULE_0___default()('.volumeBar').css('width', percentage + '%');
        this._cutscene.volume = percentage / 100;
        // change sound icon based on volume
        if (percentage == 0) {
            jquery__WEBPACK_IMPORTED_MODULE_0___default()('.sound').removeClass('sound2').addClass('muted');
        }
        else if (percentage > 50) {
            jquery__WEBPACK_IMPORTED_MODULE_0___default()('.sound').removeClass('muted').addClass('sound2');
        }
        else {
            jquery__WEBPACK_IMPORTED_MODULE_0___default()('.sound').removeClass('muted').removeClass('sound2');
        }
    };
    // Time format converter - 00:00
    CutSceneControl.prototype.timeFormat = function (seconds) {
        var min = Math.floor(seconds / 60), m = min < 10 ? "0" + min : "" + min, s = Math.floor(seconds - min * 60) < 10 ? "0" + Math.floor(seconds - min * 60) : "" + Math.floor(seconds - min * 60);
        return m + ":" + s;
    };
    return CutSceneControl;
}());
/* harmony default export */ __webpack_exports__["default"] = (CutSceneControl);


/***/ }),

/***/ "../src/Behaviour/CutSceneHelper.ts":
/*!******************************************!*\
  !*** ../src/Behaviour/CutSceneHelper.ts ***!
  \******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Proxy_Engine__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Proxy/Engine */ "../src/Proxy/Engine.ts");
/* harmony import */ var _Player_Layer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Player/Layer */ "../src/Player/Layer.ts");
/* harmony import */ var _Player_Skeleton__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Player/Skeleton */ "../src/Player/Skeleton.ts");
/* harmony import */ var _Animation_Commands__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../Animation/Commands */ "../src/Animation/Commands.ts");
/* harmony import */ var _Animation_CommandDispatch__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../Animation/CommandDispatch */ "../src/Animation/CommandDispatch.ts");





var CutSceneHelper = /** @class */ (function () {
    function CutSceneHelper(gameData, lara) {
        this.gameData = gameData;
        this.sceneData = gameData.sceneData;
        this.objMgr = gameData.objMgr;
        this.shdMgr = gameData.shdMgr;
        this.scene = gameData.sceneRender;
        this._holeDone = false;
    }
    CutSceneHelper.prototype.prepareLevel = function (trVersion, levelName, csIndex, actorMoveables) {
        var _this = this;
        var promises = [];
        if (trVersion == 'TR2') {
            switch (levelName) {
                case 'cut1.tr2': {
                    // disable interpolation for laptop animation
                    var laptop = this.objMgr.objectList['moveable'][128][0], data = this.sceneData.objects[laptop.name], anmIndex = data.animationStartIndex;
                    var track = this.sceneData.animTracks[anmIndex];
                    track = this.sceneData.animTracks[track.nextTrack];
                    track.setCommands([
                        { cmd: _Animation_Commands__WEBPACK_IMPORTED_MODULE_3__["Commands"].ANIMCMD_MISCACTIONONFRAME, params: [track.commandsFrameStart + 0, _Animation_Commands__WEBPACK_IMPORTED_MODULE_3__["Commands"].Misc.ANIMCMD_MISC_SETINTERPOLATION, false] },
                    ], track.commandsFrameStart);
                    break;
                }
                case 'cut3.tr2': {
                    // bad guys are not at the right location
                    var black = this.objMgr.objectList['moveable'][98][0], red = this.objMgr.objectList['moveable'][97][0];
                    black.setQuaternion([0, 1, 0, 0]); // 180 deg rotation
                    black.setPosition([16900, -5632, -7680]);
                    red.setPosition([20000, -5632, -10700]);
                    break;
                }
            }
        }
        switch (csIndex) {
            case 1: {
                // Handle the shovel / Make a hole in the ground / Add a fade-in/out between animation #1 and #2 (so that we don't see the hole pop...)
                var lara = actorMoveables[0], data_1 = this.sceneData.objects[lara.name], track1 = this.sceneData.animTracks[this.sceneData.objects[lara.name].animationStartIndex], track2 = this.sceneData.animTracks[this.sceneData.objects[lara.name].animationStartIndex + 1];
                var meshShovel = this.objMgr.createMoveable(417, data_1.roomIndex, undefined, true, data_1.skeleton);
                data_1.layer.setMesh(_Player_Layer__WEBPACK_IMPORTED_MODULE_1__["LAYER"].MESHSWAP, meshShovel, 0);
                this.prepareHole();
                this._holeDone = true;
                this.cs1MakeHole(_Animation_CommandDispatch__WEBPACK_IMPORTED_MODULE_4__["CommandDispatchMode"].NORMAL);
                track1.setCommands([
                    { cmd: _Animation_Commands__WEBPACK_IMPORTED_MODULE_3__["Commands"].ANIMCMD_MISCACTIONONFRAME, params: [24, _Animation_Commands__WEBPACK_IMPORTED_MODULE_3__["Commands"].Misc.ANIMCMD_MISC_CUSTOMFUNCTION, function () { return data_1.layer.updateMask(_Player_Layer__WEBPACK_IMPORTED_MODULE_1__["LAYER"].MESHSWAP, _Player_Skeleton__WEBPACK_IMPORTED_MODULE_2__["MASK"].ARM_L3); }] },
                    { cmd: _Animation_Commands__WEBPACK_IMPORTED_MODULE_3__["Commands"].ANIMCMD_MISCACTIONONFRAME, params: [230, _Animation_Commands__WEBPACK_IMPORTED_MODULE_3__["Commands"].Misc.ANIMCMD_MISC_CUSTOMFUNCTION, function (action, obj, mode) { return _this.fadeOut(1.0, mode); }] }
                ], 0);
                track2.setCommands([
                    { cmd: _Animation_Commands__WEBPACK_IMPORTED_MODULE_3__["Commands"].ANIMCMD_MISCACTIONONFRAME, params: [27, _Animation_Commands__WEBPACK_IMPORTED_MODULE_3__["Commands"].Misc.ANIMCMD_MISC_CUSTOMFUNCTION, function (action, obj, mode) { return _this.cs1MakeHole(mode); }] },
                    { cmd: _Animation_Commands__WEBPACK_IMPORTED_MODULE_3__["Commands"].ANIMCMD_MISCACTIONONFRAME, params: [30, _Animation_Commands__WEBPACK_IMPORTED_MODULE_3__["Commands"].Misc.ANIMCMD_MISC_CUSTOMFUNCTION, function (action, obj, mode) { return _this.fadeIn(1.0, mode); }] },
                    { cmd: _Animation_Commands__WEBPACK_IMPORTED_MODULE_3__["Commands"].ANIMCMD_MISCACTIONONFRAME, params: [147, _Animation_Commands__WEBPACK_IMPORTED_MODULE_3__["Commands"].Misc.ANIMCMD_MISC_CUSTOMFUNCTION, function () { return data_1.layer.updateMask(_Player_Layer__WEBPACK_IMPORTED_MODULE_1__["LAYER"].MESHSWAP, _Player_Skeleton__WEBPACK_IMPORTED_MODULE_2__["MASK"].ARM_L3); }] }
                ], 0);
                break;
            }
            case 2: {
                // Handle the shovel
                var lara = actorMoveables[0], data_2 = this.sceneData.objects[lara.name], track1 = this.sceneData.animTracks[this.sceneData.objects[lara.name].animationStartIndex];
                var meshShovel = this.objMgr.createMoveable(417, data_2.roomIndex, undefined, true, data_2.skeleton);
                data_2.layer.setMesh(_Player_Layer__WEBPACK_IMPORTED_MODULE_1__["LAYER"].MESHSWAP, meshShovel, 0);
                this.prepareHole();
                track1.setCommands([
                    { cmd: _Animation_Commands__WEBPACK_IMPORTED_MODULE_3__["Commands"].ANIMCMD_MISCACTIONONFRAME, params: [0, _Animation_Commands__WEBPACK_IMPORTED_MODULE_3__["Commands"].Misc.ANIMCMD_MISC_CUSTOMFUNCTION, function () { return data_2.layer.updateMask(_Player_Layer__WEBPACK_IMPORTED_MODULE_1__["LAYER"].MESHSWAP, _Player_Skeleton__WEBPACK_IMPORTED_MODULE_2__["MASK"].ARM_L3); }] },
                    { cmd: _Animation_Commands__WEBPACK_IMPORTED_MODULE_3__["Commands"].ANIMCMD_MISCACTIONONFRAME, params: [147, _Animation_Commands__WEBPACK_IMPORTED_MODULE_3__["Commands"].Misc.ANIMCMD_MISC_CUSTOMFUNCTION, function () { return data_2.layer.updateMask(_Player_Layer__WEBPACK_IMPORTED_MODULE_1__["LAYER"].MESHSWAP, _Player_Skeleton__WEBPACK_IMPORTED_MODULE_2__["MASK"].ARM_L3); }] }
                ], 0);
                break;
            }
            case 4: {
                // Handle the pistols visibility + fire during the fight with the scorpion
                var lara = actorMoveables[0], trackL = this.sceneData.animTracks[this.sceneData.objects[lara.name].animationStartIndex], commandsL = [];
                trackL.setCommands(commandsL, 0);
                commandsL.push({ cmd: _Animation_Commands__WEBPACK_IMPORTED_MODULE_3__["Commands"].ANIMCMD_MISCACTIONONFRAME, params: [0, _Animation_Commands__WEBPACK_IMPORTED_MODULE_3__["Commands"].Misc.ANIMCMD_MISC_GETLEFTGUN] }, { cmd: _Animation_Commands__WEBPACK_IMPORTED_MODULE_3__["Commands"].ANIMCMD_MISCACTIONONFRAME, params: [0, _Animation_Commands__WEBPACK_IMPORTED_MODULE_3__["Commands"].Misc.ANIMCMD_MISC_GETRIGHTGUN] }, { cmd: _Animation_Commands__WEBPACK_IMPORTED_MODULE_3__["Commands"].ANIMCMD_MISCACTIONONFRAME, params: [12, _Animation_Commands__WEBPACK_IMPORTED_MODULE_3__["Commands"].Misc.ANIMCMD_MISC_FIRERIGHTGUN] }, { cmd: _Animation_Commands__WEBPACK_IMPORTED_MODULE_3__["Commands"].ANIMCMD_MISCACTIONONFRAME, params: [55, _Animation_Commands__WEBPACK_IMPORTED_MODULE_3__["Commands"].Misc.ANIMCMD_MISC_FIRELEFTGUN] }, { cmd: _Animation_Commands__WEBPACK_IMPORTED_MODULE_3__["Commands"].ANIMCMD_MISCACTIONONFRAME, params: [70, _Animation_Commands__WEBPACK_IMPORTED_MODULE_3__["Commands"].Misc.ANIMCMD_MISC_FIRERIGHTGUN] }, { cmd: _Animation_Commands__WEBPACK_IMPORTED_MODULE_3__["Commands"].ANIMCMD_MISCACTIONONFRAME, params: [80, _Animation_Commands__WEBPACK_IMPORTED_MODULE_3__["Commands"].Misc.ANIMCMD_MISC_FIRELEFTGUN] }, { cmd: _Animation_Commands__WEBPACK_IMPORTED_MODULE_3__["Commands"].ANIMCMD_MISCACTIONONFRAME, params: [100, _Animation_Commands__WEBPACK_IMPORTED_MODULE_3__["Commands"].Misc.ANIMCMD_MISC_FIRERIGHTGUN] }, { cmd: _Animation_Commands__WEBPACK_IMPORTED_MODULE_3__["Commands"].ANIMCMD_MISCACTIONONFRAME, params: [110, _Animation_Commands__WEBPACK_IMPORTED_MODULE_3__["Commands"].Misc.ANIMCMD_MISC_FIRELEFTGUN] }, { cmd: _Animation_Commands__WEBPACK_IMPORTED_MODULE_3__["Commands"].ANIMCMD_MISCACTIONONFRAME, params: [120, _Animation_Commands__WEBPACK_IMPORTED_MODULE_3__["Commands"].Misc.ANIMCMD_MISC_FIRERIGHTGUN] }, { cmd: _Animation_Commands__WEBPACK_IMPORTED_MODULE_3__["Commands"].ANIMCMD_MISCACTIONONFRAME, params: [130, _Animation_Commands__WEBPACK_IMPORTED_MODULE_3__["Commands"].Misc.ANIMCMD_MISC_FIRELEFTGUN] }, { cmd: _Animation_Commands__WEBPACK_IMPORTED_MODULE_3__["Commands"].ANIMCMD_MISCACTIONONFRAME, params: [140, _Animation_Commands__WEBPACK_IMPORTED_MODULE_3__["Commands"].Misc.ANIMCMD_MISC_FIRERIGHTGUN] }, { cmd: _Animation_Commands__WEBPACK_IMPORTED_MODULE_3__["Commands"].ANIMCMD_MISCACTIONONFRAME, params: [150, _Animation_Commands__WEBPACK_IMPORTED_MODULE_3__["Commands"].Misc.ANIMCMD_MISC_FIRELEFTGUN] }, { cmd: _Animation_Commands__WEBPACK_IMPORTED_MODULE_3__["Commands"].ANIMCMD_MISCACTIONONFRAME, params: [160, _Animation_Commands__WEBPACK_IMPORTED_MODULE_3__["Commands"].Misc.ANIMCMD_MISC_FIRERIGHTGUN] }, { cmd: _Animation_Commands__WEBPACK_IMPORTED_MODULE_3__["Commands"].ANIMCMD_MISCACTIONONFRAME, params: [170, _Animation_Commands__WEBPACK_IMPORTED_MODULE_3__["Commands"].Misc.ANIMCMD_MISC_FIRELEFTGUN] }, { cmd: _Animation_Commands__WEBPACK_IMPORTED_MODULE_3__["Commands"].ANIMCMD_MISCACTIONONFRAME, params: [200, _Animation_Commands__WEBPACK_IMPORTED_MODULE_3__["Commands"].Misc.ANIMCMD_MISC_FIRERIGHTGUN] }, { cmd: _Animation_Commands__WEBPACK_IMPORTED_MODULE_3__["Commands"].ANIMCMD_MISCACTIONONFRAME, params: [210, _Animation_Commands__WEBPACK_IMPORTED_MODULE_3__["Commands"].Misc.ANIMCMD_MISC_FIRELEFTGUN] }, { cmd: _Animation_Commands__WEBPACK_IMPORTED_MODULE_3__["Commands"].ANIMCMD_MISCACTIONONFRAME, params: [220, _Animation_Commands__WEBPACK_IMPORTED_MODULE_3__["Commands"].Misc.ANIMCMD_MISC_FIRERIGHTGUN] }, { cmd: _Animation_Commands__WEBPACK_IMPORTED_MODULE_3__["Commands"].ANIMCMD_MISCACTIONONFRAME, params: [230, _Animation_Commands__WEBPACK_IMPORTED_MODULE_3__["Commands"].Misc.ANIMCMD_MISC_FIRELEFTGUN] }, { cmd: _Animation_Commands__WEBPACK_IMPORTED_MODULE_3__["Commands"].ANIMCMD_MISCACTIONONFRAME, params: [320, _Animation_Commands__WEBPACK_IMPORTED_MODULE_3__["Commands"].Misc.ANIMCMD_MISC_GETLEFTGUN] }, { cmd: _Animation_Commands__WEBPACK_IMPORTED_MODULE_3__["Commands"].ANIMCMD_MISCACTIONONFRAME, params: [320, _Animation_Commands__WEBPACK_IMPORTED_MODULE_3__["Commands"].Misc.ANIMCMD_MISC_GETRIGHTGUN] });
                // Make speaking heads
                var aziz = actorMoveables[1], azizHeadIds = [21, 22], commandsA = [], trackA = this.sceneData.animTracks[this.sceneData.objects[aziz.name].animationStartIndex];
                this.makeLayeredMesh(aziz);
                trackA.setCommands(commandsA, 0);
                this.setHeads(aziz, commandsA, azizHeadIds, 16 * 30, 28 * 30, 3, 1 << 8);
                break;
            }
            case 5: {
                // Show bagpack
                var lara = actorMoveables[0], data_3 = this.sceneData.objects[lara.name], track1 = this.sceneData.animTracks[this.sceneData.objects[lara.name].animationStartIndex];
                var laraBagpack = this.objMgr.createMoveable(1, -1, undefined, true, data_3.skeleton), meshb = _Proxy_Engine__WEBPACK_IMPORTED_MODULE_0__["default"].makeMeshBuilder(laraBagpack);
                meshb.replaceSkinIndices({ 1: _Player_Skeleton__WEBPACK_IMPORTED_MODULE_2__["BONE"].CHEST });
                data_3.layer.setMeshBuilder(_Player_Layer__WEBPACK_IMPORTED_MODULE_1__["LAYER"].MESHSWAP, meshb, 0);
                track1.setCommands([
                    { cmd: _Animation_Commands__WEBPACK_IMPORTED_MODULE_3__["Commands"].ANIMCMD_MISCACTIONONFRAME, params: [1350, _Animation_Commands__WEBPACK_IMPORTED_MODULE_3__["Commands"].Misc.ANIMCMD_MISC_CUSTOMFUNCTION, function () { return data_3.layer.updateMask(_Player_Layer__WEBPACK_IMPORTED_MODULE_1__["LAYER"].MESHSWAP, _Player_Skeleton__WEBPACK_IMPORTED_MODULE_2__["MASK"].CHEST); }] }
                ], 0);
                break;
            }
            case 6: {
                // Make speaking heads
                var vonCroy = actorMoveables[1], vonCroyHeadIds = [21, 22], commandsVC = [], trackVC = this.sceneData.animTracks[this.sceneData.objects[vonCroy.name].animationStartIndex];
                this.makeLayeredMesh(vonCroy);
                this.setHeads(vonCroy, commandsVC, vonCroyHeadIds, 0 * 30, 6 * 30 + 15, 3, 1 << 21);
                trackVC.setCommands(commandsVC, 0);
                var lara = actorMoveables[0], laraHeadIds = [17, 18, 19, 20], commandsL = [], trackL = this.sceneData.animTracks[this.sceneData.objects[lara.name].animationStartIndex];
                this.setHeads(lara, commandsL, laraHeadIds, 9 * 30 - 10, 12 * 30, 3);
                trackL.setCommands(commandsL, 0);
                break;
            }
            case 7:
            case 8:
            case 9: {
                // Add volumetric fog in the rooms / objects
                var rooms_1 = new Set([0, 1, 2, 3, 4, 5, 6, 7, 8, 110, 111, 112, 113, 114, 115, 116, 117, 122, 123]), shader_1 = this.shdMgr.getFragmentShader("TR_volumetric_fog");
                var setShader_1 = function (obj) {
                    var materials = obj.materials;
                    var _loop_1 = function (m) {
                        var material = materials[m];
                        promises.push(shader_1.then(function (shd) { return material.fragmentShader = shd; }));
                        material.uniforms.volFogCenter = { "type": "f3", "value": [52500.0, 3140.0, -49460.0] };
                        material.uniforms.volFogRadius = { "type": "f", "value": 6000 };
                        material.uniforms.volFogColor = { "type": "f3", "value": [0.1, 0.75, 0.3] };
                    };
                    for (var m = 0; m < materials.length; ++m) {
                        _loop_1(m);
                    }
                };
                this.scene.traverse(function (obj) {
                    var data = _this.sceneData.objects[obj.name];
                    if (data && rooms_1.has(data.roomIndex) || actorMoveables.indexOf(obj) >= 0) {
                        setShader_1(obj);
                    }
                });
                var ponytail = this.gameData.bhvMgr.getBehaviour("Ponytail");
                if (ponytail && ponytail.length > 0) {
                    ponytail[0].braids.forEach(function (braid) { return setShader_1(braid.model); });
                }
                // Make speaking heads
                var vonCroy = actorMoveables[1], vonCroyHeadIds = [21, 22], commandsVC = [], trackVC = this.sceneData.animTracks[this.sceneData.objects[vonCroy.name].animationStartIndex];
                this.makeLayeredMesh(vonCroy);
                trackVC.setCommands(commandsVC, 0);
                var lara = actorMoveables[0], laraHeadIds = [17, 18, 19, 20], commandsL = [], trackL = this.sceneData.animTracks[this.sceneData.objects[lara.name].animationStartIndex];
                trackL.setCommands(commandsL, 0);
                switch (csIndex) {
                    case 7: {
                        this.setHeads(vonCroy, commandsVC, vonCroyHeadIds, 13 * 30, 21 * 30, 3, 1 << 21, setShader_1);
                        this.setHeads(lara, commandsL, laraHeadIds, 22 * 30 + 10, 29 * 30, 3, _Player_Skeleton__WEBPACK_IMPORTED_MODULE_2__["MASK"].HEAD, setShader_1);
                        break;
                    }
                    case 8: {
                        this.setHeads(vonCroy, commandsVC, vonCroyHeadIds, 10 * 30 + 10, 13 * 30, 3, 1 << 21, setShader_1);
                        break;
                    }
                    case 9: {
                        this.setHeads(vonCroy, commandsVC, vonCroyHeadIds, 0 * 30, 5 * 30, 3, 1 << 21, setShader_1);
                        this.setHeads(vonCroy, commandsVC, vonCroyHeadIds, 12 * 30, 28 * 30, 3, 1 << 21, setShader_1);
                        this.setHeads(vonCroy, commandsVC, vonCroyHeadIds, 32 * 30 + 24, 38 * 30, 3, 1 << 21, setShader_1);
                        this.setHeads(lara, commandsL, laraHeadIds, 39 * 30 + 10, 42 * 30, 3, _Player_Skeleton__WEBPACK_IMPORTED_MODULE_2__["MASK"].HEAD, setShader_1);
                        this.setHeads(vonCroy, commandsVC, vonCroyHeadIds, 65 * 30, 69 * 30, 3, 1 << 21, setShader_1);
                        this.setHeads(lara, commandsL, laraHeadIds, 90 * 30, 92 * 30 + 10, 3, _Player_Skeleton__WEBPACK_IMPORTED_MODULE_2__["MASK"].HEAD, setShader_1);
                        this.setHeads(lara, commandsL, laraHeadIds, 100 * 30 + 18, 101 * 30, 3, _Player_Skeleton__WEBPACK_IMPORTED_MODULE_2__["MASK"].HEAD, setShader_1);
                        break;
                    }
                }
                break;
            }
            case 10: {
                // Scroll that Lara is reading is not well positionned at start - move and rotate it
                var oscroll = this.objMgr.objectList['staticmesh'][20][2], q = glMatrix.quat.create();
                glMatrix.quat.setAxisAngle(q, [0, 1, 0], glMatrix.glMatrix.toRadian(60));
                oscroll.setQuaternion(q);
                oscroll.setPosition([oscroll.position[0] + 850, oscroll.position[1], oscroll.position[2]]);
                oscroll.matrixAutoUpdate = false;
                // Make speaking heads
                var vonCroy = actorMoveables[1], vonCroyHeadIds = [21, 22], commandsVC = [], trackVC = this.sceneData.animTracks[this.sceneData.objects[vonCroy.name].animationStartIndex];
                this.makeLayeredMesh(vonCroy);
                trackVC.setCommands(commandsVC, 0);
                var lara = actorMoveables[0], laraHeadIds = [17, 18, 19, 20], commandsL = [], trackL = this.sceneData.animTracks[this.sceneData.objects[lara.name].animationStartIndex];
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
                var aziz = actorMoveables[2], azizHeadIds = [21, 22], commandsA = [], trackA = this.sceneData.animTracks[this.sceneData.objects[aziz.name].animationStartIndex];
                this.makeLayeredMesh(aziz);
                trackA.setCommands(commandsA, 0);
                var lara = actorMoveables[0], laraHeadIds = [17, 18, 19, 20], commandsL = [], trackL = this.sceneData.animTracks[this.sceneData.objects[lara.name].animationStartIndex];
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
                var lara = actorMoveables[0], laraHeadIds = [17, 18, 19, 20], commandsL = [], trackL = this.sceneData.animTracks[this.sceneData.objects[lara.name].animationStartIndex];
                trackL.setCommands(commandsL, 0);
                var vonCroy = actorMoveables[1], vonCroyHeadIds = [21, 22], commandsVC = [], trackVC = this.sceneData.animTracks[this.sceneData.objects[vonCroy.name].animationStartIndex];
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
                var jeanYves = actorMoveables[3], jeanYvesHeadIds = [23, 24], commandsJY = [], trackJY = this.sceneData.animTracks[this.sceneData.objects[jeanYves.name].animationStartIndex];
                this.makeLayeredMesh(jeanYves);
                trackJY.setCommands(commandsJY, 0);
                var lara = actorMoveables[0], laraHeadIds = [17, 18, 19, 20], commandsL = [], trackL = this.sceneData.animTracks[this.sceneData.objects[lara.name].animationStartIndex];
                trackL.setCommands(commandsL, 0);
                var vonCroy = actorMoveables[1], vonCroyHeadIds = [21, 22], commandsVC = [], trackVC = this.sceneData.animTracks[this.sceneData.objects[vonCroy.name].animationStartIndex];
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
                var jeanYves = actorMoveables[1], jeanYvesHeadIds = [23, 24], commandsJY = [], trackJY = this.sceneData.animTracks[this.sceneData.objects[jeanYves.name].animationStartIndex];
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
                var jeanYves = actorMoveables[1], jeanYvesHeadIds = [23, 24], commandsJY = [], trackJY = this.sceneData.animTracks[this.sceneData.objects[jeanYves.name].animationStartIndex];
                this.makeLayeredMesh(jeanYves);
                this.setHeads(jeanYves, commandsJY, jeanYvesHeadIds, 2 * 30 + 24, 8 * 30, 3, 1 << 18);
                this.setHeads(jeanYves, commandsJY, jeanYvesHeadIds, 11 * 30, 19 * 30, 3, 1 << 18);
                trackJY.setCommands(commandsJY, 0);
                break;
            }
            case 19: {
                // Make speaking heads
                var jeanYves = actorMoveables[1], jeanYvesHeadIds = [23, 24], commandsJY = [], trackJY = this.sceneData.animTracks[this.sceneData.objects[jeanYves.name].animationStartIndex];
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
                var jeanYves = actorMoveables[1], jeanYvesHeadIds = [23, 24], commandsJY = [], trackJY = this.sceneData.animTracks[this.sceneData.objects[jeanYves.name].animationStartIndex];
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
                var lara = actorMoveables[0], data_4 = this.sceneData.objects[lara.name], track1 = this.sceneData.animTracks[this.sceneData.objects[lara.name].animationStartIndex];
                var meshPole = this.objMgr.createMoveable(417, data_4.roomIndex, undefined, true, data_4.skeleton);
                data_4.layer.setMesh(_Player_Layer__WEBPACK_IMPORTED_MODULE_1__["LAYER"].MESHSWAP, meshPole, 0);
                track1.setCommands([
                    { cmd: _Animation_Commands__WEBPACK_IMPORTED_MODULE_3__["Commands"].ANIMCMD_MISCACTIONONFRAME, params: [0, _Animation_Commands__WEBPACK_IMPORTED_MODULE_3__["Commands"].Misc.ANIMCMD_MISC_CUSTOMFUNCTION, function () { return data_4.layer.updateMask(_Player_Layer__WEBPACK_IMPORTED_MODULE_1__["LAYER"].MESHSWAP, _Player_Skeleton__WEBPACK_IMPORTED_MODULE_2__["MASK"].ARM_R3); }] },
                    { cmd: _Animation_Commands__WEBPACK_IMPORTED_MODULE_3__["Commands"].ANIMCMD_MISCACTIONONFRAME, params: [560, _Animation_Commands__WEBPACK_IMPORTED_MODULE_3__["Commands"].Misc.ANIMCMD_MISC_CUSTOMFUNCTION, function () { return data_4.layer.updateMask(_Player_Layer__WEBPACK_IMPORTED_MODULE_1__["LAYER"].MESHSWAP, _Player_Skeleton__WEBPACK_IMPORTED_MODULE_2__["MASK"].ARM_R3); }] }
                ], 0);
                break;
            }
            case 23: {
                // Handle the visibility of the ankh
                var lara = actorMoveables[0], track1 = this.sceneData.animTracks[this.sceneData.objects[lara.name].animationStartIndex];
                var seth = this.objMgr.objectList['moveable'][345][0], layer_1 = this.sceneData.objects[seth.name].layer;
                layer_1.updateMask(_Player_Layer__WEBPACK_IMPORTED_MODULE_1__["LAYER"].MAIN, 1 << 11);
                track1.setCommands([
                    { cmd: _Animation_Commands__WEBPACK_IMPORTED_MODULE_3__["Commands"].ANIMCMD_MISCACTIONONFRAME, params: [555, _Animation_Commands__WEBPACK_IMPORTED_MODULE_3__["Commands"].Misc.ANIMCMD_MISC_CUSTOMFUNCTION, function () { return layer_1.updateMask(_Player_Layer__WEBPACK_IMPORTED_MODULE_1__["LAYER"].MAIN, 1 << 11); }] },
                    { cmd: _Animation_Commands__WEBPACK_IMPORTED_MODULE_3__["Commands"].ANIMCMD_MISCACTIONONFRAME, params: [655, _Animation_Commands__WEBPACK_IMPORTED_MODULE_3__["Commands"].Misc.ANIMCMD_MISC_CUSTOMFUNCTION, function () { return layer_1.updateMask(_Player_Layer__WEBPACK_IMPORTED_MODULE_1__["LAYER"].MAIN, 1 << 11); }] }
                ], 0);
                break;
            }
            case 24: {
                // Handle the pistols visibility during the dialog with the wounded guy
                var lara = actorMoveables[0], laraHeadIds = [17, 18, 19, 20], commandsL = [], track1 = this.sceneData.animTracks[this.sceneData.objects[lara.name].animationStartIndex];
                track1.setCommands(commandsL, 0);
                commandsL.push({ cmd: _Animation_Commands__WEBPACK_IMPORTED_MODULE_3__["Commands"].ANIMCMD_MISCACTIONONFRAME, params: [0, _Animation_Commands__WEBPACK_IMPORTED_MODULE_3__["Commands"].Misc.ANIMCMD_MISC_GETLEFTGUN] }, { cmd: _Animation_Commands__WEBPACK_IMPORTED_MODULE_3__["Commands"].ANIMCMD_MISCACTIONONFRAME, params: [0, _Animation_Commands__WEBPACK_IMPORTED_MODULE_3__["Commands"].Misc.ANIMCMD_MISC_GETRIGHTGUN] });
                this.setHeads(lara, commandsL, laraHeadIds, 3 * 30 - 10, 5 * 30 + 15, 3);
                this.setHeads(lara, commandsL, laraHeadIds, 17 * 30 - 10, 551, 3);
                commandsL.push({ cmd: _Animation_Commands__WEBPACK_IMPORTED_MODULE_3__["Commands"].ANIMCMD_MISCACTIONONFRAME, params: [552, _Animation_Commands__WEBPACK_IMPORTED_MODULE_3__["Commands"].Misc.ANIMCMD_MISC_GETLEFTGUN] }, { cmd: _Animation_Commands__WEBPACK_IMPORTED_MODULE_3__["Commands"].ANIMCMD_MISCACTIONONFRAME, params: [552, _Animation_Commands__WEBPACK_IMPORTED_MODULE_3__["Commands"].Misc.ANIMCMD_MISC_GETRIGHTGUN] });
                this.setHeads(lara, commandsL, laraHeadIds, 553, 22 * 30, 3);
                this.setHeads(lara, commandsL, laraHeadIds, 53 * 30, 53 * 30 + 22, 3);
                this.setHeads(lara, commandsL, laraHeadIds, 59 * 30, 60 * 30 + 4, 3);
                // Make speaking heads
                var aziz = actorMoveables[1], azizHeadIds = [21, 22], commandsA = [], trackA = this.sceneData.animTracks[this.sceneData.objects[aziz.name].animationStartIndex];
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
                var aziz = actorMoveables[1], azizHeadIds = [21, 22], commandsA = [], trackA = this.sceneData.animTracks[this.sceneData.objects[aziz.name].animationStartIndex];
                this.makeLayeredMesh(aziz);
                trackA.setCommands(commandsA, 0);
                var lara = actorMoveables[0], laraHeadIds = [17, 18, 19, 20], commandsL = [], trackL = this.sceneData.animTracks[this.sceneData.objects[lara.name].animationStartIndex];
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
                var aziz = actorMoveables[1], azizHeadIds = [21, 22], commandsA = [], trackA = this.sceneData.animTracks[this.sceneData.objects[aziz.name].animationStartIndex];
                this.makeLayeredMesh(aziz);
                trackA.setCommands(commandsA, 0);
                this.setHeads(aziz, commandsA, azizHeadIds, 3 * 30 + 10, 14 * 30 + 10, 3);
                break;
            }
        }
        return promises;
    };
    CutSceneHelper.prototype.makeLayeredMesh = function (mesh) {
        var data = this.sceneData.objects[mesh.name];
        if (!data.layer) {
            data.layer = new _Player_Layer__WEBPACK_IMPORTED_MODULE_1__["Layer"](mesh, this.gameData);
        }
    };
    CutSceneHelper.prototype.setHeads = function (mesh, commands, ids, startFrame, endFrame, frameStep, headMask, shaderFunc) {
        var _this = this;
        if (frameStep === void 0) { frameStep = 6; }
        if (headMask === void 0) { headMask = _Player_Skeleton__WEBPACK_IMPORTED_MODULE_2__["MASK"].HEAD; }
        var data = this.sceneData.objects[mesh.name];
        var heads = [];
        ids.forEach(function (id) {
            var head = _this.objMgr.createMoveable(id, -1, undefined, true, data.skeleton), meshb = _Proxy_Engine__WEBPACK_IMPORTED_MODULE_0__["default"].makeMeshBuilder(head);
            if (shaderFunc) {
                shaderFunc(head);
            }
            meshb.makeSkinIndicesList();
            heads.push(meshb);
        });
        var frame = startFrame, frameEnd = endFrame;
        var i = 0;
        while (frame <= frameEnd) {
            var func = function (head) { return (function (action, obj, mode) { return _this.setHead(mode, data.layer, head, headMask); }); };
            commands.push({ cmd: _Animation_Commands__WEBPACK_IMPORTED_MODULE_3__["Commands"].ANIMCMD_MISCACTIONONFRAME, params: [frame, _Animation_Commands__WEBPACK_IMPORTED_MODULE_3__["Commands"].Misc.ANIMCMD_MISC_CUSTOMFUNCTION, func(heads[i])] });
            frame += frameStep;
            i = (i + 1) % heads.length;
        }
        commands.push({ cmd: _Animation_Commands__WEBPACK_IMPORTED_MODULE_3__["Commands"].ANIMCMD_MISCACTIONONFRAME, params: [frameEnd + 1, _Animation_Commands__WEBPACK_IMPORTED_MODULE_3__["Commands"].Misc.ANIMCMD_MISC_CUSTOMFUNCTION, function (action, obj, mode) { return _this.resetHead(mode, data.layer); }] });
    };
    CutSceneHelper.prototype.setHead = function (mode, layer, head, headMask) {
        switch (mode) {
            case _Animation_CommandDispatch__WEBPACK_IMPORTED_MODULE_4__["CommandDispatchMode"].UNDO_END: {
                if (layer.getMeshBuilder(_Player_Layer__WEBPACK_IMPORTED_MODULE_1__["LAYER"].MESHSWAP)) {
                    layer.setMask(layer.getMeshBuilder(_Player_Layer__WEBPACK_IMPORTED_MODULE_1__["LAYER"].MESHSWAP), 0);
                }
                layer.setMask(layer.getMeshBuilder(_Player_Layer__WEBPACK_IMPORTED_MODULE_1__["LAYER"].MAIN), _Player_Skeleton__WEBPACK_IMPORTED_MODULE_2__["MASK"].ALL);
                break;
            }
            case _Animation_CommandDispatch__WEBPACK_IMPORTED_MODULE_4__["CommandDispatchMode"].NORMAL: {
                if (layer.getMeshBuilder(_Player_Layer__WEBPACK_IMPORTED_MODULE_1__["LAYER"].MESHSWAP)) {
                    layer.setMask(layer.getMeshBuilder(_Player_Layer__WEBPACK_IMPORTED_MODULE_1__["LAYER"].MESHSWAP), 0);
                }
                layer.setMeshBuilder(_Player_Layer__WEBPACK_IMPORTED_MODULE_1__["LAYER"].MESHSWAP, head, 0);
                layer.setMask(head, headMask);
                //layer.setMask(layer.getMeshBuilder(LAYER.MAIN) as IMeshBuilder, MASK.ALL & ~headMask);
                layer.setRoom(this.gameData.sceneData.objects[layer.getMeshBuilder(_Player_Layer__WEBPACK_IMPORTED_MODULE_1__["LAYER"].MAIN).mesh.name].roomIndex);
                break;
            }
        }
    };
    CutSceneHelper.prototype.resetHead = function (mode, layer) {
        switch (mode) {
            case _Animation_CommandDispatch__WEBPACK_IMPORTED_MODULE_4__["CommandDispatchMode"].NORMAL: {
                if (layer.getMeshBuilder(_Player_Layer__WEBPACK_IMPORTED_MODULE_1__["LAYER"].MESHSWAP)) {
                    layer.setMask(layer.getMeshBuilder(_Player_Layer__WEBPACK_IMPORTED_MODULE_1__["LAYER"].MESHSWAP), 0);
                }
                layer.setMask(layer.getMeshBuilder(_Player_Layer__WEBPACK_IMPORTED_MODULE_1__["LAYER"].MAIN), _Player_Skeleton__WEBPACK_IMPORTED_MODULE_2__["MASK"].ALL);
                break;
            }
        }
    };
    CutSceneHelper.prototype.fadeOut = function (duration, mode) {
        if (mode === _Animation_CommandDispatch__WEBPACK_IMPORTED_MODULE_4__["CommandDispatchMode"].NORMAL) {
            jQuery(this.gameData.container).fadeOut(duration * 1000);
        }
        else if (mode === _Animation_CommandDispatch__WEBPACK_IMPORTED_MODULE_4__["CommandDispatchMode"].UNDO) {
            jQuery(this.gameData.container).stop();
            jQuery(this.gameData.container).fadeIn(0);
        }
    };
    CutSceneHelper.prototype.fadeIn = function (duration, mode) {
        if (mode === _Animation_CommandDispatch__WEBPACK_IMPORTED_MODULE_4__["CommandDispatchMode"].NORMAL) {
            jQuery(this.gameData.container).fadeIn(duration * 1000);
        }
    };
    // Between cutscene 1 and 2, a hole should appear in the ground to reveal hidden entrance to pyramid
    CutSceneHelper.prototype.cs1MakeHole = function (mode) {
        var stateR1 = this._holeDone ? this._holeNotDoneR1 : this._holeDoneR1, stateR2 = this._holeDone ? this._holeNotDoneR2 : this._holeDoneR2;
        var oroom = this.objMgr.objectList['room'][81];
        var mshBld = _Proxy_Engine__WEBPACK_IMPORTED_MODULE_0__["default"].makeMeshBuilder(oroom);
        mshBld.setIndexAndGroupsState(stateR1);
        oroom = this.objMgr.objectList['room'][80];
        mshBld = _Proxy_Engine__WEBPACK_IMPORTED_MODULE_0__["default"].makeMeshBuilder(oroom);
        mshBld.setIndexAndGroupsState(stateR2);
        this._holeDone = !this._holeDone;
    };
    CutSceneHelper.prototype.prepareHole = function () {
        // First room
        var oroom = this.objMgr.objectList['room'][81];
        var mshBld = _Proxy_Engine__WEBPACK_IMPORTED_MODULE_0__["default"].makeMeshBuilder(oroom);
        this._holeNotDoneR1 = mshBld.getIndexAndGroupState();
        var newFaces = [
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
        oroom = this.objMgr.objectList['room'][80];
        mshBld = _Proxy_Engine__WEBPACK_IMPORTED_MODULE_0__["default"].makeMeshBuilder(oroom);
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
    };
    return CutSceneHelper;
}());
/* harmony default export */ __webpack_exports__["default"] = (CutSceneHelper);


/***/ }),

/***/ "../src/Behaviour/CutSceneTR4.ts":
/*!***************************************!*\
  !*** ../src/Behaviour/CutSceneTR4.ts ***!
  \***************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Animation_Track__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Animation/Track */ "../src/Animation/Track.ts");
/* harmony import */ var _Utils_Misc__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Utils/Misc */ "../src/Utils/Misc.ts");
/* harmony import */ var _Constants__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Constants */ "../src/Constants.ts");



var CutSceneTR4 = /** @class */ (function () {
    function CutSceneTR4(gameData, cutscene, helper, lara) {
        this.gameData = gameData;
        this.sceneData = gameData.sceneData;
        this.objMgr = gameData.objMgr;
        this.confMgr = gameData.confMgr;
        this.scene = gameData.sceneRender;
        this.cutscene = cutscene;
        this.helper = helper;
        this.lara = lara;
    }
    CutSceneTR4.prototype.makeTR4Cutscene = function (icutscene) {
        var _this = this;
        return fetch(this.gameData.relpath + 'resources/level/tr4/TR4_cutscenes/cut' + icutscene + '.json').then(function (response) {
            return response.json().then(function (data) {
                var cutscene = [];
                cutscene.push(data);
                cutscene[0].index = icutscene;
                var soundPromise = Promise.resolve();
                // get the sound for this cut scene
                if (cutscene[0].info.audio) {
                    soundPromise = _Utils_Misc__WEBPACK_IMPORTED_MODULE_1__["default"].loadSoundAsync(_this.gameData.relpath + _this.sceneData.soundPath + cutscene[0].info.audio + '.aac').then(function (ret) {
                        if (!ret || ret.code < 0) {
                            console.log('Error decoding sound data for cutscene.', ret);
                        }
                        else {
                            _this.cutscene.sound = ret.sound;
                            _this.cutscene.soundbuffer = ret.soundbuffer;
                        }
                    });
                }
                if (cutscene[0].index == 1) {
                    // we play cutscene 1 followed by cutscene 2, so need to retrieve data for cutscene 2
                    return fetch(_this.gameData.relpath + 'resources/level/tr4/TR4_cutscenes/cut' + (icutscene + 1) + '.json').then(function (response) {
                        return response.json().then(function (data) {
                            cutscene.push(data);
                            cutscene[1].index = icutscene + 1;
                            _this.makeCutsceneData(cutscene);
                            return soundPromise;
                        });
                    });
                }
                _this.makeCutsceneData(cutscene);
                return soundPromise;
            });
        });
    };
    CutSceneTR4.prototype.makeCutsceneData = function (cutscenes) {
        var _this = this;
        var ocs = this.cutscene, cutscene = cutscenes[0];
        ocs.position = [cutscene.originX, -cutscene.originY, -cutscene.originZ];
        ocs.quaternion = [0, 0, 0, 1];
        // hide moveables (except Lara) that are already in the level and that are referenced in the cutscene (we will create them later)
        var idInCutscenes = {};
        for (var ac = 0; ac < cutscene.actors.length; ++ac) {
            var id = cutscene.actors[ac].slotNumber;
            idInCutscenes[id] = true;
        }
        for (var objID in this.sceneData.objects) {
            var objData = this.sceneData.objects[objID];
            if (objData.type == 'moveable' && objData.roomIndex != -1 && objData.objectid != _Constants__WEBPACK_IMPORTED_MODULE_2__["ObjectID"].Lara && objData.objectid in idInCutscenes) {
                objData.visible = false;
                this.scene.getObjectByName(objID).visible = false;
            }
        }
        var laraRoomIndex = this.sceneData.objects[this.lara.name].roomIndex;
        // create moveable instances used in cutscene
        var actorMoveables = [];
        for (var ac = 0; ac < cutscene.actors.length; ++ac) {
            var id = cutscene.actors[ac].slotNumber;
            var mvb = this.lara;
            if (id != _Constants__WEBPACK_IMPORTED_MODULE_2__["ObjectID"].Lara) {
                mvb = this.objMgr.createMoveable(id, laraRoomIndex, undefined, true, false);
            }
            actorMoveables.push(mvb);
            mvb.setPosition(ocs.position);
            mvb.setQuaternion([0, 0, 0, 1]);
        }
        // create actor frames
        for (var ac = 0; ac < cutscene.actors.length; ++ac) {
            var actor = cutscene.actors[ac], animation = this.makeAnimationForActor(cutscene, actor, "anim_cutscene_actor" + ac);
            this.sceneData.objects[actorMoveables[ac].name].animationStartIndex = this.sceneData.animTracks.length;
            var oanimation = _Animation_Track__WEBPACK_IMPORTED_MODULE_0__["default"].createTrack(animation);
            this.sceneData.animTracks.push(oanimation);
            if (cutscene.index == 1 && ac == 0) {
                // special case for cutscene #1: we add the animation for cutscene #2 as #1+#2 is really the same cutscene
                var animationCont = this.makeAnimationForActor(cutscenes[1], cutscenes[1].actors[ac], "anim_cutscene2_actor" + ac);
                oanimation.nextTrack = this.sceneData.animTracks.length;
                animationCont.nextTrack = -1;
                this.sceneData.animTracks.push(_Animation_Track__WEBPACK_IMPORTED_MODULE_0__["default"].createTrack(animationCont));
            }
        }
        // create camera frames
        var frames = this.makeAnimationForCamera(cutscene);
        if (cutscene.index == 1) {
            frames = frames.concat(this.makeAnimationForCamera(cutscenes[1]));
        }
        ocs.frames = frames;
        this.helper.prepareLevel(this.confMgr.trversion, this.confMgr.levelName, cutscene.index, actorMoveables);
        this.cutscene.objects = {};
        actorMoveables.forEach(function (obj) { return _this.cutscene.objects[obj.name] = obj; });
    };
    CutSceneTR4.prototype.makeAnimationForActor = function (cutscene, actor, animName) {
        function makeQuaternion(angleX, angleY, angleZ) {
            angleX = 2 * Math.PI * (angleX % 1024) / 1024.0,
                angleY = 2 * Math.PI * (angleY % 1024) / 1024.0,
                angleZ = 2 * Math.PI * (angleZ % 1024) / 1024.0;
            var qx = glMatrix.quat.create(), qy = glMatrix.quat.create(), qz = glMatrix.quat.create();
            glMatrix.quat.setAxisAngle(qx, [1, 0, 0], angleX);
            glMatrix.quat.setAxisAngle(qy, [0, 1, 0], -angleY);
            glMatrix.quat.setAxisAngle(qz, [0, 0, 1], -angleZ);
            glMatrix.quat.mul(qy, qy, qx);
            glMatrix.quat.mul(qy, qy, qz);
            return qy;
        }
        var animation = {
            "fps": 30,
            "frameRate": 1,
            "keys": [],
            "name": animName,
            "nextTrack": -1,
            "nextTrackFrame": 0,
            "numFrames": cutscene.numFrames,
            "numKeys": cutscene.numFrames,
            "frameStart": 0,
            "commands": []
        };
        var CST0 = 3;
        var prev = [];
        for (var m = 0; m < actor.meshes.length; ++m) {
            var mesh = actor.meshes[m], posHdr = mesh.positionHeader, rotHdr = mesh.rotationHeader;
            prev.push({
                "position": {
                    x: posHdr ? posHdr.startPosX * CST0 : 0,
                    y: posHdr ? -posHdr.startPosY * CST0 : 0,
                    z: posHdr ? -posHdr.startPosZ * CST0 : 0
                },
                "rotation": {
                    x: rotHdr.startRotX % 1024,
                    y: rotHdr.startRotY % 1024,
                    z: rotHdr.startRotZ % 1024
                }
            });
        }
        var realNumFrames = 0;
        for (var d = 0; d < cutscene.numFrames; ++d) {
            var key = {
                "time": d,
                "data": [],
                "boundingBox": {
                    xmin: -1e7, ymin: -1e7, zmin: -1e7,
                    xmax: 1e7, ymax: 1e7, zmax: 1e7
                }
            };
            var addKey = true;
            for (var m = 0; m < actor.meshes.length; ++m) {
                var mesh = actor.meshes[m], posData = mesh.positionData, rotData = mesh.rotationData;
                if (rotData.length <= d) {
                    addKey = false;
                    break;
                }
                var transX = 0, transY = 0, transZ = 0;
                if (posData) {
                    transX = posData.dx[d] * CST0;
                    transY = -posData.dy[d] * CST0;
                    transZ = -posData.dz[d] * CST0;
                }
                var cur = {
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
                var quat = makeQuaternion(cur.rotation.x, cur.rotation.y, cur.rotation.z);
                key.data.push({
                    "position": { x: cur.position.x, y: cur.position.y, z: cur.position.z },
                    "quaternion": { x: quat[0], y: quat[1], z: quat[2], w: quat[3] }
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
    };
    CutSceneTR4.prototype.makeAnimationForCamera = function (cutscene) {
        // create camera frames
        var frames = [], ocam = cutscene.camera, CST = 2;
        var prev = {
            posX: ocam.cameraHeader.startPosX * CST, posY: ocam.cameraHeader.startPosY * CST, posZ: ocam.cameraHeader.startPosZ * CST,
            targetX: ocam.targetHeader.startPosX * CST, targetY: ocam.targetHeader.startPosY * CST, targetZ: ocam.targetHeader.startPosZ * CST
        };
        for (var d = 0; d < cutscene.numFrames; ++d) {
            if (ocam.cameraPositionData.dx.length <= d) {
                break;
            }
            var cur = {
                fov: 13000,
                roll: 0,
                posX: ocam.cameraPositionData.dx[d] * CST + prev.posX,
                posY: ocam.cameraPositionData.dy[d] * CST + prev.posY,
                posZ: ocam.cameraPositionData.dz[d] * CST + prev.posZ,
                targetX: ocam.targetPositionData.dx[d] * CST + prev.targetX,
                targetY: ocam.targetPositionData.dy[d] * CST + prev.targetY,
                targetZ: ocam.targetPositionData.dz[d] * CST + prev.targetZ
            };
            frames.push(cur);
            prev = cur;
        }
        return frames;
    };
    return CutSceneTR4;
}());
/* harmony default export */ __webpack_exports__["default"] = (CutSceneTR4);


/***/ }),

/***/ "../src/Behaviour/DynamicLight.ts":
/*!****************************************!*\
  !*** ../src/Behaviour/DynamicLight.ts ***!
  \****************************************/
/*! exports provided: DynamicLight */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DynamicLight", function() { return DynamicLight; });
/* harmony import */ var _Behaviour__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Behaviour */ "../src/Behaviour/Behaviour.ts");
/* harmony import */ var _BehaviourManager__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./BehaviourManager */ "../src/Behaviour/BehaviourManager.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();


var DynamicLight = /** @class */ (function (_super) {
    __extends(DynamicLight, _super);
    function DynamicLight(nbhv, gameData, objectid, objecttype) {
        var _this = _super.call(this, nbhv, gameData, objectid, objecttype) || this;
        _this.name = DynamicLight.name;
        _this._sysLight = gameData.sysLight;
        _this._lightNum = _this._sysLight.add();
        return _this;
    }
    DynamicLight.prototype.init = function (lstObjs) {
        return [_Behaviour__WEBPACK_IMPORTED_MODULE_0__["BehaviourRetCode"].keepBehaviour, null];
    };
    Object.defineProperty(DynamicLight.prototype, "fadeout", {
        set: function (f) {
            this._sysLight.setFadeout(this._lightNum, f);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DynamicLight.prototype, "position", {
        set: function (p) {
            this._sysLight.setPosition(this._lightNum, p);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DynamicLight.prototype, "color", {
        set: function (c) {
            this._sysLight.setColor(this._lightNum, c);
        },
        enumerable: true,
        configurable: true
    });
    return DynamicLight;
}(_Behaviour__WEBPACK_IMPORTED_MODULE_0__["Behaviour"]));

_BehaviourManager__WEBPACK_IMPORTED_MODULE_1__["BehaviourManager"].registerFactory(DynamicLight);


/***/ }),

/***/ "../src/Behaviour/Fade.ts":
/*!********************************!*\
  !*** ../src/Behaviour/Fade.ts ***!
  \********************************/
/*! exports provided: Fade */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Fade", function() { return Fade; });
/* harmony import */ var _Proxy_IMesh__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Proxy/IMesh */ "../src/Proxy/IMesh.ts");
/* harmony import */ var _Behaviour__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Behaviour */ "../src/Behaviour/Behaviour.ts");
/* harmony import */ var _BehaviourManager__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./BehaviourManager */ "../src/Behaviour/BehaviourManager.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();



var Fade = /** @class */ (function (_super) {
    __extends(Fade, _super);
    function Fade(nbhv, gameData, objectid, objecttype) {
        var _this = _super.call(this, nbhv, gameData, objectid, objecttype) || this;
        _this.name = Fade.name;
        _this.sceneRender = gameData.sceneRender;
        _this.bhvMgr = gameData.bhvMgr;
        _this.colorStart = _this.colorEnd = [0, 0, 0];
        _this.duration = 0;
        _this.startTime = -1;
        return _this;
    }
    Fade.prototype.init = function (lstObjs) {
        this.colorStart = this.nbhv.colorStart;
        this.colorEnd = this.nbhv.colorEnd;
        this.duration = parseFloat(this.nbhv.duration);
        this.startTime = -1;
        this.setColor(this.colorStart);
        return [_Behaviour__WEBPACK_IMPORTED_MODULE_1__["BehaviourRetCode"].keepBehaviour, null];
    };
    Fade.prototype.onFrameStarted = function (curTime, delta) {
        if (this.startTime < 0) {
            this.startTime = curTime;
        }
        var ratio = (curTime - this.startTime) / this.duration, color = [
            this.colorStart[0] + (this.colorEnd[0] - this.colorStart[0]) * ratio,
            this.colorStart[1] + (this.colorEnd[1] - this.colorStart[1]) * ratio,
            this.colorStart[2] + (this.colorEnd[2] - this.colorStart[2]) * ratio
        ];
        this.setColor(color);
        if (curTime - this.startTime >= this.duration) {
            this.setColor(this.colorEnd);
            this.bhvMgr.removeBehaviour(this);
        }
    };
    Fade.prototype.setColor = function (color) {
        this.sceneRender.traverse(function (obj) {
            if (!obj.visible || !Object(_Proxy_IMesh__WEBPACK_IMPORTED_MODULE_0__["isMesh"])(obj)) {
                return;
            }
            var materials = obj.materials;
            if (!materials || !materials.length) {
                return;
            }
            for (var i = 0; i < materials.length; ++i) {
                var material = materials[i];
                material.uniforms.tintColor.value = color;
                material.uniformsUpdated(["tintColor"]);
            }
        });
    };
    return Fade;
}(_Behaviour__WEBPACK_IMPORTED_MODULE_1__["Behaviour"]));

_BehaviourManager__WEBPACK_IMPORTED_MODULE_2__["BehaviourManager"].registerFactory(Fade);


/***/ }),

/***/ "../src/Behaviour/FadeUniformColor.ts":
/*!********************************************!*\
  !*** ../src/Behaviour/FadeUniformColor.ts ***!
  \********************************************/
/*! exports provided: FadeUniformColor */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FadeUniformColor", function() { return FadeUniformColor; });
/* harmony import */ var _Behaviour__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Behaviour */ "../src/Behaviour/Behaviour.ts");
/* harmony import */ var _BehaviourManager__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./BehaviourManager */ "../src/Behaviour/BehaviourManager.ts");
/* harmony import */ var _Fade__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Fade */ "../src/Behaviour/Fade.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();



var FadeUniformColor = /** @class */ (function (_super) {
    __extends(FadeUniformColor, _super);
    function FadeUniformColor(nbhv, gameData, objectid, objecttype) {
        var _this = _super.call(this, nbhv, gameData, objectid, objecttype) || this;
        _this.name = FadeUniformColor.name;
        _this.uniforms = null;
        return _this;
    }
    FadeUniformColor.prototype.init = function (lstObjs) {
        if (this.nbhv.uniforms === null) {
            return [_Behaviour__WEBPACK_IMPORTED_MODULE_0__["BehaviourRetCode"].dontKeepBehaviour, null];
        }
        this.uniforms = this.nbhv.uniforms;
        return _super.prototype.init.call(this, lstObjs);
    };
    FadeUniformColor.prototype.setColor = function (color) {
        for (var i = 0; i < this.uniforms.length; ++i) {
            var u = this.uniforms[i];
            u.a[u.i + 0] = color[0];
            u.a[u.i + 1] = color[1];
            u.a[u.i + 2] = color[2];
        }
    };
    return FadeUniformColor;
}(_Fade__WEBPACK_IMPORTED_MODULE_2__["Fade"]));

_BehaviourManager__WEBPACK_IMPORTED_MODULE_1__["BehaviourManager"].registerFactory(FadeUniformColor);


/***/ }),

/***/ "../src/Behaviour/Lara.ts":
/*!********************************!*\
  !*** ../src/Behaviour/Lara.ts ***!
  \********************************/
/*! exports provided: Lara */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Lara", function() { return Lara; });
/* harmony import */ var _Proxy_Engine__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Proxy/Engine */ "../src/Proxy/Engine.ts");
/* harmony import */ var _Behaviour__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Behaviour */ "../src/Behaviour/Behaviour.ts");
/* harmony import */ var _BehaviourManager__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./BehaviourManager */ "../src/Behaviour/BehaviourManager.ts");
/* harmony import */ var _Constants__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../Constants */ "../src/Constants.ts");
/* harmony import */ var _Player_Layer__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../Player/Layer */ "../src/Player/Layer.ts");
/* harmony import */ var _Player_Skeleton__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../Player/Skeleton */ "../src/Player/Skeleton.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();






var Lara = /** @class */ (function (_super) {
    __extends(Lara, _super);
    function Lara(nbhv, gameData, objectid, objecttype) {
        var _this = _super.call(this, nbhv, gameData, objectid, objecttype) || this;
        _this.name = Lara.name;
        _this.sceneData = gameData.sceneData;
        _this.confMgr = gameData.confMgr;
        _this.anmMgr = gameData.anmMgr;
        _this.objMgr = gameData.objMgr;
        _this.lara = null;
        if (_this.objectid === undefined) {
            throw "Invalid id for Lara!";
        }
        _Constants__WEBPACK_IMPORTED_MODULE_3__["ObjectID"].Lara = _this.objectid;
        return _this;
    }
    Lara.prototype.init = function (lstObjs) {
        var startTrans = this.nbhv.starttrans, startAnim = this.nbhv.startanim, laraAngle = this.nbhv.angle;
        this.lara = lstObjs[0];
        var dataLara = this.sceneData.objects[this.lara.name], layer = new _Player_Layer__WEBPACK_IMPORTED_MODULE_4__["Layer"](this.lara, this.gameData);
        dataLara.layer = layer;
        if (!this.gameData.isCutscene) {
            if (startTrans) {
                var laraPos = this.lara.position;
                this.lara.setPosition([laraPos[0] + parseFloat(startTrans.x), laraPos[1] + parseFloat(startTrans.y), laraPos[2] + parseFloat(startTrans.z)]);
            }
            var laraQuat = this.lara.quaternion;
            if (laraAngle != undefined) {
                var q_1 = glMatrix.quat.create();
                glMatrix.quat.setAxisAngle(q_1, [0, 1, 0], glMatrix.glMatrix.toRadian(parseFloat(laraAngle)));
                laraQuat = q_1;
            }
            var camPos = this.lara.position;
            var ofstDir = parseFloat(this.nbhv.dirdist), ofstUp = parseFloat(this.nbhv.updist);
            var v3 = [0, ofstUp, ofstDir], q = laraQuat.slice();
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
        _Constants__WEBPACK_IMPORTED_MODULE_3__["ObjectID"].PistolAnim = this.nbhv.animobject && this.nbhv.animobject.pistol ? parseInt(this.nbhv.animobject.pistol) : -1;
        var mvbPistolAnim = this.objMgr.createMoveable(_Constants__WEBPACK_IMPORTED_MODULE_3__["ObjectID"].PistolAnim, -1, undefined, true, dataLara.skeleton);
        if (mvbPistolAnim) {
            if (this.confMgr.trversion == 'TR4') {
                // for some reason, pistol animation mesh is only for left hand in TR4... So copy it to do right hand animation
                var meshb = _Proxy_Engine__WEBPACK_IMPORTED_MODULE_0__["default"].makeMeshBuilder(mvbPistolAnim);
                meshb.copyFacesWithSkinIndex(_Player_Skeleton__WEBPACK_IMPORTED_MODULE_5__["BONE"].ARM_L3, _Player_Skeleton__WEBPACK_IMPORTED_MODULE_5__["BONE"].ARM_R3);
            }
            layer.setMesh(_Player_Layer__WEBPACK_IMPORTED_MODULE_4__["LAYER"].WEAPON, mvbPistolAnim, 0);
        }
        // create "holster empty" object - TR4 only
        _Constants__WEBPACK_IMPORTED_MODULE_3__["ObjectID"].HolsterEmpty = this.nbhv.animobject && this.nbhv.animobject.holster ? parseInt(this.nbhv.animobject.holster) : -1;
        var mvbHolsterEmpty = this.objMgr.createMoveable(_Constants__WEBPACK_IMPORTED_MODULE_3__["ObjectID"].HolsterEmpty, -1, undefined, true, dataLara.skeleton);
        if (mvbHolsterEmpty) {
            // for some reason, holster meshes are made of 17 bones and not 15 as Lara mesh...
            // so, modify the skin indices so that left and right holsters match the right bones in Lara mesh
            var meshb = _Proxy_Engine__WEBPACK_IMPORTED_MODULE_0__["default"].makeMeshBuilder(mvbHolsterEmpty);
            meshb.replaceSkinIndices({ 4: _Player_Skeleton__WEBPACK_IMPORTED_MODULE_5__["BONE"].LEG_L1, 8: _Player_Skeleton__WEBPACK_IMPORTED_MODULE_5__["BONE"].LEG_R1 });
            layer.setMeshBuilder(_Player_Layer__WEBPACK_IMPORTED_MODULE_4__["LAYER"].HOLSTER_EMPTY, meshb, 0);
        }
        // create "holster full" object - TR4 only
        _Constants__WEBPACK_IMPORTED_MODULE_3__["ObjectID"].HolsterFull = this.nbhv.animobject && this.nbhv.animobject.holster_pistols ? parseInt(this.nbhv.animobject.holster_pistols) : -1;
        var mvbHolsterFull = this.objMgr.createMoveable(_Constants__WEBPACK_IMPORTED_MODULE_3__["ObjectID"].HolsterFull, -1, undefined, true, dataLara.skeleton);
        if (mvbHolsterFull) {
            var meshb = _Proxy_Engine__WEBPACK_IMPORTED_MODULE_0__["default"].makeMeshBuilder(mvbHolsterFull);
            meshb.replaceSkinIndices({ 4: _Player_Skeleton__WEBPACK_IMPORTED_MODULE_5__["BONE"].LEG_L1, 8: _Player_Skeleton__WEBPACK_IMPORTED_MODULE_5__["BONE"].LEG_R1 });
            layer.setMeshBuilder(_Player_Layer__WEBPACK_IMPORTED_MODULE_4__["LAYER"].HOLSTER_FULL, meshb, 0);
        }
        // create the meshswap objects
        var meshSwapIds = [
            this.confMgr.number('meshswap > objid1', true, 0),
            this.confMgr.number('meshswap > objid2', true, 0),
            this.confMgr.number('meshswap > objid3', true, 0)
        ];
        for (var i = 0; i < meshSwapIds.length; ++i) {
            _Constants__WEBPACK_IMPORTED_MODULE_3__["ObjectID"]['meshswap' + (i + 1)] = meshSwapIds[i];
            if (_Constants__WEBPACK_IMPORTED_MODULE_3__["ObjectID"]['meshswap' + (i + 1)] > 0) {
                var mvb = this.objMgr.createMoveable(_Constants__WEBPACK_IMPORTED_MODULE_3__["ObjectID"]['meshswap' + (i + 1)], -1, undefined, true, dataLara.skeleton);
                if (mvb) {
                    mvb.visible = false;
                }
            }
        }
        layer.update();
        layer.setBoundingObjects();
        if (this.confMgr.trversion == 'TR4') {
            if (mvbHolsterFull) {
                layer.updateMask(_Player_Layer__WEBPACK_IMPORTED_MODULE_4__["LAYER"].HOLSTER_FULL, _Player_Skeleton__WEBPACK_IMPORTED_MODULE_5__["MASK"].LEG_L1 | _Player_Skeleton__WEBPACK_IMPORTED_MODULE_5__["MASK"].LEG_R1);
            }
        }
        else if (mvbPistolAnim) {
            // put pistols in Lara holsters
            layer.updateMask(_Player_Layer__WEBPACK_IMPORTED_MODULE_4__["LAYER"].WEAPON, _Player_Skeleton__WEBPACK_IMPORTED_MODULE_5__["MASK"].LEG_L1 | _Player_Skeleton__WEBPACK_IMPORTED_MODULE_5__["MASK"].LEG_R1);
            layer.updateMask(_Player_Layer__WEBPACK_IMPORTED_MODULE_4__["LAYER"].MAIN, _Player_Skeleton__WEBPACK_IMPORTED_MODULE_5__["MASK"].LEG_L1 | _Player_Skeleton__WEBPACK_IMPORTED_MODULE_5__["MASK"].LEG_R1);
        }
        return [_Behaviour__WEBPACK_IMPORTED_MODULE_1__["BehaviourRetCode"].keepBehaviour, null];
    };
    Lara.prototype.getObject = function () {
        return this.lara;
    };
    Lara.prototype.getSkeleton = function () {
        return this.sceneData.objects[this.lara.name].skeleton;
    };
    return Lara;
}(_Behaviour__WEBPACK_IMPORTED_MODULE_1__["Behaviour"]));

_BehaviourManager__WEBPACK_IMPORTED_MODULE_2__["BehaviourManager"].registerFactory(Lara);


/***/ }),

/***/ "../src/Behaviour/Light.ts":
/*!*********************************!*\
  !*** ../src/Behaviour/Light.ts ***!
  \*********************************/
/*! exports provided: Light */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Light", function() { return Light; });
/* harmony import */ var _Proxy_Engine__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Proxy/Engine */ "../src/Proxy/Engine.ts");
/* harmony import */ var _Behaviour__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Behaviour */ "../src/Behaviour/Behaviour.ts");
/* harmony import */ var _BehaviourManager__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./BehaviourManager */ "../src/Behaviour/BehaviourManager.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();



var Light = /** @class */ (function (_super) {
    __extends(Light, _super);
    function Light(nbhv, gameData, objectid, objecttype) {
        var _this = _super.call(this, nbhv, gameData, objectid, objecttype) || this;
        _this.name = Light.name;
        _this._lstObjs = null;
        _this._color = [0, 0, 0];
        return _this;
    }
    Light.prototype.init = function (lstObjs) {
        var _this = this;
        var color = this.nbhv.color, range = parseInt(this.nbhv.range.max);
        if (lstObjs == null) {
            return [_Behaviour__WEBPACK_IMPORTED_MODULE_1__["BehaviourRetCode"].dontKeepBehaviour, null];
        }
        this._color = [parseFloat(color.r) / 255, parseFloat(color.g) / 255, parseFloat(color.b) / 255];
        this._lstObjs = lstObjs;
        this._lstObjs.forEach(function (obj) {
            var roomIndex = _this.gameData.sceneData.objects[obj.name].roomIndex, roomData = _this.gameData.sceneData.objects['room' + roomIndex];
            var globalLights = roomData.globalLights;
            if (!globalLights) {
                globalLights = [];
                roomData.globalLights = globalLights;
            }
            globalLights.push({
                "x": obj.position[0],
                "y": obj.position[1],
                "z": obj.position[2],
                "color": _this._color,
                "fadeOut": range,
            });
            Light.__numInstances++;
        });
        return [_Behaviour__WEBPACK_IMPORTED_MODULE_1__["BehaviourRetCode"].keepBehaviour, null];
    };
    Light.canLightRoom = function (roomMesh, light) {
        var meshb = _Proxy_Engine__WEBPACK_IMPORTED_MODULE_0__["default"].makeMeshBuilder(roomMesh), vertices = meshb.vertices, numVertices = vertices.length / 3, lx = light.x, ly = light.y, lz = light.z, fadeOut2 = light.fadeOut * light.fadeOut;
        for (var v = 0; v < numVertices; ++v) {
            var x = vertices[v * 3 + 0], y = vertices[v * 3 + 1], z = vertices[v * 3 + 2];
            var dist2 = (x - lx) * (x - lx) + (y - ly) * (y - ly) + (z - lz) * (z - lz);
            if (dist2 < fadeOut2) {
                return true;
            }
        }
        return false;
    };
    Light.onEngineInitialized = function (gameData) {
        if (Light.__numInstances == 0) {
            return;
        }
        // Loop through the global lights of each room.
        // If a light can light an adjoining room, add this light to the global light list of this room
        var sceneData = gameData.sceneData, objRooms = gameData.objMgr.objectList['room'], trRooms = gameData.trlvl.trlevel.rooms;
        for (var r = 0; r < trRooms.length; ++r) {
            var trRoom = trRooms[r], portals = trRoom.portals, globalLights = sceneData.objects['room' + r].globalLights;
            if (!globalLights || portals.length == 0) {
                continue;
            }
            for (var g = 0; g < globalLights.length; ++g) {
                var globalLight = globalLights[g];
                if (!globalLight.roomList) {
                    globalLight.roomList = new Set(); // list of rooms this light is
                    globalLight.roomList.add(r);
                }
                // let's see if this light can light the rooms reachable through the portals of the current room
                // if yes, add this light to those other rooms
                for (var p = 0; p < portals.length; ++p) {
                    var adjRoom = portals[p].adjoiningRoom;
                    if (globalLight.roomList.has(adjRoom)) {
                        continue;
                    } // the light is already in the adjoining room
                    if (Light.canLightRoom(objRooms[adjRoom], globalLight)) {
                        var glights = sceneData.objects['room' + adjRoom].globalLights;
                        if (!glights) {
                            glights = [];
                            sceneData.objects['room' + adjRoom].globalLights = glights;
                        }
                        glights.push(globalLight);
                        globalLight.roomList.add(adjRoom);
                    }
                }
            }
        }
        // make sure all global lights are set for each room
        for (var r = 0; r < trRooms.length; ++r) {
            var oroom = objRooms[r];
            gameData.matMgr.setUniformsFromRoom(oroom, r);
        }
    };
    Light.__numInstances = 0;
    return Light;
}(_Behaviour__WEBPACK_IMPORTED_MODULE_1__["Behaviour"]));

_BehaviourManager__WEBPACK_IMPORTED_MODULE_2__["BehaviourManager"].registerFactory(Light);


/***/ }),

/***/ "../src/Behaviour/MakeLayeredMesh.ts":
/*!*******************************************!*\
  !*** ../src/Behaviour/MakeLayeredMesh.ts ***!
  \*******************************************/
/*! exports provided: MakeLayeredMesh */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MakeLayeredMesh", function() { return MakeLayeredMesh; });
/* harmony import */ var _Behaviour__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Behaviour */ "../src/Behaviour/Behaviour.ts");
/* harmony import */ var _BehaviourManager__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./BehaviourManager */ "../src/Behaviour/BehaviourManager.ts");
/* harmony import */ var _Player_Layer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Player/Layer */ "../src/Player/Layer.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();



var MakeLayeredMesh = /** @class */ (function (_super) {
    __extends(MakeLayeredMesh, _super);
    function MakeLayeredMesh(nbhv, gameData, objectid, objecttype) {
        var _this = _super.call(this, nbhv, gameData, objectid, objecttype) || this;
        _this.name = MakeLayeredMesh.name;
        _this.sceneData = gameData.sceneData;
        return _this;
    }
    MakeLayeredMesh.prototype.init = function (lstObjs) {
        var _this = this;
        if (lstObjs != null) {
            lstObjs.forEach(function (obj) {
                var mesh = obj, data = _this.sceneData.objects[mesh.name], layer = new _Player_Layer__WEBPACK_IMPORTED_MODULE_2__["Layer"](mesh, _this.gameData);
                data.layer = layer;
            });
        }
        return [_Behaviour__WEBPACK_IMPORTED_MODULE_0__["BehaviourRetCode"].dontKeepBehaviour, null];
    };
    return MakeLayeredMesh;
}(_Behaviour__WEBPACK_IMPORTED_MODULE_0__["Behaviour"]));

_BehaviourManager__WEBPACK_IMPORTED_MODULE_1__["BehaviourManager"].registerFactory(MakeLayeredMesh);


/***/ }),

/***/ "../src/Behaviour/MuzzleFlash.ts":
/*!***************************************!*\
  !*** ../src/Behaviour/MuzzleFlash.ts ***!
  \***************************************/
/*! exports provided: MuzzleFlash */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MuzzleFlash", function() { return MuzzleFlash; });
/* harmony import */ var _Behaviour__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Behaviour */ "../src/Behaviour/Behaviour.ts");
/* harmony import */ var _BehaviourManager__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./BehaviourManager */ "../src/Behaviour/BehaviourManager.ts");
/* harmony import */ var _Player_Skeleton__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Player/Skeleton */ "../src/Player/Skeleton.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};



var DURATION = 0.1;
var COLOR = [0.6, 0.5, 0.1];
var DISTANCE = 3072 * 2;
var MuzzleFlash = /** @class */ (function (_super) {
    __extends(MuzzleFlash, _super);
    function MuzzleFlash(nbhv, gameData, objectid, objecttype) {
        var _this = _super.call(this, nbhv, gameData, objectid, objecttype) || this;
        _this.name = MuzzleFlash.name;
        _this._bhvMgr = gameData.bhvMgr;
        _this._sysLight = gameData.sysLight;
        _this._startTime = -1;
        _this._boneNumber = 0;
        _this._lightNum = _this._sysLight.add();
        _this._sysLight.setFadeout(_this._lightNum, DISTANCE);
        _this._mesh = null;
        return _this;
    }
    MuzzleFlash.prototype.init = function (lstObjs) {
        var _this = this;
        this._startTime = -1;
        this._boneNumber = this.nbhv.bone ? this.nbhv.bone : 0;
        var lara = this._bhvMgr.getBehaviour("Lara")[0];
        this._mesh = this.gameData.objMgr.createMoveable(MuzzleFlash._flashId, this.gameData.sceneData.objects[lara.getObject().name].roomIndex, undefined, true, false);
        (function () { return __awaiter(_this, void 0, void 0, function () {
            var shd, materials, mat, material;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.gameData.shdMgr.getVertexShader('TR_flash')];
                    case 1:
                        shd = _a.sent(), materials = this._mesh.materials;
                        for (mat = 0; mat < materials.length; ++mat) {
                            material = materials[mat];
                            material.depthWrite = false;
                            material.transparent = true;
                            material.vertexShader = shd;
                        }
                        return [2 /*return*/];
                }
            });
        }); })();
        return [_Behaviour__WEBPACK_IMPORTED_MODULE_0__["BehaviourRetCode"].keepBehaviour, null];
    };
    MuzzleFlash.onEngineInitialized = function (gameData) {
        var ofst = gameData.confMgr.vector3("gun > left_flashoffset", true);
        if (ofst) {
            MuzzleFlash._offsetL = [ofst.x, ofst.y, ofst.z];
        }
        ofst = gameData.confMgr.vector3("gun > right_flashoffset", true);
        if (ofst) {
            MuzzleFlash._offsetR = [ofst.x, ofst.y, ofst.z];
        }
        MuzzleFlash._flashId = gameData.confMgr.number("gun > flashid", true, 0);
        return [gameData.shdMgr.getVertexShader('TR_flash')];
    };
    MuzzleFlash.prototype.onFrameEnded = function (curTime, delta) {
        if (this._startTime < 0) {
            this._startTime = curTime;
        }
        var time = curTime - this._startTime;
        if (time < DURATION) {
            var intensity = (DURATION - time) * 20;
            var lara = this._bhvMgr.getBehaviour("Lara")[0], basis = lara.getSkeleton().getBoneDecomposition(this._boneNumber, lara.getObject());
            var q = [0, 0, 0, 1];
            glMatrix.quat.setAxisAngle(q, [1, 0, 0], -Math.PI * 0.5);
            basis.rotate(q);
            basis.translate(this._boneNumber == _Player_Skeleton__WEBPACK_IMPORTED_MODULE_2__["BONE"].ARM_L3 ? MuzzleFlash._offsetL : MuzzleFlash._offsetR);
            this._mesh.setPosition(basis.pos);
            this._mesh.setQuaternion(basis.rot);
            this._sysLight.setPosition(this._lightNum, basis.pos);
            this._sysLight.setColor(this._lightNum, [Math.min(COLOR[0] * intensity, 1), Math.min(COLOR[1] * intensity, 1), Math.min(COLOR[2] * intensity, 1)]);
        }
        else {
            this._sysLight.remove(this._lightNum);
            this.gameData.objMgr.removeObjectFromScene(this._mesh);
            this._bhvMgr.removeBehaviour(this);
        }
    };
    MuzzleFlash._flashId = 0;
    MuzzleFlash._offsetL = [0, 0, 0];
    MuzzleFlash._offsetR = [0, 0, 0];
    return MuzzleFlash;
}(_Behaviour__WEBPACK_IMPORTED_MODULE_0__["Behaviour"]));

_BehaviourManager__WEBPACK_IMPORTED_MODULE_1__["BehaviourManager"].registerFactory(MuzzleFlash);


/***/ }),

/***/ "../src/Behaviour/Ponytail.ts":
/*!************************************!*\
  !*** ../src/Behaviour/Ponytail.ts ***!
  \************************************/
/*! exports provided: Ponytail */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Ponytail", function() { return Ponytail; });
/* harmony import */ var _Behaviour__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Behaviour */ "../src/Behaviour/Behaviour.ts");
/* harmony import */ var _BehaviourManager__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./BehaviourManager */ "../src/Behaviour/BehaviourManager.ts");
/* harmony import */ var _Player_Braid__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Player/Braid */ "../src/Player/Braid.ts");
/* harmony import */ var _Constants__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../Constants */ "../src/Constants.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (undefined && undefined.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};




var Ponytail = /** @class */ (function (_super) {
    __extends(Ponytail, _super);
    function Ponytail(nbhv, gameData, objectid, objecttype) {
        var _this = _super.call(this, nbhv, gameData, objectid, objecttype) || this;
        _this.name = Ponytail.name;
        _this._braids = [];
        return _this;
    }
    Ponytail.prototype.init = function (lstObjs) {
        var id = this.nbhv.id, offsets_ = this.nbhv.offsets.offset, offsets = Array.isArray(offsets_) ? offsets_ : [offsets_], fixToHead = this.nbhv.fixtohead === 'true';
        _Constants__WEBPACK_IMPORTED_MODULE_3__["ObjectID"].LaraBraid = parseInt(id);
        var lara = this.gameData.bhvMgr.getBehaviour("Lara")[0].getObject();
        for (var i = 0; i < offsets.length; ++i) {
            var offset = __assign({ "x": "0", "y": "0", "z": "0" }, offsets[i]);
            this._braids.push(new _Player_Braid__WEBPACK_IMPORTED_MODULE_2__["Braid"](lara, [parseFloat(offset.x), parseFloat(offset.y), parseFloat(offset.z)], this.gameData, fixToHead));
        }
        return [_Behaviour__WEBPACK_IMPORTED_MODULE_0__["BehaviourRetCode"].keepBehaviour, null];
    };
    Ponytail.prototype.preWarm = function () {
        for (var n = 0; n < 30 * 3; ++n) {
            this._braids.forEach(function (b) { return b.update(1 / 30, true); });
        }
    };
    Ponytail.prototype.onFrameEnded = function (curTime, delta) {
        this._braids.forEach(function (b) { return b.update(delta); });
    };
    Ponytail.prototype.reset = function () {
        this._braids.forEach(function (b) { return b.reset(); });
    };
    Object.defineProperty(Ponytail.prototype, "braids", {
        get: function () {
            return this._braids;
        },
        enumerable: true,
        configurable: true
    });
    return Ponytail;
}(_Behaviour__WEBPACK_IMPORTED_MODULE_0__["Behaviour"]));

_BehaviourManager__WEBPACK_IMPORTED_MODULE_1__["BehaviourManager"].registerFactory(Ponytail);


/***/ }),

/***/ "../src/Behaviour/PulsingLight.ts":
/*!****************************************!*\
  !*** ../src/Behaviour/PulsingLight.ts ***!
  \****************************************/
/*! exports provided: PulsingLight */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PulsingLight", function() { return PulsingLight; });
/* harmony import */ var _Behaviour__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Behaviour */ "../src/Behaviour/Behaviour.ts");
/* harmony import */ var _BehaviourManager__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./BehaviourManager */ "../src/Behaviour/BehaviourManager.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();


var PulsingLight = /** @class */ (function (_super) {
    __extends(PulsingLight, _super);
    function PulsingLight(nbhv, gameData, objectid, objecttype) {
        var _this = _super.call(this, nbhv, gameData, objectid, objecttype) || this;
        _this.name = PulsingLight.name;
        _this._bhvMgr = gameData.bhvMgr;
        _this._sysLight = gameData.sysLight;
        _this._startTime = -1;
        _this._lightNum = -1;
        _this._color = [0, 0, 0];
        _this._frequency = 0;
        return _this;
    }
    PulsingLight.prototype.init = function (lstObjs) {
        if (lstObjs == null) {
            return [_Behaviour__WEBPACK_IMPORTED_MODULE_0__["BehaviourRetCode"].dontKeepBehaviour, null];
        }
        var objIndex = parseInt(this.nbhv.objindex ? this.nbhv.objindex : "0");
        this._lightNum = this._sysLight.add();
        this._sysLight.setFadeout(this._lightNum, parseFloat(this.nbhv.range.max));
        this._sysLight.setPosition(this._lightNum, lstObjs[objIndex].position);
        this._color = [parseFloat(this.nbhv.color.r) / 255, parseFloat(this.nbhv.color.g) / 255, parseFloat(this.nbhv.color.b) / 255];
        this._frequency = parseFloat(this.nbhv.frequency);
        return [_Behaviour__WEBPACK_IMPORTED_MODULE_0__["BehaviourRetCode"].keepBehaviour, null];
    };
    PulsingLight.prototype.onFrameStarted = function (curTime, delta) {
        if (this._startTime < 0) {
            this._startTime = curTime;
        }
        var time = curTime - this._startTime;
        var intensity = Math.abs(Math.sin(Math.PI * time / this._frequency));
        this._sysLight.setColor(this._lightNum, [this._color[0] * intensity, this._color[1] * intensity, this._color[2] * intensity]);
    };
    return PulsingLight;
}(_Behaviour__WEBPACK_IMPORTED_MODULE_0__["Behaviour"]));

_BehaviourManager__WEBPACK_IMPORTED_MODULE_1__["BehaviourManager"].registerFactory(PulsingLight);


/***/ }),

/***/ "../src/Behaviour/RemoveObject.ts":
/*!****************************************!*\
  !*** ../src/Behaviour/RemoveObject.ts ***!
  \****************************************/
/*! exports provided: RemoveObject */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RemoveObject", function() { return RemoveObject; });
/* harmony import */ var _Behaviour__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Behaviour */ "../src/Behaviour/Behaviour.ts");
/* harmony import */ var _BehaviourManager__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./BehaviourManager */ "../src/Behaviour/BehaviourManager.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();


var RemoveObject = /** @class */ (function (_super) {
    __extends(RemoveObject, _super);
    function RemoveObject(nbhv, gameData, objectid, objecttype) {
        var _this = _super.call(this, nbhv, gameData, objectid, objecttype) || this;
        _this.name = RemoveObject.name;
        _this.objMgr = gameData.objMgr;
        return _this;
    }
    RemoveObject.prototype.init = function (lstObjs) {
        var _this = this;
        if (lstObjs) {
            lstObjs.forEach(function (obj) {
                _this.objMgr.removeObjectFromScene(obj);
            });
        }
        return [_Behaviour__WEBPACK_IMPORTED_MODULE_0__["BehaviourRetCode"].dontKeepBehaviour, null];
    };
    return RemoveObject;
}(_Behaviour__WEBPACK_IMPORTED_MODULE_0__["Behaviour"]));

_BehaviourManager__WEBPACK_IMPORTED_MODULE_1__["BehaviourManager"].registerFactory(RemoveObject);


/***/ }),

/***/ "../src/Behaviour/ScrollTexture.ts":
/*!*****************************************!*\
  !*** ../src/Behaviour/ScrollTexture.ts ***!
  \*****************************************/
/*! exports provided: ScrollTexture */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ScrollTexture", function() { return ScrollTexture; });
/* harmony import */ var _Behaviour__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Behaviour */ "../src/Behaviour/Behaviour.ts");
/* harmony import */ var _BehaviourManager__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./BehaviourManager */ "../src/Behaviour/BehaviourManager.ts");
/* harmony import */ var _Constants__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Constants */ "../src/Constants.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();



var ScrollTexture = /** @class */ (function (_super) {
    __extends(ScrollTexture, _super);
    function ScrollTexture(nbhv, gameData, objectid, objecttype) {
        var _this = _super.call(this, nbhv, gameData, objectid, objecttype) || this;
        _this.name = ScrollTexture.name;
        _this.lstObjs = null;
        return _this;
    }
    ScrollTexture.prototype.init = function (lstObjs) {
        if (lstObjs == null) {
            return [_Behaviour__WEBPACK_IMPORTED_MODULE_0__["BehaviourRetCode"].dontKeepBehaviour, null];
        }
        this.lstObjs = lstObjs;
        return [_Behaviour__WEBPACK_IMPORTED_MODULE_0__["BehaviourRetCode"].keepBehaviour, null];
    };
    ScrollTexture.prototype.onFrameEnded = function (curTime, delta) {
        for (var i = 0; i < this.lstObjs.length; ++i) {
            var obj = this.lstObjs[i], materials = obj.materials;
            for (var m = 0; m < materials.length; ++m) {
                var material = materials[m], pgr = (curTime * 1000.0) / (5 * material.uniforms.map.height), h = (_Constants__WEBPACK_IMPORTED_MODULE_2__["moveableScrollAnimTileHeight"] / 2.0) / material.uniforms.map.height;
                pgr = pgr - h * Math.floor(pgr / h);
                material.uniforms.offsetRepeat.value[1] = h - pgr;
                material.uniformsUpdated(["offsetRepeat"]);
            }
        }
    };
    return ScrollTexture;
}(_Behaviour__WEBPACK_IMPORTED_MODULE_0__["Behaviour"]));

_BehaviourManager__WEBPACK_IMPORTED_MODULE_1__["BehaviourManager"].registerFactory(ScrollTexture);


/***/ }),

/***/ "../src/Behaviour/SetAnimation.ts":
/*!****************************************!*\
  !*** ../src/Behaviour/SetAnimation.ts ***!
  \****************************************/
/*! exports provided: SetAnimation */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SetAnimation", function() { return SetAnimation; });
/* harmony import */ var _Proxy_IMesh__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Proxy/IMesh */ "../src/Proxy/IMesh.ts");
/* harmony import */ var _Behaviour__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Behaviour */ "../src/Behaviour/Behaviour.ts");
/* harmony import */ var _BehaviourManager__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./BehaviourManager */ "../src/Behaviour/BehaviourManager.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();



var SetAnimation = /** @class */ (function (_super) {
    __extends(SetAnimation, _super);
    function SetAnimation(nbhv, gameData, objectid, objecttype) {
        var _this = _super.call(this, nbhv, gameData, objectid, objecttype) || this;
        _this.name = SetAnimation.name;
        _this.anmMgr = gameData.anmMgr;
        return _this;
    }
    SetAnimation.prototype.init = function (lstObjs) {
        var _this = this;
        var anim = parseInt(this.nbhv.anim);
        if (lstObjs !== null && lstObjs.length) {
            lstObjs.forEach(function (obj) { return Object(_Proxy_IMesh__WEBPACK_IMPORTED_MODULE_0__["isMesh"])(obj) ? _this.anmMgr.setAnimation(obj, anim, false) : null; });
        }
        return [_Behaviour__WEBPACK_IMPORTED_MODULE_1__["BehaviourRetCode"].dontKeepBehaviour, null];
    };
    return SetAnimation;
}(_Behaviour__WEBPACK_IMPORTED_MODULE_1__["Behaviour"]));

_BehaviourManager__WEBPACK_IMPORTED_MODULE_2__["BehaviourManager"].registerFactory(SetAnimation);


/***/ }),

/***/ "../src/Behaviour/Sky.ts":
/*!*******************************!*\
  !*** ../src/Behaviour/Sky.ts ***!
  \*******************************/
/*! exports provided: Sky */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Sky", function() { return Sky; });
/* harmony import */ var _Behaviour__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Behaviour */ "../src/Behaviour/Behaviour.ts");
/* harmony import */ var _BehaviourManager__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./BehaviourManager */ "../src/Behaviour/BehaviourManager.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();


var Sky = /** @class */ (function (_super) {
    __extends(Sky, _super);
    function Sky(nbhv, gameData, objectid, objecttype) {
        var _this = _super.call(this, nbhv, gameData, objectid, objecttype) || this;
        _this.name = Sky.name;
        _this.camera = gameData.camera;
        _this.objSky = null;
        return _this;
    }
    Sky.prototype.init = function (lstObjs) {
        var _this = this;
        var id = this.nbhv.id, hide = this.nbhv.hide == 'true', noanim = this.nbhv.noanim == 'true';
        if (hide) {
            return [_Behaviour__WEBPACK_IMPORTED_MODULE_0__["BehaviourRetCode"].dontKeepBehaviour, null];
        }
        this.objSky = this.gameData.objMgr.createMoveable(id, -1, undefined, false, false);
        if (this.objSky == null) {
            return [_Behaviour__WEBPACK_IMPORTED_MODULE_0__["BehaviourRetCode"].dontKeepBehaviour, null];
        }
        var data = this.gameData.sceneData.objects[this.objSky.name];
        data.has_anims = !noanim;
        this.objSky.renderOrder = 1;
        this.objSky.matrixAutoUpdate = true;
        if (data.has_anims) {
            this.gameData.anmMgr.setAnimation(this.objSky, 0, false);
        }
        this.gameData.sceneRender.remove(this.objSky);
        this.gameData.sceneBackground.add(this.objSky);
        var promiseShaders = Promise.all([this.gameData.shdMgr.getVertexShader('TR_sky'), this.gameData.shdMgr.getFragmentShader('TR_sky')]).then(function (shd) {
            var materials = _this.objSky.materials;
            for (var mat = 0; mat < materials.length; ++mat) {
                var material = materials[mat];
                material.depthWrite = false;
                material.vertexShader = shd[0];
                material.fragmentShader = shd[1];
            }
        });
        return [_Behaviour__WEBPACK_IMPORTED_MODULE_0__["BehaviourRetCode"].keepBehaviour, [promiseShaders]];
    };
    Sky.prototype.onFrameEnded = function () {
        this.objSky.setPosition(this.camera.position);
    };
    return Sky;
}(_Behaviour__WEBPACK_IMPORTED_MODULE_0__["Behaviour"]));

_BehaviourManager__WEBPACK_IMPORTED_MODULE_1__["BehaviourManager"].registerFactory(Sky);


/***/ }),

/***/ "../src/Behaviour/Skydome.ts":
/*!***********************************!*\
  !*** ../src/Behaviour/Skydome.ts ***!
  \***********************************/
/*! exports provided: Skydome */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Skydome", function() { return Skydome; });
/* harmony import */ var _Proxy_Engine__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Proxy/Engine */ "../src/Proxy/Engine.ts");
/* harmony import */ var _Behaviour__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Behaviour */ "../src/Behaviour/Behaviour.ts");
/* harmony import */ var _BehaviourManager__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./BehaviourManager */ "../src/Behaviour/BehaviourManager.ts");
/* harmony import */ var _Utils_SkyDome__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../Utils/SkyDome */ "../src/Utils/SkyDome.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();




var Skydome = /** @class */ (function (_super) {
    __extends(Skydome, _super);
    function Skydome(nbhv, gameData, objectid, objecttype) {
        var _this = _super.call(this, nbhv, gameData, objectid, objecttype) || this;
        _this.name = Skydome.name;
        _this.objMgr = gameData.objMgr;
        _this.camera = gameData.camera;
        _this.objSky = null;
        return _this;
    }
    Skydome.prototype.init = function (lstObjs) {
        var _this = this;
        var promise = this.createSkyDome().then(function () {
            _this.objSky.renderOrder = 0;
            _this.objSky.matrixAutoUpdate = true;
            var skyColor = [_this.nbhv.color.r / 255.0, _this.nbhv.color.g / 255.0, _this.nbhv.color.b / 255.0], material = _this.objSky.materials[0];
            material.depthWrite = false;
            material.uniforms.tintColor.value = skyColor;
            material.uniformsUpdated();
        });
        return [_Behaviour__WEBPACK_IMPORTED_MODULE_1__["BehaviourRetCode"].keepBehaviour, [promise]];
    };
    Skydome.prototype.onFrameEnded = function (curTime, delta) {
        this.objSky.setPosition(this.camera.position);
        var material = this.objSky.materials[0];
        var pgr = curTime / 50.0;
        material.uniforms.offsetRepeat.value[0] = pgr - Math.floor(pgr);
        material.uniformsUpdated(["offsetRepeat"]);
    };
    Skydome.prototype.createSkyDome = function () {
        var _this = this;
        var meshData = _Utils_SkyDome__WEBPACK_IMPORTED_MODULE_3__["default"].create(
        /*curvature*/ 10.0, 
        /*tiling*/ 3, 
        /*distance*/ 2000.0, 
        /*orientation*/ [0, 0, 0, 1], 
        /*xsegments*/ 16, 
        /*ysegments*/ 16, 
        /*ySegmentsToKeep*/ 8);
        var skyTexture = this.gameData.sceneData.textures[this.gameData.sceneData.textures.length - 1];
        skyTexture.wrapS = skyTexture.wrapT = 1000; // for threejs
        skyTexture.wrapU = skyTexture.wrapV = 1; // for babylon - don't want to abstract that...
        var uniforms = {
            "map": { type: "t", value: skyTexture },
            "offsetRepeat": { type: "f4", value: [0, 0, 1, 1] },
            "tintColor": { type: "f3", value: [0, 0, 0] }
        };
        return Promise.all([this.gameData.shdMgr.getVertexShader('TR_skydome'), this.gameData.shdMgr.getFragmentShader('TR_skydome')]).then(function (shd) {
            var meshb = _Proxy_Engine__WEBPACK_IMPORTED_MODULE_0__["default"].makeMeshBuilder();
            _this.objSky = meshb.createMesh('skydome', _this.gameData.sceneBackground, shd[0], shd[1], uniforms, meshData.vertices, meshData.faces, meshData.textures, undefined);
            _this.gameData.sceneData.objects['skydome'] = {
                "type": 'skydome',
                "objectid": '0',
                "roomIndex": -1,
                "visible": true
            };
            _this.objMgr.objectList['skydome'] = { 0: [_this.objSky] };
        });
    };
    return Skydome;
}(_Behaviour__WEBPACK_IMPORTED_MODULE_1__["Behaviour"]));

_BehaviourManager__WEBPACK_IMPORTED_MODULE_2__["BehaviourManager"].registerFactory(Skydome);


/***/ }),

/***/ "../src/Behaviour/Sprite.ts":
/*!**********************************!*\
  !*** ../src/Behaviour/Sprite.ts ***!
  \**********************************/
/*! exports provided: Sprite */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Sprite", function() { return Sprite; });
/* harmony import */ var _Behaviour__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Behaviour */ "../src/Behaviour/Behaviour.ts");
/* harmony import */ var _BehaviourManager__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./BehaviourManager */ "../src/Behaviour/BehaviourManager.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();


var Sprite = /** @class */ (function (_super) {
    __extends(Sprite, _super);
    function Sprite(nbhv, gameData, objectid, objecttype) {
        var _this = _super.call(this, nbhv, gameData, objectid, objecttype) || this;
        _this.name = Sprite.name;
        _this.objMgr = gameData.objMgr;
        _this.camera = gameData.camera;
        return _this;
    }
    Sprite.prototype.init = function (lstObjs) {
        return [_Behaviour__WEBPACK_IMPORTED_MODULE_0__["BehaviourRetCode"].keepBehaviour, null];
    };
    Sprite.prototype.onFrameEnded = function (curTime, delta) {
        // make sure the object is always facing the camera
        var cameraRot = this.camera.quaternion;
        var objects = Object.assign({}, this.objMgr.objectList['sprite'], this.objMgr.objectList['spriteseq']);
        for (var objID in objects) {
            var lstObj = objects[objID];
            for (var i = 0; i < lstObj.length; ++i) {
                var obj = lstObj[i];
                obj.setQuaternion(cameraRot);
            }
        }
    };
    return Sprite;
}(_Behaviour__WEBPACK_IMPORTED_MODULE_0__["Behaviour"]));

_BehaviourManager__WEBPACK_IMPORTED_MODULE_1__["BehaviourManager"].registerFactory(Sprite);


/***/ }),

/***/ "../src/Behaviour/UVRotate.ts":
/*!************************************!*\
  !*** ../src/Behaviour/UVRotate.ts ***!
  \************************************/
/*! exports provided: UVRotate */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UVRotate", function() { return UVRotate; });
/* harmony import */ var _Behaviour__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Behaviour */ "../src/Behaviour/Behaviour.ts");
/* harmony import */ var _BehaviourManager__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./BehaviourManager */ "../src/Behaviour/BehaviourManager.ts");
/* harmony import */ var _Constants__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Constants */ "../src/Constants.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();



var UVRotate = /** @class */ (function (_super) {
    __extends(UVRotate, _super);
    function UVRotate(nbhv, gameData, objectid, objecttype) {
        var _this = _super.call(this, nbhv, gameData, objectid, objecttype) || this;
        _this.name = UVRotate.name;
        _this.animatedTextures = gameData.sceneData.animatedTextures;
        _this.matList = [];
        return _this;
    }
    UVRotate.prototype.init = function (lstObjs) {
        if (lstObjs == null) {
            return [_Behaviour__WEBPACK_IMPORTED_MODULE_0__["BehaviourRetCode"].dontKeepBehaviour, null];
        }
        for (var i = 0; i < lstObjs.length; ++i) {
            var obj = lstObjs[i], materials = obj.materials;
            for (var m = 0; m < materials.length; ++m) {
                var material = materials[m], userData = material.userData;
                if (!userData || !userData.animatedTexture) {
                    continue;
                }
                var animTexture = this.animatedTextures[userData.animatedTexture.idxAnimatedTexture];
                if (animTexture.scrolltexture) {
                    this.matList.push(material);
                }
            }
        }
        return [_Behaviour__WEBPACK_IMPORTED_MODULE_0__["BehaviourRetCode"].keepBehaviour, null];
    };
    UVRotate.prototype.onFrameEnded = function (curTime, delta) {
        for (var i = 0; i < this.matList.length; ++i) {
            var material = this.matList[i], userData = material.userData, animTexture = this.animatedTextures[userData.animatedTexture.idxAnimatedTexture], coords = animTexture.animcoords[0], pgr = (curTime * 1000.0) / (5 * material.uniforms.map.height), h = (_Constants__WEBPACK_IMPORTED_MODULE_2__["uvRotateTileHeight"] / 2.0) / material.uniforms.map.height;
            pgr = pgr - h * Math.floor(pgr / h);
            material.uniforms.offsetRepeat.value[0] = coords.minU - userData.animatedTexture.minU;
            material.uniforms.offsetRepeat.value[1] = coords.minV - userData.animatedTexture.minV * 0.5 + h - pgr;
            material.uniforms.offsetRepeat.value[3] = 0.5;
            material.uniformsUpdated(["offsetRepeat"]);
        }
    };
    return UVRotate;
}(_Behaviour__WEBPACK_IMPORTED_MODULE_0__["Behaviour"]));

_BehaviourManager__WEBPACK_IMPORTED_MODULE_1__["BehaviourManager"].registerFactory(UVRotate);


/***/ }),

/***/ "../src/Behaviour/Zbias.ts":
/*!*********************************!*\
  !*** ../src/Behaviour/Zbias.ts ***!
  \*********************************/
/*! exports provided: Zbias */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Zbias", function() { return Zbias; });
/* harmony import */ var _Proxy_IMesh__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Proxy/IMesh */ "../src/Proxy/IMesh.ts");
/* harmony import */ var _Behaviour__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Behaviour */ "../src/Behaviour/Behaviour.ts");
/* harmony import */ var _BehaviourManager__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./BehaviourManager */ "../src/Behaviour/BehaviourManager.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();



var Zbias = /** @class */ (function (_super) {
    __extends(Zbias, _super);
    function Zbias(nbhv, gameData, objectid, objecttype) {
        var _this = _super.call(this, nbhv, gameData, objectid, objecttype) || this;
        _this.name = Zbias.name;
        return _this;
    }
    Zbias.prototype.init = function (lstObjs) {
        var params = this.nbhv.polygoneoffset;
        if (lstObjs && params) {
            var factor_1 = params.factor, unit_1 = params.unit;
            lstObjs.forEach(function (obj) {
                if (Object(_Proxy_IMesh__WEBPACK_IMPORTED_MODULE_0__["isMesh"])(obj)) {
                    var materials = obj.materials;
                    for (var m = 0; m < materials.length; ++m) {
                        var material = materials[m];
                        material.setZBias(factor_1, unit_1);
                    }
                }
            });
        }
        return [_Behaviour__WEBPACK_IMPORTED_MODULE_1__["BehaviourRetCode"].dontKeepBehaviour, null];
    };
    return Zbias;
}(_Behaviour__WEBPACK_IMPORTED_MODULE_1__["Behaviour"]));

_BehaviourManager__WEBPACK_IMPORTED_MODULE_2__["BehaviourManager"].registerFactory(Zbias);


/***/ }),

/***/ "../src/ConfigManager.ts":
/*!*******************************!*\
  !*** ../src/ConfigManager.ts ***!
  \*******************************/
/*! exports provided: ConfigManager */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ConfigManager", function() { return ConfigManager; });
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! jquery */ "jquery");
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(jquery__WEBPACK_IMPORTED_MODULE_0__);

var ConfigManager = /** @class */ (function () {
    function ConfigManager(xmlConf) {
        this._root = jquery__WEBPACK_IMPORTED_MODULE_0___default()(xmlConf);
        this._levelname = "";
        this._trversion = "";
    }
    Object.defineProperty(ConfigManager.prototype, "trversion", {
        get: function () {
            return this._trversion;
        },
        set: function (tv) {
            this._trversion = tv;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ConfigManager.prototype, "levelName", {
        get: function () {
            return this._levelname;
        },
        set: function (levelname) {
            this._levelname = levelname;
        },
        enumerable: true,
        configurable: true
    });
    ConfigManager.prototype.globalParam = function (path, getnode) {
        if (getnode === void 0) { getnode = false; }
        var node = this._root.find('game[id="' + this.trversion + '"] > global ' + path);
        return getnode ? node : (node.length > 0 ? node.text() : null);
    };
    ConfigManager.prototype.globalColor = function (path) {
        var r = this.globalParam(path + ' > r');
        var g = this.globalParam(path + ' > g');
        var b = this.globalParam(path + ' > b');
        return r != null && g != null && b != null ? { r: r / 255, g: g / 255, b: b / 255 } : null;
    };
    ConfigManager.prototype.param = function (path, checkinglobal, getnode) {
        if (checkinglobal === void 0) { checkinglobal = false; }
        if (getnode === void 0) { getnode = false; }
        var node = this._levelname ? this._root.find('game[id="' + this.trversion + '"] > levels > level[id="' + this._levelname + '"] ' + path) : null;
        if ((!node || node.length == 0) && checkinglobal) {
            node = this._root.find('game[id="' + this.trversion + '"] > global ' + path);
        }
        return getnode ? node : (node.length > 0 ? node.text() : null);
    };
    ConfigManager.prototype.color = function (path, checkinglobal) {
        if (checkinglobal === void 0) { checkinglobal = false; }
        var r = this.param(path + ' > r', checkinglobal);
        var g = this.param(path + ' > g', checkinglobal);
        var b = this.param(path + ' > b', checkinglobal);
        return r != null && g != null && b != null ? { r: r / 255, g: g / 255, b: b / 255 } : null;
    };
    ConfigManager.prototype.vector3 = function (path, checkinglobal) {
        if (checkinglobal === void 0) { checkinglobal = false; }
        var x = this.param(path + ' > x', checkinglobal);
        var y = this.param(path + ' > y', checkinglobal);
        var z = this.param(path + ' > z', checkinglobal);
        return x != null && y != null && z != null ? { x: parseFloat(x), y: parseFloat(y), z: parseFloat(z) } : null;
    };
    ConfigManager.prototype.float = function (path, checkinglobal, defvalue) {
        if (checkinglobal === void 0) { checkinglobal = false; }
        if (defvalue === void 0) { defvalue = -Infinity; }
        var v = this.param(path, checkinglobal);
        return v != null ? parseFloat(v) : defvalue;
    };
    ConfigManager.prototype.number = function (path, checkinglobal, defvalue) {
        if (checkinglobal === void 0) { checkinglobal = false; }
        if (defvalue === void 0) { defvalue = -Infinity; }
        var v = this.param(path, checkinglobal);
        return v != null ? parseInt(v) : defvalue;
    };
    ConfigManager.prototype.boolean = function (path, checkinglobal, defvalue) {
        if (checkinglobal === void 0) { checkinglobal = false; }
        if (defvalue === void 0) { defvalue = false; }
        var v = this.param(path, checkinglobal);
        return v != null ? v == 'true' : defvalue;
    };
    return ConfigManager;
}());



/***/ }),

/***/ "../src/Constants.ts":
/*!***************************!*\
  !*** ../src/Constants.ts ***!
  \***************************/
/*! exports provided: baseFrameRate, uvRotateTileHeight, moveableScrollAnimTileHeight, ObjectID */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "baseFrameRate", function() { return baseFrameRate; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "uvRotateTileHeight", function() { return uvRotateTileHeight; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "moveableScrollAnimTileHeight", function() { return moveableScrollAnimTileHeight; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ObjectID", function() { return ObjectID; });
var baseFrameRate = 30.0;
var uvRotateTileHeight = 64;
var moveableScrollAnimTileHeight = 128;
var ObjectID = {
    "Lara": 0,
    "LaraJoints": 9,
    "LaraBraid": -1,
};


/***/ }),

/***/ "../src/Loading/LevelConverter.ts":
/*!****************************************!*\
  !*** ../src/Loading/LevelConverter.ts ***!
  \****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Constants */ "../src/Constants.ts");
/* harmony import */ var _Animation_Commands__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Animation/Commands */ "../src/Animation/Commands.ts");
/* harmony import */ var _LevelConverterHelper__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./LevelConverterHelper */ "../src/Loading/LevelConverterHelper.ts");
var __read = (undefined && undefined.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (undefined && undefined.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};



/*
    Convert the JSON object created by the raw level loader to a higher level JSON scene
*/
var LevelConverter = /** @class */ (function () {
    function LevelConverter() {
        this.confMgr = null;
        this.sc = null;
        this.helper = null;
        this.laraObjectID = -1;
        this.movObjID2Index = null;
        this.objects = null;
    }
    Object.defineProperty(LevelConverter.prototype, "sceneJSON", {
        get: function () {
            return this.sc;
        },
        enumerable: true,
        configurable: true
    });
    // create one texture per tile
    LevelConverter.prototype.createTextures = function () {
        for (var i = 0; i < this.sc.data.trlevel.textile.length; ++i) {
            var name_1 = 'texture' + i;
            this.sc.textures.push({
                "uuid": name_1,
                "name": name_1,
                "anisotropy": 16,
                "flipY": false,
                "image": name_1,
                "wrap": [1001, 1001],
                "minFilter": 1006,
                "magFilter": 1006
            });
            this.sc.images.push({
                "uuid": name_1,
                "url": this.sc.data.trlevel.textile[i]
            });
        }
    };
    // Collect the animated textures
    LevelConverter.prototype.createAnimatedTextures = function () {
        var i = 0, adata = this.sc.data.trlevel.animatedTextures, numAnimatedTextures = adata[i++];
        var animatedTextures = [], mapObjTexture2AnimTexture = {};
        while (numAnimatedTextures-- > 0) {
            var numTextures = adata[i++] + 1, snumTextures = numTextures, anmcoords = [];
            while (numTextures-- > 0) {
                var texture = adata[i++], tex = this.sc.data.trlevel.objectTextures[texture], tile = tex.tile & 0x7FFF;
                var isTri = (tex.tile & 0x8000) != 0;
                var minU = 0x7FFF, minV = 0x7FFF, numVertices = isTri ? 3 : 4;
                mapObjTexture2AnimTexture[texture] = { idxAnimatedTexture: animatedTextures.length, pos: snumTextures - numTextures - 1 };
                for (var j = 0; j < numVertices; j++) {
                    var u = tex.vertices[j].Xpixel, v = tex.vertices[j].Ypixel;
                    if (minU > u) {
                        minU = u;
                    }
                    if (minV > v) {
                        minV = v;
                    }
                }
                anmcoords.push({ minU: (minU + 0.5) / this.sc.data.trlevel.atlas.width, minV: (minV + 0.5) / this.sc.data.trlevel.atlas.height, texture: "" + tile });
            }
            animatedTextures.push({
                "animcoords": anmcoords,
                "animspeed": this.sc.data.trlevel.rversion == 'TR1' ? 5 : this.sc.data.trlevel.rversion == 'TR2' ? 6 : 14,
                "scrolltexture": (animatedTextures.length < this.sc.data.trlevel.animatedTexturesUVCount)
            });
        }
        this.sc.data.animatedTextures = animatedTextures;
        this.sc.data.trlevel.mapObjTexture2AnimTexture = mapObjTexture2AnimTexture; // => to know for each objTexture if it is part of an animated texture, and if yes which is its starting position in the sequence
    };
    LevelConverter.prototype.createAllStaticMeshes = function () {
        var _a;
        for (var s = 0; s < this.sc.data.trlevel.staticMeshes.length; ++s) {
            var smesh = this.sc.data.trlevel.staticMeshes[s], meshIndex = smesh.mesh, objectID = smesh.objectID, flags = smesh.flags;
            var mesh = this.sc.data.trlevel.meshes[meshIndex];
            var meshJSON = this.helper.createNewGeometryData();
            var tiles2material = {};
            this.helper.makeMeshGeometry(mesh, meshJSON, tiles2material, this.sc.data.trlevel.objectTextures, this.sc.data.trlevel.mapObjTexture2AnimTexture);
            var materials = this.helper.makeMaterialList(tiles2material, 'mesh', 'mesh' + meshIndex);
            this.sc.geometries.push({
                "uuid": 'mesh' + meshIndex,
                "type": "BufferGeometry",
                "data": meshJSON
            });
            var meshid = 'staticmesh' + objectID;
            (_a = this.sc.materials).push.apply(_a, __spread(materials));
            this.objects.push({
                "uuid": meshid,
                "type": "Mesh",
                "name": meshid,
                "geometry": 'mesh' + meshIndex,
                "material": materials.map(function (m) { return m.uuid; }),
                "position": [0, 0, 0],
                "quaternion": [0, 0, 0, 1],
                "scale": [1, 1, 1]
            });
            this.sc.data.objects[meshid] = {
                "type": 'staticmesh',
                "raw": smesh,
                "roomIndex": -1,
                "objectid": objectID,
                "visible": false,
                "flags": flags
            };
        }
    };
    LevelConverter.prototype.createAllSprites = function () {
        var _a;
        for (var s = 0; s < this.sc.data.trlevel.spriteTextures.length; ++s) {
            var sprite = this.sc.data.trlevel.spriteTextures[s];
            var geometry = this.createSpriteSeq(s);
            var spriteid = 'sprite' + s;
            (_a = this.sc.materials).push.apply(_a, __spread(geometry.materials));
            this.objects.push({
                "uuid": spriteid,
                "type": "Mesh",
                "name": spriteid,
                "geometry": geometry.uuid,
                "material": geometry.materials.map(function (m) { return m.uuid; }),
                "position": [0, 0, 0],
                "quaternion": [0, 0, 0, 1],
                "scale": [1, 1, 1]
            });
            this.sc.data.objects[spriteid] = {
                "type": 'sprite',
                "raw": sprite,
                "roomIndex": -1,
                "objectid": s,
                "visible": false
            };
        }
    };
    //  create a sprite sequence: if there's more than one sprite in the sequence, we create an animated texture
    LevelConverter.prototype.createSpriteSeq = function (spriteSeq) {
        var spriteIndex, numSprites = 1, spriteid;
        if (typeof (spriteSeq) == 'number') {
            // case where this function is called to create a single sprite in a room
            spriteIndex = spriteSeq;
            spriteSeq = null;
            spriteid = 'sprite' + spriteIndex;
            if (spriteIndex >= this.sc.data.trlevel.spriteTextures.length) {
                console.log('spriteindex', spriteIndex, 'is too big: only', this.sc.data.trlevel.spriteTextures.length, 'sprites in this.sc.data.trlevel.spriteTextures !');
                return false;
            }
        }
        else {
            // case where this function is called to create a sprite sequence
            spriteIndex = spriteSeq.offset;
            numSprites = -spriteSeq.negativeLength;
            spriteid = 'spriteseq' + spriteSeq.objectID;
        }
        var sprite = this.sc.data.trlevel.spriteTextures[spriteIndex], meshJSON = this.helper.createNewGeometryData(), tiles2material = {};
        delete meshJSON.attributes.vertColor;
        delete meshJSON.attributes._flags;
        meshJSON.vertices.push(sprite.leftSide, -sprite.topSide, 0);
        meshJSON.vertices.push(sprite.leftSide, -sprite.bottomSide, 0);
        meshJSON.vertices.push(sprite.rightSide, -sprite.bottomSide, 0);
        meshJSON.vertices.push(sprite.rightSide, -sprite.topSide, 0);
        var texturedRectangles = [
            {
                vertices: [0, 1, 2, 3],
                texture: 0x8000,
            }
        ];
        var width = (sprite.width - 255) / 256, height = (sprite.height - 255) / 256;
        var row = 0, col = 0, tile = sprite.tile;
        if (this.sc.data.trlevel.atlas.make) {
            row = Math.floor(tile / this.sc.data.trlevel.atlas.numColPerRow), col = tile - row * this.sc.data.trlevel.atlas.numColPerRow;
            tile = 0;
        }
        var objectTextures = [
            {
                attributes: 0,
                tile: tile,
                origTile: tile,
                vertices: [
                    { Xpixel: sprite.x + col * 256, Ypixel: sprite.y + row * 256 },
                    { Xpixel: sprite.x + col * 256, Ypixel: sprite.y + height - 1 + row * 256 },
                    { Xpixel: sprite.x + width - 1 + col * 256, Ypixel: sprite.y + height - 1 + row * 256 },
                    { Xpixel: sprite.x + width - 1 + col * 256, Ypixel: sprite.y + row * 256 }
                ]
            }
        ];
        var mapObjTexture2AnimTexture = {};
        if (numSprites > 1 && this.sc.data.animatedTextures) {
            var anmcoords = [];
            mapObjTexture2AnimTexture[0] = { idxAnimatedTexture: this.sc.data.animatedTextures.length, pos: 0 };
            for (var i = 0; i < numSprites; ++i) {
                sprite = this.sc.data.trlevel.spriteTextures[spriteIndex + i];
                tile = sprite.tile;
                if (this.sc.data.trlevel.atlas.make) {
                    row = Math.floor(tile / this.sc.data.trlevel.atlas.numColPerRow), col = tile - row * this.sc.data.trlevel.atlas.numColPerRow;
                    tile = 0;
                }
                anmcoords.push({ minU: (sprite.x + col * 256 + 0.5) / this.sc.data.trlevel.atlas.width, minV: (sprite.y + row * 256 + 0.5) / this.sc.data.trlevel.atlas.height, texture: "" + tile });
            }
            this.sc.data.animatedTextures.push({
                "animcoords": anmcoords,
                "animspeed": 20
            });
        }
        this.helper.makeFaces(meshJSON, [texturedRectangles], tiles2material, objectTextures, mapObjTexture2AnimTexture, 0);
        var materials = this.helper.makeMaterialList(tiles2material, 'sprite', spriteid);
        this.sc.geometries.push({
            "uuid": spriteid,
            "type": "BufferGeometry",
            "data": meshJSON
        });
        return {
            "uuid": spriteid,
            "materials": materials
        };
    };
    // generate the rooms + static meshes + sprites in the room
    LevelConverter.prototype.createRooms = function () {
        var _a;
        // flag the alternate rooms
        for (var m = 0; m < this.sc.data.trlevel.rooms.length; ++m) {
            this.sc.data.trlevel.rooms[m].isAlternate = false;
        }
        for (var m = 0; m < this.sc.data.trlevel.rooms.length; ++m) {
            var room = this.sc.data.trlevel.rooms[m], alternate = room.alternateRoom;
            if (alternate != -1) {
                this.sc.data.trlevel.rooms[alternate].isAlternate = true;
            }
        }
        var maxLightsInRoom = 0, roomL = -1;
        // generate the rooms
        for (var m = 0; m < this.sc.data.trlevel.rooms.length; ++m) {
            var room = this.sc.data.trlevel.rooms[m], info = room.info, rdata = room.roomData, rflags = room.flags, lightMode = room.lightMode, isFilledWithWater = (rflags & 1) != 0, isFlickering = (lightMode == 1);
            var roomMesh = {
                "uuid": "room" + m,
                "type": "Mesh",
                "name": "room" + m,
                "geometry": "room" + m,
                "position": [0, 0, 0],
                "quaternion": [0, 0, 0, 1],
                "scale": [1, 1, 1]
            };
            this.objects.push(roomMesh);
            var roomData = {
                "type": 'room',
                "raw": room,
                "isAlternateRoom": room.isAlternate,
                "filledWithWater": isFilledWithWater,
                "flickering": isFlickering,
                "roomIndex": m,
                "objectid": m,
                "visible": !room.isAlternate
            };
            this.sc.data.objects['room' + m] = roomData;
            // lights in the room
            if (room.lights.length > maxLightsInRoom) {
                maxLightsInRoom = room.lights.length;
                roomL = m;
            }
            var ambientColor = glMatrix.vec3.create();
            if (this.sc.data.trlevel.rversion != 'TR4') {
                var ambient1 = 1.0 - room.ambientIntensity1 / 0x2000;
                glMatrix.vec3.set(ambientColor, ambient1, ambient1, ambient1);
            }
            else {
                var rc = room.roomColour;
                ambientColor[0] = ((rc & 0xFF0000) >> 16) / 255.0;
                ambientColor[1] = ((rc & 0xFF00) >> 8) / 255.0;
                ambientColor[2] = (rc & 0xFF) / 255.0;
            }
            var lights = [];
            for (var l = 0; l < room.lights.length; ++l) {
                var light = room.lights[l], color = [1, 1, 1];
                var px = light.x, py = -light.y, pz = -light.z, fadeIn = 0, fadeOut = 0;
                var plight = { type: 'point' };
                switch (this.sc.data.trlevel.rversion) {
                    case 'TR1':
                    case 'TR2': {
                        var intensity = light.intensity1;
                        if (intensity > 0x2000) {
                            intensity = 0x2000;
                        }
                        intensity = intensity / 0x2000;
                        glMatrix.vec3.set(color, intensity, intensity, intensity);
                        fadeOut = light.fade1;
                        break;
                    }
                    case 'TR3': {
                        var r = light.color.r / 255.0, g = light.color.g / 255.0, b = light.color.b / 255.0;
                        var intensity = light.intensity;
                        if (intensity > 0x2000) {
                            intensity = 0x2000;
                        } // without this test, cut5 in TR3 (for eg) is wrong
                        intensity = intensity / 0x2000;
                        glMatrix.vec3.set(color, r * intensity, g * intensity, b * intensity);
                        fadeOut = light.fade;
                        break;
                    }
                    case 'TR4': {
                        if (light.lightType > 2) {
                            // todo: handling of shadow / fog bulb lights
                            //console.log('light not handled because of type ' + light.lightType + ' in room ' + m, room)
                            continue;
                        }
                        var r = light.color.r / 255.0, g = light.color.g / 255.0, b = light.color.b / 255.0;
                        var intensity = light.intensity;
                        if (intensity > 32) {
                            intensity = 32;
                        }
                        intensity = intensity / 16.0;
                        glMatrix.vec3.set(color, r * intensity, g * intensity, b * intensity);
                        switch (light.lightType) {
                            case 0: // directional light
                                var bb = this.helper.getBoundingBox(room.roomData.vertices);
                                px = (bb[0] + bb[1]) / 2.0 + info.x;
                                py = -(bb[2] + bb[3]) / 2.0;
                                pz = -(bb[4] + bb[5]) / 2.0 - info.z;
                                fadeOut = Math.sqrt((bb[1] - bb[0]) * (bb[1] - bb[0]) + (bb[3] - bb[2]) * (bb[3] - bb[2]) + (bb[5] - bb[4]) * (bb[5] - bb[4]));
                                plight.type = 'directional';
                                plight.dx = light.dx;
                                plight.dy = -light.dy;
                                plight.dz = -light.dz;
                                break;
                            case 1: // point light
                                fadeIn = light.in;
                                fadeOut = light.out;
                                break;
                            case 2: // spot light
                                fadeIn = light.length;
                                fadeOut = light.cutOff;
                                if (fadeOut < fadeIn) {
                                    fadeIn = fadeOut;
                                    fadeOut = light.length;
                                }
                                plight.dx = light.dx;
                                plight.dy = -light.dy;
                                plight.dz = -light.dz;
                                plight.coneCos = light.out;
                                plight.penumbraCos = light.in;
                                if (plight.coneCos > plight.penumbraCos) {
                                    console.log('pb param spot room#' + room.roomIndex, light, room);
                                }
                                plight.type = 'spot';
                                break;
                        }
                        break;
                    }
                }
                if (fadeOut > 0x7FFF) {
                    fadeOut = 0x8000;
                }
                if (fadeIn > fadeOut) {
                    fadeIn = 0;
                }
                plight.x = px;
                plight.y = py;
                plight.z = pz;
                plight.color = color;
                plight.fadeIn = fadeIn;
                plight.fadeOut = fadeOut;
                lights.push(plight);
            }
            roomData.lights = lights;
            roomData.ambientColor = ambientColor;
            // room geometry
            var roomJSON = this.helper.createNewGeometryData();
            var tiles2material = {};
            // push the vertices + vertex colors of the room
            for (var v = 0; v < rdata.vertices.length; ++v) {
                var rvertex = rdata.vertices[v], vertexInfo = this.helper.processRoomVertex(rvertex, isFilledWithWater);
                roomJSON.vertices.push(vertexInfo.x + info.x, vertexInfo.y, vertexInfo.z - info.z);
                roomJSON.colors.push(vertexInfo.color2[0], vertexInfo.color2[1], vertexInfo.color2[2]);
                roomJSON._flags.push(vertexInfo.flag[0], vertexInfo.flag[1], vertexInfo.flag[2], vertexInfo.flag[3]);
            }
            // create the tri/quad faces
            this.helper.makeFaces(roomJSON, [rdata.rectangles, rdata.triangles], tiles2material, this.sc.data.trlevel.objectTextures, this.sc.data.trlevel.mapObjTexture2AnimTexture, 0);
            var materials = this.helper.makeMaterialList(tiles2material, 'room', 'room' + m);
            (_a = this.sc.materials).push.apply(_a, __spread(materials));
            // add the room geometry to the scene
            this.sc.geometries.push({
                "uuid": "room" + m,
                "type": "BufferGeometry",
                "data": roomJSON
            });
            roomMesh.material = materials.map(function (m) { return m.uuid; });
            // portal in the room
            var portals = [];
            for (var p = 0; p < room.portals.length; ++p) {
                var portal = room.portals[p];
                portals.push({
                    "adjoiningRoom": portal.adjoiningRoom,
                    "normal": { x: portal.normal.x, y: -portal.normal.y, z: -portal.normal.z },
                    "vertices": [
                        { x: (portal.vertices[0].x + info.x), y: -portal.vertices[0].y, z: (-portal.vertices[0].z - info.z) },
                        { x: (portal.vertices[1].x + info.x), y: -portal.vertices[1].y, z: (-portal.vertices[1].z - info.z) },
                        { x: (portal.vertices[2].x + info.x), y: -portal.vertices[2].y, z: (-portal.vertices[2].z - info.z) },
                        { x: (portal.vertices[3].x + info.x), y: -portal.vertices[3].y, z: (-portal.vertices[3].z - info.z) }
                    ]
                });
            }
            roomData.portals = portals;
        }
        console.log('num max lights in a single room=' + maxLightsInRoom + '. room=' + roomL);
    };
    LevelConverter.prototype.createAnimations = function () {
        var animTracks = [];
        for (var anm = 0; anm < this.sc.data.trlevel.animations.length; ++anm) {
            var anim = this.sc.data.trlevel.animations[anm];
            var frameOffset = anim.frameOffset / 2, frameStep = anim.frameSize, numFrames = anim.frameEnd - anim.frameStart + 1, animNumKeys = Math.floor((numFrames - 1) / anim.frameRate) + 1;
            if ((numFrames - 1) % anim.frameRate) {
                animNumKeys++;
            }
            var animFPS = _Constants__WEBPACK_IMPORTED_MODULE_0__["baseFrameRate"], animLength = ((animNumKeys - 1) * anim.frameRate) / _Constants__WEBPACK_IMPORTED_MODULE_0__["baseFrameRate"];
            if (animLength == 0) {
                animFPS = 1.0;
                animLength = 1.0;
            }
            if (this.sc.data.trlevel.rversion == 'TR1') {
                frameStep = this.sc.data.trlevel.frames[frameOffset + 9] * 2 + 10;
            }
            var animKeys = [];
            for (var key = 0; key < animNumKeys; key++) {
                var frame = frameOffset + key * frameStep, sframe = frame;
                var BBLoX = this.sc.data.trlevel.frames[frame++], BBHiX = this.sc.data.trlevel.frames[frame++], BBLoY = -this.sc.data.trlevel.frames[frame++], BBHiY = -this.sc.data.trlevel.frames[frame++], BBLoZ = -this.sc.data.trlevel.frames[frame++], BBHiZ = -this.sc.data.trlevel.frames[frame++];
                var transX = this.sc.data.trlevel.frames[frame++], transY = -this.sc.data.trlevel.frames[frame++], transZ = -this.sc.data.trlevel.frames[frame++];
                var numAnimatedMeshesUnknown = 99999, numAnimatedMeshes = numAnimatedMeshesUnknown;
                if (this.sc.data.trlevel.rversion == 'TR1') {
                    numAnimatedMeshes = this.sc.data.trlevel.frames[frame++];
                }
                var mesh = 0, keyData = [];
                // Loop through all the meshes of the key
                while (mesh < numAnimatedMeshes) {
                    var angleX = 0.0, angleY = 0.0, angleZ = 0.0;
                    if (numAnimatedMeshes == numAnimatedMeshesUnknown && (frame - sframe) >= frameStep) {
                        break;
                    }
                    var frameData = this.sc.data.trlevel.frames[frame++];
                    if (frameData < 0) {
                        frameData += 65536;
                    }
                    if ((frameData & 0xC000) && (this.sc.data.trlevel.rversion != 'TR1')) { // single axis of rotation
                        var angle = this.sc.data.trlevel.rversion == 'TR4' ? (frameData & 0xFFF) >> 2 : frameData & 0x3FF;
                        angle *= 360.0 / 1024.0;
                        switch (frameData & 0xC000) {
                            case 0x4000:
                                angleX = angle;
                                break;
                            case 0x8000:
                                angleY = angle;
                                break;
                            case 0xC000:
                                angleZ = angle;
                                break;
                        }
                    }
                    else { // 3 axis of rotation
                        if (numAnimatedMeshes == numAnimatedMeshesUnknown && (frame - sframe) >= frameStep) {
                            break;
                        }
                        var frameData2 = this.sc.data.trlevel.frames[frame++];
                        if (frameData2 < 0) {
                            frameData2 += 65536;
                        }
                        if (this.sc.data.trlevel.rversion == 'TR1') {
                            var temp = frameData;
                            frameData = frameData2;
                            frameData2 = temp;
                        }
                        angleX = (frameData >> 4) & 0x03FF;
                        angleX *= 360.0 / 1024.0;
                        angleY = (frameData << 6) & 0x03C0;
                        angleY += (frameData2 >> 10) & 0x003F;
                        angleY *= 360.0 / 1024.0;
                        angleZ = frameData2 & 0x3FF;
                        angleZ *= 360.0 / 1024.0;
                    }
                    angleX *= Math.PI / 180.0;
                    angleY *= Math.PI / 180.0;
                    angleZ *= Math.PI / 180.0;
                    var qx = glMatrix.quat.create(), qy = glMatrix.quat.create(), qz = glMatrix.quat.create();
                    glMatrix.quat.setAxisAngle(qx, [1, 0, 0], angleX);
                    glMatrix.quat.setAxisAngle(qy, [0, 1, 0], -angleY);
                    glMatrix.quat.setAxisAngle(qz, [0, 0, 1], -angleZ);
                    glMatrix.quat.mul(qy, qy, qx);
                    glMatrix.quat.mul(qy, qy, qz);
                    keyData.push({
                        "position": { x: transX, y: transY, z: transZ },
                        "quaternion": { x: qy[0], y: qy[1], z: qy[2], w: qy[3] }
                    });
                    transX = transY = transZ = 0;
                    mesh++;
                }
                animKeys.push({
                    "time": key * anim.frameRate,
                    "boundingBox": { xmin: BBLoX, ymin: BBHiY, zmin: BBHiZ, xmax: BBHiX, ymax: BBLoY, zmax: BBLoZ },
                    "data": keyData
                });
            }
            var animCommands = [], numAnimCommands = anim.numAnimCommands;
            if (numAnimCommands < 0x100) {
                var aco = anim.animCommand;
                for (var ac = 0; ac < numAnimCommands; ++ac) {
                    var cmd = this.sc.data.trlevel.animCommands[aco++].value, numParams = _Animation_Commands__WEBPACK_IMPORTED_MODULE_1__["Commands"].numParams[cmd];
                    var command = {
                        "cmd": cmd,
                        "params": Array()
                    };
                    while (numParams-- > 0) {
                        command.params.push(this.sc.data.trlevel.animCommands[aco++].value);
                    }
                    animCommands.push(command);
                }
            }
            else {
                console.log('Invalid num anim commands (' + numAnimCommands + ') ! ', anim);
            }
            if (this.sc.data.trlevel.animations[anim.nextAnimation] != undefined) { // to avoid bugging for lost artifact TR3 levels
                animTracks.push({
                    "name": "anim" + anm,
                    "numKeys": animNumKeys,
                    "numFrames": numFrames,
                    "frameRate": anim.frameRate,
                    "fps": animFPS,
                    "nextTrack": anim.nextAnimation,
                    "nextTrackFrame": anim.nextFrame - this.sc.data.trlevel.animations[anim.nextAnimation].frameStart,
                    "keys": animKeys,
                    "commands": animCommands,
                    "frameStart": anim.frameStart
                });
            }
        }
        this.sc.data.animTracks = animTracks;
    };
    LevelConverter.prototype.createAllMoveables = function () {
        var objIdAnim = this.confMgr.param('behaviour[name="ScrollTexture"]', true, true), lstIdAnim = {};
        if (objIdAnim) {
            for (var i = 0; i < objIdAnim.length; ++i) {
                var node = objIdAnim[i];
                lstIdAnim[parseInt(node.getAttribute("objectid"))] = true;
            }
        }
        for (var m = 0; m < this.sc.data.trlevel.moveables.length; ++m) {
            var moveable = this.sc.data.trlevel.moveables[m];
            this.createMoveable(moveable, lstIdAnim);
        }
    };
    LevelConverter.prototype.createMoveable = function (moveable, lstIdAnim) {
        var _a;
        var jsonid = 'moveable' + moveable.objectID;
        var objIDForVisu = this.confMgr.number('moveable[id="' + moveable.objectID + '"] > visuid', true, moveable.objectID);
        var moveableGeom = this.sc.data.trlevel.moveables[this.movObjID2Index[objIDForVisu]];
        var numMeshes = moveableGeom.numMeshes, meshIndex = moveableGeom.startingMesh, meshTree = moveableGeom.meshTree, moveableIsExternallyLit = false, materials = null, meshJSON = null;
        var isDummy = numMeshes == 1 && this.sc.data.trlevel.meshes[meshIndex].dummy && !(moveableGeom.objectID == this.laraObjectID);
        var trType = this.sc.data.trlevel.rversion;
        if (!isDummy) {
            meshJSON = this.helper.createNewGeometryData();
            delete meshJSON.attributes.vertColor;
            var tiles2material = {};
            var stackIdx = 0, stack = [], parent_1 = -1;
            var px = 0, py = 0, pz = 0, bones = [];
            meshJSON.objHasScrollAnim = moveableGeom.objectID in lstIdAnim;
            meshJSON.skinIndices = [];
            meshJSON.skinWeights = [];
            for (var idx = 0; idx < numMeshes; ++idx, meshIndex++) {
                if (idx != 0) {
                    var sflag = this.sc.data.trlevel.meshTrees[meshTree++].coord;
                    px = this.sc.data.trlevel.meshTrees[meshTree++].coord;
                    py = this.sc.data.trlevel.meshTrees[meshTree++].coord;
                    pz = this.sc.data.trlevel.meshTrees[meshTree++].coord;
                    if (sflag & 1) {
                        if (stackIdx == 0) {
                            stackIdx = 1;
                        } // some moveables can have stackPtr == -1 without this test... (look in joby1a.tr4 for eg)
                        parent_1 = stack[--stackIdx];
                    }
                    if (sflag & 2) {
                        stack[stackIdx++] = parent_1;
                    }
                }
                var mesh = this.sc.data.trlevel.meshes[meshIndex];
                var isDummyMesh = true;
                if (!mesh.dummy || (mesh.dummy && (((trType == 'TR3' || trType == 'TR4') && objIDForVisu == 1 && idx == 1) ||
                    ((trType == 'TR1' || trType == 'TR2') && objIDForVisu == 0) ||
                    (trType == 'TR1' && objIDForVisu == 77)))) {
                    isDummyMesh = false;
                }
                if ((isDummyMesh && trType == 'TR4') || (idx == 0 && trType == 'TR4' && moveableGeom.objectID == _Constants__WEBPACK_IMPORTED_MODULE_0__["ObjectID"].LaraJoints)) {
                    // dummy mesh + hack to remove bad data from joint #0 of Lara joints in TR4
                }
                else {
                    var internalLit = this.helper.makeMeshGeometry(mesh, meshJSON, tiles2material, this.sc.data.trlevel.objectTextures, this.sc.data.trlevel.mapObjTexture2AnimTexture, idx);
                    moveableIsExternallyLit = moveableIsExternallyLit || !internalLit;
                }
                bones.push({
                    "parent": parent_1,
                    "name": "mesh#" + meshIndex,
                    "pos": [0, 0, 0],
                    "pos_init": [px, -py, -pz],
                    "rotq": [0, 0, 0, 1]
                });
                parent_1 = idx;
            }
            delete meshJSON.objHasScrollAnim;
            materials = this.helper.makeMaterialList(tiles2material, 'moveable', jsonid);
            this.sc.geometries.push({
                "uuid": jsonid,
                "type": "BufferGeometry",
                "data": meshJSON
            });
            if (materials) {
                (_a = this.sc.materials).push.apply(_a, __spread(materials));
            }
            this.objects.push({
                "uuid": jsonid,
                "type": "Mesh",
                "name": jsonid,
                "geometry": !isDummy ? jsonid : null,
                "material": !isDummy ? materials.map(function (m) { return m.uuid; }) : null,
                "position": [0, 0, 0],
                "quaternion": [0, 0, 0, 1],
                "scale": [1, 1, 1]
            });
            this.sc.data.objects[jsonid] = {
                "type": 'moveable',
                "raw": moveable,
                "has_anims": !isDummy,
                "numAnimations": !isDummy ? moveable.numAnimations : 0,
                "roomIndex": -1,
                "animationStartIndex": moveable.animation,
                "objectid": moveable.objectID,
                "visible": false,
                "bonesStartingPos": !isDummy ? bones : null,
                "internallyLit": !moveableIsExternallyLit,
                "startingMesh": moveableGeom.startingMesh
            };
        }
    };
    LevelConverter.prototype.createAllSpriteSequences = function () {
        for (var s = 0; s < this.sc.data.trlevel.spriteSequences.length; ++s) {
            var spriteSeq = this.sc.data.trlevel.spriteSequences[s];
            this.createSpriteSequence(spriteSeq);
        }
    };
    LevelConverter.prototype.createSpriteSequence = function (spriteSeq) {
        var _a;
        var geometry = this.createSpriteSeq(spriteSeq);
        var spriteid = 'spriteseq' + spriteSeq.objectID;
        (_a = this.sc.materials).push.apply(_a, __spread(geometry.materials));
        this.objects.push({
            "uuid": spriteid,
            "type": "Mesh",
            "name": spriteid,
            "geometry": geometry.uuid,
            "material": geometry.materials.map(function (m) { return m.uuid; }),
            "position": [0, 0, 0],
            "quaternion": [0, 0, 0, 1],
            "scale": [1, 1, 1]
        });
        this.sc.data.objects[spriteid] = {
            "type": 'spriteseq',
            "raw": spriteSeq,
            "roomIndex": -1,
            "objectid": spriteSeq.objectID,
            "visible": false
        };
    };
    LevelConverter.prototype.collectLightsExt = function () {
        var addedLights = 0;
        for (var objID in this.sc.data.objects) {
            var objData = this.sc.data.objects[objID];
            if (objData.type != 'room') {
                continue;
            }
            var portals = objData.portals;
            var lights = objData.lights.slice(0);
            for (var p = 0; p < portals.length; ++p) {
                var portal = portals[p], r = portal.adjoiningRoom, adjRoom = this.sc.data.objects['room' + r];
                if (!adjRoom) {
                    continue;
                }
                var portalCenter = {
                    x: (portal.vertices[0].x + portal.vertices[1].x + portal.vertices[2].x + portal.vertices[3].x) / 4.0,
                    y: (portal.vertices[0].y + portal.vertices[1].y + portal.vertices[2].y + portal.vertices[3].y) / 4.0,
                    z: (portal.vertices[0].z + portal.vertices[1].z + portal.vertices[2].z + portal.vertices[3].z) / 4.0
                };
                var rlights = adjRoom.lights;
                for (var l = 0; l < rlights.length; ++l) {
                    var rlight = rlights[l];
                    switch (rlight.type) {
                        case 'directional':
                            continue;
                    }
                    var distToPortalSq = (portalCenter.x - rlight.x) * (portalCenter.x - rlight.x) +
                        (portalCenter.y - rlight.y) * (portalCenter.y - rlight.y) +
                        (portalCenter.z - rlight.z) * (portalCenter.z - rlight.z);
                    if (distToPortalSq > rlight.fadeOut * rlight.fadeOut) {
                        continue;
                    }
                    lights.push(rlight);
                    addedLights++;
                }
            }
            objData.lightsExt = lights;
        }
        console.log('Number of additional lights added: ' + addedLights);
    };
    LevelConverter.prototype.createVertexNormals = function () {
        var vA, vB, vC, vD;
        var cb, ab, db, dc, bc, cross;
        for (var i = 0; i < this.sc.geometries.length; ++i) {
            var geom = this.sc.geometries[i].data;
            var vertices = geom.vertices, normals = geom.normals, faces = geom.faces;
            for (var v = 0; v < vertices.length; ++v) {
                normals.push(0);
            }
            for (var f = 0; f < faces.length; ++f) {
                var face = faces[f], isTri = face.length == 3;
                if (isTri) {
                    vA = [vertices[face[0].idx * 3 + 0], vertices[face[0].idx * 3 + 1], vertices[face[0].idx * 3 + 2]];
                    vB = [vertices[face[1].idx * 3 + 0], vertices[face[1].idx * 3 + 1], vertices[face[1].idx * 3 + 2]];
                    vC = [vertices[face[1].idx * 3 + 0], vertices[face[2].idx * 3 + 1], vertices[face[2].idx * 3 + 2]];
                    cb = [vC[0] - vB[0], vC[1] - vB[1], vC[2] - vB[2]];
                    ab = [vA[0] - vB[0], vA[1] - vB[1], vA[2] - vB[2]];
                    cross = [
                        cb[1] * ab[2] - cb[2] * ab[1],
                        cb[2] * ab[0] - cb[0] * ab[2],
                        cb[0] * ab[1] - cb[1] * ab[0]
                    ];
                    normals[face[0].idx * 3 + 0] += cross[0];
                    normals[face[0].idx * 3 + 1] += cross[1];
                    normals[face[0].idx * 3 + 2] += cross[2];
                    normals[face[1].idx * 3 + 0] += cross[0];
                    normals[face[1].idx * 3 + 1] += cross[1];
                    normals[face[1].idx * 3 + 2] += cross[2];
                    normals[face[2].idx * 3 + 0] += cross[0];
                    normals[face[2].idx * 3 + 1] += cross[1];
                    normals[face[2].idx * 3 + 2] += cross[2];
                }
                else {
                    vA = [vertices[face[0].idx * 3 + 0], vertices[face[0].idx * 3 + 1], vertices[face[0].idx * 3 + 2]];
                    vB = [vertices[face[1].idx * 3 + 0], vertices[face[1].idx * 3 + 1], vertices[face[1].idx * 3 + 2]];
                    vC = [vertices[face[2].idx * 3 + 0], vertices[face[2].idx * 3 + 1], vertices[face[2].idx * 3 + 2]];
                    vD = [vertices[face[3].idx * 3 + 0], vertices[face[3].idx * 3 + 1], vertices[face[3].idx * 3 + 2]];
                    // abd
                    db = [vD[0] - vB[0], vD[1] - vB[1], vD[2] - vB[2]];
                    ab = [vA[0] - vB[0], vA[1] - vB[1], vA[2] - vB[2]];
                    cross = [
                        db[1] * ab[2] - db[2] * ab[1],
                        db[2] * ab[0] - db[0] * ab[2],
                        db[0] * ab[1] - db[1] * ab[0]
                    ];
                    normals[face[0].idx * 3 + 0] += cross[0];
                    normals[face[0].idx * 3 + 1] += cross[1];
                    normals[face[0].idx * 3 + 2] += cross[2];
                    normals[face[1].idx * 3 + 0] += cross[0];
                    normals[face[1].idx * 3 + 1] += cross[1];
                    normals[face[1].idx * 3 + 2] += cross[2];
                    normals[face[3].idx * 3 + 0] += cross[0];
                    normals[face[3].idx * 3 + 1] += cross[1];
                    normals[face[3].idx * 3 + 2] += cross[2];
                    // bcd
                    dc = [vD[0] - vC[0], vD[1] - vC[1], vD[2] - vC[2]];
                    bc = [vB[0] - vC[0], vB[1] - vC[1], vB[2] - vC[2]];
                    cross = [
                        dc[1] * bc[2] - dc[2] * bc[1],
                        dc[2] * bc[0] - dc[0] * bc[2],
                        dc[0] * bc[1] - dc[1] * bc[0]
                    ];
                    normals[face[1].idx * 3 + 0] += cross[0];
                    normals[face[1].idx * 3 + 1] += cross[1];
                    normals[face[1].idx * 3 + 2] += cross[2];
                    normals[face[2].idx * 3 + 0] += cross[0];
                    normals[face[2].idx * 3 + 1] += cross[1];
                    normals[face[2].idx * 3 + 2] += cross[2];
                    normals[face[3].idx * 3 + 0] += cross[0];
                    normals[face[3].idx * 3 + 1] += cross[1];
                    normals[face[3].idx * 3 + 2] += cross[2];
                }
            }
            for (var n = 0; n < normals.length / 3; ++n) {
                var x = normals[n * 3 + 0], y = normals[n * 3 + 1], z = normals[n * 3 + 2];
                var nrm = Math.sqrt(x * x + y * y + z * z);
                if (x == 0 && y == 0 && z == 0) {
                    x = 0;
                    y = 1;
                    z = 0;
                    nrm = 1;
                } // it's possible some vertices are not used in the object, so normal==0 at this point - put a (fake) valid normal
                normals[n * 3 + 0] = x / nrm;
                normals[n * 3 + 1] = y / nrm;
                normals[n * 3 + 2] = z / nrm;
            }
        }
    };
    LevelConverter.prototype.weldSkinJoints = function (mainSkinId, jointSkinId, reverse, parentCheck) {
        if (reverse === void 0) { reverse = false; }
        if (parentCheck === void 0) { parentCheck = true; }
        var joints = this.helper.getGeometryFromId('moveable' + jointSkinId).data, jointsVertices = joints.vertices, main = this.helper.getGeometryFromId('moveable' + mainSkinId).data, mainVertices = main.vertices;
        var bones = this.sc.data.objects['moveable' + mainSkinId].bonesStartingPos, numBones = bones.length, posStack = [];
        for (var j = 0; j < numBones; ++j) {
            var bone = bones[j], pos = bone.pos_init.slice(0);
            if (bone.parent >= 0) {
                pos[0] += posStack[bone.parent][0];
                pos[1] += posStack[bone.parent][1];
                pos[2] += posStack[bone.parent][2];
            }
            posStack.push(pos);
        }
        function findVertex(x, y, z, b1, b2) {
            var v = reverse ? mainVertices.length / 3 - 1 : 0, vmax = reverse ? 0 : mainVertices.length / 3 - 1, step = reverse ? -1 : 1;
            while (v != vmax) {
                var bidx = main.skinIndices[v * 2 + 0];
                if (!parentCheck || bidx == b1 || bidx == b2) {
                    var boneTrans = posStack[bidx], dx = mainVertices[v * 3 + 0] + boneTrans[0] - x, dy = mainVertices[v * 3 + 1] + boneTrans[1] - y, dz = mainVertices[v * 3 + 2] + boneTrans[2] - z, dist = dx * dx + dy * dy + dz * dz;
                    if (dist < 24) {
                        return v;
                    }
                }
                v += step;
            }
            return -1;
        }
        for (var i = 0; i < jointsVertices.length / 3; ++i) {
            var boneIdx = joints.skinIndices[i * 2 + 0], boneParentIdx = boneIdx > 0 ? bones[boneIdx].parent : boneIdx, jointTrans = posStack[boneIdx], x = jointsVertices[i * 3 + 0] + jointTrans[0], y = jointsVertices[i * 3 + 1] + jointTrans[1], z = jointsVertices[i * 3 + 2] + jointTrans[2];
            var idx = findVertex(x, y, z, boneIdx, boneParentIdx);
            if (idx >= 0) {
                jointsVertices[i * 3 + 0] = mainVertices[idx * 3 + 0];
                jointsVertices[i * 3 + 1] = mainVertices[idx * 3 + 1];
                jointsVertices[i * 3 + 2] = mainVertices[idx * 3 + 2];
                joints.normals[i * 3 + 0] = main.normals[idx * 3 + 0];
                joints.normals[i * 3 + 1] = main.normals[idx * 3 + 1];
                joints.normals[i * 3 + 2] = main.normals[idx * 3 + 2];
                joints.skinIndices[i * 2 + 0] = main.skinIndices[idx * 2 + 0];
                joints.skinIndices[i * 2 + 1] = main.skinIndices[idx * 2 + 1];
            }
        }
    };
    LevelConverter.prototype.makeLaraBraid = function () {
        var braidId = this.confMgr.number('behaviour[name="Ponytail"] > id', true, -1), young = this.confMgr.boolean('behaviour[name="Ponytail"] > young', true, false), fixToHead = this.confMgr.boolean('behaviour[name="Ponytail"] > fixtohead', true, false);
        if (braidId < 0) {
            return;
        }
        var braid = this.helper.getGeometryFromId('moveable' + braidId).data, vertices = braid.vertices, normals = braid.normals;
        function copyCoord(src, dst) {
            vertices[dst * 3 + 0] = vertices[src * 3 + 0];
            vertices[dst * 3 + 1] = vertices[src * 3 + 1];
            vertices[dst * 3 + 2] = vertices[src * 3 + 2];
            normals[dst * 3 + 0] = normals[src * 3 + 0];
            normals[dst * 3 + 1] = normals[src * 3 + 1];
            normals[dst * 3 + 2] = normals[src * 3 + 2];
        }
        if (this.sc.data.trlevel.rversion == 'TR4') {
            if (!young) {
                if (fixToHead) {
                    this.weldSkinJoints(braidId, braidId, true, false);
                    var perms = [
                        [0, 1, 2, 3], [0, 1, 3, 2], [0, 2, 1, 3], [0, 2, 3, 1], [0, 3, 1, 2], [0, 3, 2, 1],
                        [1, 0, 2, 3], [1, 0, 3, 2], [1, 2, 0, 3], [1, 2, 3, 0], [1, 3, 0, 2], [1, 3, 2, 0],
                        [2, 0, 1, 3], [2, 0, 3, 1], [2, 1, 0, 3], [2, 1, 3, 0], [2, 3, 0, 1], [2, 3, 1, 0],
                        [3, 0, 1, 2], [3, 0, 2, 1], [3, 1, 0, 2], [3, 1, 2, 0], [3, 2, 0, 1], [3, 2, 1, 0],
                    ];
                    for (var j = 0; j < 4; ++j) {
                        var perm = perms[9];
                        copyCoord(8 + perm[j], 4 + j);
                    }
                    vertices[0 * 3 + 0] -= 6;
                    vertices[0 * 3 + 1] -= 13;
                    vertices[0 * 3 + 2] -= 40;
                    vertices[1 * 3 + 0] -= 6;
                    vertices[1 * 3 + 1] -= 13;
                    vertices[1 * 3 + 2] -= 17;
                    vertices[2 * 3 + 0] -= 1;
                    vertices[2 * 3 + 1] -= 10;
                    vertices[2 * 3 + 2] -= 18;
                    vertices[3 * 3 + 0] += 2;
                    vertices[3 * 3 + 1] -= 8;
                    vertices[3 * 3 + 2] -= 42;
                }
                else {
                    this.weldSkinJoints(braidId, braidId);
                    vertices[0 * 3 + 0] -= 5;
                    vertices[1 * 3 + 0] -= 5;
                    vertices[2 * 3 + 0] += 5;
                    vertices[3 * 3 + 0] += 5;
                }
            }
            else {
                this.weldSkinJoints(braidId, braidId);
            }
        }
        else {
            this.weldSkinJoints(braidId, braidId);
        }
    };
    LevelConverter.prototype.makeSkinnedLara = function () {
        var laraID = 0;
        this.weldSkinJoints(laraID, _Constants__WEBPACK_IMPORTED_MODULE_0__["ObjectID"].LaraJoints);
        var joints = this.helper.getGeometryFromId('moveable' + _Constants__WEBPACK_IMPORTED_MODULE_0__["ObjectID"].LaraJoints).data, main = this.helper.getGeometryFromId('moveable' + laraID).data, mainVertices = main.vertices;
        var numMatInMain = 0;
        for (var f = 0; f < main.faces.length; ++f) {
            var face = main.faces[f];
            numMatInMain = Math.max(numMatInMain, face.matIndex + 1);
        }
        var faces = joints.faces;
        for (var f = 0; f < faces.length; ++f) {
            var face = faces[f];
            face.matIndex += this.sc.data.trlevel.atlas.make ? 0 : numMatInMain;
            for (var v = 0; v < face.length; ++v) {
                face[v].idx += mainVertices.length / 3;
            }
        }
        main._flags = main._flags.concat(joints._flags);
        main.colors = main.colors.concat(joints.colors);
        main.faces = main.faces.concat(joints.faces);
        main.normals = main.normals.concat(joints.normals);
        main.skinIndices = main.skinIndices.concat(joints.skinIndices);
        main.skinWeights = main.skinWeights.concat(joints.skinWeights);
        main.vertices = main.vertices.concat(joints.vertices);
        var laraObject = this.helper.getObjectFromId('moveable' + laraID);
        var laraJointObject = this.helper.getObjectFromId('moveable' + _Constants__WEBPACK_IMPORTED_MODULE_0__["ObjectID"].LaraJoints);
        if (!this.sc.data.trlevel.atlas.make) {
            laraObject.material = laraObject.material.concat(laraJointObject.material);
        }
        this.sc.geometries.splice(this.sc.geometries.indexOf(this.helper.getGeometryFromId('moveable' + _Constants__WEBPACK_IMPORTED_MODULE_0__["ObjectID"].LaraJoints)), 1);
        this.objects.splice(this.objects.indexOf(laraJointObject), 1);
    };
    LevelConverter.prototype.makeGeometryData = function () {
        for (var i = 0; i < this.sc.geometries.length; ++i) {
            var geom = this.sc.geometries[i].data;
            var attributes = geom.attributes, vertices = geom.vertices, normals = geom.normals, colors = attributes.vertColor ? geom.colors : null, _flags = attributes._flags ? geom._flags : null, skinIndices = geom.skinIndices, skinWeights = geom.skinWeights, faces = geom.faces;
            if (skinIndices) {
                geom.attributes['skinIndex'] = {
                    "itemSize": 4,
                    "type": "Float32Array",
                    "array": [],
                    "normalized": false
                };
                geom.attributes['skinWeight'] = {
                    "itemSize": 4,
                    "type": "Float32Array",
                    "array": [],
                    "normalized": false
                };
            }
            var indices = [];
            for (var f = 0; f < faces.length; ++f) {
                var face = faces[f];
                var matIndex = face.matIndex, posIdx = attributes.position.array.length / 3;
                for (var v = 0; v < face.length; ++v) {
                    var vertex = face[v];
                    attributes.position.array.push(vertices[vertex.idx * 3 + 0], vertices[vertex.idx * 3 + 1], vertices[vertex.idx * 3 + 2]);
                    attributes.uv.array.push(vertex.u, vertex.v);
                    attributes.normal.array.push(normals[vertex.idx * 3 + 0], normals[vertex.idx * 3 + 1], normals[vertex.idx * 3 + 2]);
                    if (colors) {
                        attributes.vertColor.array.push(colors[vertex.idx * 3 + 0], colors[vertex.idx * 3 + 1], colors[vertex.idx * 3 + 2]);
                    }
                    if (_flags) {
                        attributes._flags.array.push(_flags[vertex.idx * 4 + 0], _flags[vertex.idx * 4 + 1], _flags[vertex.idx * 4 + 2], _flags[vertex.idx * 4 + 3]);
                    }
                    if (skinIndices) {
                        attributes.skinIndex.array.push(skinIndices[vertex.idx * 2 + 0], skinIndices[vertex.idx * 2 + 1], 0, 0);
                    }
                    if (skinWeights) {
                        attributes.skinWeight.array.push(skinWeights[vertex.idx * 2 + 0], skinWeights[vertex.idx * 2 + 1], 0, 0);
                    }
                }
                var lsti = indices[matIndex];
                if (!lsti) {
                    lsti = [];
                    indices[matIndex] = lsti;
                }
                if (face.length == 3) {
                    lsti.push(posIdx, posIdx + 1, posIdx + 2);
                }
                else {
                    lsti.push(posIdx, posIdx + 1, posIdx + 3);
                    lsti.push(posIdx + 1, posIdx + 2, posIdx + 3);
                }
            }
            geom.groups = [];
            for (var i_1 = 0, ofst = 0; i_1 < indices.length; ++i_1) {
                var lst = indices[i_1];
                geom.groups.push({ "start": ofst, "count": lst.length, "materialIndex": i_1 });
                ofst += lst.length;
                geom.index.array.push.apply(geom.index.array, lst);
            }
            delete geom.vertices;
            delete geom.faces;
            delete geom.colors;
            delete geom.normals;
            delete geom._flags;
            delete geom.skinIndices;
            delete geom.skinWeights;
        }
    };
    LevelConverter.prototype.convert = function (trlevel) {
        glMatrix.glMatrix.setMatrixArrayType(Array);
        this.confMgr = trlevel.confMgr;
        this.sc = {
            "metadata": {
                "version": 4.3,
                "type": "Object"
            },
            "object": {
                "type": "Scene",
                "children": []
            },
            "geometries": [],
            "materials": [],
            "textures": [],
            "images": [],
            "data": {
                "objects": {},
                "trlevel": trlevel
            }
        };
        this.objects = this.sc.object.children;
        this.sc.data.levelFileName = this.sc.data.trlevel.filename;
        this.sc.data.levelShortFileName = this.sc.data.levelFileName;
        this.sc.data.levelShortFileNameNoExt = this.sc.data.levelShortFileName.substring(0, this.sc.data.levelShortFileName.indexOf('.'));
        this.sc.data.waterColor = {
            "in": this.confMgr.globalColor('water > colorin'),
            "out": this.confMgr.globalColor('water > colorout')
        };
        this.sc.data.rversion = this.sc.data.trlevel.rversion;
        this.sc.data.soundPath = "resources/sound/" + this.sc.data.rversion.toLowerCase() + "/";
        this.helper = new _LevelConverterHelper__WEBPACK_IMPORTED_MODULE_2__["default"](this.sc, this.objects);
        this.laraObjectID = this.confMgr.number('lara > id', true, 0);
        var hasUVRotate = this.confMgr.param('behaviour[name="UVRotate"]', true, false);
        if (!hasUVRotate) {
            this.sc.data.trlevel.animatedTexturesUVCount = 0;
        }
        this.movObjID2Index = {};
        for (var m = 0; m < this.sc.data.trlevel.moveables.length; ++m) {
            var moveable = this.sc.data.trlevel.moveables[m];
            this.movObjID2Index[moveable.objectID] = m;
        }
        this.objects.push({
            "uuid": "camera1",
            "type": "PerspectiveCamera",
            "name": "camera1",
            "fov": this.confMgr.float('camera > fov', true, 50),
            "near": this.confMgr.float('camera > neardist', true, 50),
            "far": this.confMgr.float('camera > fardist', true, 10000),
            "position": [0, 0, 0],
            "quaternion": [0, 0, 0, 1]
        });
        this.sc.data.objects['camera1'] = {
            "type": "camera",
            "objectid": 0,
            "roomIndex": -1,
            "visible": false
        };
        // get the number of animations for each moveable
        for (var m = 0; m < this.sc.data.trlevel.moveables.length; ++m) {
            var moveable = this.sc.data.trlevel.moveables[m];
            moveable.numAnimations = this.helper.numAnimationsForMoveable(m);
        }
        this.createTextures();
        this.createAnimatedTextures();
        this.createRooms();
        this.collectLightsExt();
        this.createAllStaticMeshes();
        this.createAllMoveables();
        this.createAllSprites();
        this.createAllSpriteSequences();
        this.createAnimations();
        this.createVertexNormals();
        this.makeLaraBraid();
        if (this.sc.data.trlevel.rversion == 'TR4') {
            this.makeSkinnedLara();
        }
        this.makeGeometryData();
    };
    return LevelConverter;
}());
/* harmony default export */ __webpack_exports__["default"] = (LevelConverter);


/***/ }),

/***/ "../src/Loading/LevelConverterHelper.ts":
/*!**********************************************!*\
  !*** ../src/Loading/LevelConverterHelper.ts ***!
  \**********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Utils_Misc__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Utils/Misc */ "../src/Utils/Misc.ts");

var LevelConverterHelper = /** @class */ (function () {
    function LevelConverterHelper(sc, objects) {
        this.sc = sc;
        this.objects = objects;
    }
    LevelConverterHelper.prototype.createNewGeometryData = function () {
        return {
            "attributes": {
                "position": {
                    "itemSize": 3,
                    "type": "Float32Array",
                    "array": [],
                    "normalized": false
                },
                "normal": {
                    "itemSize": 3,
                    "type": "Float32Array",
                    "array": [],
                    "normalized": false
                },
                "uv": {
                    "itemSize": 2,
                    "type": "Float32Array",
                    "array": [],
                    "normalized": false
                },
                "vertColor": {
                    "itemSize": 3,
                    "type": "Float32Array",
                    "array": [],
                    "normalized": false
                },
                "_flags": {
                    "itemSize": 4,
                    "type": "Float32Array",
                    "array": [],
                    "normalized": false
                }
            },
            "index": {
                "type": "Uint16Array",
                "array": []
            },
            "groups": null,
            "faces": [],
            "vertices": [],
            "colors": [],
            "normals": [],
            "_flags": []
        };
    };
    LevelConverterHelper.prototype.createMaterial = function (objType) {
        var matName = objType;
        var mat = {
            "type": "RawShaderMaterial",
            "name": matName,
            "uniforms": {
                "map": { type: "t", value: "" },
                "mapBump": { type: "t", value: "" },
                "offsetBump": { type: "f4", value: [0.0, 0.0, 0.0, 0.0] },
                "ambientColor": { type: "f3", value: [0.0, 0.0, 0.0] },
                "tintColor": { type: "f3", value: [1.0, 1.0, 1.0] },
                "flickerColor": { type: "f3", value: [1.2, 1.2, 1.2] },
                "curTime": { type: "f", value: 0.0 },
                "rnd": { type: "f", value: 0.0 },
                "offsetRepeat": { type: "f4", value: [0.0, 0.0, 1.0, 1.0] },
                "useFog": { type: "i", value: 0 },
                "lighting": { type: "f3", value: [0, 0, 0] },
                "camPosition": { type: "f3", value: [0, 0, 0] }
            },
            "vertexShader": "TR_" + objType,
            "fragmentShader": "TR_standard",
            "userData": {}
        };
        return mat;
    };
    LevelConverterHelper.prototype.getBoundingBox = function (vertices) {
        var xmin = 1e20, ymin = 1e20, zmin = 1e20, xmax = -1e20, ymax = -1e20, zmax = -1e20;
        for (var i = 0; i < vertices.length; ++i) {
            var vertex = vertices[i].vertex;
            if (xmin > vertex.x) {
                xmin = vertex.x;
            }
            if (xmax < vertex.x) {
                xmax = vertex.x;
            }
            if (ymin > vertex.y) {
                ymin = vertex.y;
            }
            if (ymax < vertex.y) {
                ymax = vertex.y;
            }
            if (zmin > vertex.z) {
                zmin = vertex.z;
            }
            if (zmax < vertex.z) {
                zmax = vertex.z;
            }
        }
        return [xmin, xmax, ymin, ymax, zmin, zmax];
    };
    LevelConverterHelper.prototype.processRoomVertex = function (rvertex, isFilledWithWater) {
        var vertex = rvertex.vertex, attribute = rvertex.attributes;
        var lighting = 0;
        switch (this.sc.data.trlevel.rversion) {
            case 'TR1': {
                lighting = Math.floor((1.0 - rvertex.lighting1 / 8192.) * 2 * 256);
                if (lighting > 255) {
                    lighting = 255;
                }
                var r = lighting, g = lighting, b = lighting;
                lighting = b + (g << 8) + (r << 16);
                break;
            }
            case 'TR2': {
                lighting = Math.floor((1.0 - rvertex.lighting2 / 8192.) * 2 * 256);
                if (lighting > 255) {
                    lighting = 255;
                }
                var r = lighting, g = lighting, b = lighting;
                lighting = b + (g << 8) + (r << 16);
                break;
            }
            case 'TR3': {
                lighting = rvertex.lighting2;
                var r = (lighting & 0x7C00) >> 10, g = (lighting & 0x03E0) >> 5, b = (lighting & 0x001F);
                lighting = ((b << 3) + 0x000007) + ((g << 11) + 0x000700) + ((r << 19) + 0x070000);
                break;
            }
            case 'TR4': {
                lighting = rvertex.lighting2;
                var r = (((lighting & 0x7C00) >> 7) + 7) << 1, g = (((lighting & 0x03E0) >> 2) + 7) << 1, b = (((lighting & 0x001F) << 3) + 7) << 1;
                if (r > 255) {
                    r = 255;
                }
                if (g > 255) {
                    g = 255;
                }
                if (b > 255) {
                    b = 255;
                }
                lighting = b + (g << 8) + (r << 16);
                break;
            }
        }
        var moveLight = (attribute & 0x4000) ? 1 : 0, moveVertex = (attribute & 0x2000) ? 1 : 0, strengthEffect = ((attribute & 0x1E) - 16) / 16;
        if (moveVertex) {
            moveLight = 1;
        }
        if ((this.sc.data.trlevel.rversion == 'TR1' || this.sc.data.trlevel.rversion == 'TR2') && isFilledWithWater) {
            moveLight = 1;
        }
        if (isFilledWithWater && (attribute & 0x8000) == 0) {
            moveVertex = 1;
        }
        return {
            x: vertex.x, y: -vertex.y, z: -vertex.z,
            flag: [moveLight, 0, moveVertex, -strengthEffect],
            color: lighting,
            color2: [((lighting & 0xFF0000) >> 16) / 255.0, ((lighting & 0xFF00) >> 8) / 255.0, (lighting & 0xFF) / 255.0]
        };
    };
    LevelConverterHelper.prototype.makeFace = function (obj, oface, tiles2material, tex, mapObjTexture2AnimTexture, fidx, ofstvert) {
        var vertices = oface.vertices, texture = oface.texture & 0x7FFF, tile = tex.tile & 0x7FFF, origTile = tex.origTile;
        if (origTile == undefined) {
            origTile = tile;
        }
        var minU = 1, minV = 1, maxV = 0;
        for (var tv = 0; tv < vertices.length; ++tv) {
            var u = (tex.vertices[fidx(tv)].Xpixel + 0.5) / this.sc.data.trlevel.atlas.width, v = (tex.vertices[fidx(tv)].Ypixel + 0.5) / this.sc.data.trlevel.atlas.height;
            if (minU > u) {
                minU = u;
            }
            if (minV > v) {
                minV = v;
            }
            if (maxV < v) {
                maxV = v;
            }
        }
        // material
        var imat, alpha = (tex.attributes & 2 || oface.effects & 1) ? 'alpha' : '';
        if (mapObjTexture2AnimTexture && mapObjTexture2AnimTexture[texture]) {
            var animTexture = mapObjTexture2AnimTexture[texture], matName = 'anmtext' + alpha + '_' + animTexture.idxAnimatedTexture + '_' + animTexture.pos;
            imat = tiles2material[matName];
            if (typeof (imat) == 'undefined') {
                imat = _Utils_Misc__WEBPACK_IMPORTED_MODULE_0__["default"].objSize(tiles2material);
                tiles2material[matName] = { imat: imat, tile: tile, minU: minU, minV: minV, origTile: origTile };
            }
            else {
                imat = imat.imat;
            }
        }
        else if (alpha) {
            imat = tiles2material['alpha' + tile];
            if (typeof (imat) == 'undefined') {
                imat = _Utils_Misc__WEBPACK_IMPORTED_MODULE_0__["default"].objSize(tiles2material);
                tiles2material['alpha' + tile] = { imat: imat, tile: tile, minU: minU, minV: minV, origTile: origTile };
            }
            else {
                imat = imat.imat;
            }
        }
        else if (origTile >= this.sc.data.trlevel.numRoomTextiles + this.sc.data.trlevel.numObjTextiles) {
            imat = tiles2material['bump' + origTile];
            if (typeof (imat) == 'undefined') {
                imat = _Utils_Misc__WEBPACK_IMPORTED_MODULE_0__["default"].objSize(tiles2material);
                tiles2material['bump' + origTile] = { imat: imat, tile: tile, minU: minU, minV: minV, origTile: origTile };
            }
            else {
                imat = imat.imat;
            }
        }
        else {
            imat = tiles2material[tile];
            if (typeof (imat) == 'undefined') {
                imat = _Utils_Misc__WEBPACK_IMPORTED_MODULE_0__["default"].objSize(tiles2material);
                tiles2material[tile] = { imat: imat, tile: tile, minU: minU, minV: minV, origTile: origTile };
            }
            else {
                imat = imat.imat;
            }
        }
        var face = [];
        for (var tv = 0; tv < vertices.length; ++tv) {
            var u = (tex.vertices[fidx(tv)].Xpixel + 0.5) / this.sc.data.trlevel.atlas.width, v = (tex.vertices[fidx(tv)].Ypixel + 0.5) / this.sc.data.trlevel.atlas.height;
            if (obj.objHasScrollAnim && v == maxV) {
                v = minV + (maxV - minV) / 2;
            }
            face.push({ "u": u, "v": v, "idx": vertices[fidx(tv)] + ofstvert });
        }
        face.matIndex = imat;
        obj.faces.push(face);
    };
    LevelConverterHelper.prototype.makeFaces = function (obj, facearrays, tiles2material, objectTextures, mapObjTexture2AnimTexture, ofstvert) {
        if (ofstvert === void 0) { ofstvert = 0; }
        for (var a = 0; a < facearrays.length; ++a) {
            var lstface = facearrays[a];
            var _loop_1 = function (i) {
                var o = lstface[i], twoSided = (o.texture & 0x8000) != 0, tex = objectTextures[o.texture & 0x7FFF];
                this_1.makeFace(obj, o, tiles2material, tex, mapObjTexture2AnimTexture, function (idx) { return o.vertices.length - 1 - idx; }, ofstvert);
                if (twoSided) {
                    this_1.makeFace(obj, o, tiles2material, tex, mapObjTexture2AnimTexture, function (idx) { return idx; }, ofstvert);
                }
            };
            var this_1 = this;
            for (var i = 0; i < lstface.length; ++i) {
                _loop_1(i);
            }
        }
    };
    LevelConverterHelper.prototype.makeMeshGeometry = function (mesh, meshJSON, tiles2material, objectTextures, mapObjTexture2AnimTexture, skinidx) {
        if (skinidx === void 0) { skinidx = undefined; }
        var internallyLit = mesh.lights.length > 0;
        var ofstvert = meshJSON.vertices.length / 3;
        // push the vertices + vertex colors of the mesh
        for (var v = 0; v < mesh.vertices.length; ++v) {
            var vertex = mesh.vertices[v], lighting = internallyLit ? 1.0 - mesh.lights[v] / 8192.0 : 1.0;
            meshJSON.vertices.push(vertex.x, -vertex.y, -vertex.z);
            meshJSON.colors.push(lighting, lighting, lighting); // not used => a specific calculation is done in the vertex shader
            // with the constant lighting for the mesh + the lighting at each vertex (passed to the shader via flags.w)
            meshJSON._flags.push(0, 0, 0, lighting);
            if (skinidx !== undefined) {
                meshJSON.skinIndices.push(skinidx, skinidx);
                meshJSON.skinWeights.push(0.5, 0.5);
            }
        }
        this.makeFaces(meshJSON, [mesh.texturedRectangles, mesh.texturedTriangles], tiles2material, objectTextures, mapObjTexture2AnimTexture, ofstvert);
        return internallyLit;
    };
    LevelConverterHelper.prototype.makeMaterialList = function (tiles2material, matname, id) {
        if (!matname) {
            matname = 'room';
        }
        var lstMat = [];
        for (var tile in tiles2material) {
            var oimat = tiles2material[tile], imat = oimat.imat, origTile = oimat.origTile, isAnimText = tile.substr(0, 7) == 'anmtext', isBump = tile.substr(0, 4) == 'bump';
            var isAlphaText = tile.substr(0, 5) == 'alpha';
            if (isAlphaText) {
                tile = tile.substr(5);
            }
            if (isBump) {
                tile = oimat.tile;
            }
            lstMat[imat] = this.createMaterial(matname);
            lstMat[imat].uuid = id + '-' + imat;
            if (isAnimText) {
                var idxAnimText = parseInt(tile.split('_')[1]), pos = parseInt(tile.split('_')[2]);
                isAlphaText = tile.substr(7, 5) == 'alpha';
                lstMat[imat].uniforms.map.value = "texture" + oimat.tile;
                lstMat[imat].uniforms.mapBump.value = "texture" + oimat.tile;
                lstMat[imat].userData.animatedTexture = {
                    "idxAnimatedTexture": idxAnimText,
                    "pos": pos,
                    "minU": oimat.minU,
                    "minV": oimat.minV
                };
            }
            else {
                lstMat[imat].uniforms.map.value = "texture" + tile;
                lstMat[imat].uniforms.mapBump.value = "texture" + tile;
                if (isBump) {
                    if (this.sc.data.trlevel.atlas.make) {
                        var row0 = Math.floor(origTile / this.sc.data.trlevel.atlas.numColPerRow), col0 = origTile - row0 * this.sc.data.trlevel.atlas.numColPerRow, row = Math.floor((origTile + this.sc.data.trlevel.numBumpTextiles / 2) / this.sc.data.trlevel.atlas.numColPerRow), col = (origTile + this.sc.data.trlevel.numBumpTextiles / 2) - row * this.sc.data.trlevel.atlas.numColPerRow;
                        lstMat[imat].uniforms.mapBump.value = "texture" + tile;
                        lstMat[imat].uniforms.offsetBump.value = [(col - col0) * 256.0 / this.sc.data.trlevel.atlas.width, (row - row0) * 256.0 / this.sc.data.trlevel.atlas.height, 0, 1];
                    }
                    else {
                        lstMat[imat].uniforms.mapBump.value = "texture" + (Math.floor(origTile) + this.sc.data.trlevel.numBumpTextiles / 2);
                    }
                }
            }
            lstMat[imat].transparent = isAlphaText;
        }
        return lstMat;
    };
    LevelConverterHelper.prototype.numAnimationsForMoveable = function (moveableIdx) {
        var curr_moveable = this.sc.data.trlevel.moveables[moveableIdx];
        if (curr_moveable.animation != 0xFFFF) {
            var next_anim_index = this.sc.data.trlevel.animations.length;
            for (var i = moveableIdx + 1; i < this.sc.data.trlevel.moveables.length; ++i) {
                if (this.sc.data.trlevel.moveables[i].animation != 0xFFFF) {
                    next_anim_index = this.sc.data.trlevel.moveables[i].animation;
                    break;
                }
            }
            return next_anim_index - curr_moveable.animation;
        }
        return 0;
    };
    LevelConverterHelper.prototype.getGeometryFromId = function (id) {
        for (var i = 0; i < this.sc.geometries.length; ++i) {
            var geom = this.sc.geometries[i];
            if (geom.uuid == id) {
                return geom;
            }
        }
        return null;
    };
    LevelConverterHelper.prototype.getObjectFromId = function (id) {
        for (var i = 0; i < this.objects.length; ++i) {
            var obj = this.objects[i];
            if (obj.uuid == id) {
                return obj;
            }
        }
        return null;
    };
    return LevelConverterHelper;
}());
/* harmony default export */ __webpack_exports__["default"] = (LevelConverterHelper);


/***/ }),

/***/ "../src/Loading/LevelDescription/TR1.ts":
/*!**********************************************!*\
  !*** ../src/Loading/LevelDescription/TR1.ts ***!
  \**********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
var descr = {
    part1: [
        'version', 'uint32',
        'numTextiles', 'uint32',
        'textile8', ['', ['', 'uint8', 256 * 256], 'numTextiles'],
        'unused1', 'uint32',
        'numRooms', 'uint16',
        'rooms', ['', [
                'info', ['x', 'int32', 'z', 'int32', 'yBottom', 'int32', 'yTop', 'int32'],
                'numData', 'uint32',
                'roomData', [
                    'numVertices', 'uint16',
                    'vertices', ['', [
                            'vertex', ['x', 'int16', 'y', 'int16', 'z', 'int16'],
                            'lighting1', 'uint16'
                        ], 'numVertices'],
                    'numRectangles', 'uint16',
                    'rectangles', ['', [
                            'vertices', ['', 'uint16', 4],
                            'texture', 'uint16'
                        ], 'numRectangles'],
                    'numTriangles', 'uint16',
                    'triangles', ['', [
                            'vertices', ['', 'uint16', 3],
                            'texture', 'uint16'
                        ], 'numTriangles'],
                    'numSprites', 'uint16',
                    'sprites', ['', [
                            'vertex', 'int16',
                            'texture', 'uint16'
                        ], 'numSprites']
                ],
                'numPortals', 'uint16',
                'portals', ['', [
                        'adjoiningRoom', 'uint16',
                        'normal', ['x', 'int16', 'y', 'int16', 'z', 'int16'],
                        'vertices', ['', ['x', 'int16', 'y', 'int16', 'z', 'int16'], 4]
                    ], 'numPortals'],
                'numZsectors', 'uint16',
                'numXsectors', 'uint16',
                'sectorList', ['', [
                        'FDindex', 'uint16',
                        'boxIndex', 'uint16',
                        'roomBelow', 'uint8',
                        'floor', 'int8',
                        'roomAbove', 'uint8',
                        'ceiling', 'int8'
                    ], function (struct, dataStream, type) { return struct.numZsectors * struct.numXsectors; }],
                'ambientIntensity1', 'int16',
                'numLights', 'uint16',
                'lights', ['', [
                        'x', 'int32',
                        'y', 'int32',
                        'z', 'int32',
                        'intensity1', 'uint16',
                        'fade1', 'uint32'
                    ], 'numLights'],
                'numStaticMeshes', 'uint16',
                'staticMeshes', ['', [
                        'x', 'int32',
                        'y', 'int32',
                        'z', 'int32',
                        'rotation', 'uint16',
                        'intensity1', 'uint16',
                        'objectID', 'uint16'
                    ], 'numStaticMeshes'],
                'alternateRoom', 'int16',
                'flags', 'int16'
            ], 'numRooms'],
        'numFloorData', 'uint32',
        'floorData', ['', 'uint16', 'numFloorData'],
        'numMeshData', 'uint32'
    ],
    part2: [
        'center', ['x', 'int16', 'y', 'int16', 'z', 'int16'],
        'collisionSize', 'int32',
        'numVertices', 'int16',
        'vertices', ['', ['x', 'int16', 'y', 'int16', 'z', 'int16'], 'numVertices'],
        'numNormals', 'int16',
        'normals', ['', ['x', 'int16', 'y', 'int16', 'z', 'int16'], function (struct, dataStream, type) { return struct.numNormals < 0 ? 0 : struct.numNormals; }],
        'lights', ['', 'int16', function (struct, dataStream, type) { return struct.numNormals < 0 ? -struct.numNormals : 0; }],
        'numTexturedRectangles', 'int16',
        'texturedRectangles', ['', [
                'vertices', ['', 'uint16', 4],
                'texture', 'uint16'
            ], 'numTexturedRectangles'],
        'numTexturedTriangles', 'int16',
        'texturedTriangles', ['', [
                'vertices', ['', 'uint16', 3],
                'texture', 'uint16'
            ], 'numTexturedTriangles'],
        'numColouredRectangles', 'int16',
        'colouredRectangles', ['', [
                'vertices', ['', 'uint16', 4],
                'texture', 'uint16'
            ], 'numColouredRectangles'],
        'numColouredTriangles', 'int16',
        'colouredTriangles', ['', [
                'vertices', ['', 'uint16', 3],
                'texture', 'uint16'
            ], 'numColouredTriangles']
    ],
    part3: [
        'numAnimations', 'uint32',
        'animations', ['', [
                'frameOffset', 'uint32',
                'frameRate', 'uint8',
                'frameSize', 'uint8',
                'stateID', 'uint16',
                'speedLo', 'int16',
                'speedHi', 'int16',
                'accelLo', 'uint16',
                'accelHi', 'int16',
                'frameStart', 'uint16',
                'frameEnd', 'uint16',
                'nextAnimation', 'uint16',
                'nextFrame', 'uint16',
                'numStateChanges', 'uint16',
                'stateChangeOffset', 'uint16',
                'numAnimCommands', 'uint16',
                'animCommand', 'uint16'
            ], 'numAnimations'],
        'numStateChanges', 'uint32',
        'stateChanges', ['', [
                'stateID', 'uint16',
                'numAnimDispatches', 'uint16',
                'animDispatch', 'uint16'
            ], 'numStateChanges'],
        'numAnimDispatches', 'uint32',
        'animDispatches', ['', [
                'low', 'int16',
                'high', 'int16',
                'nextAnimation', 'int16',
                'nextFrame', 'int16'
            ], 'numAnimDispatches'],
        'numAnimCommands', 'uint32',
        'animCommands', ['', [
                'value', 'int16',
            ], 'numAnimCommands'],
        'numMeshTrees', 'uint32',
        'meshTrees', ['', [
                'coord', 'int32',
            ], 'numMeshTrees'],
        'numFrames', 'uint32',
        'frames', ['', 'int16', 'numFrames'],
        'numMoveables', 'uint32',
        'moveables', ['', [
                'objectID', 'uint32',
                'numMeshes', 'uint16',
                'startingMesh', 'uint16',
                'meshTree', 'uint32',
                'frameOffset', 'uint32',
                'animation', 'uint16'
            ], 'numMoveables'],
        'numStaticMeshes', 'uint32',
        'staticMeshes', ['', [
                'objectID', 'uint32',
                'mesh', 'uint16',
                'boundingBox', ['', ['minx', 'int16', 'maxx', 'int16', 'miny', 'int16', 'maxy', 'int16', 'minz', 'int16', 'maxz', 'int16'], 2],
                'flags', 'uint16'
            ], 'numStaticMeshes'],
        'numObjectTextures', 'uint32',
        'objectTextures', ['', [
                'attributes', 'uint16',
                'tile', 'uint16',
                'vertices', ['', ['Xcoordinate', 'int8', 'Xpixel', 'uint8', 'Ycoordinate', 'int8', 'Ypixel', 'uint8'], 4]
            ], 'numObjectTextures'],
        'numSpriteTextures', 'uint32',
        'spriteTextures', ['', [
                'tile', 'uint16',
                'x', 'uint8',
                'y', 'uint8',
                'width', 'uint16',
                'height', 'uint16',
                'leftSide', 'int16',
                'topSide', 'int16',
                'rightSide', 'int16',
                'bottomSide', 'int16'
            ], 'numSpriteTextures'],
        'numSpriteSequences', 'uint32',
        'spriteSequences', ['', [
                'objectID', 'int32',
                'negativeLength', 'int16',
                'offset', 'int16'
            ], 'numSpriteSequences'],
        /*		'palette', ['', ['r', 'uint8', 'g', 'uint8', 'b', 'uint8'], 256],*/
        'numCameras', 'uint32',
        'cameras', ['', [
                'x', 'int32',
                'y', 'int32',
                'z', 'int32',
                'room', 'int16',
                'unknown', 'uint16'
            ], 'numCameras'],
        'numSoundSources', 'uint32',
        'soundSources', ['', [
                'x', 'int32',
                'y', 'int32',
                'z', 'int32',
                'soundID', 'uint16',
                'flags', 'uint16'
            ], 'numSoundSources'],
        'numBoxes', 'uint32',
        'boxes', ['', [
                'Zmin', 'uint32',
                'Zmax', 'uint32',
                'Xmin', 'uint32',
                'Xmax', 'uint32',
                'trueFloor', 'int16',
                'overlapIndex', 'int16'
            ], 'numBoxes'],
        'numOverlaps', 'uint32',
        'overlaps', ['', 'uint16', 'numOverlaps'],
        'zones', ['', ['id', 'int16', 6], 'numBoxes'],
        'numAnimatedTextures', 'uint32',
        'animatedTextures', ['', 'uint16', 'numAnimatedTextures'],
        'numItems', 'uint32',
        'items', ['', [
                'objectID', 'int16',
                'room', 'int16',
                'x', 'int32',
                'y', 'int32',
                'z', 'int32',
                'angle', 'uint16',
                'intensity1', 'int16',
                'flags', 'uint16'
            ], 'numItems'],
        'lightmap', ['', 'uint8', 32 * 256],
        'palette', ['', ['r', 'uint8', 'g', 'uint8', 'b', 'uint8'], 256],
        'numCinematicFrames', 'uint16',
        'cinematicFrames', ['', [
                'targetX', 'int16',
                'targetY', 'int16',
                'targetZ', 'int16',
                'posX', 'int16',
                'posY', 'int16',
                'posZ', 'int16',
                'fov', 'int16',
                'roll', 'int16'
            ], 'numCinematicFrames'],
        'numDemoData', 'uint16',
        'demoData', ['', 'uint8', 'numDemoData'],
        'soundMap', ['', 'int16', 256],
        'numSoundDetails', 'uint32',
        'soundDetails', ['', [
                'sample', 'int16',
                'volume', 'int16',
                'unknown1', 'int16',
                'unknown2', 'int16'
            ], 'numSoundDetails'],
        'numSamples', 'uint32',
        'samples', ['', 'uint8', 'numSamples'],
        'numSampleIndices', 'uint32',
        'sampleIndices', ['', 'uint32', 'numSampleIndices']
    ]
};
/* harmony default export */ __webpack_exports__["default"] = (descr);


/***/ }),

/***/ "../src/Loading/LevelDescription/TR1Tub.ts":
/*!*************************************************!*\
  !*** ../src/Loading/LevelDescription/TR1Tub.ts ***!
  \*************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
var descr = {
    part1: [
        'version', 'uint32',
        'numTextiles', 'uint32',
        'textile8', ['', ['', 'uint8', 256 * 256], 'numTextiles'],
        'unused1', 'uint32',
        'numRooms', 'uint16',
        'rooms', ['', [
                'info', ['x', 'int32', 'z', 'int32', 'yBottom', 'int32', 'yTop', 'int32'],
                'numData', 'uint32',
                'roomData', [
                    'numVertices', 'uint16',
                    'vertices', ['', [
                            'vertex', ['x', 'int16', 'y', 'int16', 'z', 'int16'],
                            'lighting1', 'uint16'
                        ], 'numVertices'],
                    'numRectangles', 'uint16',
                    'rectangles', ['', [
                            'vertices', ['', 'uint16', 4],
                            'texture', 'uint16'
                        ], 'numRectangles'],
                    'numTriangles', 'uint16',
                    'triangles', ['', [
                            'vertices', ['', 'uint16', 3],
                            'texture', 'uint16'
                        ], 'numTriangles'],
                    'numSprites', 'uint16',
                    'sprites', ['', [
                            'vertex', 'int16',
                            'texture', 'uint16'
                        ], 'numSprites']
                ],
                'numPortals', 'uint16',
                'portals', ['', [
                        'adjoiningRoom', 'uint16',
                        'normal', ['x', 'int16', 'y', 'int16', 'z', 'int16'],
                        'vertices', ['', ['x', 'int16', 'y', 'int16', 'z', 'int16'], 4]
                    ], 'numPortals'],
                'numZsectors', 'uint16',
                'numXsectors', 'uint16',
                'sectorList', ['', [
                        'FDindex', 'uint16',
                        'boxIndex', 'uint16',
                        'roomBelow', 'uint8',
                        'floor', 'int8',
                        'roomAbove', 'uint8',
                        'ceiling', 'int8'
                    ], function (struct, dataStream, type) { return struct.numZsectors * struct.numXsectors; }],
                'ambientIntensity1', 'int16',
                'numLights', 'uint16',
                'lights', ['', [
                        'x', 'int32',
                        'y', 'int32',
                        'z', 'int32',
                        'intensity1', 'uint16',
                        'fade1', 'uint32'
                    ], 'numLights'],
                'numStaticMeshes', 'uint16',
                'staticMeshes', ['', [
                        'x', 'int32',
                        'y', 'int32',
                        'z', 'int32',
                        'rotation', 'uint16',
                        'intensity1', 'uint16',
                        'objectID', 'uint16'
                    ], 'numStaticMeshes'],
                'alternateRoom', 'int16',
                'flags', 'int16'
            ], 'numRooms'],
        'numFloorData', 'uint32',
        'floorData', ['', 'uint16', 'numFloorData'],
        'numMeshData', 'uint32'
    ],
    part2: [
        'center', ['x', 'int16', 'y', 'int16', 'z', 'int16'],
        'collisionSize', 'int32',
        'numVertices', 'int16',
        'vertices', ['', ['x', 'int16', 'y', 'int16', 'z', 'int16'], 'numVertices'],
        'numNormals', 'int16',
        'normals', ['', ['x', 'int16', 'y', 'int16', 'z', 'int16'], function (struct, dataStream, type) { return struct.numNormals < 0 ? 0 : struct.numNormals; }],
        'lights', ['', 'int16', function (struct, dataStream, type) { return struct.numNormals < 0 ? -struct.numNormals : 0; }],
        'numTexturedRectangles', 'int16',
        'texturedRectangles', ['', [
                'vertices', ['', 'uint16', 4],
                'texture', 'uint16'
            ], 'numTexturedRectangles'],
        'numTexturedTriangles', 'int16',
        'texturedTriangles', ['', [
                'vertices', ['', 'uint16', 3],
                'texture', 'uint16'
            ], 'numTexturedTriangles'],
        'numColouredRectangles', 'int16',
        'colouredRectangles', ['', [
                'vertices', ['', 'uint16', 4],
                'texture', 'uint16'
            ], 'numColouredRectangles'],
        'numColouredTriangles', 'int16',
        'colouredTriangles', ['', [
                'vertices', ['', 'uint16', 3],
                'texture', 'uint16'
            ], 'numColouredTriangles']
    ],
    part3: [
        'numAnimations', 'uint32',
        'animations', ['', [
                'frameOffset', 'uint32',
                'frameRate', 'uint8',
                'frameSize', 'uint8',
                'stateID', 'uint16',
                'speedLo', 'int16',
                'speedHi', 'int16',
                'accelLo', 'uint16',
                'accelHi', 'int16',
                'frameStart', 'uint16',
                'frameEnd', 'uint16',
                'nextAnimation', 'uint16',
                'nextFrame', 'uint16',
                'numStateChanges', 'uint16',
                'stateChangeOffset', 'uint16',
                'numAnimCommands', 'uint16',
                'animCommand', 'uint16'
            ], 'numAnimations'],
        'numStateChanges', 'uint32',
        'stateChanges', ['', [
                'stateID', 'uint16',
                'numAnimDispatches', 'uint16',
                'animDispatch', 'uint16'
            ], 'numStateChanges'],
        'numAnimDispatches', 'uint32',
        'animDispatches', ['', [
                'low', 'int16',
                'high', 'int16',
                'nextAnimation', 'int16',
                'nextFrame', 'int16'
            ], 'numAnimDispatches'],
        'numAnimCommands', 'uint32',
        'animCommands', ['', [
                'value', 'int16',
            ], 'numAnimCommands'],
        'numMeshTrees', 'uint32',
        'meshTrees', ['', [
                'coord', 'int32',
            ], 'numMeshTrees'],
        'numFrames', 'uint32',
        'frames', ['', 'int16', 'numFrames'],
        'numMoveables', 'uint32',
        'moveables', ['', [
                'objectID', 'uint32',
                'numMeshes', 'uint16',
                'startingMesh', 'uint16',
                'meshTree', 'uint32',
                'frameOffset', 'uint32',
                'animation', 'uint16'
            ], 'numMoveables'],
        'numStaticMeshes', 'uint32',
        'staticMeshes', ['', [
                'objectID', 'uint32',
                'mesh', 'uint16',
                'boundingBox', ['', ['minx', 'int16', 'maxx', 'int16', 'miny', 'int16', 'maxy', 'int16', 'minz', 'int16', 'maxz', 'int16'], 2],
                'flags', 'uint16'
            ], 'numStaticMeshes'],
        'numObjectTextures', 'uint32',
        'objectTextures', ['', [
                'attributes', 'uint16',
                'tile', 'uint16',
                'vertices', ['', ['Xcoordinate', 'int8', 'Xpixel', 'uint8', 'Ycoordinate', 'int8', 'Ypixel', 'uint8'], 4]
            ], 'numObjectTextures'],
        'numSpriteTextures', 'uint32',
        'spriteTextures', ['', [
                'tile', 'uint16',
                'x', 'uint8',
                'y', 'uint8',
                'width', 'uint16',
                'height', 'uint16',
                'leftSide', 'int16',
                'topSide', 'int16',
                'rightSide', 'int16',
                'bottomSide', 'int16'
            ], 'numSpriteTextures'],
        'numSpriteSequences', 'uint32',
        'spriteSequences', ['', [
                'objectID', 'int32',
                'negativeLength', 'int16',
                'offset', 'int16'
            ], 'numSpriteSequences'],
        'palette', ['', ['r', 'uint8', 'g', 'uint8', 'b', 'uint8'], 256],
        'numCameras', 'uint32',
        'cameras', ['', [
                'x', 'int32',
                'y', 'int32',
                'z', 'int32',
                'room', 'int16',
                'unknown', 'uint16'
            ], 'numCameras'],
        'numSoundSources', 'uint32',
        'soundSources', ['', [
                'x', 'int32',
                'y', 'int32',
                'z', 'int32',
                'soundID', 'uint16',
                'flags', 'uint16'
            ], 'numSoundSources'],
        'numBoxes', 'uint32',
        'boxes', ['', [
                'Zmin', 'uint32',
                'Zmax', 'uint32',
                'Xmin', 'uint32',
                'Xmax', 'uint32',
                'trueFloor', 'int16',
                'overlapIndex', 'int16'
            ], 'numBoxes'],
        'numOverlaps', 'uint32',
        'overlaps', ['', 'uint16', 'numOverlaps'],
        'zones', ['', ['id', 'int16', 6], 'numBoxes'],
        'numAnimatedTextures', 'uint32',
        'animatedTextures', ['', 'uint16', 'numAnimatedTextures'],
        'numItems', 'uint32',
        'items', ['', [
                'objectID', 'int16',
                'room', 'int16',
                'x', 'int32',
                'y', 'int32',
                'z', 'int32',
                'angle', 'uint16',
                'intensity1', 'int16',
                'flags', 'uint16'
            ], 'numItems'],
        'lightmap', ['', 'uint8', 32 * 256],
        'numCinematicFrames', 'uint16',
        'cinematicFrames', ['', [
                'targetX', 'int16',
                'targetY', 'int16',
                'targetZ', 'int16',
                'posX', 'int16',
                'posY', 'int16',
                'posZ', 'int16',
                'fov', 'int16',
                'roll', 'int16'
            ], 'numCinematicFrames'],
        'numDemoData', 'uint16',
        'demoData', ['', 'uint8', 'numDemoData'],
        'soundMap', ['', 'int16', 256],
        'numSoundDetails', 'uint32',
        'soundDetails', ['', [
                'sample', 'int16',
                'volume', 'int16',
                'unknown1', 'int16',
                'unknown2', 'int16'
            ], 'numSoundDetails'],
        'numSamples', 'uint32',
        'samples', ['', 'uint8', 'numSamples'],
        'numSampleIndices', 'uint32',
        'sampleIndices', ['', 'uint32', 'numSampleIndices']
    ]
};
/* harmony default export */ __webpack_exports__["default"] = (descr);


/***/ }),

/***/ "../src/Loading/LevelDescription/TR2.ts":
/*!**********************************************!*\
  !*** ../src/Loading/LevelDescription/TR2.ts ***!
  \**********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
var descr = {
    part1: [
        'version', 'uint32',
        'palette', ['', ['r', 'uint8', 'g', 'uint8', 'b', 'uint8'], 256],
        'palette16', ['', ['r', 'uint8', 'g', 'uint8', 'b', 'uint8', 'u', 'uint8'], 256],
        'numTextiles', 'uint32',
        'textile8', ['', ['', 'uint8', 256 * 256], 'numTextiles'],
        'textile16', ['', ['', 'uint16', 256 * 256], 'numTextiles'],
        'unused1', 'uint32',
        'numRooms', 'uint16',
        'rooms', ['', [
                'info', ['x', 'int32', 'z', 'int32', 'yBottom', 'int32', 'yTop', 'int32'],
                'numData', 'uint32',
                'roomData', [
                    'numVertices', 'uint16',
                    'vertices', ['', [
                            'vertex', ['x', 'int16', 'y', 'int16', 'z', 'int16'],
                            'lighting1', 'uint16',
                            'attributes', 'uint16',
                            'lighting2', 'int16'
                        ], 'numVertices'],
                    'numRectangles', 'uint16',
                    'rectangles', ['', [
                            'vertices', ['', 'uint16', 4],
                            'texture', 'uint16'
                        ], 'numRectangles'],
                    'numTriangles', 'uint16',
                    'triangles', ['', [
                            'vertices', ['', 'uint16', 3],
                            'texture', 'uint16'
                        ], 'numTriangles'],
                    'numSprites', 'uint16',
                    'sprites', ['', [
                            'vertex', 'int16',
                            'texture', 'uint16'
                        ], 'numSprites']
                ],
                'numPortals', 'uint16',
                'portals', ['', [
                        'adjoiningRoom', 'uint16',
                        'normal', ['x', 'int16', 'y', 'int16', 'z', 'int16'],
                        'vertices', ['', ['x', 'int16', 'y', 'int16', 'z', 'int16'], 4]
                    ], 'numPortals'],
                'numZsectors', 'uint16',
                'numXsectors', 'uint16',
                'sectorList', ['', [
                        'FDindex', 'uint16',
                        'boxIndex', 'uint16',
                        'roomBelow', 'uint8',
                        'floor', 'int8',
                        'roomAbove', 'uint8',
                        'ceiling', 'int8'
                    ], function (struct, dataStream, type) { return struct.numZsectors * struct.numXsectors; }],
                'ambientIntensity1', 'int16',
                'ambientIntensity2', 'int16',
                'lightMode', 'int16',
                'numLights', 'uint16',
                'lights', ['', [
                        'x', 'int32',
                        'y', 'int32',
                        'z', 'int32',
                        'intensity1', 'uint16',
                        'intensity2', 'uint16',
                        'fade1', 'uint32',
                        'fade2', 'uint32'
                    ], 'numLights'],
                'numStaticMeshes', 'uint16',
                'staticMeshes', ['', [
                        'x', 'int32',
                        'y', 'int32',
                        'z', 'int32',
                        'rotation', 'uint16',
                        'intensity1', 'uint16',
                        'intensity2', 'uint16',
                        'objectID', 'uint16'
                    ], 'numStaticMeshes'],
                'alternateRoom', 'int16',
                'flags', 'int16'
            ], 'numRooms'],
        'numFloorData', 'uint32',
        'floorData', ['', 'uint16', 'numFloorData'],
        'numMeshData', 'uint32'
    ],
    part2: [
        'center', ['x', 'int16', 'y', 'int16', 'z', 'int16'],
        'collisionSize', 'int32',
        'numVertices', 'int16',
        'vertices', ['', ['x', 'int16', 'y', 'int16', 'z', 'int16'], 'numVertices'],
        'numNormals', 'int16',
        'normals', ['', ['x', 'int16', 'y', 'int16', 'z', 'int16'], function (struct, dataStream, type) { return struct.numNormals < 0 ? 0 : struct.numNormals; }],
        'lights', ['', 'int16', function (struct, dataStream, type) { return struct.numNormals < 0 ? -struct.numNormals : 0; }],
        'numTexturedRectangles', 'int16',
        'texturedRectangles', ['', [
                'vertices', ['', 'uint16', 4],
                'texture', 'uint16'
            ], 'numTexturedRectangles'],
        'numTexturedTriangles', 'int16',
        'texturedTriangles', ['', [
                'vertices', ['', 'uint16', 3],
                'texture', 'uint16'
            ], 'numTexturedTriangles'],
        'numColouredRectangles', 'int16',
        'colouredRectangles', ['', [
                'vertices', ['', 'uint16', 4],
                'texture', 'uint16'
            ], 'numColouredRectangles'],
        'numColouredTriangles', 'int16',
        'colouredTriangles', ['', [
                'vertices', ['', 'uint16', 3],
                'texture', 'uint16'
            ], 'numColouredTriangles']
    ],
    part3: [
        'numAnimations', 'uint32',
        'animations', ['', [
                'frameOffset', 'uint32',
                'frameRate', 'uint8',
                'frameSize', 'uint8',
                'stateID', 'uint16',
                'speedLo', 'int16',
                'speedHi', 'int16',
                'accelLo', 'uint16',
                'accelHi', 'int16',
                'frameStart', 'uint16',
                'frameEnd', 'uint16',
                'nextAnimation', 'uint16',
                'nextFrame', 'uint16',
                'numStateChanges', 'uint16',
                'stateChangeOffset', 'uint16',
                'numAnimCommands', 'uint16',
                'animCommand', 'uint16'
            ], 'numAnimations'],
        'numStateChanges', 'uint32',
        'stateChanges', ['', [
                'stateID', 'uint16',
                'numAnimDispatches', 'uint16',
                'animDispatch', 'uint16'
            ], 'numStateChanges'],
        'numAnimDispatches', 'uint32',
        'animDispatches', ['', [
                'low', 'int16',
                'high', 'int16',
                'nextAnimation', 'int16',
                'nextFrame', 'int16'
            ], 'numAnimDispatches'],
        'numAnimCommands', 'uint32',
        'animCommands', ['', [
                'value', 'int16',
            ], 'numAnimCommands'],
        'numMeshTrees', 'uint32',
        'meshTrees', ['', [
                'coord', 'int32',
            ], 'numMeshTrees'],
        'numFrames', 'uint32',
        'frames', ['', 'int16', 'numFrames'],
        'numMoveables', 'uint32',
        'moveables', ['', [
                'objectID', 'uint32',
                'numMeshes', 'uint16',
                'startingMesh', 'uint16',
                'meshTree', 'uint32',
                'frameOffset', 'uint32',
                'animation', 'uint16'
            ], 'numMoveables'],
        'numStaticMeshes', 'uint32',
        'staticMeshes', ['', [
                'objectID', 'uint32',
                'mesh', 'uint16',
                'boundingBox', ['', ['minx', 'int16', 'maxx', 'int16', 'miny', 'int16', 'maxy', 'int16', 'minz', 'int16', 'maxz', 'int16'], 2],
                'flags', 'uint16'
            ], 'numStaticMeshes'],
        'numObjectTextures', 'uint32',
        'objectTextures', ['', [
                'attributes', 'uint16',
                'tile', 'uint16',
                'vertices', ['', ['Xcoordinate', 'int8', 'Xpixel', 'uint8', 'Ycoordinate', 'int8', 'Ypixel', 'uint8'], 4]
            ], 'numObjectTextures'],
        'numSpriteTextures', 'uint32',
        'spriteTextures', ['', [
                'tile', 'uint16',
                'x', 'uint8',
                'y', 'uint8',
                'width', 'uint16',
                'height', 'uint16',
                'leftSide', 'int16',
                'topSide', 'int16',
                'rightSide', 'int16',
                'bottomSide', 'int16'
            ], 'numSpriteTextures'],
        'numSpriteSequences', 'uint32',
        'spriteSequences', ['', [
                'objectID', 'int32',
                'negativeLength', 'int16',
                'offset', 'int16'
            ], 'numSpriteSequences'],
        'numCameras', 'uint32',
        'cameras', ['', [
                'x', 'int32',
                'y', 'int32',
                'z', 'int32',
                'room', 'int16',
                'unknown', 'uint16'
            ], 'numCameras'],
        'numSoundSources', 'uint32',
        'soundSources', ['', [
                'x', 'int32',
                'y', 'int32',
                'z', 'int32',
                'soundID', 'uint16',
                'flags', 'uint16'
            ], 'numSoundSources'],
        'numBoxes', 'uint32',
        'boxes', ['', [
                'Zmin', 'uint8',
                'Zmax', 'uint8',
                'Xmin', 'uint8',
                'Xmax', 'uint8',
                'trueFloor', 'int16',
                'overlapIndex', 'int16'
            ], 'numBoxes'],
        'numOverlaps', 'uint32',
        'overlaps', ['', 'uint16', 'numOverlaps'],
        'zones', ['', ['id', 'int16', 10], 'numBoxes'],
        'numAnimatedTextures', 'uint32',
        'animatedTextures', ['', 'uint16', 'numAnimatedTextures'],
        'numItems', 'uint32',
        'items', ['', [
                'objectID', 'int16',
                'room', 'int16',
                'x', 'int32',
                'y', 'int32',
                'z', 'int32',
                'angle', 'uint16',
                'intensity1', 'int16',
                'intensity2', 'int16',
                'flags', 'uint16'
            ], 'numItems'],
        'lightmap', ['', 'uint8', 32 * 256],
        'numCinematicFrames', 'uint16',
        'cinematicFrames', ['', [
                'targetX', 'int16',
                'targetY', 'int16',
                'targetZ', 'int16',
                'posX', 'int16',
                'posY', 'int16',
                'posZ', 'int16',
                'fov', 'int16',
                'roll', 'int16'
            ], 'numCinematicFrames'],
        'numDemoData', 'uint16',
        'demoData', ['', 'uint8', 'numDemoData'],
        'soundMap', ['', 'int16', 370],
        'numSoundDetails', 'uint32',
        'soundDetails', ['', [
                'sample', 'int16',
                'volume', 'int16',
                'unknown1', 'int16',
                'unknown2', 'int16'
            ], 'numSoundDetails'],
        'numSampleIndices', 'uint32',
        'sampleIndices', ['', 'uint32', 'numSampleIndices']
    ]
};
/* harmony default export */ __webpack_exports__["default"] = (descr);


/***/ }),

/***/ "../src/Loading/LevelDescription/TR3.ts":
/*!**********************************************!*\
  !*** ../src/Loading/LevelDescription/TR3.ts ***!
  \**********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
var descr = {
    part1: [
        'version', 'uint32',
        'palette', ['', ['r', 'uint8', 'g', 'uint8', 'b', 'uint8'], 256],
        'palette16', ['', ['r', 'uint8', 'g', 'uint8', 'b', 'uint8', 'u', 'uint8'], 256],
        'numTextiles', 'uint32',
        'textile8', ['', ['', 'uint8', 256 * 256], 'numTextiles'],
        'textile16', ['', ['', 'uint16', 256 * 256], 'numTextiles'],
        'unused1', 'uint32',
        'numRooms', 'uint16',
        'rooms', ['', [
                'info', ['x', 'int32', 'z', 'int32', 'yBottom', 'int32', 'yTop', 'int32'],
                'numData', 'uint32',
                'roomData', [
                    'numVertices', 'uint16',
                    'vertices', ['', [
                            'vertex', ['x', 'int16', 'y', 'int16', 'z', 'int16'],
                            'lighting1', 'uint16',
                            'attributes', 'uint16',
                            'lighting2', 'uint16'
                        ], 'numVertices'],
                    'numRectangles', 'uint16',
                    'rectangles', ['', [
                            'vertices', ['', 'uint16', 4],
                            'texture', 'uint16'
                        ], 'numRectangles'],
                    'numTriangles', 'uint16',
                    'triangles', ['', [
                            'vertices', ['', 'uint16', 3],
                            'texture', 'uint16'
                        ], 'numTriangles'],
                    'numSprites', 'uint16',
                    'sprites', ['', [
                            'vertex', 'int16',
                            'texture', 'uint16'
                        ], 'numSprites']
                ],
                'numPortals', 'uint16',
                'portals', ['', [
                        'adjoiningRoom', 'uint16',
                        'normal', ['x', 'int16', 'y', 'int16', 'z', 'int16'],
                        'vertices', ['', ['x', 'int16', 'y', 'int16', 'z', 'int16'], 4]
                    ], 'numPortals'],
                'numZsectors', 'uint16',
                'numXsectors', 'uint16',
                'sectorList', ['', [
                        'FDindex', 'uint16',
                        'boxIndex', 'uint16',
                        'roomBelow', 'uint8',
                        'floor', 'int8',
                        'roomAbove', 'uint8',
                        'ceiling', 'int8'
                    ], function (struct, dataStream, type) { return struct.numZsectors * struct.numXsectors; }],
                'ambientIntensity1', 'int16',
                'ambientIntensity2', 'int16',
                'numLights', 'uint16',
                'lights', ['', [
                        'x', 'int32',
                        'y', 'int32',
                        'z', 'int32',
                        'color', ['r', 'uint8', 'g', 'uint8', 'b', 'uint8', 'u', 'uint8'],
                        'intensity', 'uint32',
                        'fade', 'uint32'
                    ], 'numLights'],
                'numStaticMeshes', 'uint16',
                'staticMeshes', ['', [
                        'x', 'int32',
                        'y', 'int32',
                        'z', 'int32',
                        'rotation', 'uint16',
                        'intensity1', 'uint16',
                        'intensity2', 'uint16',
                        'objectID', 'uint16'
                    ], 'numStaticMeshes'],
                'alternateRoom', 'int16',
                'flags', 'int16',
                'roomColor', ['r', 'uint8', 'g', 'uint8', 'b', 'uint8']
            ], 'numRooms'],
        'numFloorData', 'uint32',
        'floorData', ['', 'uint16', 'numFloorData'],
        'numMeshData', 'uint32'
    ],
    part2: [
        'center', ['x', 'int16', 'y', 'int16', 'z', 'int16'],
        'collisionSize', 'int32',
        'numVertices', 'int16',
        'vertices', ['', ['x', 'int16', 'y', 'int16', 'z', 'int16'], 'numVertices'],
        'numNormals', 'int16',
        'normals', ['', ['x', 'int16', 'y', 'int16', 'z', 'int16'], function (struct, dataStream, type) { return struct.numNormals < 0 ? 0 : struct.numNormals; }],
        'lights', ['', 'int16', function (struct, dataStream, type) { return struct.numNormals < 0 ? -struct.numNormals : 0; }],
        'numTexturedRectangles', 'int16',
        'texturedRectangles', ['', [
                'vertices', ['', 'uint16', 4],
                'texture', 'uint16'
            ], 'numTexturedRectangles'],
        'numTexturedTriangles', 'int16',
        'texturedTriangles', ['', [
                'vertices', ['', 'uint16', 3],
                'texture', 'uint16'
            ], 'numTexturedTriangles'],
        'numColouredRectangles', 'int16',
        'colouredRectangles', ['', [
                'vertices', ['', 'uint16', 4],
                'texture', 'uint16'
            ], 'numColouredRectangles'],
        'numColouredTriangles', 'int16',
        'colouredTriangles', ['', [
                'vertices', ['', 'uint16', 3],
                'texture', 'uint16'
            ], 'numColouredTriangles']
    ],
    part3: [
        'numAnimations', 'uint32',
        'animations', ['', [
                'frameOffset', 'uint32',
                'frameRate', 'uint8',
                'frameSize', 'uint8',
                'stateID', 'uint16',
                'speedLo', 'int16',
                'speedHi', 'int16',
                'accelLo', 'uint16',
                'accelHi', 'int16',
                'frameStart', 'uint16',
                'frameEnd', 'uint16',
                'nextAnimation', 'uint16',
                'nextFrame', 'uint16',
                'numStateChanges', 'uint16',
                'stateChangeOffset', 'uint16',
                'numAnimCommands', 'uint16',
                'animCommand', 'uint16'
            ], 'numAnimations'],
        'numStateChanges', 'uint32',
        'stateChanges', ['', [
                'stateID', 'uint16',
                'numAnimDispatches', 'uint16',
                'animDispatch', 'uint16'
            ], 'numStateChanges'],
        'numAnimDispatches', 'uint32',
        'animDispatches', ['', [
                'low', 'int16',
                'high', 'int16',
                'nextAnimation', 'int16',
                'nextFrame', 'int16'
            ], 'numAnimDispatches'],
        'numAnimCommands', 'uint32',
        'animCommands', ['', [
                'value', 'int16',
            ], 'numAnimCommands'],
        'numMeshTrees', 'uint32',
        'meshTrees', ['', [
                'coord', 'int32',
            ], 'numMeshTrees'],
        'numFrames', 'uint32',
        'frames', ['', 'int16', 'numFrames'],
        'numMoveables', 'uint32',
        'moveables', ['', [
                'objectID', 'uint32',
                'numMeshes', 'uint16',
                'startingMesh', 'uint16',
                'meshTree', 'uint32',
                'frameOffset', 'uint32',
                'animation', 'uint16'
            ], 'numMoveables'],
        'numStaticMeshes', 'uint32',
        'staticMeshes', ['', [
                'objectID', 'uint32',
                'mesh', 'uint16',
                'boundingBox', ['', ['minx', 'int16', 'maxx', 'int16', 'miny', 'int16', 'maxy', 'int16', 'minz', 'int16', 'maxz', 'int16'], 2],
                'flags', 'uint16'
            ], 'numStaticMeshes'],
        'numSpriteTextures', 'uint32',
        'spriteTextures', ['', [
                'tile', 'uint16',
                'x', 'uint8',
                'y', 'uint8',
                'width', 'uint16',
                'height', 'uint16',
                'leftSide', 'int16',
                'topSide', 'int16',
                'rightSide', 'int16',
                'bottomSide', 'int16'
            ], 'numSpriteTextures'],
        'numSpriteSequences', 'uint32',
        'spriteSequences', ['', [
                'objectID', 'int32',
                'negativeLength', 'int16',
                'offset', 'int16'
            ], 'numSpriteSequences'],
        'numCameras', 'uint32',
        'cameras', ['', [
                'x', 'int32',
                'y', 'int32',
                'z', 'int32',
                'room', 'int16',
                'unknown', 'uint16'
            ], 'numCameras'],
        'numSoundSources', 'uint32',
        'soundSources', ['', [
                'x', 'int32',
                'y', 'int32',
                'z', 'int32',
                'soundID', 'uint16',
                'flags', 'uint16'
            ], 'numSoundSources'],
        'numBoxes', 'uint32',
        'boxes', ['', [
                'Zmin', 'uint8',
                'Zmax', 'uint8',
                'Xmin', 'uint8',
                'Xmax', 'uint8',
                'trueFloor', 'int16',
                'overlapIndex', 'int16'
            ], 'numBoxes'],
        'numOverlaps', 'uint32',
        'overlaps', ['', 'uint16', 'numOverlaps'],
        'zones', ['', ['id', 'int16', 10], 'numBoxes'],
        'numAnimatedTextures', 'uint32',
        'animatedTextures', ['', 'uint16', 'numAnimatedTextures'],
        'numObjectTextures', 'uint32',
        'objectTextures', ['', [
                'attributes', 'uint16',
                'tile', 'uint16',
                'vertices', ['', ['Xcoordinate', 'int8', 'Xpixel', 'uint8', 'Ycoordinate', 'int8', 'Ypixel', 'uint8'], 4]
            ], 'numObjectTextures'],
        'numItems', 'uint32',
        'items', ['', [
                'objectID', 'int16',
                'room', 'int16',
                'x', 'int32',
                'y', 'int32',
                'z', 'int32',
                'angle', 'uint16',
                'intensity1', 'int16',
                'intensity2', 'int16',
                'flags', 'uint16'
            ], 'numItems'],
        'lightmap', ['', 'uint8', 32 * 256],
        'numCinematicFrames', 'uint16',
        'cinematicFrames', ['', [
                'targetX', 'int16',
                'targetY', 'int16',
                'targetZ', 'int16',
                'posX', 'int16',
                'posY', 'int16',
                'posZ', 'int16',
                'fov', 'int16',
                'roll', 'int16'
            ], 'numCinematicFrames'],
        'numDemoData', 'uint16',
        'demoData', ['', 'uint8', 'numDemoData'],
        'soundMap', ['', 'int16', 370],
        'numSoundDetails', 'uint32',
        'soundDetails', ['', [
                'sample', 'int16',
                'volume', 'int16',
                'unknown1', 'int16',
                'unknown2', 'int16'
            ], 'numSoundDetails'],
        'numSampleIndices', 'uint32',
        'sampleIndices', ['', 'uint32', 'numSampleIndices']
    ]
};
/* harmony default export */ __webpack_exports__["default"] = (descr);


/***/ }),

/***/ "../src/Loading/LevelDescription/TR4.ts":
/*!**********************************************!*\
  !*** ../src/Loading/LevelDescription/TR4.ts ***!
  \**********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _LevelLoader__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../LevelLoader */ "../src/Loading/LevelLoader.ts");

var descr = {
    part1: [
        'version', 'uint32',
        'numRoomTextiles', 'uint16',
        'numObjTextiles', 'uint16',
        'numBumpTextiles', 'uint16',
        'textile32_uncompSize', 'uint32',
        'textile32_compSize', 'uint32',
        '', function (dataStream, struct) { _LevelLoader__WEBPACK_IMPORTED_MODULE_0__["LevelLoader"].unzip(dataStream, struct, struct.textile32_compSize); return ''; },
        'textile32', ['', ['', 'uint32', 256 * 256], function (struct, dataStream, type) { return struct.numRoomTextiles + struct.numObjTextiles + struct.numBumpTextiles; }],
        'textile16_uncompSize', 'uint32',
        'textile16_compSize', 'uint32',
        '', function (dataStream, struct) { dataStream.position += struct.textile16_compSize; return ''; },
        'textile32misc_uncompSize', 'uint32',
        'textile32misc_compSize', 'uint32',
        '', function (dataStream, struct) { _LevelLoader__WEBPACK_IMPORTED_MODULE_0__["LevelLoader"].unzip(dataStream, struct, struct.textile32misc_compSize); return ''; },
        'textile32misc', ['', ['', 'uint32', 256 * 256], 2],
        'levelData_uncompSize', 'uint32',
        'levelData_compSize', 'uint32',
        '', function (dataStream, struct) { _LevelLoader__WEBPACK_IMPORTED_MODULE_0__["LevelLoader"].unzip(dataStream, struct, struct.levelData_compSize); return ''; },
        'unused', 'uint32',
        'numRooms', 'uint16',
        'rooms', ['', [
                'info', ['x', 'int32', 'z', 'int32', 'yBottom', 'int32', 'yTop', 'int32'],
                'numData', 'uint32',
                'roomData', [
                    'numVertices', 'uint16',
                    'vertices', ['', [
                            'vertex', ['x', 'int16', 'y', 'int16', 'z', 'int16'],
                            'lighting1', 'uint16',
                            'attributes', 'uint16',
                            'lighting2', 'uint16'
                        ], 'numVertices'],
                    'numRectangles', 'uint16',
                    'rectangles', ['', [
                            'vertices', ['', 'uint16', 4],
                            'texture', 'uint16'
                        ], 'numRectangles'],
                    'numTriangles', 'uint16',
                    'triangles', ['', [
                            'vertices', ['', 'uint16', 3],
                            'texture', 'uint16'
                        ], 'numTriangles'],
                    'numSprites', 'uint16',
                    'sprites', ['', [
                            'vertex', 'int16',
                            'texture', 'uint16'
                        ], 'numSprites']
                ],
                'numPortals', 'uint16',
                'portals', ['', [
                        'adjoiningRoom', 'uint16',
                        'normal', ['x', 'int16', 'y', 'int16', 'z', 'int16'],
                        'vertices', ['', ['x', 'int16', 'y', 'int16', 'z', 'int16'], 4]
                    ], 'numPortals'],
                'numZsectors', 'uint16',
                'numXsectors', 'uint16',
                'sectorList', ['', [
                        'FDindex', 'uint16',
                        'boxIndex', 'uint16',
                        'roomBelow', 'uint8',
                        'floor', 'int8',
                        'roomAbove', 'uint8',
                        'ceiling', 'int8'
                    ], function (struct, dataStream, type) { return struct.numZsectors * struct.numXsectors; }],
                'roomColour', 'uint32',
                'numLights', 'uint16',
                'lights', ['', [
                        'x', 'int32',
                        'y', 'int32',
                        'z', 'int32',
                        'color', ['r', 'uint8', 'g', 'uint8', 'b', 'uint8'],
                        'lightType', 'uint8',
                        'filler', 'uint8',
                        'intensity', 'uint8',
                        'in', 'float32',
                        'out', 'float32',
                        'length', 'float32',
                        'cutOff', 'float32',
                        'dx', 'float32',
                        'dy', 'float32',
                        'dz', 'float32'
                    ], 'numLights'],
                'numStaticMeshes', 'uint16',
                'staticMeshes', ['', [
                        'x', 'int32',
                        'y', 'int32',
                        'z', 'int32',
                        'rotation', 'uint16',
                        'intensity1', 'uint16',
                        'intensity2', 'uint16',
                        'objectID', 'uint16'
                    ], 'numStaticMeshes'],
                'alternateRoom', 'int16',
                'flags', 'int16',
                'waterScheme', 'uint8',
                'reverbInfo', 'uint8',
                'alternateGroup', 'uint8'
            ], 'numRooms'],
        'numFloorData', 'uint32',
        'floorData', ['', 'uint16', 'numFloorData'],
        'numMeshData', 'uint32'
    ],
    part2: [
        'center', ['x', 'int16', 'y', 'int16', 'z', 'int16'],
        'collisionSize', 'int32',
        'numVertices', 'int16',
        'vertices', ['', ['x', 'int16', 'y', 'int16', 'z', 'int16'], 'numVertices'],
        'numNormals', 'int16',
        'normals', ['', ['x', 'int16', 'y', 'int16', 'z', 'int16'], function (struct, dataStream, type) { return struct.numNormals < 0 ? 0 : struct.numNormals; }],
        'lights', ['', 'int16', function (struct, dataStream, type) { return struct.numNormals <= 0 ? -struct.numNormals : 0; }],
        'numTexturedRectangles', 'int16',
        'texturedRectangles', ['', [
                'vertices', ['', 'uint16', 4],
                'texture', 'uint16',
                'effects', 'uint16'
            ], 'numTexturedRectangles'],
        'numTexturedTriangles', 'int16',
        'texturedTriangles', ['', [
                'vertices', ['', 'uint16', 3],
                'texture', 'uint16',
                'effects', 'uint16'
            ], 'numTexturedTriangles']
    ],
    part3: [
        'numAnimations', 'uint32',
        'animations', ['', [
                'frameOffset', 'uint32',
                'frameRate', 'uint8',
                'frameSize', 'uint8',
                'stateID', 'uint16',
                'speedLo', 'int16',
                'speedHi', 'int16',
                'accelLo', 'uint16',
                'accelHi', 'int16',
                'speedLateralLo', 'int16',
                'speedLateralHi', 'int16',
                'accelLateralLo', 'uint16',
                'accelLateralHi', 'int16',
                'frameStart', 'uint16',
                'frameEnd', 'uint16',
                'nextAnimation', 'uint16',
                'nextFrame', 'uint16',
                'numStateChanges', 'uint16',
                'stateChangeOffset', 'uint16',
                'numAnimCommands', 'uint16',
                'animCommand', 'uint16'
            ], 'numAnimations'],
        'numStateChanges', 'uint32',
        'stateChanges', ['', [
                'stateID', 'uint16',
                'numAnimDispatches', 'uint16',
                'animDispatch', 'uint16'
            ], 'numStateChanges'],
        'numAnimDispatches', 'uint32',
        'animDispatches', ['', [
                'low', 'int16',
                'high', 'int16',
                'nextAnimation', 'int16',
                'nextFrame', 'int16'
            ], 'numAnimDispatches'],
        'numAnimCommands', 'uint32',
        'animCommands', ['', [
                'value', 'int16',
            ], 'numAnimCommands'],
        'numMeshTrees', 'uint32',
        'meshTrees', ['', [
                'coord', 'int32',
            ], 'numMeshTrees'],
        'numFrames', 'uint32',
        'frames', ['', 'int16', 'numFrames'],
        'numMoveables', 'uint32',
        'moveables', ['', [
                'objectID', 'uint32',
                'numMeshes', 'uint16',
                'startingMesh', 'uint16',
                'meshTree', 'uint32',
                'frameOffset', 'uint32',
                'animation', 'uint16'
            ], 'numMoveables'],
        'numStaticMeshes', 'uint32',
        'staticMeshes', ['', [
                'objectID', 'uint32',
                'mesh', 'uint16',
                'boundingBox', ['', ['minx', 'int16', 'maxx', 'int16', 'miny', 'int16', 'maxy', 'int16', 'minz', 'int16', 'maxz', 'int16'], 2],
                'flags', 'uint16'
            ], 'numStaticMeshes'],
        'spr', ['', 'uint8', 3],
        'numSpriteTextures', 'uint32',
        'spriteTextures', ['', [
                'tile', 'uint16',
                'x', 'uint8',
                'y', 'uint8',
                'width', 'uint16',
                'height', 'uint16',
                'leftSide', 'int16',
                'topSide', 'int16',
                'rightSide', 'int16',
                'bottomSide', 'int16'
            ], 'numSpriteTextures'],
        'numSpriteSequences', 'uint32',
        'spriteSequences', ['', [
                'objectID', 'int32',
                'negativeLength', 'int16',
                'offset', 'int16'
            ], 'numSpriteSequences'],
        'numCameras', 'uint32',
        'cameras', ['', [
                'x', 'int32',
                'y', 'int32',
                'z', 'int32',
                'room', 'int16',
                'flag', 'uint16'
            ], 'numCameras'],
        'numFlybyCameras', 'uint32',
        'flybyCameras', ['', [
                'x', 'int32',
                'y', 'int32',
                'z', 'int32',
                'dx', 'int32',
                'dy', 'int32',
                'dz', 'int32',
                'sequence', 'uint8',
                'index', 'uint8',
                'fov', 'uint16',
                'roll', 'int16',
                'timer', 'uint16',
                'speed', 'uint16',
                'flags', 'uint16',
                'roomID', 'uint32'
            ], 'numFlybyCameras'],
        'numSoundSources', 'uint32',
        'soundSources', ['', [
                'x', 'int32',
                'y', 'int32',
                'z', 'int32',
                'soundID', 'uint16',
                'flags', 'uint16'
            ], 'numSoundSources'],
        'numBoxes', 'uint32',
        'boxes', ['', [
                'Zmin', 'uint8',
                'Zmax', 'uint8',
                'Xmin', 'uint8',
                'Xmax', 'uint8',
                'trueFloor', 'int16',
                'overlapIndex', 'int16'
            ], 'numBoxes'],
        'numOverlaps', 'uint32',
        'overlaps', ['', 'uint16', 'numOverlaps'],
        'zones', ['', ['id', 'int16', 10], 'numBoxes'],
        'numAnimatedTextures', 'uint32',
        'animatedTextures', ['', 'uint16', 'numAnimatedTextures'],
        'animatedTexturesUVCount', 'uint8',
        'tex', ['', 'uint8', 3],
        'numObjectTextures', 'uint32',
        'objectTextures', ['', [
                'attributes', 'uint16',
                'tile', 'uint16',
                'newFlags', 'uint16',
                'vertices', ['', ['Xcoordinate', 'int8', 'Xpixel', 'uint8', 'Ycoordinate', 'int8', 'Ypixel', 'uint8'], 4],
                'originalU', 'uint32',
                'originalV', 'uint32',
                'width', 'uint32',
                'height', 'uint32'
            ], 'numObjectTextures'],
        'numItems', 'uint32',
        'items', ['', [
                'objectID', 'int16',
                'room', 'int16',
                'x', 'int32',
                'y', 'int32',
                'z', 'int32',
                'angle', 'int16',
                'intensity1', 'int16',
                'ocb', 'int16',
                'flags', 'uint16'
            ], 'numItems'],
        'numAIObjects', 'uint32',
        'aiObjects', ['', [
                'typeID', 'uint16',
                'room', 'uint16',
                'x', 'int32',
                'y', 'int32',
                'z', 'int32',
                'ocb', 'int16',
                'flags', 'uint16',
                'angle', 'int32'
            ], 'numAIObjects'],
        'numDemoData', 'uint16',
        'demoData', ['', 'uint8', 'numDemoData'],
        'soundMap', ['', 'int16', 370],
        'numSoundDetails', 'uint32',
        'soundDetails', ['', [
                'sample', 'int16',
                'volume', 'int16',
                'unknown1', 'int16',
                'unknown2', 'int16'
            ], 'numSoundDetails'],
        'numSampleIndices', 'uint32',
        'sampleIndices', ['', 'uint32', 'numSampleIndices']
        // we don't read the sample data
    ]
};
/* harmony default export */ __webpack_exports__["default"] = (descr);


/***/ }),

/***/ "../src/Loading/LevelLoader.ts":
/*!*************************************!*\
  !*** ../src/Loading/LevelLoader.ts ***!
  \*************************************/
/*! exports provided: levelVersion, LevelLoader */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "levelVersion", function() { return levelVersion; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LevelLoader", function() { return LevelLoader; });
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! jquery */ "jquery");
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(jquery__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var pako__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! pako */ "pako");
/* harmony import */ var pako__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(pako__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _Utils_Misc__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Utils/Misc */ "../src/Utils/Misc.ts");
/* harmony import */ var _LevelDescription_TR1__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./LevelDescription/TR1 */ "../src/Loading/LevelDescription/TR1.ts");
/* harmony import */ var _LevelDescription_TR1Tub__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./LevelDescription/TR1Tub */ "../src/Loading/LevelDescription/TR1Tub.ts");
/* harmony import */ var _LevelDescription_TR2__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./LevelDescription/TR2 */ "../src/Loading/LevelDescription/TR2.ts");
/* harmony import */ var _LevelDescription_TR3__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./LevelDescription/TR3 */ "../src/Loading/LevelDescription/TR3.ts");
/* harmony import */ var _LevelDescription_TR4__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./LevelDescription/TR4 */ "../src/Loading/LevelDescription/TR4.ts");








var gameFormatDescr = {
    "TR1": _LevelDescription_TR1__WEBPACK_IMPORTED_MODULE_3__["default"],
    "TR1TUB": _LevelDescription_TR1Tub__WEBPACK_IMPORTED_MODULE_4__["default"],
    "TR2": _LevelDescription_TR2__WEBPACK_IMPORTED_MODULE_5__["default"],
    "TR3": _LevelDescription_TR3__WEBPACK_IMPORTED_MODULE_6__["default"],
    "TR4": _LevelDescription_TR4__WEBPACK_IMPORTED_MODULE_7__["default"],
};
var levelVersion;
(function (levelVersion) {
    levelVersion["TR1"] = "TR1";
    levelVersion["TR2"] = "TR2";
    levelVersion["TR3"] = "TR3";
    levelVersion["TR4"] = "TR4";
})(levelVersion || (levelVersion = {}));
/**
 *  Read the raw level files (meaning the .phd / .tub / .tr2 / ... files)
 *  The result is a JSON tree with all data read
 */
var LevelLoader = /** @class */ (function () {
    function LevelLoader(confMgr) {
        this._level = {};
        this._confMgr = confMgr;
    }
    Object.defineProperty(LevelLoader.prototype, "level", {
        get: function () {
            return this._level;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LevelLoader.prototype, "version", {
        get: function () {
            return this._level.rversion;
        },
        enumerable: true,
        configurable: true
    });
    LevelLoader.prototype.load = function (data, fname, showTiles) {
        if (showTiles === void 0) { showTiles = false; }
        var ds = new DataStream(data);
        ds.endianness = DataStream.LITTLE_ENDIAN;
        var hdr = ds.readStruct([
            'version', 'uint32'
        ]);
        var version = hdr.version;
        var rversion = 'Unknown';
        switch (version) {
            case 0x00000020:
                rversion = 'TR1';
                break;
            case 0x0000002D:
                rversion = 'TR2';
                break;
            case 0xFF080038:
                rversion = 'TR3';
                break;
            case 0xFF180034:
                rversion = 'TR3';
                break;
            case 0xFF180038:
                rversion = 'TR3';
                break;
            case 0x00345254:
                rversion = 'TR4';
                break;
        }
        ds.seek(0);
        var rversionLoader = rversion;
        if (fname.toLowerCase().indexOf('.tub') >= 0) {
            rversionLoader = 'TR1TUB';
        }
        try {
            var out = ds.readStruct(gameFormatDescr[rversionLoader].part1);
            //console.log('first part ok', out);
            var savepos = ds.position;
            ds.position += out.numMeshData * 2;
            out.numMeshPointers = ds.readUint32();
            out.meshPointers = ds.readUint32Array(out.numMeshPointers);
            out.meshes = [];
            var savepos2 = ds.position;
            for (var m = 0; m < out.numMeshPointers; ++m) {
                ds.position = savepos + out.meshPointers[m];
                var mesh = ds.readStruct(gameFormatDescr[rversionLoader].part2);
                out.meshes[m] = mesh;
                out.meshes[m].dummy = out.meshPointers[m] == 0;
                //if (out.meshPointers[m] == 0) { console.log(m, mesh); }
            }
            ds.position = savepos2;
            //console.log('second part ok', out);
            var nextPart = ds.readStruct(gameFormatDescr[rversionLoader].part3);
            //console.log('third part ok', out);
            for (var attr in nextPart) {
                out[attr] = nextPart[attr];
            }
            this._level = out;
        }
        catch (e) {
            console.log('An error occurred while parsing the level! ds.failurePosition=', ds.failurePosition);
            console.log(ds);
            throw e;
        }
        // -------------------
        // --- post processing
        //console.log(this._level.numRoomTextiles, this._level.numObjTextiles, this._level.numBumpTextiles);
        var idx = fname.lastIndexOf('\\'), idx2 = fname.lastIndexOf('/');
        this._level.filename = fname.substring(1 + Math.max(idx, idx2));
        this._level.shortfilename = fname.substring(0, fname.indexOf('.'));
        this._level.rversion = rversion;
        this._level.version = _Utils_Misc__WEBPACK_IMPORTED_MODULE_2__["default"].toHexString32(version);
        this._level.textile = [];
        this._level.animatedTexturesUVCount = this._level.animatedTexturesUVCount || 0;
        this._level.confMgr = this._confMgr;
        this._level.confMgr.trversion = this._level.rversion;
        this._level.confMgr.levelName = this._level.filename.toLowerCase();
        if (this._level.textile32misc != undefined) {
            this._level.textile32 = this._level.textile32.concat(this._level.textile32misc);
            delete this._level.textile32misc;
        }
        var numTotTextiles = 0;
        if (this._level.textile8 && !this._level.textile16) {
            numTotTextiles += this._level.textile8.length;
        }
        if (this._level.textile16) {
            numTotTextiles += this._level.textile16.length;
        }
        if (this._level.textile32) {
            numTotTextiles += this._level.textile32.length;
        }
        this._level.atlas = {
            "width": 256,
            "height": 256,
            "make": true,
            "imageData": null,
            "numColPerRow": 4,
            "curRow": 0,
            "curCol": 0,
        };
        if (this._level.atlas.make) {
            this._level.atlas.width = this._level.atlas.numColPerRow * 256;
            this._level.atlas.height = (Math.floor((numTotTextiles + 1) / this._level.atlas.numColPerRow) + (((numTotTextiles + 1) % this._level.atlas.numColPerRow) == 0 ? 0 : 1)) * 256;
            this._level.atlas.imageData = new ImageData(this._level.atlas.width, this._level.atlas.height);
        }
        // Handle 8-bit textures
        var numTextiles = 0;
        if (this._level.textile8 && !this._level.textile16) {
            for (var t = 0; t < this._level.textile8.length; ++t, ++numTextiles) {
                var imageData = new ImageData(256, 256);
                for (var j = 0; j < 256; ++j) {
                    for (var i = 0; i < 256; ++i) {
                        var pix = this._level.textile8[t][j * 256 + i];
                        var a = pix ? 0xFF : 0x00, r = this._level.palette[pix].r << 2, g = this._level.palette[pix].g << 2, b = this._level.palette[pix].b << 2;
                        imageData.data[j * 256 * 4 + i * 4 + 0] = r;
                        imageData.data[j * 256 * 4 + i * 4 + 1] = g;
                        imageData.data[j * 256 * 4 + i * 4 + 2] = b;
                        imageData.data[j * 256 * 4 + i * 4 + 3] = a;
                        if (this._level.atlas.make) {
                            this._level.atlas.imageData.data[(j + this._level.atlas.curRow * 256) * 4 * this._level.atlas.width + (i + this._level.atlas.curCol * 256) * 4 + 0] = r;
                            this._level.atlas.imageData.data[(j + this._level.atlas.curRow * 256) * 4 * this._level.atlas.width + (i + this._level.atlas.curCol * 256) * 4 + 1] = g;
                            this._level.atlas.imageData.data[(j + this._level.atlas.curRow * 256) * 4 * this._level.atlas.width + (i + this._level.atlas.curCol * 256) * 4 + 2] = b;
                            this._level.atlas.imageData.data[(j + this._level.atlas.curRow * 256) * 4 * this._level.atlas.width + (i + this._level.atlas.curCol * 256) * 4 + 3] = a;
                        }
                    }
                }
                this._level.textile[numTextiles] = _Utils_Misc__WEBPACK_IMPORTED_MODULE_2__["default"].convertToPng(imageData);
                if (showTiles) {
                    var idElem = "tex8_" + t;
                    jquery__WEBPACK_IMPORTED_MODULE_0___default()('body').append('<span id="' + idElem + '">' +
                        '<img alt="' + this._level.shortfilename + '_tile' + numTextiles + '.png" style="border:1px solid red" src="' + this._level.textile[numTextiles] +
                        '"/><span style="position:relative;left:-140px;top:-140px;background-color:white">' + numTextiles + '</span></span>');
                    document.getElementById(idElem).addEventListener("click", _Utils_Misc__WEBPACK_IMPORTED_MODULE_2__["default"].saveData.bind(null, this._level.shortfilename + '_tile' + numTextiles, this._level.textile[numTextiles]), false);
                }
                if (this._level.atlas.make) {
                    this._level.atlas.curCol++;
                    if (this._level.atlas.curCol == this._level.atlas.numColPerRow) {
                        this._level.atlas.curCol = 0;
                        this._level.atlas.curRow++;
                    }
                }
            }
        }
        // Handle 16-bit textures
        if (!this._level.textile16) {
            this._level.textile16 = [];
        }
        var newtile = this.replaceColouredPolys(numTotTextiles);
        if (newtile != null) {
            this._level.textile16.push(newtile);
        }
        for (var t = 0; t < this._level.textile16.length; ++t, ++numTextiles) {
            var imageData = new ImageData(256, 256);
            for (var j = 0; j < 256; ++j) {
                for (var i = 0; i < 256; ++i) {
                    var pix = this._level.textile16[t][j * 256 + i];
                    var a = pix & 0x8000, r = ((pix & 0x7c00) >> 10) << 3, g = ((pix & 0x03e0) >> 5) << 3, b = (pix & 0x001f) << 3;
                    if (a) {
                        a = 0xFF;
                    }
                    imageData.data[j * 256 * 4 + i * 4 + 0] = r;
                    imageData.data[j * 256 * 4 + i * 4 + 1] = g;
                    imageData.data[j * 256 * 4 + i * 4 + 2] = b;
                    imageData.data[j * 256 * 4 + i * 4 + 3] = a;
                    if (this._level.atlas.make) {
                        this._level.atlas.imageData.data[(j + this._level.atlas.curRow * 256) * 4 * this._level.atlas.width + (i + this._level.atlas.curCol * 256) * 4 + 0] = r;
                        this._level.atlas.imageData.data[(j + this._level.atlas.curRow * 256) * 4 * this._level.atlas.width + (i + this._level.atlas.curCol * 256) * 4 + 1] = g;
                        this._level.atlas.imageData.data[(j + this._level.atlas.curRow * 256) * 4 * this._level.atlas.width + (i + this._level.atlas.curCol * 256) * 4 + 2] = b;
                        this._level.atlas.imageData.data[(j + this._level.atlas.curRow * 256) * 4 * this._level.atlas.width + (i + this._level.atlas.curCol * 256) * 4 + 3] = a;
                    }
                }
            }
            this._level.textile[numTextiles] = _Utils_Misc__WEBPACK_IMPORTED_MODULE_2__["default"].convertToPng(imageData);
            if (showTiles) {
                var idElem = "tex16_" + t;
                jquery__WEBPACK_IMPORTED_MODULE_0___default()('body').append('<span id="' + idElem + '">' +
                    '<img alt="' + this._level.shortfilename + '_tile' + numTextiles + '.png" style="border:1px solid red" src="' + this._level.textile[numTextiles] +
                    '"/><span style="position:relative;left:-140px;top:-140px;background-color:white">' + numTextiles + '</span></span>');
                document.getElementById(idElem).addEventListener("click", _Utils_Misc__WEBPACK_IMPORTED_MODULE_2__["default"].saveData.bind(null, this._level.shortfilename + '_tile' + numTextiles, this._level.textile[numTextiles]), false);
            }
            if (this._level.atlas.make) {
                this._level.atlas.curCol++;
                if (this._level.atlas.curCol == this._level.atlas.numColPerRow) {
                    this._level.atlas.curCol = 0;
                    this._level.atlas.curRow++;
                }
            }
        }
        // Handle 32-bit textures
        if (!this._level.textile32) {
            this._level.textile32 = [];
        }
        for (var t = 0; t < this._level.textile32.length; ++t, ++numTextiles) {
            var imageData = new ImageData(256, 256);
            for (var j = 0; j < 256; ++j) {
                for (var i = 0; i < 256; ++i) {
                    var pix = this._level.textile32[t][j * 256 + i];
                    var a = ((pix & 0xff000000) >> 24) & 0xFF, r = (pix & 0x00ff0000) >> 16, g = (pix & 0x0000ff00) >> 8, b = (pix & 0x000000ff);
                    imageData.data[j * 256 * 4 + i * 4] = r;
                    imageData.data[j * 256 * 4 + i * 4 + 1] = g;
                    imageData.data[j * 256 * 4 + i * 4 + 2] = b;
                    imageData.data[j * 256 * 4 + i * 4 + 3] = a;
                    if (this._level.atlas.make) {
                        this._level.atlas.imageData.data[(j + this._level.atlas.curRow * 256) * 4 * this._level.atlas.width + (i + this._level.atlas.curCol * 256) * 4 + 0] = r;
                        this._level.atlas.imageData.data[(j + this._level.atlas.curRow * 256) * 4 * this._level.atlas.width + (i + this._level.atlas.curCol * 256) * 4 + 1] = g;
                        this._level.atlas.imageData.data[(j + this._level.atlas.curRow * 256) * 4 * this._level.atlas.width + (i + this._level.atlas.curCol * 256) * 4 + 2] = b;
                        this._level.atlas.imageData.data[(j + this._level.atlas.curRow * 256) * 4 * this._level.atlas.width + (i + this._level.atlas.curCol * 256) * 4 + 3] = a;
                    }
                }
            }
            this._level.textile[numTextiles] = _Utils_Misc__WEBPACK_IMPORTED_MODULE_2__["default"].convertToPng(imageData);
            if (showTiles) {
                var idElem = "tex32_" + t;
                jquery__WEBPACK_IMPORTED_MODULE_0___default()('body').append('<span id="' + idElem + '">' +
                    '<img alt="' + this._level.shortfilename + '_tile' + numTextiles + '.png" style="border:1px solid red" src="' + this._level.textile[numTextiles] +
                    '"/><span style="position:relative;left:-140px;top:-140px;background-color:white">' + numTextiles + '</span></span>');
                document.getElementById(idElem).addEventListener("click", _Utils_Misc__WEBPACK_IMPORTED_MODULE_2__["default"].saveData.bind(null, this._level.shortfilename + '_tile' + numTextiles, this._level.textile[numTextiles]), false);
            }
            if (this._level.atlas.make) {
                this._level.atlas.curCol++;
                if (this._level.atlas.curCol == this._level.atlas.numColPerRow) {
                    this._level.atlas.curCol = 0;
                    this._level.atlas.curRow++;
                }
            }
        }
        if (rversion != 'TR4') {
            for (var i = 0; i < this._level.objectTextures.length; ++i) {
                var tex = this._level.objectTextures[i], tile = tex.tile & 0x7FFF;
                var isTri = (tex.vertices[3].Xpixel == 0) &&
                    (tex.vertices[3].Ypixel == 0) &&
                    (tex.vertices[3].Xcoordinate == 0) &&
                    (tex.vertices[3].Ycoordinate == 0);
                tex.tile = tile + (isTri ? 0x8000 : 0);
            }
        }
        if (this._level.atlas.make) {
            var dataSky = this._level.textile[this._level.textile.length - 1];
            this._level.textile = [_Utils_Misc__WEBPACK_IMPORTED_MODULE_2__["default"].convertToPng(this._level.atlas.imageData)];
            if (rversion == 'TR4') {
                this._level.textile.push(dataSky);
            } // the sky textile must always be the last of the this._level.textile array
            if (showTiles) {
                jquery__WEBPACK_IMPORTED_MODULE_0___default()(document.body).css('overflow', 'auto');
                jquery__WEBPACK_IMPORTED_MODULE_0___default()('body').append('<span id="atlas">' +
                    '<img title="' + this._level.atlas.width + 'x' + this._level.atlas.height + '" alt="' + this._level.shortfilename + '_atlas.png" style="border:1px solid red" src="' + this._level.textile[0] + '"/></span>');
                document.getElementById("atlas").addEventListener("click", _Utils_Misc__WEBPACK_IMPORTED_MODULE_2__["default"].saveData.bind(null, this._level.shortfilename + '_atlas', this._level.textile[0]), false);
            }
            for (var i = 0; i < this._level.objectTextures.length; ++i) {
                var objText = this._level.objectTextures[i];
                var tile = objText.tile & 0x7FFF, b16 = objText.tile & 0x8000;
                var row = Math.floor(tile / this._level.atlas.numColPerRow), col = tile - row * this._level.atlas.numColPerRow;
                objText.tile = 0 + b16;
                objText.origTile = tile;
                for (var j = 0; j < objText.vertices.length; ++j) {
                    var vert = objText.vertices[j];
                    vert.Xpixel = parseInt(vert.Xpixel) + col * 256;
                    vert.Ypixel = parseInt(vert.Ypixel) + row * 256;
                }
            }
        }
        delete this._level.palette;
        delete this._level.textile8;
        delete this._level.textile16;
        delete this._level.textile32;
        _Utils_Misc__WEBPACK_IMPORTED_MODULE_2__["default"].flatten(this._level, 'rooms.roomData.rectangles.vertices');
        _Utils_Misc__WEBPACK_IMPORTED_MODULE_2__["default"].flatten(this._level, 'rooms.roomData.triangles.vertices');
        _Utils_Misc__WEBPACK_IMPORTED_MODULE_2__["default"].flatten(this._level, 'floorData');
        _Utils_Misc__WEBPACK_IMPORTED_MODULE_2__["default"].flatten(this._level, 'meshPointers');
        _Utils_Misc__WEBPACK_IMPORTED_MODULE_2__["default"].flatten(this._level, 'meshes.lights');
        _Utils_Misc__WEBPACK_IMPORTED_MODULE_2__["default"].flatten(this._level, 'meshes.texturedRectangles.vertices');
        _Utils_Misc__WEBPACK_IMPORTED_MODULE_2__["default"].flatten(this._level, 'meshes.texturedTriangles.vertices');
        _Utils_Misc__WEBPACK_IMPORTED_MODULE_2__["default"].flatten(this._level, 'meshes.colouredRectangles.vertices');
        _Utils_Misc__WEBPACK_IMPORTED_MODULE_2__["default"].flatten(this._level, 'meshes.colouredTriangles.vertices');
        _Utils_Misc__WEBPACK_IMPORTED_MODULE_2__["default"].flatten(this._level, 'frames');
        _Utils_Misc__WEBPACK_IMPORTED_MODULE_2__["default"].flatten(this._level, 'spr');
        _Utils_Misc__WEBPACK_IMPORTED_MODULE_2__["default"].flatten(this._level, 'overlaps');
        _Utils_Misc__WEBPACK_IMPORTED_MODULE_2__["default"].flatten(this._level, 'zones');
        _Utils_Misc__WEBPACK_IMPORTED_MODULE_2__["default"].flatten(this._level, 'animatedTextures');
        _Utils_Misc__WEBPACK_IMPORTED_MODULE_2__["default"].flatten(this._level, 'lightmap');
        _Utils_Misc__WEBPACK_IMPORTED_MODULE_2__["default"].flatten(this._level, 'tex');
        _Utils_Misc__WEBPACK_IMPORTED_MODULE_2__["default"].flatten(this._level, 'demoData');
        _Utils_Misc__WEBPACK_IMPORTED_MODULE_2__["default"].flatten(this._level, 'soundMap');
        _Utils_Misc__WEBPACK_IMPORTED_MODULE_2__["default"].flatten(this._level, 'sampleIndices');
        return ds.position == ds.byteLength;
    };
    LevelLoader.prototype.replaceColouredPolys = function (tile) {
        if (this._level.rversion == 'TR4') {
            return null;
        }
        // Build a new textile from the color palette
        var newTile = new Uint16Array(256 * 256);
        var ofst = 0, lgn = 0;
        for (var c = 0; c < 256; ++c) {
            var color = this.version == 'TR1' ? this._level.palette[c] : this._level.palette16[c];
            if (this.version == 'TR1') {
                color = ((color.r >> 1) << 10) + ((color.g >> 1) << 5) + (color.b >> 1) + 0x8000;
            }
            else {
                color = ((color.r >> 3) << 10) + ((color.g >> 3) << 5) + (color.b >> 3) + 0x8000;
            }
            for (var j = 0; j < 3; ++j) {
                for (var i = 0; i < 3; ++i) {
                    newTile[lgn * 256 + ofst + i + j * 256] = color;
                }
            }
            ofst += 3;
            if (ofst + 3 >= 256) {
                ofst = 0;
                lgn += 3;
            }
        }
        // Build new objectTexture structures for the 256 colors of the palette
        // There are 2 new sets of 256 objectTexture structs: one for tris and one for quads
        var numObjText = this._level.numObjectTextures;
        for (var j = 0; j < 2; ++j) {
            ofst = lgn = 0;
            for (var c = 0; c < 256; ++c) {
                var objText = {
                    "attributes": 0,
                    "tile": tile,
                    "vertices": [
                        { "Xcoordinate": +1, "Xpixel": ofst, "Ycoordinate": +1, "Ypixel": lgn },
                        { "Xcoordinate": -1, "Xpixel": ofst + 2, "Ycoordinate": +1, "Ypixel": lgn },
                        { "Xcoordinate": -1, "Xpixel": ofst + 2, "Ycoordinate": -1, "Ypixel": lgn + 2 },
                        { "Xcoordinate": 0, "Xpixel": 0, "Ycoordinate": 0, "Ypixel": 0 }
                    ]
                };
                if (j == 1) {
                    objText.vertices[3].Xcoordinate = +1;
                    objText.vertices[3].Xpixel = ofst;
                    objText.vertices[3].Ycoordinate = -1;
                    objText.vertices[3].Ypixel = lgn + 2;
                }
                this._level.objectTextures.push(objText);
                numObjText++;
                ofst += 3;
                if (ofst + 3 >= 256) {
                    ofst = 0;
                    lgn += 3;
                }
            }
        }
        var skyRemovePolyStart = this._level.confMgr.number('behaviour[name="Sky"] > removepoly > start', true, 0);
        var skyRemovePolyNum = this._level.confMgr.number('behaviour[name="Sky"] > removepoly > num', true, 0);
        if (skyRemovePolyNum > 0) {
            var skyId = this._level.confMgr.number('behaviour[name="Sky"] > id', true, 0);
            if (skyId) {
                for (var m = 0; m < this._level.moveables.length; ++m) {
                    var moveable = this._level.moveables[m];
                    if (moveable.objectID == skyId) {
                        this._level.meshes[moveable.startingMesh].colouredTriangles.splice(skyRemovePolyStart, skyRemovePolyNum);
                        break;
                    }
                }
            }
        }
        // Process the meshes and replace colored polys by textured ones
        for (var m = 0; m < this._level.meshes.length; ++m) {
            var mesh = this._level.meshes[m];
            // coloured rectangles
            for (var i = 0; i < mesh.colouredRectangles.length; ++i) {
                var poly = mesh.colouredRectangles[i];
                var index = this._level.rversion == levelVersion.TR1 ? poly.texture & 0xFF : poly.texture >> 8;
                poly.texture = numObjText - 256 + index;
                mesh.texturedRectangles.push(poly);
            }
            mesh.colouredRectangles = [];
            mesh.numColouredRectangles = 0;
            // coloured triangles
            for (var i = 0; i < mesh.colouredTriangles.length; ++i) {
                var poly = mesh.colouredTriangles[i];
                var index = this._level.rversion == levelVersion.TR1 ? poly.texture & 0xFF : poly.texture >> 8;
                poly.texture = numObjText - 512 + index;
                mesh.texturedTriangles.push(poly);
            }
            mesh.colouredTriangles = [];
            mesh.numColouredTriangles = 0;
        }
        return newTile;
    };
    LevelLoader.unzip = function (ds, struct, dlength) {
        // unzip chunk of data
        if (dlength == 0) {
            dlength = ds.byteLength - ds.position;
        }
        var arr = new Uint8Array(dlength);
        DataStream.memcpy(arr.buffer, 0, ds.buffer, ds.byteOffset + ds.position, dlength);
        var unzipped = pako__WEBPACK_IMPORTED_MODULE_1___default.a.inflate(arr);
        // recreate a buffer and replace the compressed data with the uncompressed one
        var buf = new Uint8Array(ds.byteLength + unzipped.length - dlength), ofst = 0;
        var src = new Uint8Array(ds.buffer, 0, ds.byteOffset + ds.position);
        buf.set(src, ofst);
        ofst += src.length;
        buf.set(unzipped, ofst);
        ofst += unzipped.length;
        src = new Uint8Array(ds.buffer, ds.byteOffset + ds.position + dlength);
        buf.set(src, ofst);
        ds.buffer = buf.buffer.slice(buf.byteOffset, buf.byteLength + buf.byteOffset);
    };
    return LevelLoader;
}());



/***/ }),

/***/ "../src/Loading/MasterLoader.ts":
/*!**************************************!*\
  !*** ../src/Loading/MasterLoader.ts ***!
  \**************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Proxy_Engine__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Proxy/Engine */ "../src/Proxy/Engine.ts");
/* harmony import */ var _LevelLoader__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./LevelLoader */ "../src/Loading/LevelLoader.ts");
/* harmony import */ var _LevelConverter__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./LevelConverter */ "../src/Loading/LevelConverter.ts");



var MasterLoader = /** @class */ (function () {
    function MasterLoader() {
    }
    /* trlevel is either:
        * a string which is the name of the level to download.
        * a JSON object like { data:XXX, name:YYY } where data are the binary data of the TR level and YYY the filename
     */
    MasterLoader.loadLevel = function (trlevel, confMgr) {
        var loader = new _LevelLoader__WEBPACK_IMPORTED_MODULE_1__["LevelLoader"](confMgr);
        return new Promise(function (resolve, reject) {
            if (typeof (trlevel) != 'string') {
                loader.load(trlevel.data, trlevel.name, trlevel.showTiles);
                resolve(loader.level);
            }
            else {
                fetch(trlevel).then(function (response) {
                    response.arrayBuffer().then(function (blob) {
                        loader.load(blob, trlevel);
                        resolve(loader.level);
                    });
                });
            }
        }).then(function (level) {
            if (trlevel.showTiles) {
                return Promise.resolve(level);
            }
            var converter = new _LevelConverter__WEBPACK_IMPORTED_MODULE_2__["default"]();
            converter.convert(level);
            var shdMgr = _Proxy_Engine__WEBPACK_IMPORTED_MODULE_0__["default"].getShaderMgr();
            shdMgr.setTRLevel(level);
            return _Proxy_Engine__WEBPACK_IMPORTED_MODULE_0__["default"].parseScene(converter.sceneJSON).then(function (scene) {
                MasterLoader._postProcessLevel(converter.sceneJSON, scene);
                return Promise.resolve([converter.sceneJSON, scene]);
            });
        });
    };
    MasterLoader._postProcessLevel = function (sceneJSON, scene) {
        var sceneData = sceneJSON.data, sceneRender = scene;
        sceneData.textures = sceneRender.textures;
        // Set all objects as auto update=false
        // Camera, skies, animated objects will have their matrixAutoUpdate set to true later
        sceneRender.traverse(function (obj) {
            obj.matrixAutoUpdate = false;
        });
        var objToRemoveFromScene = [];
        sceneRender.traverse(function (obj) {
            var data = sceneData.objects[obj.name];
            if (data) {
                if ((data.type == 'moveable' || data.type == 'spriteseq' || data.type == 'sprite' || data.type == 'staticmesh') /*&& data.roomIndex < 0*/) {
                    data.liveObj = obj;
                    objToRemoveFromScene.push(obj);
                }
                if (data.type == "camera") {
                    obj.matrixAutoUpdate = true;
                }
                obj.visible = data.visible;
            }
        });
        objToRemoveFromScene.forEach(function (obj) { return sceneRender.remove(obj); });
    };
    return MasterLoader;
}());
/* harmony default export */ __webpack_exports__["default"] = (MasterLoader);


/***/ }),

/***/ "../src/Main.ts":
/*!**********************!*\
  !*** ../src/Main.ts ***!
  \**********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! jquery */ "jquery");
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(jquery__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _Utils_Browser__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Utils/Browser */ "../src/Utils/Browser.ts");
/* harmony import */ var _Utils_ProgressBar__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Utils/ProgressBar */ "../src/Utils/ProgressBar.ts");
/* harmony import */ var _Loading_MasterLoader__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Loading/MasterLoader */ "../src/Loading/MasterLoader.ts");
/* harmony import */ var _Player_Play__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Player/Play */ "../src/Player/Play.ts");
/* harmony import */ var _ConfigManager__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./ConfigManager */ "../src/ConfigManager.ts");






var showTiles = false;
var relPath = _Utils_Browser__WEBPACK_IMPORTED_MODULE_1__["default"].QueryString.relpath || "";
function setContainerDimensions() {
    if (!showTiles) {
        jquery__WEBPACK_IMPORTED_MODULE_0___default()('#container').width(window.innerWidth);
        jquery__WEBPACK_IMPORTED_MODULE_0___default()('#container').height(window.innerHeight);
    }
}
jquery__WEBPACK_IMPORTED_MODULE_0___default()(window).on('resize', setContainerDimensions);
jquery__WEBPACK_IMPORTED_MODULE_0___default()(window).on('load', setContainerDimensions);
jquery__WEBPACK_IMPORTED_MODULE_0___default()(document).on('keydown', function (event) {
    //console.log(event.which)
    switch (event.which) {
        case 72: // H
            jquery__WEBPACK_IMPORTED_MODULE_0___default()("#help").css('display', jquery__WEBPACK_IMPORTED_MODULE_0___default()('#help').css('display') == 'block' ? 'none' : 'block');
            break;
        case 13: // Enter
            jquery__WEBPACK_IMPORTED_MODULE_0___default()("#panel").css('display', jquery__WEBPACK_IMPORTED_MODULE_0___default()('#panel').css('display') == 'block' ? 'none' : 'block');
            jquery__WEBPACK_IMPORTED_MODULE_0___default()("#stats").css('display', jquery__WEBPACK_IMPORTED_MODULE_0___default()('#stats').css('display') == 'block' ? 'none' : 'block');
            break;
        case 36: // Home
            var qgame = _Utils_Browser__WEBPACK_IMPORTED_MODULE_1__["default"].QueryString.trgame, qengine = _Utils_Browser__WEBPACK_IMPORTED_MODULE_1__["default"].QueryString.engine, prm = '?';
            if (qengine) {
                prm += 'engine=' + qengine;
            }
            if (qgame) {
                prm += '&trgame=' + qgame;
            }
            document.location.href = '/index.html' + prm;
            break;
    }
});
function loadAndPlayLevel(level) {
    var progressbar = new _Utils_ProgressBar__WEBPACK_IMPORTED_MODULE_2__["ProgressBar"](document.getElementById('container'), relPath);
    progressbar.show();
    fetch(relPath + 'resources/level/TRLevels.xml').then(function (response) {
        response.text().then(function (txt) {
            var confMgr = new _ConfigManager__WEBPACK_IMPORTED_MODULE_5__["ConfigManager"](jquery__WEBPACK_IMPORTED_MODULE_0___default.a.parseXML(txt));
            _Loading_MasterLoader__WEBPACK_IMPORTED_MODULE_3__["default"].loadLevel(level, confMgr).then(function (res) {
                if (!showTiles) {
                    var play_1 = new _Player_Play__WEBPACK_IMPORTED_MODULE_4__["default"](document.getElementById('container'));
                    window.play = play_1;
                    jquery__WEBPACK_IMPORTED_MODULE_0___default()("<style type=\"text/css\" media=\"all\">@import \"" + relPath + "resources/css/help.css\";</style>").appendTo(jquery__WEBPACK_IMPORTED_MODULE_0___default()(document.body));
                    fetch(relPath + 'resources/template/help.html').then(function (response) {
                        response.text().then(function (html) {
                            jquery__WEBPACK_IMPORTED_MODULE_0___default()(html).appendTo(document.body);
                        });
                    });
                    if (_Utils_Browser__WEBPACK_IMPORTED_MODULE_1__["default"].QueryString.autostart == '1') {
                        play_1.initialize(res[0], res[1]).then(function () {
                            progressbar.hide();
                            play_1.play();
                        });
                    }
                    else {
                        play_1.initialize(res[0], res[1]).then(function () {
                            if (play_1.gameData.isCutscene) {
                                var idTimer_1 = setInterval(function () {
                                    if (play_1.gameData.sceneRender.allMeshesReady) {
                                        clearInterval(idTimer_1);
                                        progressbar.hide();
                                        play_1.play(true, true);
                                        play_1.play(true, false); // we need a 2nd call to display the particle systems in Babylon...
                                        var bhvCutScene = play_1.gameData.bhvMgr.getBehaviour("CutScene")[0];
                                        bhvCutScene.showController();
                                    }
                                }, 10);
                            }
                            else {
                                progressbar.showStart(function () {
                                    progressbar.hide();
                                    play_1.play();
                                });
                            }
                        });
                    }
                }
                else {
                    progressbar.hide();
                }
            });
        });
    });
}
function handleFileSelect(evt) {
    function readFile(idx) {
        var f = files[idx - 1];
        var freader = new FileReader();
        freader.onload = (function (theFile) {
            return function (e) {
                jquery__WEBPACK_IMPORTED_MODULE_0___default()('#files').css('display', 'none');
                loadAndPlayLevel({
                    "data": e.target.result,
                    "name": theFile.name,
                    "showTiles": showTiles,
                });
            };
        })(f);
        freader.readAsArrayBuffer(f);
    }
    var files = evt.target.files;
    readFile(1);
}
if (_Utils_Browser__WEBPACK_IMPORTED_MODULE_1__["default"].QueryString.level) {
    loadAndPlayLevel(relPath + 'resources/level/' + _Utils_Browser__WEBPACK_IMPORTED_MODULE_1__["default"].QueryString.level);
}
else {
    jquery__WEBPACK_IMPORTED_MODULE_0___default()('body').prepend('<input type="file" id="files" multiple="multiple" _style="display: none" />');
    jquery__WEBPACK_IMPORTED_MODULE_0___default()('#files').css('display', 'block');
    jquery__WEBPACK_IMPORTED_MODULE_0___default()('#files').on('change', handleFileSelect);
}


/***/ }),

/***/ "../src/Player/Basis.ts":
/*!******************************!*\
  !*** ../src/Player/Basis.ts ***!
  \******************************/
/*! exports provided: Basis */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Basis", function() { return Basis; });
var Basis = /** @class */ (function () {
    function Basis(pos, quat) {
        this.pos = pos ? pos : [0, 0, 0];
        this.rot = quat ? quat : [0, 0, 0, 1];
    }
    Basis.prototype.identity = function () {
        this.rot = [0, 0, 0, 1];
        this.pos = [0, 0, 0];
    };
    Basis.prototype.multBasis = function (basis) {
        var q = [0, 0, 0, 1], p = [0, 0, 0];
        glMatrix.quat.mul(q, this.rot, basis.rot);
        glMatrix.vec3.transformQuat(p, basis.pos, this.rot);
        p[0] += this.pos[0];
        p[1] += this.pos[1];
        p[2] += this.pos[2];
        return new Basis(p, q);
    };
    Basis.prototype.mult = function (v) {
        var p = [0, 0, 0];
        glMatrix.vec3.transformQuat(p, v, this.rot);
        p[0] += this.pos[0];
        p[1] += this.pos[1];
        p[2] += this.pos[2];
        return p;
    };
    Basis.prototype.translate = function (v) {
        var p = [0, 0, 0];
        glMatrix.vec3.transformQuat(p, v, this.rot);
        this.pos[0] += p[0];
        this.pos[1] += p[1];
        this.pos[2] += p[2];
    };
    Basis.prototype.rotate = function (q) {
        glMatrix.quat.mul(this.rot, this.rot, q);
    };
    return Basis;
}());



/***/ }),

/***/ "../src/Player/Braid.ts":
/*!******************************!*\
  !*** ../src/Player/Braid.ts ***!
  \******************************/
/*! exports provided: Braid */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Braid", function() { return Braid; });
/* harmony import */ var _Constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Constants */ "../src/Constants.ts");
/* harmony import */ var _Skeleton__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Skeleton */ "../src/Player/Skeleton.ts");
/* harmony import */ var _Basis__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Basis */ "../src/Player/Basis.ts");



var GRAVITY = 6;
var EPS = 1.192092896e-07; // smallest such that 1.0+FLT_EPSILON != 1.0
var __m = glMatrix.mat4.create();
var Braid = /** @class */ (function () {
    function Braid(lara, offset, gameData, fixToHead) {
        if (fixToHead === void 0) { fixToHead = false; }
        window.braid = this;
        this._lara = lara;
        this._offset = offset;
        this._time = 0;
        this._gameData = gameData;
        this._headBasis = null;
        this._curFrame = -1;
        this._fixToHead = fixToHead;
        this._laraSkeleton = this._gameData.sceneData.objects[this._lara.name].skeleton;
        this._laraSkeleton.updateBoneMatrices();
        this._laraStartingMesh = this._gameData.sceneData.objects['moveable' + this._gameData.sceneData.objects[this._lara.name].objectid].startingMesh;
        this._model = this.getModel();
        this._modelSkeleton = this._gameData.sceneData.objects[this._model.name].skeleton;
        var modelJointCount = this._modelSkeleton.bones.length;
        this._jointsCount = modelJointCount + 1;
        this._joints = new Array(this._jointsCount);
        this._basis = new Array(this._jointsCount - 1);
        for (var b = 0; b < this._basis.length; ++b) {
            this._basis[b] = new _Basis__WEBPACK_IMPORTED_MODULE_2__["Basis"]();
        }
        this.reset();
    }
    Object.defineProperty(Braid.prototype, "model", {
        get: function () {
            return this._model;
        },
        enumerable: true,
        configurable: true
    });
    Braid.prototype.reset = function () {
        var basis = this.getBasis(true);
        basis.translate(this._offset);
        for (var i = 0; i < this._jointsCount - 1; i++) {
            var bonePos = this._modelSkeleton.bonesStartingPos[1 + Math.min(i, this._jointsCount - 3)].pos_init;
            this._joints[i] = {
                "posPrev": basis.pos.slice(),
                "pos": basis.pos.slice(),
                "length": -bonePos[2],
            };
            basis.translate([0.0, 0.0, this._joints[i].length]);
        }
        this._joints[this._jointsCount - 1] = {
            "posPrev": basis.pos.slice(),
            "pos": basis.pos.slice(),
            "length": 1.0,
        };
    };
    Braid.prototype.getModel = function () {
        // break the hierarchy between bones so that the matrices are not cumulated: we will calculate the final matrix for each bone ourselves
        var bones = this._gameData.sceneData.objects['moveable' + _Constants__WEBPACK_IMPORTED_MODULE_0__["ObjectID"].LaraBraid].bonesStartingPos;
        bones.forEach(function (b) { return b.parent = -1; });
        // get the model
        var mvb = this._gameData.objMgr.createMoveable(_Constants__WEBPACK_IMPORTED_MODULE_0__["ObjectID"].LaraBraid, this._gameData.sceneData.objects[this._lara.name].roomIndex, undefined, true, false), data = this._gameData.sceneData.objects[mvb.name];
        data.has_anims = false;
        mvb.frustumCulled = false; // faster than regenerating a new bounding box each frame, as the braid will be visible most of the time
        return mvb;
    };
    Braid.prototype.getBasis = function (force) {
        if (force === void 0) { force = false; }
        if (!force && (this._curFrame == this._gameData.curFrame)) {
            return this._headBasis;
        }
        this._headBasis = this._laraSkeleton.getBoneDecomposition(_Skeleton__WEBPACK_IMPORTED_MODULE_1__["BONE"].HEAD, this._lara);
        this._curFrame = this._gameData.curFrame;
        return this._headBasis;
    };
    Braid.prototype.getPos = function (forceCalcBasis) {
        if (forceCalcBasis === void 0) { forceCalcBasis = false; }
        return this.getBasis(forceCalcBasis).mult(this._offset);
    };
    Braid.prototype.integrate = function (deltaTime) {
        var TIMESTEP = deltaTime;
        var ACCEL = 16.0 * GRAVITY * 30.0 * TIMESTEP * TIMESTEP;
        var DAMPING = 1.5;
        DAMPING = 1.0 / (1.0 + DAMPING * TIMESTEP); // Padé approximation
        for (var i = 1; i < this._jointsCount; i++) {
            var j = this._joints[i], delta = [0, 0, 0];
            glMatrix.vec3.sub(delta, j.pos, j.posPrev);
            var deltaLength = glMatrix.vec3.length(delta);
            glMatrix.vec3.normalize(delta, delta);
            glMatrix.vec3.scale(delta, delta, Math.min(deltaLength, 2048.0 * deltaTime) * DAMPING); // speed limit
            glMatrix.vec3.copy(j.posPrev, j.pos);
            glMatrix.vec3.add(j.pos, j.pos, delta);
            j.pos[1] -= ACCEL;
        }
    };
    Braid.prototype.collide = function () {
        var BRAID_RADIUS = 0.0, meshes = this._gameData.trlvl.trlevel.meshes;
        var pos = [0, 0, 0], quat = [0, 0, 0, 0], dir = [0, 0, 0];
        for (var i = 0; i < this._laraSkeleton.bones.length; i++) {
            if (!(_Skeleton__WEBPACK_IMPORTED_MODULE_1__["MASK"].BRAID & (1 << i))) {
                continue;
            }
            var mesh = meshes[i + this._laraStartingMesh], mcenter = [mesh.center.x, -mesh.center.y, -mesh.center.z], mradius = mesh.collisionSize;
            this._laraSkeleton.bones[i].decomposeMatrixWorld(pos, quat);
            var laraBasis = new _Basis__WEBPACK_IMPORTED_MODULE_2__["Basis"](this._lara.position, this._lara.quaternion), boneBasis = laraBasis.multBasis(new _Basis__WEBPACK_IMPORTED_MODULE_2__["Basis"](pos, quat)), center = boneBasis.mult(mcenter);
            var radiusSq = mradius + BRAID_RADIUS;
            radiusSq *= radiusSq;
            for (var j = 1; j < this._jointsCount; j++) {
                glMatrix.vec3.sub(dir, this._joints[j].pos, center);
                var len = glMatrix.vec3.squaredLength(dir) + EPS;
                if (len < radiusSq) {
                    len = Math.sqrt(len);
                    glMatrix.vec3.scale(dir, dir, (mradius + BRAID_RADIUS - len) / len);
                    glMatrix.vec3.scale(dir, dir, 0.9);
                    glMatrix.vec3.add(this._joints[j].pos, this._joints[j].pos, dir);
                }
            }
        }
    };
    Braid.prototype.solve = function () {
        for (var i = 0; i < this._jointsCount - 1; i++) {
            var a = this._joints[i], b = this._joints[i + 1], dir = [0, 0, 0];
            glMatrix.vec3.sub(dir, b.pos, a.pos);
            var len = glMatrix.vec3.length(dir) + EPS;
            glMatrix.vec3.scale(dir, dir, 1.0 / len);
            var d = a.length - len;
            if (i > 0) {
                glMatrix.vec3.scale(dir, dir, d * (0.5 * 1.0));
                glMatrix.vec3.sub(a.pos, a.pos, dir);
                glMatrix.vec3.add(b.pos, b.pos, dir);
            }
            else {
                glMatrix.vec3.scale(dir, dir, d * 1.0);
                glMatrix.vec3.add(b.pos, b.pos, dir);
            }
        }
    };
    Braid.prototype.update = function (deltaTime, forceCalcBasis) {
        if (forceCalcBasis === void 0) { forceCalcBasis = false; }
        this._joints[0].pos = this.getPos(forceCalcBasis);
        this.integrate(deltaTime); // Verlet integration step
        this.collide(); // check collision with Lara's mesh
        for (var i = 0; i < this._jointsCount; i++) { // solve connections (springs)
            this.solve();
        }
        var headDir = [0, 0, 0];
        glMatrix.vec3.transformQuat(headDir, [0, 0, 1], this.getBasis().rot);
        for (var i = 0; i < this._jointsCount - 1; i++) {
            var d = [0, 0, 0];
            glMatrix.vec3.sub(d, this._joints[i + 1].pos, this._joints[i].pos);
            glMatrix.vec3.normalize(d, d);
            var r = [0, 0, 0];
            glMatrix.vec3.cross(r, d, headDir);
            glMatrix.vec3.normalize(r, r);
            var u = [0, 0, 0];
            glMatrix.vec3.cross(u, d, r);
            glMatrix.vec3.normalize(u, u);
            __m[0] = r[0];
            __m[1] = -r[1];
            __m[2] = -r[2];
            __m[4] = u[0];
            __m[5] = -u[1];
            __m[6] = -u[2];
            __m[8] = d[0];
            __m[9] = -d[1];
            __m[10] = -d[2];
            this._basis[i].identity();
            this._basis[i].translate(this._joints[i].pos);
            var q = [0, 0, 0, 1];
            glMatrix.mat4.getRotation(q, __m);
            this._basis[i].rotate(q);
            this._modelSkeleton.bones[i].setPosition(this._basis[i].pos);
            this._modelSkeleton.bones[i].setQuaternion([this._basis[i].rot[0], -this._basis[i].rot[1], -this._basis[i].rot[2], this._basis[i].rot[3]]);
            this._modelSkeleton.bones[i].updateMatrixWorld();
        }
        if (this._fixToHead) {
            var headBasis = this.getBasis();
            var q = glMatrix.quat.create();
            glMatrix.quat.setAxisAngle(q, [1, 0, 0], Math.PI);
            headBasis.rotate(q);
            this._modelSkeleton.bones[0].setPosition(headBasis.pos);
            this._modelSkeleton.bones[0].setQuaternion(headBasis.rot);
            this._modelSkeleton.bones[0].updateMatrixWorld();
        }
        this._modelSkeleton.setBoneMatrices();
        if (this._gameData.sceneData.objects[this._model.name].roomIndex != this._gameData.sceneData.objects[this._lara.name].roomIndex) {
            this._gameData.objMgr.changeRoomMembership(this._model, this._gameData.sceneData.objects[this._model.name].roomIndex, this._gameData.sceneData.objects[this._lara.name].roomIndex);
        }
    };
    return Braid;
}());



/***/ }),

/***/ "../src/Player/Layer.ts":
/*!******************************!*\
  !*** ../src/Player/Layer.ts ***!
  \******************************/
/*! exports provided: LAYER, Layer */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LAYER", function() { return LAYER; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Layer", function() { return Layer; });
/* harmony import */ var _Proxy_Engine__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Proxy/Engine */ "../src/Proxy/Engine.ts");
/* harmony import */ var _Player_Skeleton__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Player/Skeleton */ "../src/Player/Skeleton.ts");
var __values = (undefined && undefined.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __read = (undefined && undefined.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};


var LAYER;
(function (LAYER) {
    LAYER[LAYER["MAIN"] = 0] = "MAIN";
    LAYER[LAYER["WEAPON"] = 1] = "WEAPON";
    LAYER[LAYER["HOLSTER_EMPTY"] = 2] = "HOLSTER_EMPTY";
    LAYER[LAYER["HOLSTER_FULL"] = 3] = "HOLSTER_FULL";
    LAYER[LAYER["MESHSWAP"] = 4] = "MESHSWAP";
})(LAYER || (LAYER = {}));
var Layer = /** @class */ (function () {
    function Layer(mainMesh, gameData) {
        this.sceneData = gameData.sceneData;
        this.matMgr = gameData.matMgr;
        this.layers = new Map();
        this.setMesh(LAYER.MAIN, mainMesh);
    }
    Layer.prototype.isEmpty = function (layerIndex) {
        return this.layers.get(layerIndex) === undefined;
    };
    Layer.prototype.getMesh = function (layerIndex) {
        var layer = this.layers.get(layerIndex);
        return layer ? layer.meshb.mesh : null;
    };
    Layer.prototype.getMeshBuilder = function (layerIndex) {
        var layer = this.layers.get(layerIndex);
        return layer ? layer.meshb : null;
    };
    Layer.prototype.setMesh = function (layerIndex, mesh, mask) {
        return this.setMeshBuilder(layerIndex, _Proxy_Engine__WEBPACK_IMPORTED_MODULE_0__["default"].makeMeshBuilder(mesh), mask);
    };
    Layer.prototype.setMeshBuilder = function (layerIndex, meshb, mask) {
        if (mask === undefined) {
            mask = _Player_Skeleton__WEBPACK_IMPORTED_MODULE_1__["MASK"].ALL;
        }
        this.layers.set(layerIndex, { "meshb": meshb, "mask": mask });
        meshb.makeSkinIndicesList();
        if (layerIndex !== LAYER.MAIN) {
            var mainMesh = this.layers.get(LAYER.MAIN).meshb.mesh;
            this._setSkeleton(meshb.mesh, this.sceneData.objects[mainMesh.name].skeleton);
            this.setRoom(this.sceneData.objects[mainMesh.name].roomIndex, meshb.mesh);
        }
        this.setMask(meshb, mask);
        meshb.mesh.visible = true;
    };
    Layer.prototype.updateMask = function (layerIndex, mask) {
        var layer = this.layers.get(layerIndex);
        if (!layer) {
            return;
        }
        layer.mask = layer.mask ^ mask;
        this.setMask(layer.meshb, layer.mask);
    };
    Layer.prototype.setMask = function (meshb, mask) {
        var idx = 0, indices = [], skinIndices = meshb.skinIndicesList, numMaxBones = skinIndices.length;
        while (mask && idx < numMaxBones) {
            var bit = mask & 1;
            if (bit && skinIndices[idx] !== undefined) {
                indices = indices.concat(skinIndices[idx]);
            }
            mask = mask >> 1;
            idx++;
        }
        meshb.setIndex(indices);
    };
    Layer.prototype.update = function () {
        var e_1, _a;
        var position = this.layers.get(LAYER.MAIN).meshb.mesh.position, quaternion = this.layers.get(LAYER.MAIN).meshb.mesh.quaternion, it = this.layers.entries();
        try {
            for (var it_1 = __values(it), it_1_1 = it_1.next(); !it_1_1.done; it_1_1 = it_1.next()) {
                var _b = __read(it_1_1.value, 2), i = _b[0], layer = _b[1];
                if (i != LAYER.MAIN) {
                    layer.meshb.mesh.setPosition(position);
                    layer.meshb.mesh.setQuaternion(quaternion);
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (it_1_1 && !it_1_1.done && (_a = it_1.return)) _a.call(it_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
    };
    Layer.prototype.setBoundingObjects = function () {
        var e_2, _a;
        var mainBbox = this.layers.get(LAYER.MAIN).meshb.mesh.getBoundingBox(), it = this.layers.entries();
        try {
            for (var it_2 = __values(it), it_2_1 = it_2.next(); !it_2_1.done; it_2_1 = it_2.next()) {
                var _b = __read(it_2_1.value, 2), i = _b[0], layer = _b[1];
                var mesh = layer.meshb.mesh;
                if (i != LAYER.MAIN) {
                    mesh.setBoundingBox(mainBbox);
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (it_2_1 && !it_2_1.done && (_a = it_2.return)) _a.call(it_2);
            }
            finally { if (e_2) throw e_2.error; }
        }
    };
    Layer.prototype.setRoom = function (roomIndex, mesh) {
        var e_3, _a;
        if (mesh) {
            this.sceneData.objects[mesh.name].roomIndex = roomIndex;
            this.matMgr.setUniformsFromRoom(mesh, roomIndex);
        }
        else {
            var it = this.layers.entries();
            try {
                for (var it_3 = __values(it), it_3_1 = it_3.next(); !it_3_1.done; it_3_1 = it_3.next()) {
                    var _b = __read(it_3_1.value, 2), i = _b[0], layer = _b[1];
                    var mesh_1 = layer.meshb.mesh;
                    if (i != LAYER.MAIN) {
                        this.sceneData.objects[mesh_1.name].roomIndex = roomIndex;
                        this.matMgr.setUniformsFromRoom(mesh_1, roomIndex);
                    }
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (it_3_1 && !it_3_1.done && (_a = it_3.return)) _a.call(it_3);
                }
                finally { if (e_3) throw e_3.error; }
            }
        }
    };
    Layer.prototype._setSkeleton = function (mesh, skeleton) {
        for (var m = 0; m < mesh.materials.length; ++m) {
            var material = mesh.materials[m];
            material.uniforms.boneMatrices.value = skeleton.boneMatrices;
            material.uniformsUpdated(["boneMatrices"]);
        }
        this.sceneData.objects[mesh.name].skeleton = skeleton;
    };
    return Layer;
}());



/***/ }),

/***/ "../src/Player/MaterialManager.ts":
/*!****************************************!*\
  !*** ../src/Player/MaterialManager.ts ***!
  \****************************************/
/*! exports provided: MaterialManager */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MaterialManager", function() { return MaterialManager; });
var MaterialManager = /** @class */ (function () {
    function MaterialManager() {
        this._useAdditionalLights = false;
        this._sysLight = null;
    }
    Object.defineProperty(MaterialManager.prototype, "useAdditionalLights", {
        get: function () {
            return this._useAdditionalLights;
        },
        set: function (u) {
            this._useAdditionalLights = u;
        },
        enumerable: true,
        configurable: true
    });
    MaterialManager.prototype.initialize = function (gameData) {
        this.sceneData = gameData.sceneData;
        this._sysLight = gameData.sysLight;
    };
    MaterialManager.prototype.createLightUniformsForObject = function (obj, onlyGlobalLights) {
        var materials = obj.materials;
        for (var m = 0; m < materials.length; ++m) {
            this.createLightUniformsForMaterial(materials[m], onlyGlobalLights);
        }
    };
    MaterialManager.prototype.createLightUniformsForMaterial = function (material, onlyGlobalLights) {
        var u = material.uniforms;
        u.numSystemLight = { type: "i", value: 0 };
        u.systemLight_position = { type: "fv", value: [0, 0, 0] };
        u.systemLight_color = { type: "fv", value: [0, 0, 0] };
        u.systemLight_distance = { type: "fv1", value: [0] };
        this._sysLight.bindToUniforms(u);
        u.numGlobalLight = { type: "i", value: 0 };
        u.globalLight_position = { type: "fv", value: [0, 0, 0] };
        u.globalLight_color = { type: "fv", value: [0, 0, 0] };
        u.globalLight_distance = { type: "fv1", value: [0] };
        if (onlyGlobalLights) {
            return;
        }
        u.numDirectionalLight = { type: "i", value: 0 };
        u.directionalLight_direction = { type: "fv", value: [0, 0, 0] };
        u.directionalLight_color = { type: "fv", value: [0, 0, 0] };
        u.numPointLight = { type: "i", value: -1 }; // -1 here means the object is internally lit
        u.pointLight_position = { type: "fv", value: [0, 0, 0] };
        u.pointLight_color = { type: "fv", value: [0, 0, 0] };
        u.pointLight_distance = { type: "fv1", value: [0] };
        u.numSpotLight = { type: "i", value: 0 };
        u.spotLight_position = { type: "fv", value: [0, 0, 0] };
        u.spotLight_color = { type: "fv", value: [0, 0, 0] };
        u.spotLight_distance = { type: "fv1", value: [0] };
        u.spotLight_direction = { type: "fv", value: [0, 0, 0] };
        u.spotLight_coneCos = { type: "fv1", value: [0] };
        u.spotLight_penumbraCos = { type: "fv1", value: [0] };
    };
    MaterialManager.prototype.setUniformsFromRoom = function (obj, roomIndex) {
        var materials = obj.materials, roomData = this.sceneData.objects['room' + roomIndex], data = this.sceneData.objects[obj.name];
        for (var mat = 0; mat < materials.length; ++mat) {
            var material = materials[mat];
            if (data.type != 'moveable' || !data.internallyLit) {
                material.uniforms.ambientColor.value = roomData.ambientColor;
            }
            this.setLightUniformsForMaterial(roomData, material, false, data.type != 'moveable' || data.internallyLit);
            if (!roomData.flickering) {
                material.uniforms.flickerColor.value = [1, 1, 1];
            }
            if (roomData.filledWithWater) {
                material.uniforms.tintColor.value = [this.sceneData.waterColor.in.r, this.sceneData.waterColor.in.g, this.sceneData.waterColor.in.b];
            }
            material.uniformsUpdated();
        }
    };
    MaterialManager.prototype.setLightUniformsForMaterial = function (room, material, noreset, onlyGlobalLights) {
        if (noreset === void 0) { noreset = false; }
        if (onlyGlobalLights === void 0) { onlyGlobalLights = false; }
        var u = material.uniforms;
        // global lights created by the Light behaviour
        if (!noreset) {
            u.numGlobalLight.value = 0;
        }
        var lights = room.globalLights;
        if (lights && lights.length > 0) {
            for (var l = 0; l < lights.length; ++l) {
                var light = lights[l];
                if (u.globalLight_position.value === undefined || (!noreset && u.numGlobalLight.value == 0)) {
                    u.globalLight_position.value = [];
                }
                if (u.globalLight_color.value === undefined || (!noreset && u.numGlobalLight.value == 0)) {
                    u.globalLight_color.value = [];
                }
                if (u.globalLight_distance.value === undefined || (!noreset && u.numGlobalLight.value == 0)) {
                    u.globalLight_distance.value = [];
                }
                u.globalLight_position.value = u.globalLight_position.value.concat([light.x, light.y, light.z]);
                u.globalLight_color.value = u.globalLight_color.value.concat(light.color);
                u.globalLight_distance.value.push(light.fadeOut);
                u.numGlobalLight.value++;
            }
        }
        if (onlyGlobalLights) {
            return;
        }
        // regular room lights
        if (!noreset) {
            u.numDirectionalLight.value = 0;
            u.numPointLight.value = 0;
            u.numSpotLight.value = 0;
        }
        lights = this._useAdditionalLights ? room.lightsExt : room.lights;
        if (lights.length == 0) {
            material.uniformsUpdated();
            return;
        }
        for (var l = 0; l < lights.length; ++l) {
            var light = lights[l];
            switch (light.type) {
                case 'directional':
                    if (u.directionalLight_direction.value === undefined || (!noreset && u.numDirectionalLight.value == 0)) {
                        u.directionalLight_direction.value = [];
                    }
                    if (u.directionalLight_color.value === undefined || (!noreset && u.numDirectionalLight.value == 0)) {
                        u.directionalLight_color.value = [];
                    }
                    u.directionalLight_direction.value = u.directionalLight_direction.value.concat([light.dx, light.dy, light.dz]);
                    u.directionalLight_color.value = u.directionalLight_color.value.concat(light.color);
                    u.numDirectionalLight.value++;
                    break;
                case 'point':
                    if (u.pointLight_position.value === undefined || (!noreset && u.numPointLight.value == 0)) {
                        u.pointLight_position.value = [];
                    }
                    if (u.pointLight_color.value === undefined || (!noreset && u.numPointLight.value == 0)) {
                        u.pointLight_color.value = [];
                    }
                    if (u.pointLight_distance.value === undefined || (!noreset && u.numPointLight.value == 0)) {
                        u.pointLight_distance.value = [];
                    }
                    u.pointLight_position.value = u.pointLight_position.value.concat([light.x, light.y, light.z]);
                    u.pointLight_color.value = u.pointLight_color.value.concat(light.color);
                    u.pointLight_distance.value.push(light.fadeOut);
                    u.numPointLight.value++;
                    break;
                case 'spot':
                    if (u.spotLight_position.value === undefined || (!noreset && u.numSpotLight.value == 0)) {
                        u.spotLight_position.value = [];
                    }
                    if (u.spotLight_color.value === undefined || (!noreset && u.numSpotLight.value == 0)) {
                        u.spotLight_color.value = [];
                    }
                    if (u.spotLight_direction.value === undefined || (!noreset && u.numSpotLight.value == 0)) {
                        u.spotLight_direction.value = [];
                    }
                    if (u.spotLight_distance.value === undefined || (!noreset && u.numSpotLight.value == 0)) {
                        u.spotLight_distance.value = [];
                    }
                    if (u.spotLight_coneCos.value === undefined || (!noreset && u.numSpotLight.value == 0)) {
                        u.spotLight_coneCos.value = [];
                    }
                    if (u.spotLight_penumbraCos.value === undefined || (!noreset && u.numSpotLight.value == 0)) {
                        u.spotLight_penumbraCos.value = [];
                    }
                    u.spotLight_position.value = u.spotLight_position.value.concat([light.x, light.y, light.z]);
                    u.spotLight_color.value = u.spotLight_color.value.concat(light.color);
                    u.spotLight_direction.value = u.spotLight_direction.value.concat([light.dx, light.dy, light.dz]);
                    u.spotLight_distance.value.push(light.fadeOut);
                    u.spotLight_coneCos.value.push(light.coneCos);
                    u.spotLight_penumbraCos.value.push(light.penumbraCos);
                    u.numSpotLight.value++;
                    break;
            }
        }
        material.uniformsUpdated();
    };
    MaterialManager.prototype.setLightUniformsForObject = function (obj) {
        var data = this.sceneData.objects[obj.name];
        if (data && data.roomIndex >= 0) {
            var materials = obj.materials;
            for (var m = 0; m < materials.length; ++m) {
                var material = materials[m], onlyGlobalLights = !material.uniforms || material.uniforms.numPointLight === undefined || material.uniforms.numPointLight < 0;
                this.setLightUniformsForMaterial(this.sceneData.objects['room' + data.roomIndex], material, false, onlyGlobalLights);
            }
        }
    };
    // update material light uniforms for all `objects`, depending on the room they are in (should be a list of moveables only!)
    MaterialManager.prototype.setLightUniformsForObjects = function (objects) {
        for (var objID in objects) {
            var o = objects[objID], lstObj = Array.isArray(o) ? o : [o];
            for (var i = 0; i < lstObj.length; ++i) {
                this.setLightUniformsForObject(lstObj[i]);
            }
        }
    };
    MaterialManager.prototype.getFirstDirectionalLight = function (lights) {
        for (var i = 0; i < lights.length; ++i) {
            if (lights[i].type == 'directional') {
                return i;
            }
        }
        return -1;
    };
    return MaterialManager;
}());



/***/ }),

/***/ "../src/Player/ObjectManager.ts":
/*!**************************************!*\
  !*** ../src/Player/ObjectManager.ts ***!
  \**************************************/
/*! exports provided: ObjectManager */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ObjectManager", function() { return ObjectManager; });
/* harmony import */ var _Player_Skeleton__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Player/Skeleton */ "../src/Player/Skeleton.ts");

var ObjectManager = /** @class */ (function () {
    function ObjectManager() {
        this.objectList = null;
        this.count = 0;
        this.sceneRender = null;
        this.bhvMgr = null;
        this.matMgr = null;
        this.anmMgr = null;
        this.gameData = null;
        this.camera = null;
    }
    ObjectManager.prototype.initialize = function (gameData) {
        this.gameData = gameData;
        this.sceneRender = gameData.sceneRender;
        this.sceneData = gameData.sceneData;
        this.matMgr = gameData.matMgr;
        this.bhvMgr = gameData.bhvMgr;
        this.anmMgr = gameData.anmMgr;
        this.camera = gameData.camera;
        this.buildLists();
    };
    ObjectManager.prototype.buildLists = function () {
        var _this = this;
        this.objectList = {
            "moveable": {},
            "room": {},
            "staticmesh": {},
            "sprite": {},
            "spriteseq": {}
        };
        this.sceneRender.traverse(function (obj) {
            var data = _this.sceneData.objects[obj.name];
            if (!data) {
                return;
            }
            var id = data.objectid, type = data.type;
            var objs = _this.objectList[type];
            if (!objs) {
                objs = {};
                _this.objectList[type] = objs;
            }
            if (type === 'room') {
                objs[id] = obj;
            }
            else {
                var objsForId = objs[id];
                if (!objsForId) {
                    objsForId = [];
                    objs[id] = objsForId;
                }
                else if (!Array.isArray(objsForId)) {
                    throw "Bug!!";
                }
                objsForId.push(obj);
            }
        });
    };
    ObjectManager.prototype.createSprite = function (spriteID, roomIndex, color, addToScene) {
        if (addToScene === void 0) { addToScene = true; }
        var data = this.sceneData.objects[spriteID < 0 ? 'spriteseq' + (-spriteID) : 'sprite' + spriteID];
        if (spriteID < 0) {
            spriteID = -spriteID;
        }
        if (!data || !data.liveObj) {
            return null;
        }
        var obj = data.liveObj.clone();
        // copy material
        var newMaterial = [];
        for (var m = 0; m < obj.materials.length; ++m) {
            var material = obj.materials[m];
            newMaterial[m] = material.clone();
            newMaterial[m].uniforms.lighting.value = color;
            newMaterial[m].uniforms.map.value = material.uniforms.map.value;
            newMaterial[m].uniforms.mapBump.value = material.uniforms.mapBump.value;
            newMaterial[m].uniformsUpdated();
        }
        obj.materials = newMaterial;
        obj.name = data.type + spriteID + '_room' + roomIndex + '_dyncreate_' + (this.count++);
        obj.visible = true;
        var newData = {
            "type": data.type,
            "roomIndex": roomIndex,
            "has_anims": false,
            "objectid": data.objectid,
            "visible": true
        };
        this.sceneData.objects[obj.name] = newData;
        var lst = this.objectList[data.type][spriteID];
        if (!lst) {
            lst = [];
            this.objectList[data.type][spriteID] = lst;
        }
        lst.push(obj);
        this.matMgr.createLightUniformsForObject(obj, true);
        if (addToScene) {
            this.sceneRender.add(obj);
        }
        return obj;
    };
    ObjectManager.prototype.createStaticMesh = function (staticmeshID, roomIndex, color, addToScene) {
        if (addToScene === void 0) { addToScene = true; }
        var data = this.sceneData.objects['staticmesh' + staticmeshID];
        if (!data || !data.liveObj) {
            return null;
        }
        var obj = data.liveObj.clone();
        // copy material
        var newMaterial = [];
        for (var m = 0; m < obj.materials.length; ++m) {
            var material = obj.materials[m];
            newMaterial[m] = material.clone();
            newMaterial[m].uniforms.lighting.value = color;
            newMaterial[m].uniforms.map.value = material.uniforms.map.value;
            newMaterial[m].uniforms.mapBump.value = material.uniforms.mapBump.value;
            newMaterial[m].uniformsUpdated();
        }
        obj.materials = newMaterial;
        obj.name = 'staticmesh' + staticmeshID + '_room' + roomIndex + '_dyncreate_' + (this.count++);
        obj.visible = true;
        var newData = {
            "type": 'staticmesh',
            "roomIndex": roomIndex,
            "has_anims": false,
            "objectid": data.objectid,
            "visible": true
        };
        this.sceneData.objects[obj.name] = newData;
        var lst = this.objectList[data.type][staticmeshID];
        if (!lst) {
            lst = [];
            this.objectList[data.type][staticmeshID] = lst;
        }
        lst.push(obj);
        this.matMgr.createLightUniformsForObject(obj, true);
        if (addToScene) {
            this.sceneRender.add(obj);
        }
        return obj;
    };
    ObjectManager.prototype.createMoveable = function (moveableID, roomIndex, extrnColor, addToScene, setAnimation) {
        if (addToScene === void 0) { addToScene = true; }
        if (setAnimation === void 0) { setAnimation = true; }
        var data = this.sceneData.objects['moveable' + moveableID];
        if (!data || !data.liveObj) {
            return null;
        }
        var obj = data.liveObj.clone();
        // copy material
        var newMaterial = [];
        var skeleton = typeof (setAnimation) == 'boolean' ? new _Player_Skeleton__WEBPACK_IMPORTED_MODULE_0__["Skeleton"](data.bonesStartingPos) : setAnimation;
        for (var m = 0; m < obj.materials.length; ++m) {
            var material = obj.materials[m];
            newMaterial[m] = material.clone();
            newMaterial[m].uniforms.map.value = material.uniforms.map.value;
            newMaterial[m].uniforms.mapBump.value = material.uniforms.mapBump.value;
            newMaterial[m].uniforms.boneMatrices = { "type": "m4v", "value": null };
            if (skeleton) {
                newMaterial[m].uniforms.boneMatrices.value = skeleton.boneMatrices;
            }
            if (extrnColor) {
                newMaterial[m].uniforms.ambientColor.value = extrnColor;
            }
            newMaterial[m].uniformsUpdated();
        }
        obj.materials = newMaterial;
        obj.name = 'moveable' + moveableID + '_room' + roomIndex + '_dyncreate_' + (this.count++);
        obj.visible = true;
        obj.matrixAutoUpdate = true;
        var newData = {
            "type": 'moveable',
            "roomIndex": roomIndex,
            "has_anims": data.has_anims && typeof (setAnimation) == 'boolean',
            "objectid": data.objectid,
            "visible": true,
            "internallyLit": extrnColor != undefined,
            "skeleton": skeleton
        };
        this.sceneData.objects[obj.name] = newData;
        if (newData.has_anims) {
            newData.animationStartIndex = data.animationStartIndex;
            newData.numAnimations = data.numAnimations;
        }
        var lst = this.objectList['moveable'][moveableID];
        if (!lst) {
            lst = [];
            this.objectList['moveable'][moveableID] = lst;
        }
        lst.push(obj);
        this.matMgr.createLightUniformsForObject(obj, false);
        if (addToScene) {
            this.sceneRender.add(obj);
        }
        if (typeof (setAnimation) == 'boolean' && setAnimation && data.has_anims) {
            this.anmMgr.setAnimation(obj, 0, false);
        }
        return obj;
    };
    ObjectManager.prototype.removeObjectFromScene = function (obj, removeBehaviours) {
        if (removeBehaviours === undefined) {
            removeBehaviours = true;
        }
        if (removeBehaviours) {
            this.bhvMgr.removeBehaviours(obj);
        }
        this.sceneRender.remove(obj);
    };
    ObjectManager.prototype._collectObjectsWithAnimatedTextures = function (lst) {
        var objs = [];
        for (var objID in lst) {
            var lstObjs = lst[objID];
            if (!Array.isArray(lstObjs)) {
                lstObjs = [lstObjs];
            }
            for (var i = 0; i < lstObjs.length; ++i) {
                var obj = lstObjs[i], materials = obj.materials;
                for (var m = 0; m < materials.length; ++m) {
                    var material = materials[m], userData = material.userData;
                    if (!userData || !userData.animatedTexture) {
                        continue;
                    }
                    var animTexture = this.sceneData.animatedTextures[userData.animatedTexture.idxAnimatedTexture];
                    if (!animTexture.scrolltexture) {
                        objs.push(obj);
                        break;
                    }
                }
            }
        }
        return objs;
    };
    ObjectManager.prototype.collectObjectsWithAnimatedTextures = function () {
        var objs = this._collectObjectsWithAnimatedTextures(this.objectList['room']);
        objs = objs.concat(this._collectObjectsWithAnimatedTextures(this.objectList['sprite']));
        objs = objs.concat(this._collectObjectsWithAnimatedTextures(this.objectList['spriteseq']));
        return objs;
    };
    ObjectManager.prototype.updateObjects = function (curTime) {
        var _this = this;
        this.gameData.curRoom = -1;
        var camPos = this.camera.position;
        this.sceneRender.traverse(function (obj) {
            var data = _this.sceneData.objects[obj.name];
            if (!data) {
                return;
            }
            // Test camera room membership
            if (data.type == 'room') {
                if (obj.containsPoint(_this.gameData.camera.position) && !data.isAlternateRoom) {
                    //if (!data.isAlternateRoom && this.gameData.trlvl.isPointInRoom(this.gameData.camera.position, data.roomIndex)) {
                    _this.gameData.curRoom = data.roomIndex;
                }
            }
            // Set the visibility for the object
            if (_this.gameData.singleRoomMode) {
                obj.visible = data.roomIndex == _this.gameData.curRoom && !data.isAlternateRoom;
            }
            else {
                obj.visible = data.visible;
            }
            // Update material uniforms
            var materials = obj.materials, room = _this.sceneData.objects['room' + data.roomIndex];
            if (room < 0) {
                return;
            }
            for (var i = 0; i < materials.length; ++i) {
                var material = materials[i];
                if (_this.gameData.globalTintColor != null) {
                    material.uniforms.tintColor.value = _this.gameData.globalTintColor;
                }
                material.uniforms.numSystemLight.value = _this.gameData.sysLight.numLights;
                material.uniforms.curTime.value = curTime;
                material.uniforms.rnd.value = _this.gameData.quantumRnd;
                material.uniforms.flickerColor.value = room && room.flickering ? _this.gameData.flickerColor : _this.gameData.unitVec3;
                material.uniforms.camPosition.value = camPos;
                material.uniformsUpdated(["tintColor", "numSystemLight", "curTime", "rnd", "flickerColor", "camPosition"]);
            }
        });
    };
    ObjectManager.prototype.getRoomByPos = function (pos) {
        var roomList = this.objectList['room'];
        for (var r in roomList) {
            var obj = roomList[r], data = this.sceneData.objects[obj.name];
            if (data.isAlternateRoom) {
                continue;
            }
            if (!Array.isArray(obj) && obj.containsPoint(pos)) {
                return parseInt(r);
            }
        }
        return -1;
    };
    ObjectManager.prototype.changeRoomMembership = function (obj, oldRoomIndex, newRoomIndex) {
        var data = this.sceneData.objects[obj.name];
        var dataCurRoom = this.sceneData.objects['room' + oldRoomIndex], curRoomLights = this.matMgr.useAdditionalLights ? dataCurRoom.lightsExt : dataCurRoom.lights, curLIdx = this.matMgr.getFirstDirectionalLight(curRoomLights);
        var dataNewRoom = this.sceneData.objects['room' + newRoomIndex], newRoomLights = this.matMgr.useAdditionalLights ? dataNewRoom.lightsExt : dataNewRoom.lights, newLIdx = this.matMgr.getFirstDirectionalLight(newRoomLights);
        data.roomIndex = newRoomIndex;
        this.matMgr.setUniformsFromRoom(obj, newRoomIndex);
        if (data.layer) {
            data.layer.setRoom(newRoomIndex);
        }
        if (curLIdx >= 0 && newLIdx >= 0) {
            var uniforms = [];
            for (var i = 0; i < obj.materials.length; ++i) {
                var material = obj.materials[i];
                uniforms.push({ a: material.uniforms.directionalLight_color.value, i: 0 });
            }
            this.bhvMgr.addBehaviour('FadeUniformColor', {
                "colorStart": curRoomLights[curLIdx].color,
                "colorEnd": newRoomLights[newLIdx].color,
                "duration": 1.0,
                "uniforms": uniforms
            });
        }
    };
    return ObjectManager;
}());



/***/ }),

/***/ "../src/Player/Play.ts":
/*!*****************************!*\
  !*** ../src/Player/Play.ts ***!
  \*****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Proxy_Engine__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Proxy/Engine */ "../src/Proxy/Engine.ts");
/* harmony import */ var _Utils_Browser__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Utils/Browser */ "../src/Utils/Browser.ts");
/* harmony import */ var _Constants__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Constants */ "../src/Constants.ts");
/* harmony import */ var _Animation_AnimationManager__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../Animation/AnimationManager */ "../src/Animation/AnimationManager.ts");
/* harmony import */ var _Behaviour_BehaviourManager__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../Behaviour/BehaviourManager */ "../src/Behaviour/BehaviourManager.ts");
/* harmony import */ var _ObjectManager__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./ObjectManager */ "../src/Player/ObjectManager.ts");
/* harmony import */ var _MaterialManager__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./MaterialManager */ "../src/Player/MaterialManager.ts");
/* harmony import */ var _TRLevel__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./TRLevel */ "../src/Player/TRLevel.ts");
/* harmony import */ var _Utils_Panel__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../Utils/Panel */ "../src/Utils/Panel.ts");
/* harmony import */ var _SystemLight__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./SystemLight */ "../src/Player/SystemLight.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};










var Play = /** @class */ (function () {
    function Play(container) {
        this.gameData = {
            "relpath": _Utils_Browser__WEBPACK_IMPORTED_MODULE_1__["default"].QueryString.relpath || "/",
            "play": this,
            "curFrame": 0,
            "container": container,
            "curRoom": -1,
            "camera": null,
            "sceneRender": null,
            "sceneBackground": null,
            "sceneData": null,
            "singleRoomMode": false,
            "panel": null,
            "bhvMgr": null,
            "objMgr": null,
            "matMgr": null,
            "confMgr": null,
            "trlvl": null,
            "anmMgr": null,
            "shdMgr": null,
            "sysLight": null,
            "startTime": -1,
            "lastTime": -1,
            "quantum": 1 / _Constants__WEBPACK_IMPORTED_MODULE_2__["baseFrameRate"],
            "quantumTime": -1,
            "quantumRnd": 0,
            "flickerColor": [1.2, 1.2, 1.2],
            "unitVec3": [1.0, 1.0, 1.0],
            "globalTintColor": null,
            "isCutscene": false,
            "singleFrame": false,
            "update": true,
            "fps": 0
        };
        this.renderer = _Proxy_Engine__WEBPACK_IMPORTED_MODULE_0__["default"].createRenderer(this.gameData.container);
        this.renderer.setSize(jQuery(this.gameData.container).width(), jQuery(this.gameData.container).height());
        this.gameData.panel = new _Utils_Panel__WEBPACK_IMPORTED_MODULE_8__["Panel"](this.gameData.container, this.gameData, this.renderer);
        this.gameData.panel.hide();
        this.stats = new Stats();
        this.stats.domElement.style.position = 'absolute';
        this.stats.domElement.style.top = '0px';
        this.stats.domElement.style.right = '0px';
        this.stats.domElement.style.zIndex = 100;
        this.ofstTime = 0;
        this.freezeTime = 0;
        this.initsDone = false;
        this.gameData.container.append(this.stats.domElement);
        _Utils_Browser__WEBPACK_IMPORTED_MODULE_1__["default"].bindRequestPointerLock(document.body);
        _Utils_Browser__WEBPACK_IMPORTED_MODULE_1__["default"].bindRequestFullscreen(document.body);
    }
    Play.prototype.initialize = function (sceneJSON, scene) {
        return __awaiter(this, void 0, void 0, function () {
            var camera, isCutScene, cutsceneIndex, tintColor, vals, vals, allPromises, otherPromises;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.gameData.sceneData = sceneJSON.data;
                        this.gameData.sceneRender = scene;
                        this.gameData.sceneBackground = this.renderer.createScene();
                        _Proxy_Engine__WEBPACK_IMPORTED_MODULE_0__["default"].activeScene = scene;
                        camera = this.gameData.sceneRender.getCamera();
                        if (camera !== undefined) {
                            this.gameData.camera = camera;
                        }
                        else {
                            console.log("Can't find camera!");
                        }
                        /*camera.setPosition([26686, 472, -67788]);
                        camera.setQuaternion([0.00564, 0.99346, 0.05650, -0.09910]);
                        camera.updateMatrixWorld();
                        camera.updateProjectionMatrix();*/
                        this.gameData.confMgr = this.gameData.sceneData.trlevel.confMgr;
                        this.gameData.bhvMgr = new _Behaviour_BehaviourManager__WEBPACK_IMPORTED_MODULE_4__["BehaviourManager"]();
                        this.gameData.matMgr = new _MaterialManager__WEBPACK_IMPORTED_MODULE_6__["MaterialManager"]();
                        this.gameData.objMgr = new _ObjectManager__WEBPACK_IMPORTED_MODULE_5__["ObjectManager"]();
                        this.gameData.trlvl = new _TRLevel__WEBPACK_IMPORTED_MODULE_7__["TRLevel"]();
                        this.gameData.anmMgr = new _Animation_AnimationManager__WEBPACK_IMPORTED_MODULE_3__["AnimationManager"]();
                        this.gameData.shdMgr = _Proxy_Engine__WEBPACK_IMPORTED_MODULE_0__["default"].getShaderMgr();
                        this.gameData.sysLight = new _SystemLight__WEBPACK_IMPORTED_MODULE_9__["SystemLight"]();
                        this.gameData.bhvMgr.initialize(this.gameData);
                        this.gameData.matMgr.initialize(this.gameData);
                        this.gameData.objMgr.initialize(this.gameData);
                        this.gameData.trlvl.initialize(this.gameData);
                        this.gameData.anmMgr.initialize(this.gameData);
                        delete this.gameData.sceneData.trlevel.confMgr;
                        delete this.gameData.sceneData.trlevel;
                        isCutScene = this.gameData.confMgr.param('', false, true).attr('type') == 'cutscene', cutsceneIndex = this.gameData.sceneData.rversion == 'TR4' && _Utils_Browser__WEBPACK_IMPORTED_MODULE_1__["default"].QueryString.cutscene != undefined ? parseInt(_Utils_Browser__WEBPACK_IMPORTED_MODULE_1__["default"].QueryString.cutscene) : -1;
                        this.gameData.isCutscene = isCutScene || cutsceneIndex > 0;
                        tintColor = this.gameData.confMgr.color('globaltintcolor', true);
                        if (tintColor != null) {
                            this.gameData.globalTintColor = [tintColor.r, tintColor.g, tintColor.b];
                        }
                        if (this.gameData.sceneData.rversion != 'TR4') {
                            jQuery('#nobumpmapping').prop('disabled', 'disabled');
                        }
                        if (_Utils_Browser__WEBPACK_IMPORTED_MODULE_1__["default"].QueryString.pos) {
                            vals = _Utils_Browser__WEBPACK_IMPORTED_MODULE_1__["default"].QueryString.pos.split(',');
                            this.gameData.camera.setPosition([parseFloat(vals[0]), parseFloat(vals[1]), parseFloat(vals[2])]);
                        }
                        if (_Utils_Browser__WEBPACK_IMPORTED_MODULE_1__["default"].QueryString.rot) {
                            vals = _Utils_Browser__WEBPACK_IMPORTED_MODULE_1__["default"].QueryString.rot.split(',');
                            this.gameData.camera.setQuaternion([parseFloat(vals[0]), parseFloat(vals[1]), parseFloat(vals[2]), parseFloat(vals[3])]);
                        }
                        this.gameData.trlvl.createObjectsInLevel();
                        allPromises = this.gameData.bhvMgr.loadBehaviours() || [];
                        allPromises = allPromises.concat(this.gameData.bhvMgr.addBehaviour('Sprite') || []);
                        allPromises = allPromises.concat(this.gameData.bhvMgr.addBehaviour('AnimatedTexture', undefined, undefined, undefined, this.gameData.objMgr.collectObjectsWithAnimatedTextures()) || []);
                        if (cutsceneIndex >= 0) {
                            allPromises = allPromises.concat(this.gameData.bhvMgr.addBehaviour('CutScene', { "index": cutsceneIndex, "useadditionallights": true }) || []);
                        }
                        return [4 /*yield*/, Promise.all(allPromises)];
                    case 1:
                        _a.sent();
                        // set uniforms on objects
                        this.gameData.sceneRender.traverse(function (obj) {
                            var data = _this.gameData.sceneData.objects[obj.name];
                            if (!data || data.roomIndex < 0) {
                                return;
                            }
                            _this.gameData.matMgr.setUniformsFromRoom(obj, data.roomIndex);
                        });
                        otherPromises = _Behaviour_BehaviourManager__WEBPACK_IMPORTED_MODULE_4__["BehaviourManager"].onEngineInitialized(this.gameData);
                        if (!(Array.isArray(otherPromises) && otherPromises.length > 0)) return [3 /*break*/, 3];
                        return [4 /*yield*/, Promise.all(otherPromises)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/, Promise.resolve()];
                }
            });
        });
    };
    Play.prototype.play = function (onceOnly, update) {
        if (onceOnly === void 0) { onceOnly = false; }
        if (update === void 0) { update = true; }
        this.gameData.singleFrame = onceOnly;
        this.gameData.update = update;
        if (!this.initsDone) {
            this.initsDone = true;
            this.gameData.panel.show();
            this.gameData.panel.updateFromParent();
            window.addEventListener('resize', this.onWindowResize.bind(this), false);
            this.gameData.bhvMgr.onBeforeRenderLoop();
            this.gameData.startTime = this.gameData.lastTime = this.gameData.quantumTime = (new Date()).getTime() / 1000.0;
        }
        this.setSizes(true);
        if (onceOnly) {
            this.render();
        }
        else {
            this.renderLoop();
        }
    };
    Play.prototype.goto = function (name, type) {
        var _this = this;
        var objTypeList = [];
        if (type !== undefined) {
            objTypeList = [type];
        }
        else {
            objTypeList = ["moveable", "room", "staticmesh", "sprite", "spriteseq"];
        }
        var choice1 = null, choice2 = null;
        objTypeList.forEach(function (tp) {
            var list = _this.gameData.objMgr.objectList[tp];
            for (var id in list) {
                var lstObjs_ = list[id];
                (Array.isArray(lstObjs_) ? lstObjs_ : [lstObjs_]).forEach(function (obj) {
                    var data = _this.gameData.sceneData.objects[obj.name];
                    if (obj.name === name || obj.name.indexOf(name) >= 0) {
                        var pos = [0, 0, 0];
                        if (data.type == 'room') {
                            var bb = obj.getBoundingBox();
                            pos = [(bb.min[0] + bb.max[0]) / 2, (bb.min[1] + bb.max[1]) / 2, (bb.min[2] + bb.max[2]) / 2];
                        }
                        else {
                            pos = obj.position;
                        }
                        if (obj.name === name) {
                            choice1 = pos;
                        }
                        else {
                            choice2 = pos;
                        }
                    }
                });
            }
        });
        if (!choice1 && !choice2) {
            var partsys = this.gameData.sceneRender._scene;
            if (partsys && partsys.particleSystems) {
                partsys.particleSystems.forEach(function (psys) {
                    if (psys.name === name) {
                        choice1 = [psys.worldOffset.x, psys.worldOffset.y, psys.worldOffset.z];
                    }
                    else if (psys.name.indexOf(name) >= 0) {
                        choice2 = [psys.worldOffset.x, psys.worldOffset.y, psys.worldOffset.z];
                    }
                });
            }
        }
        if (choice1) {
            this.gameData.camera.setPosition(choice1);
        }
        else if (choice2) {
            this.gameData.camera.setPosition(choice2);
        }
    };
    Play.prototype.renderLoop = function () {
        requestAnimationFrame(this.renderLoop.bind(this));
        if (!this.gameData.singleFrame) {
            if (this.freezeTime > 0) {
                this.ofstTime += (new Date()).getTime() / 1000.0 - this.freezeTime;
                this.freezeTime = 0;
            }
        }
        this.render();
    };
    Play.prototype.render = function (forceUpdate) {
        if (forceUpdate === void 0) { forceUpdate = false; }
        if (this.gameData.singleFrame) {
            if (this.freezeTime > 0) {
                this.ofstTime += (new Date()).getTime() / 1000.0 - this.freezeTime;
                this.freezeTime = 0;
            }
        }
        var curTime = (new Date()).getTime() / 1000.0 - this.ofstTime, delta = curTime - this.gameData.lastTime;
        this.gameData.lastTime = curTime;
        if (curTime - this.gameData.quantumTime > this.gameData.quantum) {
            this.gameData.quantumRnd = Math.random();
            this.gameData.quantumTime = curTime;
        }
        curTime = curTime - this.gameData.startTime;
        if (delta > 0.1) {
            delta = 0.1;
        }
        this.gameData.fps = delta ? 1 / delta : 60;
        if (this.gameData.update || forceUpdate) {
            this.gameData.bhvMgr.onFrameStarted(curTime, delta);
            this.gameData.anmMgr.animateObjects(delta);
        }
        else {
            // we still want to be able to move the camera in the "no update" mode
            var bhvCtrl = this.gameData.bhvMgr.getBehaviour("BasicControl")[0];
            bhvCtrl.onFrameStarted(curTime, delta);
        }
        this.gameData.camera.updateMatrixWorld();
        this.gameData.objMgr.updateObjects(curTime);
        if (this.gameData.update || forceUpdate) {
            this.gameData.bhvMgr.onFrameEnded(curTime, delta);
        }
        this.renderer.clear();
        this.renderer.render(this.gameData.sceneBackground, this.gameData.camera);
        this.renderer.render(this.gameData.sceneRender, this.gameData.camera);
        this.stats.update();
        this.gameData.panel.showInfo();
        this.gameData.curFrame++;
        if (this.gameData.singleFrame) {
            this.freezeTime = (new Date()).getTime() / 1000.0;
        }
    };
    Play.prototype.setSizes = function (noRendering) {
        var w = jQuery(this.gameData.container).width(), h = jQuery(this.gameData.container).height();
        this.gameData.camera.aspect = w / h;
        this.gameData.camera.updateProjectionMatrix();
        this.renderer.setSize(w, h);
        if (!noRendering) {
            this.render();
        }
    };
    Play.prototype.onWindowResize = function () {
        this.setSizes(false);
    };
    return Play;
}());
/* harmony default export */ __webpack_exports__["default"] = (Play);


/***/ }),

/***/ "../src/Player/Sequence.ts":
/*!*********************************!*\
  !*** ../src/Player/Sequence.ts ***!
  \*********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
var Sequence = /** @class */ (function () {
    function Sequence(numTiles, tileDispDuration) {
        this.numberOfTiles = numTiles;
        this.tileDisplayDuration = tileDispDuration;
        // how long has the current image been displayed?
        this.currentDisplayTime = 0;
        // which image is currently being displayed?
        this.currentTile = 0;
    }
    Sequence.prototype.update = function (milliSec) {
        this.currentDisplayTime += milliSec;
        while (this.currentDisplayTime > this.tileDisplayDuration) {
            this.currentDisplayTime -= this.tileDisplayDuration;
            this.currentTile++;
            if (this.currentTile == this.numberOfTiles) {
                this.currentTile = 0;
            }
        }
    };
    return Sequence;
}());
/* harmony default export */ __webpack_exports__["default"] = (Sequence);


/***/ }),

/***/ "../src/Player/Skeleton.ts":
/*!*********************************!*\
  !*** ../src/Player/Skeleton.ts ***!
  \*********************************/
/*! exports provided: BONE, MASK, Skeleton */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BONE", function() { return BONE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MASK", function() { return MASK; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Skeleton", function() { return Skeleton; });
/* harmony import */ var _Proxy_Engine__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Proxy/Engine */ "../src/Proxy/Engine.ts");
/* harmony import */ var _Basis__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Basis */ "../src/Player/Basis.ts");


var BONE;
(function (BONE) {
    BONE[BONE["HIPS"] = 0] = "HIPS";
    BONE[BONE["LEG_L1"] = 1] = "LEG_L1";
    BONE[BONE["LEG_L2"] = 2] = "LEG_L2";
    BONE[BONE["LEG_L3"] = 3] = "LEG_L3";
    BONE[BONE["LEG_R1"] = 4] = "LEG_R1";
    BONE[BONE["LEG_R2"] = 5] = "LEG_R2";
    BONE[BONE["LEG_R3"] = 6] = "LEG_R3";
    BONE[BONE["CHEST"] = 7] = "CHEST";
    BONE[BONE["ARM_R1"] = 8] = "ARM_R1";
    BONE[BONE["ARM_R2"] = 9] = "ARM_R2";
    BONE[BONE["ARM_R3"] = 10] = "ARM_R3";
    BONE[BONE["ARM_L1"] = 11] = "ARM_L1";
    BONE[BONE["ARM_L2"] = 12] = "ARM_L2";
    BONE[BONE["ARM_L3"] = 13] = "ARM_L3";
    BONE[BONE["HEAD"] = 14] = "HEAD";
})(BONE || (BONE = {}));
var MASK;
(function (MASK) {
    MASK[MASK["HIPS"] = 1] = "HIPS";
    MASK[MASK["LEG_L1"] = 2] = "LEG_L1";
    MASK[MASK["LEG_L2"] = 4] = "LEG_L2";
    MASK[MASK["LEG_L3"] = 8] = "LEG_L3";
    MASK[MASK["LEG_R1"] = 16] = "LEG_R1";
    MASK[MASK["LEG_R2"] = 32] = "LEG_R2";
    MASK[MASK["LEG_R3"] = 64] = "LEG_R3";
    MASK[MASK["CHEST"] = 128] = "CHEST";
    MASK[MASK["ARM_R1"] = 256] = "ARM_R1";
    MASK[MASK["ARM_R2"] = 512] = "ARM_R2";
    MASK[MASK["ARM_R3"] = 1024] = "ARM_R3";
    MASK[MASK["ARM_L1"] = 2048] = "ARM_L1";
    MASK[MASK["ARM_L2"] = 4096] = "ARM_L2";
    MASK[MASK["ARM_L3"] = 8192] = "ARM_L3";
    MASK[MASK["HEAD"] = 16384] = "HEAD";
    MASK[MASK["ARM_L"] = 14336] = "ARM_L";
    MASK[MASK["ARM_R"] = 1792] = "ARM_R";
    MASK[MASK["LEG_L"] = 14] = "LEG_L";
    MASK[MASK["LEG_R"] = 112] = "LEG_R";
    MASK[MASK["BRAID"] = 23424] = "BRAID";
    MASK[MASK["UPPER"] = 16256] = "UPPER";
    MASK[MASK["LOWER"] = 127] = "LOWER";
    MASK[MASK["ALL"] = 4294967295] = "ALL";
})(MASK || (MASK = {}));
var Skeleton = /** @class */ (function () {
    function Skeleton(bonesStartingPos) {
        this._bones = [];
        this._bonesStartingPos = bonesStartingPos;
        this._boneMatrices = new Float32Array(64 * 16);
        for (var i = 0; i < 64; ++i) {
            this._boneMatrices.set([1], 0 + 16 * i);
            this._boneMatrices.set([1], 5 + 16 * i);
            this._boneMatrices.set([1], 10 + 16 * i);
            this._boneMatrices.set([1], 15 + 16 * i);
        }
        for (var b = 0; b < bonesStartingPos.length; ++b) {
            var parent_1 = bonesStartingPos[b].parent, bone = _Proxy_Engine__WEBPACK_IMPORTED_MODULE_0__["default"].makeNode("Skeleton bone node", _Proxy_Engine__WEBPACK_IMPORTED_MODULE_0__["default"].activeScene);
            this.bones.push(bone);
            if (parent_1 >= 0) {
                this.bones[parent_1].add(bone);
            }
        }
    }
    Object.defineProperty(Skeleton.prototype, "bones", {
        get: function () {
            return this._bones;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Skeleton.prototype, "bonesStartingPos", {
        get: function () {
            return this._bonesStartingPos;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Skeleton.prototype, "boneMatrices", {
        get: function () {
            return this._boneMatrices;
        },
        enumerable: true,
        configurable: true
    });
    Skeleton.prototype.getBoneDecomposition = function (bone, parentMesh) {
        var _pos = [0, 0, 0], _quat = [0, 0, 0, 0];
        this.bones[bone].decomposeMatrixWorld(_pos, _quat);
        if (parentMesh === undefined) {
            return new _Basis__WEBPACK_IMPORTED_MODULE_1__["Basis"](_pos, _quat);
        }
        var meshBasis = new _Basis__WEBPACK_IMPORTED_MODULE_1__["Basis"](parentMesh.position, parentMesh.quaternion), boneBasis = new _Basis__WEBPACK_IMPORTED_MODULE_1__["Basis"](_pos, _quat);
        return meshBasis.multBasis(boneBasis);
    };
    Skeleton.prototype.updateBoneMatrices = function () {
        this._bones[0].updateMatrixWorld(); // will triger updateMatrixWorld for all descendants of bone #0
        this.setBoneMatrices();
    };
    Skeleton.prototype.setBoneMatrices = function () {
        for (var b = 0; b < this._bones.length; b++) {
            var bone = this._bones[b];
            bone.matrixWorldToArray(this._boneMatrices, b * 16);
        }
    };
    return Skeleton;
}());



/***/ }),

/***/ "../src/Player/SystemLight.ts":
/*!************************************!*\
  !*** ../src/Player/SystemLight.ts ***!
  \************************************/
/*! exports provided: SystemLight */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SystemLight", function() { return SystemLight; });
var SystemLight = /** @class */ (function () {
    function SystemLight() {
        this._positions = [0, 0, 0];
        this._colors = [0, 0, 0];
        this._fadeouts = [0];
        this._lightIds = [];
    }
    Object.defineProperty(SystemLight.prototype, "numLights", {
        get: function () {
            return this._lightIds.length;
        },
        enumerable: true,
        configurable: true
    });
    SystemLight.prototype.add = function () {
        var id = SystemLight.__id++;
        this._lightIds.push(id);
        if (this._lightIds.length > 1) {
            this._positions.push(0, 0, 0);
            this._colors.push(0, 0, 0);
            this._fadeouts.push(0);
        }
        return id;
    };
    SystemLight.prototype.remove = function (id) {
        var idx = this.findIndexFromId(id);
        if (idx < 0) {
            return;
        }
        if (this._lightIds.length > 1) {
            this._positions.splice(idx * 3, 3);
            this._colors.splice(idx * 3, 3);
            this._fadeouts.splice(idx, 1);
        }
        this._lightIds.splice(idx, 1);
    };
    SystemLight.prototype.setPosition = function (id, position) {
        var idx = this.findIndexFromId(id);
        this._positions[idx * 3 + 0] = position[0];
        this._positions[idx * 3 + 1] = position[1];
        this._positions[idx * 3 + 2] = position[2];
    };
    SystemLight.prototype.setColor = function (id, color) {
        var idx = this.findIndexFromId(id);
        this._colors[idx * 3 + 0] = color[0];
        this._colors[idx * 3 + 1] = color[1];
        this._colors[idx * 3 + 2] = color[2];
    };
    SystemLight.prototype.setFadeout = function (id, distance) {
        var idx = this.findIndexFromId(id);
        this._fadeouts[idx] = distance;
    };
    SystemLight.prototype.bindToUniforms = function (uniforms) {
        uniforms.numSystemLight.value = this._lightIds.length;
        uniforms.systemLight_position.value = this._positions;
        uniforms.systemLight_color.value = this._colors;
        uniforms.systemLight_distance.value = this._fadeouts;
    };
    SystemLight.prototype.findIndexFromId = function (id) {
        for (var i = 0; i < this._lightIds.length; ++i) {
            if (this._lightIds[i] == id) {
                return i;
            }
        }
        return -1;
    };
    SystemLight.__id = 0;
    return SystemLight;
}());



/***/ }),

/***/ "../src/Player/TRLevel.ts":
/*!********************************!*\
  !*** ../src/Player/TRLevel.ts ***!
  \********************************/
/*! exports provided: TRLevel */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TRLevel", function() { return TRLevel; });
/* harmony import */ var _Proxy_Engine__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Proxy/Engine */ "../src/Proxy/Engine.ts");

var TRLevel = /** @class */ (function () {
    function TRLevel() {
        this.movObjID2Index = new Map();
        this.sceneRender = null;
        this.objMgr = null;
        this.confMgr = null;
        this.shdMgr = null;
        this.trlevel = null;
        this.gameData = null;
    }
    TRLevel.prototype.initialize = function (gameData) {
        this.gameData = gameData;
        this.trlevel = gameData.sceneData.trlevel;
        this.sceneRender = gameData.sceneRender;
        this.sceneData = gameData.sceneData;
        this.objMgr = gameData.objMgr;
        this.confMgr = gameData.confMgr;
        this.shdMgr = gameData.shdMgr;
        for (var m = 0; m < this.trlevel.moveables.length; ++m) {
            var moveable = this.trlevel.moveables[m];
            this.movObjID2Index.set(moveable.objectID, m);
        }
    };
    TRLevel.prototype.getMoveableIndex = function (objectID) {
        return this.movObjID2Index.get(objectID);
    };
    TRLevel.prototype.getRoomByPos = function (pos) {
        var trlevel = this.trlevel, x = Math.floor(pos[0]), y = -Math.floor(pos[1]), z = -Math.floor(pos[2]);
        for (var r = 0; r < trlevel.rooms.length; ++r) {
            var room = trlevel.rooms[r];
            if (room.isAlternate) {
                continue;
            }
            var mx = room.info.x + room.numXsectors * 1024;
            var mz = room.info.z + room.numZsectors * 1024;
            if (x >= room.info.x && x < mx && z >= room.info.z && z < mz && y >= room.info.yTop && y < room.info.yBottom) {
                return r;
            }
        }
        return -1;
    };
    TRLevel.prototype.isPointInRoom = function (pos, roomIndex) {
        var room = this.trlevel.rooms[roomIndex];
        var x = Math.floor(pos[0]), y = -Math.floor(pos[1]), z = -Math.floor(pos[2]);
        var mx = room.info.x + room.numXsectors * 1024;
        var mz = room.info.z + room.numZsectors * 1024;
        if (x >= room.info.x && x < mx && z >= room.info.z && z < mz && y >= room.info.yTop && y < room.info.yBottom) {
            return true;
        }
        return false;
    };
    TRLevel.prototype.getItemsWithObjID = function (objID) {
        var items = [];
        for (var i = 0; i < this.trlevel.items.length; ++i) {
            var item = this.trlevel.items[i];
            if (item.objectID == objID) {
                items.push(item);
            }
        }
        return items;
    };
    TRLevel.prototype.convertIntensity = function (intensity) {
        var l = [intensity / 8192.0, intensity / 8192.0, intensity / 8192.0];
        if (this.trlevel.rversion == 'TR3' || this.trlevel.rversion == 'TR4') {
            var b = ((intensity & 0x7C00) >> 10) << 3, g = ((intensity & 0x03E0) >> 5) << 3, r = (intensity & 0x001F) << 3;
            l = [r / 255, g / 255, b / 255];
        }
        return l;
    };
    TRLevel.prototype.convertLighting = function (lighting1) {
        var color = [0, 0, 0];
        switch (this.trlevel.rversion) {
            case 'TR1':
            case 'TR2': {
                var lighting = Math.floor((1.0 - lighting1 / 8192.) * 2 * 256);
                if (lighting > 255) {
                    lighting = 255;
                }
                color = [lighting / 255.0, lighting / 255.0, lighting / 255.0];
                break;
            }
            case 'TR3': {
                var lighting = lighting1;
                var r = (lighting & 0x7C00) >> 10, g = (lighting & 0x03E0) >> 5, b = (lighting & 0x001F);
                color = [((r << 3) + 0x7) / 255.0, ((g << 3) + 0x7) / 255.0, ((b << 3) + 0x7) / 255.0];
                break;
            }
            case 'TR4': {
                var lighting = lighting1;
                var r = (((lighting & 0x7C00) >> 7) + 7) << 1, g = (((lighting & 0x03E0) >> 2) + 7) << 1, b = (((lighting & 0x001F) << 3) + 7) << 1;
                if (r > 255) {
                    r = 255;
                }
                if (g > 255) {
                    g = 255;
                }
                if (b > 255) {
                    b = 255;
                }
                color = [r / 255.0, g / 255.0, b / 255.0];
                break;
            }
        }
        return color;
    };
    TRLevel.prototype.createObjectsInLevel = function () {
        var _this = this;
        for (var i = 0; i < this.trlevel.items.length; ++i) {
            var item = this.trlevel.items[i];
            var roomIndex = item.room, lighting = item.intensity1, q = glMatrix.quat.create();
            glMatrix.quat.setAxisAngle(q, [0, 1, 0], glMatrix.glMatrix.toRadian(-(item.angle >> 14) * 90));
            var m = this.movObjID2Index.get(item.objectID);
            if (m == null) {
                var obj = this.objMgr.createSprite(-item.objectID, roomIndex, this.convertLighting(lighting), true);
                if (obj != null) {
                    obj.setPosition([item.x, -item.y, -item.z]);
                    obj.matrixAutoUpdate = true;
                }
            }
            else {
                var obj = this.objMgr.createMoveable(item.objectID, roomIndex, lighting != -1 ? this.convertIntensity(lighting) : undefined);
                if (obj != null) {
                    obj.setPosition([item.x, -item.y, -item.z]);
                    obj.setQuaternion(q);
                    obj.matrixAutoUpdate = true;
                }
                else {
                    // moveable is a placeholder with no geometry
                    var spriteSeqObjID = this.confMgr.number('moveable[id="' + item.objectID + '"] > spritesequence', true, -1);
                    if (spriteSeqObjID >= 0) {
                        obj = this.objMgr.createSprite(-spriteSeqObjID, roomIndex, [1, 1, 1], true);
                        if (obj != null) {
                            obj.setPosition([item.x, -item.y, -item.z]);
                            obj.matrixAutoUpdate = true;
                        }
                    }
                }
            }
        }
        var _loop_1 = function (m) {
            var room = this_1.trlevel.rooms[m], info = room.info, rdata = room.roomData, data = this_1.sceneData.objects['room' + m];
            this_1.gameData.matMgr.createLightUniformsForObject(this_1.gameData.objMgr.objectList['room'][m], true);
            // create portals
            var portals = data.portals, meshPortals = [];
            data.meshPortals = meshPortals;
            var _loop_2 = function (p) {
                var portal = portals[p];
                var vertices = [
                    portal.vertices[0].x, portal.vertices[0].y, portal.vertices[0].z,
                    portal.vertices[1].x, portal.vertices[1].y, portal.vertices[1].z,
                    portal.vertices[2].x, portal.vertices[2].y, portal.vertices[2].z,
                    portal.vertices[3].x, portal.vertices[3].y, portal.vertices[3].z
                ];
                var colors = [
                    1, 0, 0,
                    0, 1, 0,
                    0, 0, 1,
                    1, 1, 1
                ];
                var faces = [
                    0, 1, 2,
                    0, 2, 3
                ];
                Promise.all([this_1.shdMgr.getVertexShader('TR_portal'), this_1.shdMgr.getFragmentShader('TR_portal')]).then(function (shd) {
                    var meshb = _Proxy_Engine__WEBPACK_IMPORTED_MODULE_0__["default"].makeMeshBuilder(), mesh = meshb.createMesh('room' + m + '_portal' + p, _this.gameData.sceneRender, shd[0], shd[1], undefined, vertices, faces, undefined, colors);
                    mesh.materials.forEach(function (m) { return (m.transparent = true, m.depthWrite = false); });
                    mesh.setPosition([0, 0, 0]);
                    mesh.matrixAutoUpdate = false;
                    mesh.visible = false;
                    meshPortals.push(mesh);
                });
            };
            for (var p = 0; p < portals.length; ++p) {
                _loop_2(p);
            }
            // static meshes in the room
            for (var s = 0; s < room.staticMeshes.length; ++s) {
                var staticMesh = room.staticMeshes[s], x = staticMesh.x, y = -staticMesh.y, z = -staticMesh.z, rot = ((staticMesh.rotation & 0xC000) >> 14) * 90, objectID = staticMesh.objectID;
                var mflags = this_1.sceneData.objects['staticmesh' + objectID].flags, nonCollisionable = (mflags & 1) != 0, visible = (mflags & 2) != 0;
                if (!visible) {
                    continue;
                }
                var q = glMatrix.quat.create();
                glMatrix.quat.setAxisAngle(q, [0, 1, 0], glMatrix.glMatrix.toRadian(-rot));
                var obj = this_1.objMgr.createStaticMesh(objectID, m, this_1.convertIntensity(staticMesh.intensity1), true);
                if (obj != null) {
                    obj.visible = !data.isAlternateRoom;
                    obj.setPosition([x, y, z]);
                    obj.setQuaternion(q);
                    obj.matrixAutoUpdate = false;
                }
            }
            // sprites in the room
            for (var s = 0; s < rdata.sprites.length; ++s) {
                var sprite = rdata.sprites[s], spriteIndex = sprite.texture, rvertex = rdata.vertices[sprite.vertex], lighting = this_1.trlevel.rversion == 'TR1' ? rvertex.lighting1 : rvertex.lighting2;
                var obj = this_1.objMgr.createSprite(spriteIndex, m, this_1.convertLighting(lighting), true);
                if (obj != null) {
                    obj.visible = !data.isAlternateRoom;
                    obj.setPosition([rvertex.vertex.x + info.x, -rvertex.vertex.y, -rvertex.vertex.z - info.z]);
                    obj.matrixAutoUpdate = true;
                }
            }
        };
        var this_1 = this;
        for (var m = 0; m < this.trlevel.rooms.length; ++m) {
            _loop_1(m);
        }
    };
    return TRLevel;
}());



/***/ }),

/***/ "../src/Proxy/Engine.ts":
/*!******************************!*\
  !*** ../src/Proxy/Engine.ts ***!
  \******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
var Engine = /** @class */ (function () {
    function Engine() {
    }
    Engine.registerFunctions = function (pointers) {
        Engine.pointers = pointers;
    };
    Engine.makeNode = function (name, scene) {
        return Engine.pointers.makeNode(name, scene);
    };
    Engine.makeMeshBuilder = function (mesh) {
        return Engine.pointers.makeMeshBuilder(mesh);
    };
    Engine.parseScene = function (sceneJSON) {
        return Engine.pointers.parseScene(sceneJSON);
    };
    Engine.createRenderer = function (container) {
        return Engine.pointers.createRenderer(container);
    };
    Engine.getShaderMgr = function () {
        return Engine.pointers.getShaderMgr;
    };
    Object.defineProperty(Engine, "activeScene", {
        get: function () {
            return Engine._activeScene;
        },
        set: function (as) {
            Engine._activeScene = as;
        },
        enumerable: true,
        configurable: true
    });
    return Engine;
}());
/* harmony default export */ __webpack_exports__["default"] = (Engine);


/***/ }),

/***/ "../src/Proxy/IMesh.ts":
/*!*****************************!*\
  !*** ../src/Proxy/IMesh.ts ***!
  \*****************************/
/*! exports provided: isMesh */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isMesh", function() { return isMesh; });
function isMesh(obj) {
    return obj.materials !== undefined;
}


/***/ }),

/***/ "../src/ShaderManager.ts":
/*!*******************************!*\
  !*** ../src/ShaderManager.ts ***!
  \*******************************/
/*! exports provided: shaderType, ShaderManager */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "shaderType", function() { return shaderType; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ShaderManager", function() { return ShaderManager; });
var shaderType;
(function (shaderType) {
    shaderType["vertex"] = "vertex";
    shaderType["fragment"] = "fragment";
})(shaderType || (shaderType = {}));
var ShaderManager = /** @class */ (function () {
    function ShaderManager(dirPath) {
        this._fpath = dirPath || 'resources/shader/';
        this._fileCache = {};
        this._level = null;
        this._globalLightsInFragment = true;
    }
    Object.defineProperty(ShaderManager.prototype, "globalLightsInFragment", {
        get: function () {
            return this._globalLightsInFragment;
        },
        set: function (glif) {
            this._globalLightsInFragment = glif;
        },
        enumerable: true,
        configurable: true
    });
    ShaderManager.prototype.getShader = function (ptype, name, forceReload) {
        if (forceReload === void 0) { forceReload = false; }
        return this._getFile(name + (ptype == shaderType.vertex ? '.vs' : '.fs'), forceReload);
    };
    ShaderManager.prototype.getVertexShader = function (name, forceReload) {
        if (forceReload === void 0) { forceReload = false; }
        return this.getShader(shaderType.vertex, name, forceReload);
    };
    ShaderManager.prototype.getFragmentShader = function (name, forceReload) {
        if (forceReload === void 0) { forceReload = false; }
        return this.getShader(shaderType.fragment, name, forceReload);
    };
    ShaderManager.prototype.setTRLevel = function (level) {
        this._level = level;
    };
    ShaderManager.prototype.preprocess = function (code) {
        return code
            .replace(/##tr_version##/g, this._level.rversion.substr(2))
            .replace(/##global_lights_in_vertex##/g, this._globalLightsInFragment ? "0" : "1")
            .replace(/##global_lights_in_fragment##/g, this._globalLightsInFragment ? "1" : "0");
    };
    ShaderManager.prototype._getFile = function (fname, forceReload) {
        if (forceReload === void 0) { forceReload = false; }
        if (!forceReload && typeof this._fileCache[fname] != 'undefined') {
            return this._fileCache[fname];
        }
        this._fileCache[fname] = this._loadFile(fname);
        return this._fileCache[fname];
    };
    ShaderManager.prototype._loadFile = function (fname) {
        var _this = this;
        return fetch(this._fpath + fname).then(function (response) {
            return response.text().then(function (txt) {
                return _this.preprocess(txt);
            });
        });
    };
    return ShaderManager;
}());



/***/ }),

/***/ "../src/Utils/BinaryBuffer.ts":
/*!************************************!*\
  !*** ../src/Utils/BinaryBuffer.ts ***!
  \************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
var BinaryBuffer = /** @class */ (function () {
    function BinaryBuffer(urlList) {
        this.urlList = urlList;
        this.bufferList = new Array();
        this.loadCount = 0;
    }
    BinaryBuffer.prototype._loadBuffer = function (url, index, resolve) {
        var _this = this;
        var request = new XMLHttpRequest();
        request.open("GET", url, true);
        request.responseType = "arraybuffer";
        request.onerror = function () {
            console.log('BinaryBuffer: XHR error', request.status, request.statusText);
            if (++_this.loadCount == _this.urlList.length) {
                resolve(_this.bufferList);
            }
        };
        request.onreadystatechange = function () {
            if (request.readyState != 4) {
                return;
            }
            if (request.status != 200) {
                console.log('Could not read a binary file. ', request.status, request.statusText);
                if (++_this.loadCount == _this.urlList.length) {
                    resolve(_this.bufferList);
                }
            }
            else {
                _this.bufferList[index] = request.response;
                if (++_this.loadCount == _this.urlList.length) {
                    resolve(_this.bufferList);
                }
            }
        };
        request.send();
    };
    BinaryBuffer.prototype.load = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            for (var i = 0; i < _this.urlList.length; ++i) {
                _this._loadBuffer(_this.urlList[i], i, resolve);
            }
        });
    };
    return BinaryBuffer;
}());
/* harmony default export */ __webpack_exports__["default"] = (BinaryBuffer);


/***/ }),

/***/ "../src/Utils/Box3.ts":
/*!****************************!*\
  !*** ../src/Utils/Box3.ts ***!
  \****************************/
/*! exports provided: Box3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Box3", function() { return Box3; });
var Box3 = /** @class */ (function () {
    function Box3(min, max) {
        if (min !== undefined) {
            this._min = min;
        }
        else {
            this._min = [+Infinity, +Infinity, +Infinity];
        }
        if (max !== undefined) {
            this._max = max;
        }
        else {
            this._max = [-Infinity, -Infinity, -Infinity];
        }
    }
    Object.defineProperty(Box3.prototype, "min", {
        get: function () {
            return this._min;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Box3.prototype, "max", {
        get: function () {
            return this._max;
        },
        enumerable: true,
        configurable: true
    });
    Box3.prototype.union = function (box) {
        this._min[0] = Math.min(this._min[0], box._min[0]);
        this._min[1] = Math.min(this._min[1], box._min[1]);
        this._min[2] = Math.min(this._min[2], box._min[2]);
        this._max[0] = Math.max(this._max[0], box._max[0]);
        this._max[1] = Math.max(this._max[1], box._max[1]);
        this._max[2] = Math.max(this._max[2], box._max[2]);
    };
    return Box3;
}());



/***/ }),

/***/ "../src/Utils/Browser.ts":
/*!*******************************!*\
  !*** ../src/Utils/Browser.ts ***!
  \*******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
if (!("pointerLockElement" in document)) {
    var getter = (function () {
        // These are the functions that match the spec, and should be preferred
        if ("webkitPointerLockElement" in document) {
            return function () { return document.webkitPointerLockElement; };
        }
        if ("mozPointerLockElement" in document) {
            return function () { return document.mozPointerLockElement; };
        }
        return function () { return null; }; // not supported
    })();
    Object.defineProperty(document, "pointerLockElement", {
        enumerable: true, configurable: false, writable: false,
        get: getter
    });
}
if (!("fullscreenElement" in document)) {
    var getter = (function () {
        if ("webkitFullscreenElement" in document) {
            return function () { return document.webkitFullscreenElement; };
        }
        if ("mozFullScreenElement" in document) {
            return function () { return document.mozFullScreenElement; };
        }
        return function () { return null; }; // not supported
    })();
    Object.defineProperty(document, "fullscreenElement", {
        enumerable: true, configurable: false, writable: false,
        get: getter
    });
}
if (!document.exitPointerLock) {
    document.exitPointerLock = (function () {
        return document.webkitExitPointerLock ||
            document.mozExitPointerLock ||
            function () {
                if (navigator.pointer) {
                    navigator.pointer.unlock();
                }
            };
    })();
}
if (!document.exitFullscreen) {
    document.exitFullscreen = (function () {
        return document.webkitCancelFullScreen ||
            document.mozCancelFullScreen ||
            function () { };
    })();
}
var Browser = /** @class */ (function () {
    function Browser() {
    }
    Object.defineProperty(Browser, "AudioContext", {
        get: function () {
            if (Browser._AudioContext === null) {
                Browser._AudioContext =
                    typeof (AudioContext) != 'undefined' ? new AudioContext() :
                        typeof (window.webkitAudioContext) != 'undefined' ? new window.webkitAudioContext() :
                            typeof (window.mozAudioContext) != 'undefined' ? new window.mozAudioContext() : null;
            }
            return Browser._AudioContext;
        },
        enumerable: true,
        configurable: true
    });
    Browser.bindRequestPointerLock = function (domElement) {
        domElement.requestPointerLock =
            domElement.requestPointerLock ||
                domElement.mozRequestPointerLock ||
                domElement.webkitRequestPointerLock;
    };
    Browser.bindRequestFullscreen = function (domElement) {
        domElement.requestFullscreen =
            domElement.requestFullscreen ||
                domElement.mozRequestFullScreen ||
                domElement.webkitRequestFullscreen ||
                domElement.webkitRequestFullScreen;
    };
    Object.defineProperty(Browser, "QueryString", {
        get: function () {
            if (!Browser._qs) {
            }
            var query_string = {}, query = window.location.search.substring(1), vars = query.split("&");
            for (var i = 0; i < vars.length; i++) {
                var pair = vars[i].split("=");
                // If first entry with this name
                if (typeof query_string[decodeURIComponent(pair[0])] === "undefined") {
                    query_string[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
                    // If second entry with this name
                }
                else if (typeof query_string[decodeURIComponent(pair[0])] === "string") {
                    var arr = [query_string[decodeURIComponent(pair[0])], decodeURIComponent(pair[1])];
                    query_string[decodeURIComponent(pair[0])] = arr;
                    // If third or later entry with this name
                }
                else {
                    query_string[decodeURIComponent(pair[0])].push(decodeURIComponent(pair[1]));
                }
            }
            Browser._qs = query_string;
            return Browser._qs;
        },
        enumerable: true,
        configurable: true
    });
    Browser._qs = null;
    Browser._AudioContext = null;
    return Browser;
}());
/* harmony default export */ __webpack_exports__["default"] = (Browser);


/***/ }),

/***/ "../src/Utils/Misc.ts":
/*!****************************!*\
  !*** ../src/Utils/Misc.ts ***!
  \****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Browser__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Browser */ "../src/Utils/Browser.ts");
/* harmony import */ var _BinaryBuffer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./BinaryBuffer */ "../src/Utils/BinaryBuffer.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};


var Utils = /** @class */ (function () {
    function Utils() {
    }
    Utils.toHexString32 = function (n) {
        if (n < 0) {
            n = 0xFFFFFFFF + n + 1;
        }
        return "0x" + ("00000000" + n.toString(16).toUpperCase()).substr(-8);
    };
    Utils.toHexString16 = function (n) {
        if (n < 0) {
            n = 0xFFFF + n + 1;
        }
        return "0x" + ("0000" + n.toString(16).toUpperCase()).substr(-4);
    };
    Utils.toHexString8 = function (n) {
        if (n < 0) {
            n = 0xFF + n + 1;
        }
        return "0x" + ("00" + n.toString(16).toUpperCase()).substr(-2);
    };
    Utils.flattenArray = function (a) {
        if (!a) {
            return;
        }
        var res = [];
        for (var i = 0; i < a.length; ++i) {
            res.push(a[i]);
        }
        return res;
    };
    Utils.flatten = function (obj, fpath) {
        function flatten_sub(o, parts, p) {
            if (!o) {
                return;
            }
            for (; p < parts.length - 1; ++p) {
                o = o[parts[p]];
                if (Array.isArray(o)) {
                    for (var i = 0; i < o.length; ++i) {
                        flatten_sub(o[i], parts, p + 1);
                    }
                    return;
                }
            }
            if (!o) {
                return;
            }
            if (Array.isArray(o[parts[p]])) {
                for (var i = 0; i < o[parts[p]].length; ++i) {
                    o[parts[p]][i] = Utils.flattenArray(o[parts[p]][i]);
                }
            }
            else {
                o[parts[p]] = Utils.flattenArray(o[parts[p]]);
            }
        }
        flatten_sub(obj, fpath.split('.'), 0);
    };
    Utils.objSize = function (o) {
        return Object.keys(o).length;
    };
    Utils.saveData = function (filename, data) {
        return __awaiter(this, void 0, void 0, function () {
            var blob, url, a;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch(data)];
                    case 1: return [4 /*yield*/, (_a.sent()).blob()];
                    case 2:
                        blob = _a.sent();
                        url = URL.createObjectURL(blob);
                        a = document.createElement('a');
                        a.href = url;
                        a.target = '_blank';
                        a.download = filename + '.png';
                        a.click();
                        setTimeout(function () { URL.revokeObjectURL(url); }, 4E4); // 40s
                        return [2 /*return*/];
                }
            });
        });
    };
    Utils.convertToPng = function (imgData) {
        var canvas = document.createElement("canvas");
        canvas.width = imgData.width;
        canvas.height = imgData.height;
        var context = canvas.getContext('2d');
        context.putImageData(imgData, 0, 0);
        return canvas.toDataURL('image/png');
    };
    Utils.domNodeToJSon = function (node) {
        var children = {};
        var attrs = node.attributes;
        if (attrs && attrs.length > 0) {
            var attr = {};
            children.__attributes = attr;
            for (var i = 0; i < attrs.length; i++) {
                var at = attrs[i];
                attr[at.nodeName] = at.nodeValue;
            }
        }
        var childNodes = node.childNodes;
        if (childNodes) {
            var textVal = '', hasRealChild = false;
            for (var i = 0; i < childNodes.length; i++) {
                var child = childNodes[i], cname = child.nodeName;
                switch (child.nodeType) {
                    case 1:
                        hasRealChild = true;
                        if (children[cname]) {
                            if (!Array.isArray(children[cname])) {
                                children[cname] = [children[cname]];
                            }
                            children[cname].push(Utils.domNodeToJSon(child));
                        }
                        else {
                            children[cname] = Utils.domNodeToJSon(child);
                        }
                        break;
                    case 3:
                        if (child.nodeValue) {
                            textVal += child.nodeValue;
                        }
                        break;
                }
            }
            textVal = textVal.replace(/[ \r\n\t]/g, '').replace(' ', '');
            if (textVal !== '') {
                if (children.__attributes == undefined && !hasRealChild) {
                    children = textVal;
                }
                else {
                    children.__value = textVal;
                }
            }
            else if (children.__attributes == undefined && !hasRealChild) {
                children = null;
            }
        }
        return children;
    };
    Utils.startSound = function (sound) {
        if (sound == null) {
            return;
        }
        sound.start ? sound.start(0) : sound.noteOn ? sound.noteOn(0) : '';
    };
    Utils.loadSoundAsync = function (filepath) {
        return __awaiter(this, void 0, void 0, function () {
            var binaryBuffer, pbinBuff;
            return __generator(this, function (_a) {
                if (!filepath || !_Browser__WEBPACK_IMPORTED_MODULE_0__["default"].AudioContext) {
                    return [2 /*return*/, Promise.resolve(null)];
                }
                binaryBuffer = new _BinaryBuffer__WEBPACK_IMPORTED_MODULE_1__["default"]([filepath]), pbinBuff = binaryBuffer.load();
                return [2 /*return*/, pbinBuff.then(function (bufferList) {
                        if (bufferList != null && bufferList.length > 0) {
                            return (new Promise(function (resolve, reject) {
                                return _Browser__WEBPACK_IMPORTED_MODULE_0__["default"].AudioContext.decodeAudioData(bufferList[0], function (buffer) {
                                    var ret = {
                                        code: 0
                                    };
                                    if (!buffer) {
                                        ret.code = -1;
                                    }
                                    else {
                                        ret.soundbuffer = buffer;
                                        ret.sound = _Browser__WEBPACK_IMPORTED_MODULE_0__["default"].AudioContext.createBufferSource();
                                        ret.sound.buffer = buffer;
                                    }
                                    resolve(ret);
                                });
                            }));
                        }
                        else {
                            console.log('Error when loading sound async. path=', filepath);
                            return Promise.resolve(null);
                        }
                    })];
            });
        });
    };
    Utils.lerp = function (a, b, t) {
        if (t <= 0.0) {
            return a;
        }
        if (t >= 1.0) {
            return b;
        }
        return a + (b - a) * t;
    };
    return Utils;
}());
/* harmony default export */ __webpack_exports__["default"] = (Utils);


/***/ }),

/***/ "../src/Utils/Panel.ts":
/*!*****************************!*\
  !*** ../src/Utils/Panel.ts ***!
  \*****************************/
/*! exports provided: Panel */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Panel", function() { return Panel; });
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var Panel = /** @class */ (function () {
    function Panel(domElement, gameData, renderer) {
        var _this = this;
        this._elem = jQuery('');
        this._parent = gameData;
        this._renderer = renderer;
        this._show = false;
        jQuery("<style type=\"text/css\" media=\"all\">@import \"" + gameData.relpath + "resources/css/panel.css?ver=3\";</style>").appendTo(domElement);
        fetch(gameData.relpath + 'resources/template/panel.html').then(function (response) {
            response.text().then(function (html) {
                _this._elem = jQuery(html);
                _this._elem.appendTo(domElement);
                _this.bindEvents(_this);
                _this._setState();
            });
        });
    }
    Panel.prototype.show = function () {
        this._show = true;
        this._setState();
    };
    Panel.prototype.hide = function () {
        this._show = false;
        this._setState();
    };
    Panel.prototype.showInfo = function () {
        var sceneData = this._parent.sceneData, camera = this._parent.camera, perfData = this._renderer.getPerfData([this._parent.sceneRender, this._parent.sceneBackground]);
        var regularLights = this._parent.curRoom == -1 ? 0 : (this._parent.matMgr.useAdditionalLights ? sceneData.objects['room' + this._parent.curRoom].lightsExt.length : sceneData.objects['room' + this._parent.curRoom].lights.length);
        var globalLights = this._parent.curRoom == -1 || !sceneData.objects['room' + this._parent.curRoom].globalLights ? 0 : sceneData.objects['room' + this._parent.curRoom].globalLights.length;
        this._elem.find('#currentroom').html(this._parent.curRoom.toString());
        this._elem.find('#numlights').html('' + regularLights + " - " + globalLights);
        this._elem.find('#camerapos').html(camera.position[0].toFixed(5) + ',' + camera.position[1].toFixed(5) + ',' + camera.position[2].toFixed(5));
        this._elem.find('#camerarot').html(camera.quaternion[0].toFixed(5) + ',' + camera.quaternion[1].toFixed(5) + ',' + camera.quaternion[2].toFixed(5) + ',' + camera.quaternion[3].toFixed(5));
        if (perfData) {
            this._elem.find('#renderinfo').html(perfData.numDrawCalls + ' / ' + perfData.numFaces + ' / ' + perfData.numObjects + ' / ' + perfData.numParticles);
            this._elem.find('#memoryinfo').html(perfData.numGeometries + ' / ' + perfData.numPrograms + ' / ' + perfData.numTextures);
        }
    };
    Panel.prototype.updateFromParent = function () {
        this._elem.find('#singleroommode').prop('checked', this._parent.singleRoomMode);
        this._elem.find('#useaddlights').prop('checked', this._parent.matMgr.useAdditionalLights);
    };
    Panel.prototype.bindEvents = function (This) {
        this._elem.on('click', function (e) { e.stopPropagation(); return false; });
        this._elem.find('#singleroommode').on('click', function (e) {
            e.stopPropagation();
            This._parent.singleRoomMode = this.checked;
        });
        this._elem.find('#wireframemode').on('click', function (e) {
            var _this = this;
            e.stopPropagation();
            var scene = This._parent.sceneRender;
            scene.traverse(function (obj) {
                var materials = obj.materials;
                for (var i = 0; i < materials.length; ++i) {
                    var material = materials[i];
                    (material.material).wireframe = _this.checked;
                }
            });
        });
        this._elem.find('#usefog').on('click', function (e) {
            var _this = this;
            e.stopPropagation();
            var scene = This._parent.sceneRender;
            scene.traverse(function (obj) {
                var materials = obj.materials;
                for (var i = 0; i < materials.length; ++i) {
                    var material = materials[i];
                    if (material.uniforms && material.uniforms.useFog) {
                        material.uniforms.useFog.value = _this.checked ? 1 : 0;
                        material.uniformsUpdated(["useFog"]);
                    }
                }
            });
        });
        this._elem.find('#nolights').on('click', function (e) {
            var _this = this;
            e.stopPropagation();
            var scene = This._parent.sceneRender, white = [1, 1, 1];
            scene.traverse(function (obj) {
                var materials = obj.materials;
                for (var i = 0; i < materials.length; ++i) {
                    var material = materials[i];
                    if (!material.uniforms || material.uniforms.numPointLight === undefined) {
                        return;
                    }
                    if (material.__savenum === undefined) {
                        material.__savenum = material.uniforms.numPointLight.value;
                        material.__saveambient = material.uniforms.ambientColor.value;
                    }
                    material.uniforms.numPointLight.value = _this.checked ? 0 : material.__savenum;
                    material.uniforms.ambientColor.value = _this.checked ? white : material.__saveambient;
                    material.uniformsUpdated(["numPointLight", "ambientColor"]);
                }
            });
        });
        this._elem.find('#showboundingboxes').on('click', function (e) {
            var _this = this;
            e.stopPropagation();
            var scene = This._parent.sceneRender;
            scene.traverse(function (obj) {
                if (obj.materials.length == 0) {
                    return;
                }
                obj.showBoundingBox(_this.checked);
            });
        });
        this._elem.find('#showportals').on('click', function (e) {
            var _this = this;
            e.stopPropagation();
            var scene = This._parent.sceneRender, sceneData = This._parent.sceneData;
            scene.traverse(function (obj) {
                var data = sceneData.objects[obj.name];
                if (!data || data.type != 'room' && data.meshPortals) {
                    return;
                }
                var portals = data.meshPortals;
                if (!portals) {
                    return;
                }
                for (var i = 0; i < portals.length; ++i) {
                    portals[i].visible = _this.checked;
                }
            });
        });
        this._elem.find('#fullscreen').on('click', function (e) {
            e.stopPropagation();
            if (document.fullscreenElement != null) {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                }
            }
            else if (document.body.requestFullscreen) {
                document.body.requestFullscreen();
            }
        });
        this._elem.find('#useqwerty').on('click', function (e) {
            e.stopPropagation();
            var bc = This._parent.bhvMgr.getBehaviour("BasicControl");
            if (bc === undefined) {
                return;
            }
            var states = bc[0].states, STATES = bc[0].STATES;
            if (this.checked) {
                states[87] = { state: STATES.FORWARD, on: false }; // W
                states[65] = { state: STATES.LEFT, on: false }; // A
                delete states[90]; // Z
                delete states[81]; // Q
            }
            else {
                states[90] = { state: STATES.FORWARD, on: false }; // W
                states[81] = { state: STATES.LEFT, on: false }; // A
                delete states[87]; // W
                delete states[65]; // A
            }
        });
        this._elem.find('#noobjecttexture').on('click', function (e) {
            var _this = this;
            e.stopPropagation();
            var shaderMgr = This._parent.shdMgr, scene = This._parent.sceneRender, shader = shaderMgr.getFragmentShader('TR_uniformcolor');
            shader.then(function (code) {
                scene.traverse(function (obj) {
                    if (obj.name.match(/moveable|sprite|staticmesh/) == null) {
                        return;
                    }
                    var materials = obj.materials;
                    for (var i = 0; i < materials.length; ++i) {
                        var material = materials[i], origFragmentShader = material.origFragmentShader;
                        if (!origFragmentShader) {
                            material.origFragmentShader = material.fragmentShader;
                        }
                        material.fragmentShader = _this.checked ? code : material.origFragmentShader;
                    }
                });
            });
        });
        this._elem.find('#lowlightsquality').on('click', function (e) {
            return __awaiter(this, void 0, void 0, function () {
                var shaderMgr, scene, shaders, _a;
                var _this = this;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            e.stopPropagation();
                            shaderMgr = This._parent.shdMgr, scene = This._parent.sceneRender;
                            shaderMgr.globalLightsInFragment = !this.checked;
                            return [4 /*yield*/, shaderMgr.getFragmentShader('TR_standard', true)];
                        case 1:
                            _a = [_b.sent()];
                            return [4 /*yield*/, shaderMgr.getVertexShader('TR_room', true)];
                        case 2:
                            _a = _a.concat([_b.sent()]);
                            return [4 /*yield*/, shaderMgr.getVertexShader('TR_moveable', true)];
                        case 3:
                            _a = _a.concat([_b.sent()]);
                            return [4 /*yield*/, shaderMgr.getVertexShader('TR_mesh', true)];
                        case 4:
                            shaders = _a.concat([_b.sent()]);
                            return [4 /*yield*/, Promise.all(shaders)];
                        case 5:
                            _b.sent();
                            scene.traverse(function (obj) {
                                var vshader = obj.name.startsWith("moveable") ? shaders[2] :
                                    obj.name.startsWith("room") ? shaders[1] :
                                        obj.name.startsWith("staticmesh") ? shaders[3] : '';
                                if (vshader === '') {
                                    return;
                                }
                                var materials = obj.materials;
                                for (var i = 0; i < materials.length; ++i) {
                                    var material = materials[i], origFragmentShader = material.origFragmentShader, origVertexShader = material.origVertexShader;
                                    if (!origFragmentShader) {
                                        material.origFragmentShader = material.fragmentShader;
                                    }
                                    if (!origVertexShader) {
                                        material.origVertexShader = material.vertexShader;
                                    }
                                    material.vertexShader = _this.checked ? vshader : material.origVertexShader;
                                    material.fragmentShader = _this.checked ? shaders[0] : material.origFragmentShader;
                                }
                            });
                            return [2 /*return*/];
                    }
                });
            });
        });
        this._elem.find('#nobumpmapping').on('click', function (e) {
            e.stopPropagation();
            var scene = This._parent.sceneRender;
            scene.traverse(function (obj) {
                var data = This._parent.sceneData.objects[obj.name];
                if (!data || data.type != "room") {
                    return;
                }
                var materials = obj.materials;
                for (var i = 0; i < materials.length; ++i) {
                    var material = materials[i], s = material.uniforms.offsetBump.value[2];
                    material.uniforms.offsetBump.value[2] = material.uniforms.offsetBump.value[3];
                    material.uniforms.offsetBump.value[3] = s;
                    material.uniformsUpdated(['offsetBump']);
                }
            });
        });
        this._elem.find('#useaddlights').on('click', function (e) {
            e.stopPropagation();
            This._parent.matMgr.useAdditionalLights = this.checked;
            This._parent.matMgr.setLightUniformsForObjects(This._parent.objMgr.objectList['moveable']);
        });
        var prefix = ['', 'webkit', 'moz'];
        for (var i = 0; i < prefix.length; ++i) {
            document.addEventListener(prefix[i] + "fullscreenchange", function () {
                This._elem.find('#fullscreen').prop('checked', document.fullscreenElement != null);
            }, false);
        }
    };
    Panel.prototype._setState = function () {
        this._elem.css('display', this._show ? 'block' : 'none');
        jQuery("#stats").css('display', this._show ? 'block' : 'none');
    };
    return Panel;
}());



/***/ }),

/***/ "../src/Utils/ProgressBar.ts":
/*!***********************************!*\
  !*** ../src/Utils/ProgressBar.ts ***!
  \***********************************/
/*! exports provided: ProgressBar */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ProgressBar", function() { return ProgressBar; });
var ProgressBar = /** @class */ (function () {
    function ProgressBar(domElement, relpath) {
        var _this = this;
        if (relpath === void 0) { relpath = "/"; }
        this._elem = jQuery('');
        this._show = false;
        this._showStart = false;
        jQuery("<style type=\"text/css\" media=\"all\">@import \"" + relpath + "resources/css/progressbar.css\";</style>").appendTo(domElement);
        fetch(relpath + 'resources/template/progressbar.html').then(function (response) {
            response.text().then(function (html) {
                _this._elem = jQuery(html);
                _this._elem.appendTo(domElement);
                _this._setState();
            });
        });
    }
    ProgressBar.prototype.show = function () {
        this._show = true;
        this._elem.css('display', 'block');
    };
    ProgressBar.prototype.hide = function () {
        this._show = false;
        this._elem.css('display', 'none');
    };
    ProgressBar.prototype.showStart = function (callback) {
        this._showStart = true;
        this._callback = callback;
        this._elem.find('.message').css('display', 'none');
        this._elem.find('.progressbar').css('display', 'none');
        this._elem.find('.start').css('display', 'block');
        this._elem.find('.start').attr('class', 'start enabled');
        this._elem.find('.start').on('click', callback);
    };
    ProgressBar.prototype._setState = function () {
        this._elem.css('display', this._show ? 'block' : 'none');
        if (this._showStart) {
            this.showStart(this._callback);
        }
    };
    return ProgressBar;
}());



/***/ }),

/***/ "../src/Utils/SkyDome.ts":
/*!*******************************!*\
  !*** ../src/Utils/SkyDome.ts ***!
  \*******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/*
    Ported from the SceneManager::setSkyDome method of Ogre3D engine (https://www.ogre3d.org/docs/api/1.9/class_ogre_1_1_scene_manager.html#add758e3fa5df1291df9ff98b2594d35b)
*/
var SkyDome = /** @class */ (function () {
    function SkyDome() {
    }
    SkyDome.create = function (
    /*Real*/ curvature, 
    /*Real*/ tiling, 
    /*Real*/ distance, 
    /*const Quaternion&*/ orientation, 
    /*int*/ xsegments, /*int*/ ysegments, /*int*/ ySegmentsToKeep) {
        var res = { vertices: [], textures: [], faces: Array() };
        for (var i = 0; i < 5; ++i) {
            var data = SkyDome.createPlane(i, curvature, tiling, distance, orientation, xsegments, ysegments, i != 4 /*BP_UP*/ ? ySegmentsToKeep : -1);
            var numVertices = res.vertices.length / 3;
            for (var f = 0; f < data.faces.length; ++f) {
                res.faces.push(data.faces[f] + numVertices);
            }
            res.vertices = res.vertices.concat(data.vertices);
            res.textures = res.textures.concat(data.textures);
        }
        return res;
    };
    SkyDome.createPlane = function (
    /*BoxPlane*/ bp, 
    /*Real*/ curvature, 
    /*Real*/ tiling, 
    /*Real*/ distance, 
    /*const Quaternion&*/ orientation, 
    /*int*/ xsegments, /*int*/ ysegments, /*int*/ ysegments_keep) {
        var BP_FRONT = 0, BP_BACK = 1, BP_LEFT = 2, BP_RIGHT = 3, BP_UP = 4, BP_DOWN = 5;
        var plane = { constant: distance, normal: [0, 0, 0] };
        var up = [0, 1, 0];
        // Set up plane equation
        switch (bp) {
            case BP_FRONT:
                plane.normal = [0, 0, 1];
                break;
            case BP_BACK:
                plane.normal = [0, 0, -1];
                break;
            case BP_LEFT:
                plane.normal = [1, 0, 0];
                break;
            case BP_RIGHT:
                plane.normal = [-1, 0, 0];
                break;
            case BP_UP:
                plane.normal = [0, -1, 0];
                up = [0, 0, 1];
                break;
            case BP_DOWN:
                // no down
                return null;
        }
        // Modify by orientation
        glMatrix.vec3.transformQuat(plane.normal, plane.normal, orientation);
        glMatrix.vec3.transformQuat(up, up, orientation);
        // Create new
        var planeSize = distance * 2;
        return SkyDome.createCurvedIllusionPlane(plane, planeSize, planeSize, curvature, xsegments, ysegments, tiling, tiling, up, orientation, ysegments_keep);
    };
    SkyDome.createCurvedIllusionPlane = function (plane, 
    /*Real*/ width, /*Real*/ height, /*Real*/ curvature, 
    /*int*/ xsegments, /*int*/ ysegments, 
    /*Real*/ uTile, /*Real*/ vTile, /*Const Vector3&*/ upVector, 
    /*const Quaternion&*/ orientation, 
    /*int*/ ySegmentsToKeep) {
        var params = {
            plane: plane,
            width: width,
            height: height,
            curvature: curvature,
            xsegments: xsegments,
            ysegments: ysegments,
            xTile: uTile,
            yTile: vTile,
            upVector: upVector,
            orientation: orientation,
            ySegmentsToKeep: ySegmentsToKeep
        };
        return SkyDome.loadManualCurvedIllusionPlane(params);
    };
    SkyDome.loadManualCurvedIllusionPlane = function (params) {
        var vertCoords = [], textCoords = [];
        if (params.ySegmentsToKeep == -1) {
            params.ySegmentsToKeep = params.ysegments;
        }
        if ((params.xsegments + 1) * (params.ySegmentsToKeep + 1) > 65536) {
            throw "Plane tessellation is too high, must generate max 65536 vertices";
        }
        // Work out the transform required
        // Default orientation of plane is normal along +z, distance 0
        // Determine axes
        var zAxis = glMatrix.vec3.clone(params.plane.normal);
        glMatrix.vec3.normalize(zAxis, zAxis);
        var yAxis = glMatrix.vec3.clone(params.upVector);
        glMatrix.vec3.normalize(yAxis, yAxis);
        var xAxis = glMatrix.vec3.create();
        glMatrix.vec3.cross(xAxis, yAxis, zAxis);
        if (glMatrix.vec3.squaredLength(xAxis) == 0) {
            //upVector must be wrong
            throw "The upVector you supplied is parallel to the plane normal, so is not valid.";
        }
        glMatrix.vec3.normalize(xAxis, xAxis);
        var rot = glMatrix.mat4.create();
        glMatrix.mat4.set(rot, xAxis[0], xAxis[1], xAxis[2], 0, yAxis[0], yAxis[1], yAxis[2], 0, zAxis[0], zAxis[1], zAxis[2], 0, 0, 0, 0, 1);
        // Set up standard transform from origin
        var xlate = glMatrix.mat4.create(); // create an identity matrix
        var pnormal = glMatrix.vec3.clone(params.plane.normal);
        glMatrix.vec3.scale(pnormal, pnormal, -params.plane.constant);
        xlate[12] = pnormal[0];
        xlate[13] = pnormal[1];
        xlate[14] = pnormal[2];
        // concatenate
        var xform = glMatrix.mat4.clone(xlate);
        glMatrix.mat4.multiply(xform, xform, rot);
        // Generate vertex data
        // Imagine a large sphere with the camera located near the top
        // The lower the curvature, the larger the sphere
        // Use the angle from viewer to the points on the plane
        // Credit to Aftershock for the general approach
        // Actual values irrelevant, it's the relation between sphere radius and camera position that's important
        var SPHERE_RAD = 100.0;
        var CAM_DIST = 5.0;
        var sphereRadius = SPHERE_RAD - params.curvature;
        var /* Real */ camPos = sphereRadius - CAM_DIST; // Camera position relative to sphere center
        var xSpace = params.width / params.xsegments;
        var ySpace = params.height / params.ysegments;
        var halfWidth = params.width / 2;
        var halfHeight = params.height / 2;
        var invOrientation = glMatrix.quat.clone(params.orientation);
        glMatrix.quat.invert(invOrientation, invOrientation);
        for (var y = params.ysegments - params.ySegmentsToKeep; y < params.ysegments + 1; ++y) {
            for (var x = 0; x < params.xsegments + 1; ++x) {
                // Work out centered on origin
                var vec = glMatrix.vec3.fromValues((x * xSpace) - halfWidth, (y * ySpace) - halfHeight, 0.0);
                // Transform by orientation and distance
                glMatrix.vec3.transformMat4(vec, vec, xform);
                // Assign to geometry
                vertCoords.push(vec[0], vec[1], vec[2]);
                // Generate texture coords
                // Normalise position
                // modify by orientation to return +y up
                glMatrix.vec3.transformQuat(vec, vec, invOrientation);
                glMatrix.vec3.normalize(vec, vec);
                // Find distance to sphere
                var sphDist = Math.sqrt(camPos * camPos * (vec[1] * vec[1] - 1.0) + sphereRadius * sphereRadius) - camPos * vec[1]; // Distance from camera to sphere along box vertex vector
                vec[0] *= sphDist;
                vec[2] *= sphDist;
                // Use x and y on sphere as texture coordinates, tiled
                var s = vec[0] * (0.01 * params.xTile);
                var t = 1.0 - (vec[2] * (0.01 * params.yTile));
                textCoords.push(s, t);
            } // x
        } // y
        var faceIndices = this.tesselate2DMesh(params.xsegments + 1, params.ySegmentsToKeep + 1, false);
        return { vertices: vertCoords, textures: textCoords, faces: faceIndices };
    };
    SkyDome.tesselate2DMesh = function (/*unsigned short*/ meshWidth, /*unsigned short*/ meshHeight, /*bool*/ doubleSided) {
        // Make a list of indexes to spit out the triangles
        var vInc = 1, v = 0, iterations = doubleSided ? 2 : 1;
        var indices = [];
        while (iterations--) {
            // Make tris in a zigzag pattern (compatible with strips)
            var u = 0;
            var uInc = 1; // Start with moving +u
            var vCount = meshHeight - 1;
            while (vCount--) {
                var uCount = meshWidth - 1;
                while (uCount--) {
                    // First Tri in cell
                    indices.push(((v + vInc) * meshWidth) + u, (v * meshWidth) + u, ((v + vInc) * meshWidth) + (u + uInc));
                    // Second Tri in cell
                    indices.push(((v + vInc) * meshWidth) + (u + uInc), (v * meshWidth) + u, (v * meshWidth) + (u + uInc));
                    // Next column
                    u += uInc;
                }
                // Next row
                v += vInc;
                u = 0;
            }
            // Reverse vInc for double sided
            v = meshHeight - 1;
            vInc = -vInc;
        }
        return indices;
    };
    return SkyDome;
}());
/* harmony default export */ __webpack_exports__["default"] = (SkyDome);


/***/ }),

/***/ "./src/Behaviours.ts":
/*!***************************!*\
  !*** ./src/Behaviours.ts ***!
  \***************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _src_Behaviour_AnimatedTexture__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../src/Behaviour/AnimatedTexture */ "../src/Behaviour/AnimatedTexture.ts");
/* harmony import */ var _src_Behaviour_BasicControl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../src/Behaviour/BasicControl */ "../src/Behaviour/BasicControl.ts");
/* harmony import */ var _src_Behaviour_CutScene__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../src/Behaviour/CutScene */ "../src/Behaviour/CutScene.ts");
/* harmony import */ var _src_Behaviour_DynamicLight__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../src/Behaviour/DynamicLight */ "../src/Behaviour/DynamicLight.ts");
/* harmony import */ var _src_Behaviour_Fade__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../src/Behaviour/Fade */ "../src/Behaviour/Fade.ts");
/* harmony import */ var _src_Behaviour_FadeUniformColor__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../src/Behaviour/FadeUniformColor */ "../src/Behaviour/FadeUniformColor.ts");
/* harmony import */ var _src_Behaviour_Lara__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../src/Behaviour/Lara */ "../src/Behaviour/Lara.ts");
/* harmony import */ var _src_Behaviour_Light__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../src/Behaviour/Light */ "../src/Behaviour/Light.ts");
/* harmony import */ var _src_Behaviour_MakeLayeredMesh__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../src/Behaviour/MakeLayeredMesh */ "../src/Behaviour/MakeLayeredMesh.ts");
/* harmony import */ var _src_Behaviour_MuzzleFlash__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../src/Behaviour/MuzzleFlash */ "../src/Behaviour/MuzzleFlash.ts");
/* harmony import */ var _src_Behaviour_Ponytail__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../src/Behaviour/Ponytail */ "../src/Behaviour/Ponytail.ts");
/* harmony import */ var _src_Behaviour_PulsingLight__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../src/Behaviour/PulsingLight */ "../src/Behaviour/PulsingLight.ts");
/* harmony import */ var _src_Behaviour_RemoveObject__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../../src/Behaviour/RemoveObject */ "../src/Behaviour/RemoveObject.ts");
/* harmony import */ var _src_Behaviour_ScrollTexture__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../../src/Behaviour/ScrollTexture */ "../src/Behaviour/ScrollTexture.ts");
/* harmony import */ var _src_Behaviour_SetAnimation__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../../src/Behaviour/SetAnimation */ "../src/Behaviour/SetAnimation.ts");
/* harmony import */ var _src_Behaviour_Sky__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../../src/Behaviour/Sky */ "../src/Behaviour/Sky.ts");
/* harmony import */ var _src_Behaviour_Skydome__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ../../src/Behaviour/Skydome */ "../src/Behaviour/Skydome.ts");
/* harmony import */ var _src_Behaviour_Sprite__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ../../src/Behaviour/Sprite */ "../src/Behaviour/Sprite.ts");
/* harmony import */ var _src_Behaviour_UVRotate__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ../../src/Behaviour/UVRotate */ "../src/Behaviour/UVRotate.ts");
/* harmony import */ var _src_Behaviour_Zbias__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ../../src/Behaviour/Zbias */ "../src/Behaviour/Zbias.ts");






















/***/ }),

/***/ "./src/Camera.ts":
/*!***********************!*\
  !*** ./src/Camera.ts ***!
  \***********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Node__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Node */ "./src/Node.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();

var Camera = /** @class */ (function (_super) {
    __extends(Camera, _super);
    function Camera(camera) {
        var _this = _super.call(this, camera) || this;
        _this._camera = camera;
        return _this;
    }
    Object.defineProperty(Camera.prototype, "object", {
        get: function () {
            return this._camera;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Camera.prototype, "aspect", {
        get: function () {
            return this._camera.aspect;
        },
        set: function (a) {
            this._camera.aspect = a;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Camera.prototype, "fov", {
        get: function () {
            return this._camera.fov;
        },
        set: function (f) {
            this._camera.fov = f;
        },
        enumerable: true,
        configurable: true
    });
    Camera.prototype.updateProjectionMatrix = function () {
        this._camera.updateProjectionMatrix();
    };
    return Camera;
}(_Node__WEBPACK_IMPORTED_MODULE_0__["default"]));
/* harmony default export */ __webpack_exports__["default"] = (Camera);


/***/ }),

/***/ "./src/Material.ts":
/*!*************************!*\
  !*** ./src/Material.ts ***!
  \*************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! three */ "three");
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(three__WEBPACK_IMPORTED_MODULE_0__);

var Material = /** @class */ (function () {
    function Material(mat) {
        this._material = mat;
        this.userData = mat.userData;
        this.uniforms = mat.uniforms;
    }
    Object.defineProperty(Material.prototype, "material", {
        get: function () {
            return this._material;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Material.prototype, "depthWrite", {
        get: function () {
            return this._material.depthWrite;
        },
        set: function (d) {
            this._material.depthWrite = d;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Material.prototype, "transparent", {
        get: function () {
            return this._material.transparent;
        },
        set: function (t) {
            this._material.transparent = t;
            if (t) {
                this._material.blending = three__WEBPACK_IMPORTED_MODULE_0__["AdditiveBlending"];
                this._material.blendSrc = three__WEBPACK_IMPORTED_MODULE_0__["OneFactor"];
                this._material.blendDst = three__WEBPACK_IMPORTED_MODULE_0__["OneMinusSrcColorFactor"];
            }
            else {
                this._material.blending = three__WEBPACK_IMPORTED_MODULE_0__["NoBlending"];
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Material.prototype, "vertexShader", {
        get: function () {
            return this._material.vertexShader;
        },
        set: function (vs) {
            this._material.vertexShader = vs;
            this._material.needsUpdate = true;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Material.prototype, "fragmentShader", {
        get: function () {
            return this._material.fragmentShader;
        },
        set: function (fs) {
            this._material.fragmentShader = fs;
            this._material.needsUpdate = true;
        },
        enumerable: true,
        configurable: true
    });
    Material.prototype.uniformsUpdated = function (names) { };
    Material.prototype.clone = function () {
        return new Material(this._material.clone());
    };
    Material.prototype.setZBias = function (factor, unit) {
        this._material.polygonOffset = true;
        this._material.polygonOffsetFactor = factor;
        this._material.polygonOffsetUnits = unit;
    };
    return Material;
}());
/* harmony default export */ __webpack_exports__["default"] = (Material);


/***/ }),

/***/ "./src/Mesh.ts":
/*!*********************!*\
  !*** ./src/Mesh.ts ***!
  \*********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! three */ "three");
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(three__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _src_Utils_Box3__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../src/Utils/Box3 */ "../src/Utils/Box3.ts");
/* harmony import */ var _Material__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Material */ "./src/Material.ts");
/* harmony import */ var _Node__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Node */ "./src/Node.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __read = (undefined && undefined.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (undefined && undefined.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};




var Mesh = /** @class */ (function (_super) {
    __extends(Mesh, _super);
    function Mesh(obj) {
        var _this = _super.call(this, obj) || this;
        _this._materials = [];
        _this._boundingBox = null;
        if (obj instanceof three__WEBPACK_IMPORTED_MODULE_0__["Mesh"] && Array.isArray(obj.material)) {
            for (var m = 0; m < obj.material.length; ++m) {
                _this._materials.push(new _Material__WEBPACK_IMPORTED_MODULE_2__["default"](obj.material[m]));
            }
        }
        return _this;
    }
    Object.defineProperty(Mesh.prototype, "materials", {
        get: function () {
            return this._materials;
        },
        set: function (mat) {
            this._materials = mat;
            if (this.object instanceof three__WEBPACK_IMPORTED_MODULE_0__["Mesh"]) {
                var mesh_1 = this.object;
                mesh_1.material = [];
                mat.forEach(function (m) { return mesh_1.material.push(m.material); });
            }
        },
        enumerable: true,
        configurable: true
    });
    Mesh.prototype.containsPoint = function (pos) {
        if (this.object instanceof three__WEBPACK_IMPORTED_MODULE_0__["Mesh"]) {
            return this.object.geometry.boundingBox.containsPoint(new (three__WEBPACK_IMPORTED_MODULE_0__["Vector3"].bind.apply(three__WEBPACK_IMPORTED_MODULE_0__["Vector3"], __spread([void 0], pos)))());
        }
        return false;
    };
    Mesh.prototype.showBoundingBox = function (show) {
        if (!this._boundingBox && this.object instanceof three__WEBPACK_IMPORTED_MODULE_0__["Mesh"] && this.object.name.indexOf('portal') < 0) {
            this._boundingBox = new three__WEBPACK_IMPORTED_MODULE_0__["Box3Helper"](this.object.geometry.boundingBox);
            this._boundingBox.name = this.object.name + '_box';
            this._obj.add(this._boundingBox);
        }
        if (this._boundingBox !== null) {
            this._boundingBox.visible = show;
        }
    };
    Mesh.prototype.clone = function () {
        return new Mesh(this.object.clone());
    };
    Mesh.prototype.setBoundingBox = function (box) {
        if (this._obj instanceof three__WEBPACK_IMPORTED_MODULE_0__["Mesh"]) {
            var boundingBox = new three__WEBPACK_IMPORTED_MODULE_0__["Box3"](new three__WEBPACK_IMPORTED_MODULE_0__["Vector3"](box.min[0], box.min[1], box.min[2]), new three__WEBPACK_IMPORTED_MODULE_0__["Vector3"](box.max[0], box.max[1], box.max[2]));
            boundingBox.getBoundingSphere(this._obj.geometry.boundingSphere);
            this._obj.geometry.boundingBox = boundingBox;
            if (this._boundingBox !== null) {
                this._boundingBox.box = boundingBox;
            }
        }
    };
    Mesh.prototype.getBoundingBox = function () {
        if (this._obj instanceof three__WEBPACK_IMPORTED_MODULE_0__["Mesh"]) {
            var bbox = this._obj.geometry.boundingBox;
            return new _src_Utils_Box3__WEBPACK_IMPORTED_MODULE_1__["Box3"]([bbox.min.x, bbox.min.y, bbox.min.z], [bbox.max.x, bbox.max.y, bbox.max.z]);
        }
        return new _src_Utils_Box3__WEBPACK_IMPORTED_MODULE_1__["Box3"]();
    };
    return Mesh;
}(_Node__WEBPACK_IMPORTED_MODULE_3__["default"]));
/* harmony default export */ __webpack_exports__["default"] = (Mesh);


/***/ }),

/***/ "./src/MeshBuilder.ts":
/*!****************************!*\
  !*** ./src/MeshBuilder.ts ***!
  \****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! three */ "three");
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(three__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _Mesh__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Mesh */ "./src/Mesh.ts");
var __read = (undefined && undefined.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (undefined && undefined.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};


var MeshBuilder = /** @class */ (function () {
    function MeshBuilder(mesh) {
        this._tmesh = mesh;
        this._mesh = mesh ? mesh.object : null;
        this._skinIndices = [];
    }
    Object.defineProperty(MeshBuilder.prototype, "mesh", {
        get: function () {
            return this._tmesh;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MeshBuilder.prototype, "skinIndicesList", {
        get: function () {
            return this._skinIndices;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MeshBuilder.prototype, "vertices", {
        get: function () {
            var geometry = this._mesh.geometry, positions = Array.from(geometry.attributes.position.array);
            return positions;
        },
        enumerable: true,
        configurable: true
    });
    MeshBuilder.prototype.createFaces = function (faces, matIndex) {
        var geometry = this._mesh.geometry, index = Array.from(geometry.index.array), positions = Array.from(geometry.attributes.position.array), colors = Array.from(geometry.attributes.vertColor.array), normals = Array.from(geometry.attributes.normal.array), uvs = Array.from(geometry.attributes.uv.array), _flags = Array.from(geometry.attributes._flags.array);
        var addIndex = [], ofstIdx = positions.length / 3;
        for (var f = 0; f < faces.length; ++f, ofstIdx += 3) {
            var face = faces[f];
            positions.push.apply(positions, __spread(face.v1, face.v2, face.v3));
            colors.push.apply(colors, __spread(face.c1, face.c2, face.c3));
            normals.push.apply(normals, __spread(face.n1, face.n2, face.n3));
            uvs.push.apply(uvs, __spread(face.uv1, face.uv2, face.uv3));
            _flags.push.apply(_flags, __spread(face.f1, face.f2, face.f3));
            addIndex.push(ofstIdx, ofstIdx + 1, ofstIdx + 2);
        }
        index.splice.apply(index, __spread([geometry.groups[matIndex].start, 0], addIndex));
        geometry.setIndex(index);
        geometry.groups[matIndex].count += addIndex.length;
        for (var g = matIndex + 1; g < geometry.groups.length; ++g) {
            geometry.groups[g].start += addIndex.length;
        }
        geometry.attributes.position.array = new Float32Array(positions);
        geometry.attributes.position.needsUpdate = true;
        geometry.attributes.vertColor.array = new Float32Array(colors);
        geometry.attributes.vertColor.needsUpdate = true;
        geometry.attributes.normal.array = new Float32Array(normals);
        geometry.attributes.normal.needsUpdate = true;
        geometry.attributes.uv.array = new Float32Array(uvs);
        geometry.attributes.uv.needsUpdate = true;
        geometry.attributes._flags.array = new Float32Array(_flags);
        geometry.attributes._flags.needsUpdate = true;
    };
    MeshBuilder.prototype.copyFace = function (faceIdx) {
        var geom = this._mesh.geometry, index = geom.index.array, newFace = {
            v1: [geom.attributes.position.array[index[faceIdx * 3 + 0] * 3 + 0], geom.attributes.position.array[index[faceIdx * 3 + 0] * 3 + 1], geom.attributes.position.array[index[faceIdx * 3 + 0] * 3 + 2]],
            v2: [geom.attributes.position.array[index[faceIdx * 3 + 1] * 3 + 0], geom.attributes.position.array[index[faceIdx * 3 + 1] * 3 + 1], geom.attributes.position.array[index[faceIdx * 3 + 1] * 3 + 2]],
            v3: [geom.attributes.position.array[index[faceIdx * 3 + 2] * 3 + 0], geom.attributes.position.array[index[faceIdx * 3 + 2] * 3 + 1], geom.attributes.position.array[index[faceIdx * 3 + 2] * 3 + 2]],
            c1: [geom.attributes.vertColor.array[index[faceIdx * 3 + 0] * 3 + 0], geom.attributes.vertColor.array[index[faceIdx * 3 + 0] * 3 + 1], geom.attributes.vertColor.array[index[faceIdx * 3 + 0] * 3 + 2]],
            c2: [geom.attributes.vertColor.array[index[faceIdx * 3 + 1] * 3 + 0], geom.attributes.vertColor.array[index[faceIdx * 3 + 1] * 3 + 1], geom.attributes.vertColor.array[index[faceIdx * 3 + 1] * 3 + 2]],
            c3: [geom.attributes.vertColor.array[index[faceIdx * 3 + 2] * 3 + 0], geom.attributes.vertColor.array[index[faceIdx * 3 + 2] * 3 + 1], geom.attributes.vertColor.array[index[faceIdx * 3 + 2] * 3 + 2]],
            n1: [geom.attributes.normal.array[index[faceIdx * 3 + 0] * 3 + 0], geom.attributes.normal.array[index[faceIdx * 3 + 0] * 3 + 1], geom.attributes.normal.array[index[faceIdx * 3 + 0] * 3 + 2]],
            n2: [geom.attributes.normal.array[index[faceIdx * 3 + 1] * 3 + 0], geom.attributes.normal.array[index[faceIdx * 3 + 1] * 3 + 1], geom.attributes.normal.array[index[faceIdx * 3 + 1] * 3 + 2]],
            n3: [geom.attributes.normal.array[index[faceIdx * 3 + 2] * 3 + 0], geom.attributes.normal.array[index[faceIdx * 3 + 2] * 3 + 1], geom.attributes.normal.array[index[faceIdx * 3 + 2] * 3 + 2]],
            uv1: [geom.attributes.uv.array[index[faceIdx * 3 + 0] * 2 + 0], geom.attributes.uv.array[index[faceIdx * 3 + 0] * 2 + 1]],
            uv2: [geom.attributes.uv.array[index[faceIdx * 3 + 1] * 2 + 0], geom.attributes.uv.array[index[faceIdx * 3 + 1] * 2 + 1]],
            uv3: [geom.attributes.uv.array[index[faceIdx * 3 + 2] * 2 + 0], geom.attributes.uv.array[index[faceIdx * 3 + 2] * 2 + 1]],
            f1: [geom.attributes._flags.array[index[faceIdx * 3 + 0] * 4 + 0], geom.attributes._flags.array[index[faceIdx * 3 + 0] * 4 + 1], geom.attributes._flags.array[index[faceIdx * 3 + 0] * 4 + 2], geom.attributes._flags.array[index[faceIdx * 3 + 0] * 4 + 3]],
            f2: [geom.attributes._flags.array[index[faceIdx * 3 + 1] * 4 + 0], geom.attributes._flags.array[index[faceIdx * 3 + 1] * 4 + 1], geom.attributes._flags.array[index[faceIdx * 3 + 1] * 4 + 2], geom.attributes._flags.array[index[faceIdx * 3 + 1] * 4 + 3]],
            f3: [geom.attributes._flags.array[index[faceIdx * 3 + 2] * 4 + 0], geom.attributes._flags.array[index[faceIdx * 3 + 2] * 4 + 1], geom.attributes._flags.array[index[faceIdx * 3 + 2] * 4 + 2], geom.attributes._flags.array[index[faceIdx * 3 + 2] * 4 + 3]]
        };
        return newFace;
    };
    MeshBuilder.prototype.removeFaces = function (remove) {
        var geom = this._mesh.geometry, indices = [], index = geom.index.array;
        var ofstGroups = geom.groups.map(function () { return 0; });
        for (var i = 0; i < index.length / 3; ++i) {
            if (!remove.has(i)) {
                indices.push(index[i * 3 + 0], index[i * 3 + 1], index[i * 3 + 2]);
            }
            else {
                for (var g = 0; g < geom.groups.length; ++g) {
                    var group = geom.groups[g];
                    if (i * 3 >= group.start && i * 3 < group.start + group.count) {
                        ofstGroups[g] += 3;
                        break;
                    }
                }
            }
        }
        for (var g = 0, sum = 0; g < geom.groups.length; ++g) {
            geom.groups[g].count -= ofstGroups[g];
            geom.groups[g].start -= sum;
            sum += ofstGroups[g];
        }
        geom.setIndex(indices);
    };
    MeshBuilder.prototype.replaceSkinIndices = function (remap) {
        var skinIndices = this._mesh.geometry.attributes.skinIndex.array, indices = [];
        for (var i = 0; i < skinIndices.length; ++i) {
            var v = remap[skinIndices[i]];
            if (v !== undefined) {
                indices[i] = v;
            }
            else {
                indices[i] = skinIndices[i];
            }
        }
        this._mesh.geometry.attributes.skinIndex.array = new Float32Array(indices);
    };
    MeshBuilder.prototype.copyFacesWithSkinIndex = function (skinidx, newskinidx) {
        var geometry = this._mesh.geometry, index = Array.from(geometry.index.array), positions = Array.from(geometry.attributes.position.array), normals = Array.from(geometry.attributes.normal.array), skinIndices = Array.from(geometry.attributes.skinIndex.array), skinWeights = Array.from(geometry.attributes.skinWeight.array), uvs = Array.from(geometry.attributes.uv.array), _flags = Array.from(geometry.attributes._flags.array);
        var addIndex = [];
        for (var i = 0; i < index.length / 3; ++i) {
            var posIdx1 = index[i * 3 + 0], posIdx2 = index[i * 3 + 1], posIdx3 = index[i * 3 + 2];
            if (skinIndices[posIdx1 * 4 + 0] == skinidx && skinIndices[posIdx1 * 4 + 1] == skinidx) {
                // we assume that the 2 other vertices of the face have also skinidx has skin index
                var nposIdx = positions.length / 3;
                addIndex.push(nposIdx, nposIdx + 1, nposIdx + 2);
                positions.push(positions[posIdx1 * 3 + 0], positions[posIdx1 * 3 + 1], positions[posIdx1 * 3 + 2]);
                positions.push(positions[posIdx2 * 3 + 0], positions[posIdx2 * 3 + 1], positions[posIdx2 * 3 + 2]);
                positions.push(positions[posIdx3 * 3 + 0], positions[posIdx3 * 3 + 1], positions[posIdx3 * 3 + 2]);
                normals.push(normals[posIdx1 * 3 + 0], normals[posIdx1 * 3 + 1], normals[posIdx1 * 3 + 2]);
                normals.push(normals[posIdx2 * 3 + 0], normals[posIdx2 * 3 + 1], normals[posIdx2 * 3 + 2]);
                normals.push(normals[posIdx3 * 3 + 0], normals[posIdx3 * 3 + 1], normals[posIdx3 * 3 + 2]);
                skinIndices.push(newskinidx, newskinidx, 0, 0);
                skinIndices.push(newskinidx, newskinidx, 0, 0);
                skinIndices.push(newskinidx, newskinidx, 0, 0);
                skinWeights.push(skinWeights[posIdx1 * 4 + 0], skinWeights[posIdx1 * 4 + 1], skinWeights[posIdx1 * 4 + 2], skinWeights[posIdx1 * 4 + 3]);
                skinWeights.push(skinWeights[posIdx2 * 4 + 0], skinWeights[posIdx2 * 4 + 1], skinWeights[posIdx2 * 4 + 2], skinWeights[posIdx2 * 4 + 3]);
                skinWeights.push(skinWeights[posIdx3 * 4 + 0], skinWeights[posIdx3 * 4 + 1], skinWeights[posIdx3 * 4 + 2], skinWeights[posIdx3 * 4 + 3]);
                uvs.push(uvs[posIdx1 * 2 + 0], uvs[posIdx1 * 2 + 1]);
                uvs.push(uvs[posIdx2 * 2 + 0], uvs[posIdx2 * 2 + 1]);
                uvs.push(uvs[posIdx3 * 2 + 0], uvs[posIdx3 * 2 + 1]);
                _flags.push(_flags[posIdx1 * 4 + 0], _flags[posIdx1 * 4 + 1], _flags[posIdx1 * 4 + 2], _flags[posIdx1 * 4 + 3]);
                _flags.push(_flags[posIdx2 * 4 + 0], _flags[posIdx2 * 4 + 1], _flags[posIdx2 * 4 + 2], _flags[posIdx2 * 4 + 3]);
                _flags.push(_flags[posIdx3 * 4 + 0], _flags[posIdx3 * 4 + 1], _flags[posIdx3 * 4 + 2], _flags[posIdx3 * 4 + 3]);
            }
        }
        index.push.apply(index, __spread(addIndex));
        geometry.setIndex(index);
        geometry.groups[0].count = geometry.index.count; // assume there is a single group
        geometry.attributes.position.array = new Float32Array(positions);
        geometry.attributes.position.needsUpdate = true;
        geometry.attributes.normal.array = new Float32Array(normals);
        geometry.attributes.normal.needsUpdate = true;
        geometry.attributes.skinIndex.array = new Float32Array(skinIndices);
        geometry.attributes.skinIndex.needsUpdate = true;
        geometry.attributes.skinWeight.array = new Float32Array(skinWeights);
        geometry.attributes.skinWeight.needsUpdate = true;
        geometry.attributes.uv.array = new Float32Array(uvs);
        geometry.attributes.uv.needsUpdate = true;
        geometry.attributes._flags.array = new Float32Array(_flags);
        geometry.attributes._flags.needsUpdate = true;
    };
    MeshBuilder.prototype.setIndex = function (index) {
        var geometry = this._mesh.geometry;
        geometry.setIndex(index);
    };
    MeshBuilder.prototype.makeSkinIndicesList = function () {
        if (this._skinIndices.length > 0) {
            return;
        }
        var geometry = this._mesh.geometry;
        if (!geometry.attributes.skinIndex) {
            return;
        }
        var sindices = geometry.attributes.skinIndex.array, index = geometry.index;
        for (var i = 0; i < index.count / 3; ++i) {
            var skinIndex = sindices[index.array[i * 3 + 0] * 4 + 0];
            var lst = this._skinIndices[skinIndex];
            if (!lst) {
                lst = [];
                this._skinIndices[skinIndex] = lst;
            }
            lst.push(index.array[i * 3 + 0], index.array[i * 3 + 1], index.array[i * 3 + 2]);
        }
    };
    MeshBuilder.prototype.createMesh = function (name, scene, vshader, fshader, uniforms, vertices, indices, uvs, colors) {
        var geom = new three__WEBPACK_IMPORTED_MODULE_0__["BufferGeometry"]();
        geom.setIndex(indices);
        geom.addAttribute('position', new three__WEBPACK_IMPORTED_MODULE_0__["Float32BufferAttribute"](vertices, 3));
        if (uvs) {
            geom.addAttribute('uv', new three__WEBPACK_IMPORTED_MODULE_0__["Float32BufferAttribute"](uvs, 2));
        }
        if (colors) {
            geom.addAttribute('vertColor', new three__WEBPACK_IMPORTED_MODULE_0__["Float32BufferAttribute"](colors, 3));
        }
        geom.addGroup(0, indices.length, 0);
        var material = new three__WEBPACK_IMPORTED_MODULE_0__["RawShaderMaterial"]({
            "fragmentShader": fshader,
            "vertexShader": vshader,
            "uniforms": uniforms || {}
        });
        this._mesh = new three__WEBPACK_IMPORTED_MODULE_0__["Mesh"](geom, [material]);
        this._mesh.name = name;
        var mesh = new _Mesh__WEBPACK_IMPORTED_MODULE_1__["default"](this._mesh);
        scene.add(mesh);
        return mesh;
    };
    MeshBuilder.prototype.getIndexAndGroupState = function () {
        var geom = this._mesh.geometry, index = Array.from(geom.index.array);
        var groups = [];
        for (var g = 0; g < geom.groups.length; ++g) {
            groups.push({
                "indexStart": geom.groups[g].start,
                "indexCount": geom.groups[g].count,
            });
        }
        return {
            "indices": index,
            "groups": groups,
        };
    };
    MeshBuilder.prototype.setIndexAndGroupsState = function (state) {
        var geom = this._mesh.geometry;
        this.setIndex(state.indices);
        for (var g = 0; g < geom.groups.length; ++g) {
            geom.groups[g].count = state.groups[g].indexCount;
            geom.groups[g].start = state.groups[g].indexStart;
        }
    };
    return MeshBuilder;
}());
/* harmony default export */ __webpack_exports__["default"] = (MeshBuilder);


/***/ }),

/***/ "./src/Node.ts":
/*!*********************!*\
  !*** ./src/Node.ts ***!
  \*********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! three */ "three");
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(three__WEBPACK_IMPORTED_MODULE_0__);
var __read = (undefined && undefined.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (undefined && undefined.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};

var Node = /** @class */ (function () {
    function Node(obj, name, scene) {
        this._obj = obj ? obj : new three__WEBPACK_IMPORTED_MODULE_0__["Object3D"]();
        this._children = [];
        this.behaviours = [];
        if (!obj && name) {
            this._obj.name = name;
        }
    }
    Object.defineProperty(Node.prototype, "object", {
        get: function () {
            return this._obj;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Node.prototype, "position", {
        get: function () {
            return [this._obj.position.x, this._obj.position.y, this._obj.position.z];
        },
        enumerable: true,
        configurable: true
    });
    Node.prototype.setPosition = function (pos) {
        var _a;
        (_a = this._obj.position).set.apply(_a, __spread(pos));
    };
    Object.defineProperty(Node.prototype, "quaternion", {
        get: function () {
            return [this._obj.quaternion.x, this._obj.quaternion.y, this._obj.quaternion.z, this._obj.quaternion.w];
        },
        enumerable: true,
        configurable: true
    });
    Node.prototype.setQuaternion = function (quat) {
        var _a;
        (_a = this._obj.quaternion).set.apply(_a, __spread(quat));
    };
    Object.defineProperty(Node.prototype, "matrixAutoUpdate", {
        get: function () {
            return this._obj.matrixAutoUpdate;
        },
        set: function (b) {
            this._obj.updateMatrix();
            this._obj.matrixAutoUpdate = b;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Node.prototype, "name", {
        get: function () {
            return this._obj.name;
        },
        set: function (n) {
            this._obj.name = n;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Node.prototype, "visible", {
        get: function () {
            return this._obj.visible;
        },
        set: function (v) {
            this._obj.visible = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Node.prototype, "renderOrder", {
        get: function () {
            return this._obj.renderOrder;
        },
        set: function (ro) {
            this._obj.renderOrder = ro;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Node.prototype, "frustumCulled", {
        get: function () {
            return this._obj.frustumCulled;
        },
        set: function (fc) {
            this._obj.frustumCulled = fc;
        },
        enumerable: true,
        configurable: true
    });
    Node.prototype.add = function (child) {
        this._obj.add(child._obj);
        this._children.push(child);
    };
    Node.prototype.remove = function (child) {
        var index = this._children.indexOf(child);
        if (index !== -1) {
            this._children.splice(index, 1);
            this._obj.remove(child._obj);
        }
    };
    Node.prototype.traverse = function (callback) {
        for (var i = 0; i < this._children.length; i++) {
            var child = this._children[i];
            callback(child);
            child.traverse(callback);
        }
    };
    Node.prototype.getObjectByName = function (name) {
        if (this._obj.name === name) {
            return this;
        }
        for (var i = 0; i < this._children.length; ++i) {
            var child = this._children[i], object = child.getObjectByName(name);
            if (object !== undefined) {
                return object;
            }
        }
        return undefined;
    };
    Node.prototype.updateMatrixWorld = function () {
        this._obj.updateMatrixWorld(true);
    };
    Node.prototype.clone = function () {
        return new Node(this._obj.clone());
    };
    Node.prototype.matrixWorldToArray = function (arr, ofst) {
        this._obj.matrixWorld.toArray(arr, ofst);
    };
    Node.prototype.lookAt = function (pos) {
        var _a;
        (_a = this._obj).lookAt.apply(_a, __spread(pos));
    };
    Node.prototype.decomposeMatrixWorld = function (pos, quat) {
        var _pos = new three__WEBPACK_IMPORTED_MODULE_0__["Vector3"](), _quat = new three__WEBPACK_IMPORTED_MODULE_0__["Quaternion"](), _scale = new three__WEBPACK_IMPORTED_MODULE_0__["Vector3"]();
        this._obj.matrixWorld.decompose(_pos, _quat, _scale);
        pos[0] = _pos.x;
        pos[1] = _pos.y;
        pos[2] = _pos.z;
        quat[0] = _quat.x;
        quat[1] = _quat.y;
        quat[2] = _quat.z;
        quat[3] = _quat.w;
    };
    return Node;
}());
/* harmony default export */ __webpack_exports__["default"] = (Node);


/***/ }),

/***/ "./src/Renderer.ts":
/*!*************************!*\
  !*** ./src/Renderer.ts ***!
  \*************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! three */ "three");
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(three__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _Scene__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Scene */ "./src/Scene.ts");


var Renderer = /** @class */ (function () {
    function Renderer(container) {
        var canvas = document.createElement('canvas'), context = canvas.getContext('webgl2', { alpha: false });
        this._renderer = new three__WEBPACK_IMPORTED_MODULE_0__["WebGLRenderer"]({ canvas: canvas, context: context, antialias: true });
        this._renderer.autoClear = false;
        container.appendChild(this._renderer.domElement);
        return this;
    }
    Renderer.prototype.setSize = function (width, height) {
        this._renderer.setSize(width, height);
    };
    Renderer.prototype.createScene = function () {
        return new _Scene__WEBPACK_IMPORTED_MODULE_1__["default"](new three__WEBPACK_IMPORTED_MODULE_0__["Scene"]());
    };
    Renderer.prototype.clear = function () {
        this._renderer.clear(true, true, true);
    };
    Renderer.prototype.render = function (scene, camera) {
        this._renderer.render(scene.object, camera.object);
    };
    Renderer.prototype.getPerfData = function (scenes) {
        var numDrawCalls = 0, numObjects = 0, numGeometries = 0, numFaces = 0, numTextures = 0, numPrograms = 0;
        scenes.forEach(function (scene) {
            numObjects += scene.object.children.length;
        });
        numDrawCalls += this._renderer.info.render.calls;
        numGeometries += this._renderer.info.memory.geometries;
        numFaces += this._renderer.info.render.triangles;
        numTextures += this._renderer.info.memory.textures;
        numPrograms += this._renderer.info.programs.length;
        return {
            "numDrawCalls": numDrawCalls,
            "numObjects": numObjects,
            "numFaces": numFaces,
            "numTextures": numTextures,
            "numGeometries": numGeometries,
            "numParticles": -1,
            "numPrograms": numPrograms,
        };
    };
    return Renderer;
}());
/* harmony default export */ __webpack_exports__["default"] = (Renderer);


/***/ }),

/***/ "./src/Scene.ts":
/*!**********************!*\
  !*** ./src/Scene.ts ***!
  \**********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Node__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Node */ "./src/Node.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();

var Scene = /** @class */ (function (_super) {
    __extends(Scene, _super);
    function Scene(scene, textures) {
        var _this = _super.call(this, scene) || this;
        _this.textures = textures;
        _this._camera = null;
        return _this;
    }
    Object.defineProperty(Scene.prototype, "allMeshesReady", {
        get: function () {
            return true;
        },
        enumerable: true,
        configurable: true
    });
    Scene.prototype.setCamera = function (camera) {
        this._camera = camera;
    };
    Scene.prototype.getCamera = function () {
        return this._camera;
    };
    Scene.prototype.traverse = function (callback) {
        _super.prototype.traverse.call(this, callback);
    };
    Scene.prototype.add = function (child) {
        _super.prototype.add.call(this, child);
    };
    Scene.prototype.remove = function (child) {
        _super.prototype.remove.call(this, child);
    };
    Scene.prototype.getObjectByName = function (name) {
        return _super.prototype.getObjectByName.call(this, name);
    };
    return Scene;
}(_Node__WEBPACK_IMPORTED_MODULE_0__["default"]));
/* harmony default export */ __webpack_exports__["default"] = (Scene);


/***/ }),

/***/ "./src/SceneParser.ts":
/*!****************************!*\
  !*** ./src/SceneParser.ts ***!
  \****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! three */ "three");
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(three__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _Camera__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Camera */ "./src/Camera.ts");
/* harmony import */ var _Mesh__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Mesh */ "./src/Mesh.ts");
/* harmony import */ var _Scene__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Scene */ "./src/Scene.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();




var SceneParser = /** @class */ (function (_super) {
    __extends(SceneParser, _super);
    function SceneParser(shdMgr, manager) {
        var _this = _super.call(this, manager) || this;
        _this._shdMgr = shdMgr;
        _this._numShadersToLoad = 0;
        return _this;
    }
    SceneParser.prototype.parse = function (json, onLoad) {
        var _this = this;
        var geometries = this.parseGeometries(json.geometries);
        var images = this.parseImages(json.images, function () {
            if (onLoad !== undefined) {
                var tscene = object;
                tscene.traverse(function (msh) {
                    for (var m = 0; m < msh.materials.length; ++m) {
                        var material = msh.materials[m];
                        for (var uname in material.uniforms) {
                            var uval = material.uniforms[uname];
                            if (uname == 'map' || uname == 'mapBump') {
                                uval.width = uval.value.image.width;
                                uval.height = uval.value.image.height;
                            }
                        }
                    }
                });
                var idTimer_1 = setInterval(function () {
                    if (_this._numShadersToLoad == 0) {
                        clearInterval(idTimer_1);
                        onLoad(object, textures);
                    }
                }, 0);
            }
        });
        var textures = this.parseTextures(json.textures, images);
        var materials = this.parseMaterials(json.materials, textures);
        var object = this.parseObject(json.object, geometries, materials, textures);
        var camera = object.getObjectByName("camera1");
        object.setCamera(camera);
        object.remove(camera);
        return object;
    };
    SceneParser.prototype.parseGeometries = function (json) {
        var geometries = {};
        if (json !== undefined) {
            var bufferGeometryLoader = new three__WEBPACK_IMPORTED_MODULE_0__["BufferGeometryLoader"]();
            for (var i = 0, l = json.length; i < l; i++) {
                var geometry;
                var data = json[i];
                switch (data.type) {
                    case 'BufferGeometry':
                    case 'InstancedBufferGeometry':
                        geometry = bufferGeometryLoader.parse(data);
                        break;
                    default:
                        console.warn('THREE.ObjectLoader: Unsupported geometry type "' + data.type + '"');
                        continue;
                }
                geometry.uuid = data.uuid;
                if (data.name !== undefined) {
                    geometry.name = data.name;
                }
                if (geometry.isBufferGeometry === true && data.userData !== undefined) {
                    geometry.userData = data.userData;
                }
                geometries[data.uuid] = geometry;
            }
        }
        return geometries;
    };
    SceneParser.prototype.parseMaterials = function (json, textures) {
        var _this = this;
        var cache = {};
        var materials = {};
        if (json !== undefined) {
            var loader = new three__WEBPACK_IMPORTED_MODULE_0__["MaterialLoader"]();
            loader.setTextures(textures);
            for (var i = 0, l = json.length; i < l; i++) {
                var data = json[i];
                if (cache[data.uuid] === undefined) {
                    cache[data.uuid] = loader.parse(data);
                    this._numShadersToLoad += 2;
                    (function (uuid) {
                        _this._shdMgr.getVertexShader(cache[data.uuid].vertexShader).then(function (shd) {
                            cache[uuid].vertexShader = shd;
                            _this._numShadersToLoad--;
                        });
                        _this._shdMgr.getFragmentShader(cache[data.uuid].fragmentShader).then(function (shd) {
                            cache[uuid].fragmentShader = shd;
                            _this._numShadersToLoad--;
                        });
                    })(data.uuid);
                }
                materials[data.uuid] = cache[data.uuid];
            }
        }
        return materials;
    };
    SceneParser.prototype.parseImages = function (json, onLoad) {
        var images = {};
        function loadImage(url, manager) {
            manager.itemStart(url);
            return loader.load(url, function () {
                manager.itemEnd(url);
            }, undefined, function () {
                manager.itemError(url);
                manager.itemEnd(url);
            });
        }
        if (json !== undefined && json.length > 0) {
            var manager = new three__WEBPACK_IMPORTED_MODULE_0__["LoadingManager"](onLoad);
            var loader = new three__WEBPACK_IMPORTED_MODULE_0__["ImageLoader"](manager);
            loader.setCrossOrigin(this.crossOrigin);
            for (var i = 0, il = json.length; i < il; i++) {
                var image = json[i];
                var url = image.url;
                if (Array.isArray(url)) {
                    // load array of images e.g CubeTexture
                    images[image.uuid] = [];
                    for (var j = 0, jl = url.length; j < jl; j++) {
                        var currentUrl = url[j];
                        var path = /^(\/\/)|([a-z]+:(\/\/)?)/i.test(currentUrl) ? currentUrl : this.resourcePath + currentUrl;
                        images[image.uuid].push(loadImage(path, this.manager));
                    }
                }
                else {
                    // load single image
                    var path = /^(\/\/)|([a-z]+:(\/\/)?)/i.test(image.url) ? image.url : this.resourcePath + image.url;
                    images[image.uuid] = loadImage(path, this.manager);
                }
            }
        }
        return images;
    };
    SceneParser.prototype.parseTextures = function (json, images) {
        function parseConstant(value, type) {
            if (typeof value === 'number') {
                return value;
            }
            console.warn('THREE.ObjectLoader.parseTexture: Constant should be in numeric form.', value);
            return type[value];
        }
        var textures = {};
        if (json !== undefined) {
            for (var i = 0, l = json.length; i < l; i++) {
                var data = json[i];
                if (data.image === undefined) {
                    console.warn('THREE.ObjectLoader: No "image" specified for', data.uuid);
                }
                if (images[data.image] === undefined) {
                    console.warn('THREE.ObjectLoader: Undefined image', data.image);
                }
                var texture;
                if (Array.isArray(images[data.image])) {
                    texture = new three__WEBPACK_IMPORTED_MODULE_0__["CubeTexture"](images[data.image]);
                }
                else {
                    texture = new three__WEBPACK_IMPORTED_MODULE_0__["Texture"](images[data.image]);
                }
                texture.needsUpdate = true;
                texture.uuid = data.uuid;
                if (data.name !== undefined) {
                    texture.name = data.name;
                }
                if (data.mapping !== undefined) {
                    texture.mapping = parseConstant(data.mapping, TEXTURE_MAPPING);
                }
                if (data.offset !== undefined) {
                    texture.offset.fromArray(data.offset);
                }
                if (data.repeat !== undefined) {
                    texture.repeat.fromArray(data.repeat);
                }
                if (data.center !== undefined) {
                    texture.center.fromArray(data.center);
                }
                if (data.rotation !== undefined) {
                    texture.rotation = data.rotation;
                }
                if (data.wrap !== undefined) {
                    texture.wrapS = parseConstant(data.wrap[0], TEXTURE_WRAPPING);
                    texture.wrapT = parseConstant(data.wrap[1], TEXTURE_WRAPPING);
                }
                if (data.format !== undefined) {
                    texture.format = data.format;
                }
                if (data.type !== undefined) {
                    texture.type = data.type;
                }
                if (data.encoding !== undefined) {
                    texture.encoding = data.encoding;
                }
                if (data.minFilter !== undefined) {
                    texture.minFilter = parseConstant(data.minFilter, TEXTURE_FILTER);
                }
                if (data.magFilter !== undefined) {
                    texture.magFilter = parseConstant(data.magFilter, TEXTURE_FILTER);
                }
                if (data.anisotropy !== undefined) {
                    texture.anisotropy = data.anisotropy;
                }
                if (data.flipY !== undefined) {
                    texture.flipY = data.flipY;
                }
                if (data.premultiplyAlpha !== undefined) {
                    texture.premultiplyAlpha = data.premultiplyAlpha;
                }
                if (data.unpackAlignment !== undefined) {
                    texture.unpackAlignment = data.unpackAlignment;
                }
                textures[data.uuid] = texture;
            }
        }
        return textures;
    };
    SceneParser.prototype.parseObject = function (data, geometries, materials, textures) {
        var object;
        var tobject;
        function getGeometry(name) {
            if (geometries[name] === undefined) {
                console.warn('THREE.ObjectLoader: Undefined geometry', name);
            }
            return geometries[name];
        }
        function getMaterial(name) {
            if (name === undefined) {
                return undefined;
            }
            if (Array.isArray(name)) {
                var array = [];
                for (var i = 0, l = name.length; i < l; i++) {
                    var uuid = name[i];
                    if (materials[uuid] === undefined) {
                        console.warn('THREE.ObjectLoader: Undefined material', uuid);
                    }
                    array.push(materials[uuid]);
                }
                return array;
            }
            if (materials[name] === undefined) {
                console.warn('THREE.ObjectLoader: Undefined material', name);
            }
            return materials[name];
        }
        switch (data.type) {
            case 'Scene':
                var textureList = [];
                for (var name_1 in textures) {
                    var idx = name_1.substring("texture".length);
                    textureList[parseInt(idx)] = textures[name_1];
                }
                object = new three__WEBPACK_IMPORTED_MODULE_0__["Scene"]();
                tobject = new _Scene__WEBPACK_IMPORTED_MODULE_3__["default"](object, textureList);
                break;
            case 'PerspectiveCamera':
                object = new three__WEBPACK_IMPORTED_MODULE_0__["PerspectiveCamera"](data.fov, data.aspect, data.near, data.far);
                tobject = new _Camera__WEBPACK_IMPORTED_MODULE_1__["default"](object);
                if (data.focus !== undefined) {
                    object.focus = data.focus;
                }
                if (data.zoom !== undefined) {
                    object.zoom = data.zoom;
                }
                if (data.filmGauge !== undefined) {
                    object.filmGauge = data.filmGauge;
                }
                if (data.filmOffset !== undefined) {
                    object.filmOffset = data.filmOffset;
                }
                if (data.view !== undefined) {
                    object.view = Object.assign({}, data.view);
                }
                break;
            case 'Mesh':
                var geometry = getGeometry(data.geometry);
                var material = getMaterial(data.material);
                object = new three__WEBPACK_IMPORTED_MODULE_0__["Mesh"](geometry, material);
                tobject = new _Mesh__WEBPACK_IMPORTED_MODULE_2__["default"](object);
                object.geometry.computeBoundingBox();
                object.geometry.computeBoundingSphere();
                object.frustumCulled = true;
                var materials_1 = object.material;
                if (Array.isArray(materials_1) && materials_1.length > 0) {
                    for (var i_1 = 0; i_1 < materials_1.length; ++i_1) {
                        var material_1 = materials_1[i_1];
                        if (material_1.transparent) {
                            material_1.blending = three__WEBPACK_IMPORTED_MODULE_0__["AdditiveBlending"];
                            material_1.blendSrc = three__WEBPACK_IMPORTED_MODULE_0__["OneFactor"];
                            material_1.blendDst = three__WEBPACK_IMPORTED_MODULE_0__["OneMinusSrcColorFactor"];
                            material_1.depthWrite = false;
                        }
                    }
                }
                if (data.drawMode !== undefined) {
                    object.setDrawMode(data.drawMode);
                }
                break;
            default:
                console.log(data);
                throw "Unknown object type! " + data.type;
        }
        object.uuid = data.uuid;
        if (data.name !== undefined) {
            object.name = data.name;
        }
        if (data.matrix !== undefined) {
            object.matrix.fromArray(data.matrix);
            if (data.matrixAutoUpdate !== undefined) {
                object.matrixAutoUpdate = data.matrixAutoUpdate;
            }
            if (object.matrixAutoUpdate) {
                object.matrix.decompose(object.position, object.quaternion, object.scale);
            }
        }
        else {
            if (data.position !== undefined) {
                object.position.fromArray(data.position);
            }
            if (data.rotation !== undefined) {
                object.rotation.fromArray(data.rotation);
            }
            if (data.quaternion !== undefined) {
                object.quaternion.fromArray(data.quaternion);
            }
            if (data.scale !== undefined) {
                object.scale.fromArray(data.scale);
            }
        }
        if (data.castShadow !== undefined) {
            object.castShadow = data.castShadow;
        }
        if (data.receiveShadow !== undefined) {
            object.receiveShadow = data.receiveShadow;
        }
        if (data.shadow) {
            if (data.shadow.bias !== undefined) {
                object.shadow.bias = data.shadow.bias;
            }
            if (data.shadow.radius !== undefined) {
                object.shadow.radius = data.shadow.radius;
            }
            if (data.shadow.mapSize !== undefined) {
                object.shadow.mapSize.fromArray(data.shadow.mapSize);
            }
            if (data.shadow.camera !== undefined) {
                object.shadow.camera = this.parseObject(data.shadow.camera, geometries, materials, textures);
            }
        }
        if (data.visible !== undefined) {
            object.visible = data.visible;
        }
        if (data.frustumCulled !== undefined) {
            object.frustumCulled = data.frustumCulled;
        }
        if (data.renderOrder !== undefined) {
            object.renderOrder = data.renderOrder;
        }
        if (data.userData !== undefined) {
            object.userData = data.userData;
        }
        if (data.layers !== undefined) {
            object.layers.mask = data.layers;
        }
        if (data.children !== undefined) {
            var children = data.children;
            for (var i = 0; i < children.length; i++) {
                tobject.add(this.parseObject(children[i], geometries, materials, textures));
            }
        }
        if (data.type === 'LOD') {
            var levels = data.levels;
            for (var l = 0; l < levels.length; l++) {
                var level = levels[l];
                var child = object.getObjectByProperty('uuid', level.object);
                if (child !== undefined) {
                    object.addLevel(child, level.distance);
                }
            }
        }
        return tobject;
    };
    return SceneParser;
}(three__WEBPACK_IMPORTED_MODULE_0__["Loader"]));
/* harmony default export */ __webpack_exports__["default"] = (SceneParser);
var TEXTURE_MAPPING = {
    UVMapping: three__WEBPACK_IMPORTED_MODULE_0__["UVMapping"],
    CubeReflectionMapping: three__WEBPACK_IMPORTED_MODULE_0__["CubeReflectionMapping"],
    CubeRefractionMapping: three__WEBPACK_IMPORTED_MODULE_0__["CubeRefractionMapping"],
    EquirectangularReflectionMapping: three__WEBPACK_IMPORTED_MODULE_0__["EquirectangularReflectionMapping"],
    EquirectangularRefractionMapping: three__WEBPACK_IMPORTED_MODULE_0__["EquirectangularRefractionMapping"],
    SphericalReflectionMapping: three__WEBPACK_IMPORTED_MODULE_0__["SphericalReflectionMapping"],
    CubeUVReflectionMapping: three__WEBPACK_IMPORTED_MODULE_0__["CubeUVReflectionMapping"],
    CubeUVRefractionMapping: three__WEBPACK_IMPORTED_MODULE_0__["CubeUVRefractionMapping"]
};
var TEXTURE_WRAPPING = {
    RepeatWrapping: three__WEBPACK_IMPORTED_MODULE_0__["RepeatWrapping"],
    ClampToEdgeWrapping: three__WEBPACK_IMPORTED_MODULE_0__["ClampToEdgeWrapping"],
    MirroredRepeatWrapping: three__WEBPACK_IMPORTED_MODULE_0__["MirroredRepeatWrapping"]
};
var TEXTURE_FILTER = {
    NearestFilter: three__WEBPACK_IMPORTED_MODULE_0__["NearestFilter"],
    NearestMipmapNearestFilter: three__WEBPACK_IMPORTED_MODULE_0__["NearestMipmapNearestFilter"],
    NearestMipmapLinearFilter: three__WEBPACK_IMPORTED_MODULE_0__["NearestMipmapLinearFilter"],
    LinearFilter: three__WEBPACK_IMPORTED_MODULE_0__["LinearFilter"],
    LinearMipmapNearestFilter: three__WEBPACK_IMPORTED_MODULE_0__["LinearMipmapNearestFilter"],
    LinearMipmapLinearFilter: three__WEBPACK_IMPORTED_MODULE_0__["LinearMipmapLinearFilter"]
};


/***/ }),

/***/ "./src/TRN.ts":
/*!********************!*\
  !*** ./src/TRN.ts ***!
  \********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _src_Utils_Browser__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../src/Utils/Browser */ "../src/Utils/Browser.ts");
/* harmony import */ var _src_Proxy_Engine__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../src/Proxy/Engine */ "../src/Proxy/Engine.ts");
/* harmony import */ var _src_ShaderManager__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../src/ShaderManager */ "../src/ShaderManager.ts");
/* harmony import */ var _src_Main__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../src/Main */ "../src/Main.ts");
/* harmony import */ var _Behaviours__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Behaviours */ "./src/Behaviours.ts");
/* harmony import */ var _MeshBuilder__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./MeshBuilder */ "./src/MeshBuilder.ts");
/* harmony import */ var _Node__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./Node */ "./src/Node.ts");
/* harmony import */ var _Renderer__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./Renderer */ "./src/Renderer.ts");
/* harmony import */ var _SceneParser__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./SceneParser */ "./src/SceneParser.ts");









var relPath = _src_Utils_Browser__WEBPACK_IMPORTED_MODULE_0__["default"].QueryString.relpath || "";
glMatrix.glMatrix.setMatrixArrayType(Array);
var shdMgr = new _src_ShaderManager__WEBPACK_IMPORTED_MODULE_2__["ShaderManager"](relPath + "resources/shader/");
_src_Proxy_Engine__WEBPACK_IMPORTED_MODULE_1__["default"].registerFunctions({
    "makeNode": function () { return new _Node__WEBPACK_IMPORTED_MODULE_6__["default"](); },
    "makeMeshBuilder": function (mesh) { return new _MeshBuilder__WEBPACK_IMPORTED_MODULE_5__["default"](mesh); },
    "parseScene": function (sceneJSON) {
        var sceneParser = new _SceneParser__WEBPACK_IMPORTED_MODULE_8__["default"](shdMgr);
        return new Promise(function (resolve, reject) {
            sceneParser.parse(sceneJSON, resolve);
        });
    },
    "createRenderer": function (container) {
        return new _Renderer__WEBPACK_IMPORTED_MODULE_7__["default"](container);
    },
    "getShaderMgr": shdMgr,
});


/***/ }),

/***/ "jquery":
/*!*************************!*\
  !*** external "jQuery" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = jQuery;

/***/ }),

/***/ "pako":
/*!***********************!*\
  !*** external "pako" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = pako;

/***/ }),

/***/ "three":
/*!************************!*\
  !*** external "THREE" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = THREE;

/***/ })

/******/ });
//# sourceMappingURL=trn_three.js.map