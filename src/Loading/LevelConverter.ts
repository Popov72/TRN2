import { ConfigManager } from "../ConfigManager";
import { RawLevel } from "./LevelLoader";
import { baseFrameRate, ObjectID } from "../Constants";
import { Commands } from "../Animation/Commands";
import LevelConverterHelper from "./LevelConverterHelper";

declare var glMatrix: any;

interface mapNumberToNumber {
    [id: number]: number;
}

/*
	Convert the JSON object created by the raw level loader to a higher level JSON scene
*/
export default class LevelConverter {

    private confMgr: ConfigManager;
    private sc: any;
    private helper: LevelConverterHelper;
    private laraObjectID: number;
    private movObjID2Index: mapNumberToNumber;
    private objects: any;

    constructor() {
        this.confMgr = <any>null;
        this.sc = null;
        this.helper = <any>null;
        this.laraObjectID = -1;
        this.movObjID2Index = <any>null;
        this.objects = null;
    }

    get sceneJSON(): any {
        return this.sc;
    }

    // create one texture per tile
    private createTextures(): void {
        for (let i = 0; i < this.sc.data.trlevel.textile.length; ++i) {
            const name = 'texture' + i;
            this.sc.textures.push({
                "uuid": name,
                "name": name,
                "anisotropy": 16,
                "flipY": false,
                "image": name,
                "wrap": [1001, 1001], /* 1001=ClampToEdgeWrapping */
                "minFilter": 1006, /* 1006=LinearFilter */
                "magFilter": 1006
            });

            this.sc.images.push({
                "uuid": name,
                "url": this.sc.data.trlevel.textile[i]
            });
        }
    }

    // Collect the animated textures
    private createAnimatedTextures(): void {
        let i = 0, adata = this.sc.data.trlevel.animatedTextures, numAnimatedTextures = adata[i++];
        const animatedTextures = [], mapObjTexture2AnimTexture: any = {};
        while (numAnimatedTextures-- > 0) {
            let numTextures = adata[i++] + 1, snumTextures = numTextures,
                anmcoords = [];
            while (numTextures-- > 0) {
                const texture = adata[i++], tex = this.sc.data.trlevel.objectTextures[texture], tile = tex.tile & 0x7FFF;
                const isTri = (tex.tile & 0x8000) != 0;

                let minU = 0x7FFF, minV = 0x7FFF, numVertices = isTri ? 3 : 4;

                mapObjTexture2AnimTexture[texture] = { idxAnimatedTexture: animatedTextures.length, pos: snumTextures - numTextures - 1 };

                for (let j = 0; j < numVertices; j++) {
                    const u = tex.vertices[j].Xpixel,
                          v = tex.vertices[j].Ypixel;

                    if (minU > u) { minU = u; } if (minV > v) { minV = v; }
                }

                anmcoords.push({ minU: (minU + 0.5) / this.sc.data.trlevel.atlas.width, minV: (minV + 0.5) / this.sc.data.trlevel.atlas.height, texture: "" + tile});
            }

            animatedTextures.push({
                "animcoords": anmcoords,
                "animspeed" : this.sc.data.trlevel.rversion == 'TR1' ? 5 : this.sc.data.trlevel.rversion == 'TR2' ? 6 : 14,
                "scrolltexture" : (animatedTextures.length < this.sc.data.trlevel.animatedTexturesUVCount)
            });
        }

        this.sc.data.animatedTextures = animatedTextures;
        this.sc.data.trlevel.mapObjTexture2AnimTexture = mapObjTexture2AnimTexture; // => to know for each objTexture if it is part of an animated texture, and if yes which is its starting position in the sequence
    }

    private createAllStaticMeshes(): void {
        for (let s = 0; s < this.sc.data.trlevel.staticMeshes.length; ++s) {
            const smesh = this.sc.data.trlevel.staticMeshes[s],
                  meshIndex = smesh.mesh,
                  objectID = smesh.objectID,
                  flags = smesh.flags;

            const mesh = this.sc.data.trlevel.meshes[meshIndex];
            const meshJSON = this.helper.createNewGeometryData();

            const tiles2material = {};

            this.helper.makeMeshGeometry(mesh, meshJSON, tiles2material, this.sc.data.trlevel.objectTextures, this.sc.data.trlevel.mapObjTexture2AnimTexture);

            const materials = this.helper.makeMaterialList(tiles2material, 'mesh', 'mesh' + meshIndex);

            this.sc.geometries.push({
                "uuid": 'mesh' + meshIndex,
                "type": "BufferGeometry",
                "data": meshJSON
            });

            const meshid = 'staticmesh' + objectID;

            this.sc.materials.push(...materials);

            this.objects.push({
                "uuid"          : meshid,
                "type"          : "Mesh",
                "name"          : meshid,
                "geometry" 		: 'mesh' + meshIndex,
                "material" 		: materials.map((m) => m.uuid),
                "position" 		: [ 0, 0, 0 ],
                "quaternion" 	: [ 0, 0, 0, 1 ],
                "scale"	   		: [ 1, 1, 1 ]
            });

            this.sc.data.objects[meshid] = {
                "type"			: 'staticmesh',
                "raw"           : smesh,
                "roomIndex"		: -1,
                "objectid"      : objectID,
                "visible"  		: false,
                "flags"         : flags
            };
        }
    }

    private createAllSprites(): void {
        for (let s = 0; s < this.sc.data.trlevel.spriteTextures.length; ++s) {
            const sprite = this.sc.data.trlevel.spriteTextures[s];

            const geometry: any = this.createSpriteSeq(s);

            const spriteid = 'sprite' + s;

            this.sc.materials.push(...geometry.materials);

            this.objects.push({
                "uuid"          : spriteid,
                "type"          : "Mesh",
                "name"          : spriteid,
                "geometry" 		: geometry.uuid,
                "material" 		: geometry.materials.map((m: any) => m.uuid),
                "position" 		: [ 0, 0, 0 ],
                "quaternion" 	: [ 0, 0, 0, 1 ],
                "scale"	   		: [ 1, 1, 1 ]
            });

            this.sc.data.objects[spriteid] = {
                "type"			: 'sprite',
                "raw"           : sprite,
                "roomIndex"		: -1,
                "objectid"      : s,
                "visible"  		: false
            };
        }
    }

    //  create a sprite sequence: if there's more than one sprite in the sequence, we create an animated texture
    private createSpriteSeq(spriteSeq: number | any): any {

        let spriteIndex, numSprites = 1, spriteid;

        if (typeof(spriteSeq) == 'number') {
            // case where this function is called to create a single sprite in a room

            spriteIndex = spriteSeq;
            spriteSeq = null;
            spriteid = 'sprite' + spriteIndex;

            if (spriteIndex >= this.sc.data.trlevel.spriteTextures.length) {
                console.log('spriteindex', spriteIndex, 'is too big: only', this.sc.data.trlevel.spriteTextures.length, 'sprites in this.sc.data.trlevel.spriteTextures !');
                return false;
            }

        } else {
            // case where this function is called to create a sprite sequence

            spriteIndex = spriteSeq.offset;
            numSprites = -spriteSeq.negativeLength;
            spriteid = 'spriteseq' + spriteSeq.objectID;
        }

        let sprite = this.sc.data.trlevel.spriteTextures[spriteIndex],
            meshJSON = this.helper.createNewGeometryData(),
            tiles2material = {};

        delete meshJSON.attributes.vertColor;
        delete meshJSON.attributes._flags;

        meshJSON.vertices.push(sprite.leftSide,  -sprite.topSide,       0);
        meshJSON.vertices.push(sprite.leftSide,  -sprite.bottomSide,    0);
        meshJSON.vertices.push(sprite.rightSide, -sprite.bottomSide,    0);
        meshJSON.vertices.push(sprite.rightSide, -sprite.topSide,       0);

        const texturedRectangles = [
                {
                    vertices: [0, 1, 2, 3],
                    texture: 0x8000,
                }
            ];
        const width = (sprite.width - 255) / 256,
              height = (sprite.height - 255) / 256;
        let row = 0, col = 0, tile = sprite.tile;
        if (this.sc.data.trlevel.atlas.make) {
            row = Math.floor(tile / this.sc.data.trlevel.atlas.numColPerRow), col = tile - row * this.sc.data.trlevel.atlas.numColPerRow;
            tile = 0;
        }
        const objectTextures = [
                {
                    attributes: 0,
                    tile: tile,
                    origTile: tile,
                    vertices: [
                        { Xpixel: sprite.x + col * 256, 		Ypixel: sprite.y + row * 256 },
                        { Xpixel: sprite.x + col * 256, 		Ypixel: sprite.y + height - 1 + row * 256 },
                        { Xpixel: sprite.x + width - 1 + col * 256, Ypixel: sprite.y + height - 1 + row * 256 },
                        { Xpixel: sprite.x + width - 1 + col * 256, Ypixel: sprite.y + row * 256 }
                    ]
                }
        ];

        const mapObjTexture2AnimTexture: any = {};

        if (numSprites > 1 && this.sc.data.animatedTextures) {
            const anmcoords = [];
            mapObjTexture2AnimTexture[0] = { idxAnimatedTexture: this.sc.data.animatedTextures.length, pos: 0 };
            for (let i = 0; i < numSprites; ++i) {
                sprite = this.sc.data.trlevel.spriteTextures[spriteIndex + i];
                tile = sprite.tile;
                if (this.sc.data.trlevel.atlas.make) {
                    row = Math.floor(tile / this.sc.data.trlevel.atlas.numColPerRow), col = tile - row * this.sc.data.trlevel.atlas.numColPerRow;
                    tile = 0;
                }
                anmcoords.push({ minU: (sprite.x + col * 256 + 0.5) / this.sc.data.trlevel.atlas.width, minV: (sprite.y + row * 256 + 0.5) / this.sc.data.trlevel.atlas.height, texture: "" + tile});
            }
            this.sc.data.animatedTextures.push({
                "animcoords": anmcoords,
                "animspeed" : 20
            });
        }

        this.helper.makeFaces(meshJSON, [texturedRectangles], tiles2material, objectTextures, mapObjTexture2AnimTexture, 0);

        const materials = this.helper.makeMaterialList(tiles2material, 'sprite', spriteid);

        this.sc.geometries.push({
            "uuid": spriteid,
            "type": "BufferGeometry",
            "data": meshJSON
        });

        return {
            "uuid": spriteid,
            "materials": materials
        };
    }

    // generate the rooms + static meshes + sprites in the room
    private createRooms(): void {
        // flag the alternate rooms
        for (let m = 0; m < this.sc.data.trlevel.rooms.length; ++m) {
            this.sc.data.trlevel.rooms[m].isAlternate = false;
        }

        for (let m = 0; m < this.sc.data.trlevel.rooms.length; ++m) {
            const room = this.sc.data.trlevel.rooms[m],
                  alternate = room.alternateRoom;
            if (alternate != -1) {
                this.sc.data.trlevel.rooms[alternate].isAlternate = true;
            }
        }

        let maxLightsInRoom = 0, roomL = -1;

        // generate the rooms
        for (let m = 0; m < this.sc.data.trlevel.rooms.length; ++m) {
            const room = this.sc.data.trlevel.rooms[m],
                  info = room.info, rdata = room.roomData, rflags = room.flags, lightMode = room.lightMode,
                  isFilledWithWater = (rflags & 1) != 0, isFlickering = (lightMode == 1);

            const roomMesh: any = {
                "uuid"              : "room" + m,
                "type"              : "Mesh",
                "name"              : "room" + m,
                "geometry" 			: "room" + m,
                "position" 			: [ 0, 0, 0 ],
                "quaternion" 		: [ 0, 0, 0, 1 ],
                "scale"	   			: [ 1, 1, 1 ]
            };

            this.objects.push(roomMesh);

            const roomData: any = {
                "type"				: 'room',
                "raw"               : room,
                "isAlternateRoom" 	: room.isAlternate,
                "filledWithWater"	: isFilledWithWater,
                "flickering"		: isFlickering,
                "roomIndex"			: m,
                "objectid"          : m,
                "visible"  			: !room.isAlternate
            };

            this.sc.data.objects['room' + m] = roomData;

            // lights in the room
            if (room.lights.length > maxLightsInRoom) {
                maxLightsInRoom = room.lights.length;
                roomL = m;
            }

            const ambientColor = glMatrix.vec3.create();
            if (this.sc.data.trlevel.rversion != 'TR4') {
                const ambient1 = 1.0 - room.ambientIntensity1 / 0x2000;
                glMatrix.vec3.set(ambientColor, ambient1, ambient1, ambient1);
            } else {
                const rc = room.roomColour;
                ambientColor[0] = ((rc & 0xFF0000) >> 16) / 255.0;
                ambientColor[1] = ((rc & 0xFF00) >> 8)  / 255.0;
                ambientColor[2] = (rc & 0xFF)  / 255.0;
            }

            const lights = [];
            for (let l = 0; l < room.lights.length; ++l) {
                const light = room.lights[l], color = [1, 1, 1];
                let px = light.x, py = -light.y, pz = -light.z,
                    fadeIn = 0, fadeOut = 0;
                const plight: any = { type: 'point' };
                switch (this.sc.data.trlevel.rversion) {
                    case 'TR1':
                    case 'TR2': {
                        let intensity = light.intensity1;
                        if (intensity > 0x2000) { intensity = 0x2000; }
                        intensity = intensity / 0x2000;
                        glMatrix.vec3.set(color, intensity, intensity, intensity);
                        fadeOut = light.fade1;
                        break;
                    }
                    case 'TR3': {
                        const r = light.color.r / 255.0,
                              g = light.color.g / 255.0,
                              b = light.color.b / 255.0;
                        let intensity = light.intensity;
                        if (intensity > 0x2000) { intensity = 0x2000; } // without this test, cut5 in TR3 (for eg) is wrong
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
                        const r = light.color.r / 255.0,
                              g = light.color.g / 255.0,
                              b = light.color.b / 255.0;
                        let intensity = light.intensity;
                        if (intensity > 32) { intensity = 32; }
                        intensity = intensity / 16.0;
                        glMatrix.vec3.set(color, r * intensity, g * intensity, b * intensity);
                        switch (light.lightType) {
                            case 0: // directional light
                                const bb = this.helper.getBoundingBox(room.roomData.vertices);
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
                if (fadeOut > 0x7FFF) { fadeOut = 0x8000; }
                if (fadeIn > fadeOut) { fadeIn = 0; }
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
            const roomJSON = this.helper.createNewGeometryData();

            const tiles2material = {};

            // push the vertices + vertex colors of the room
            for (let v = 0; v < rdata.vertices.length; ++v) {
                const rvertex = rdata.vertices[v],
                      vertexInfo = this.helper.processRoomVertex(rvertex, isFilledWithWater);

                roomJSON.vertices.push(vertexInfo.x + info.x, vertexInfo.y, vertexInfo.z - info.z);
                roomJSON.colors.push(vertexInfo.color2[0], vertexInfo.color2[1], vertexInfo.color2[2]);
                roomJSON._flags.push(vertexInfo.flag[0], vertexInfo.flag[1], vertexInfo.flag[2], vertexInfo.flag[3]);
            }

            // create the tri/quad faces
            this.helper.makeFaces(roomJSON, [rdata.rectangles, rdata.triangles], tiles2material, this.sc.data.trlevel.objectTextures, this.sc.data.trlevel.mapObjTexture2AnimTexture, 0);

            const materials = this.helper.makeMaterialList(tiles2material, 'room', 'room' + m);

            this.sc.materials.push(...materials);

            // add the room geometry to the scene
            this.sc.geometries.push({
                "uuid": "room" + m,
                "type": "BufferGeometry",
                "data": roomJSON
            });

            roomMesh.material = materials.map((m) => m.uuid);

            // portal in the room
            const portals = [];
            for (let p = 0; p < room.portals.length; ++p) {
                const portal = room.portals[p];
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
    }

    private createAnimations(): void {
        const animTracks = [];

        for (let anm = 0; anm < this.sc.data.trlevel.animations.length; ++anm) {
            const anim: any = this.sc.data.trlevel.animations[anm];

            let frameOffset = anim.frameOffset / 2,
                frameStep   = anim.frameSize,
                numFrames = anim.frameEnd - anim.frameStart + 1,
                animNumKeys = Math.floor((numFrames - 1) / anim.frameRate) + 1;

            if ((numFrames - 1) % anim.frameRate) { animNumKeys++; }

            let animFPS = baseFrameRate,
                animLength = ((animNumKeys - 1) * anim.frameRate) / baseFrameRate;

            if (animLength == 0) {
                animFPS = 1.0;
                animLength = 1.0;
            }

            if (this.sc.data.trlevel.rversion == 'TR1') {
                frameStep = this.sc.data.trlevel.frames[frameOffset + 9] * 2 + 10;
            }

            const animKeys = [];

            for (let key = 0; key < animNumKeys; key++)	{
                let frame = frameOffset + key * frameStep, sframe = frame;

                const BBLoX =  this.sc.data.trlevel.frames[frame++], BBHiX =  this.sc.data.trlevel.frames[frame++],
                      BBLoY = -this.sc.data.trlevel.frames[frame++], BBHiY = -this.sc.data.trlevel.frames[frame++],
                      BBLoZ = -this.sc.data.trlevel.frames[frame++], BBHiZ = -this.sc.data.trlevel.frames[frame++];

                let transX = this.sc.data.trlevel.frames[frame++], transY = -this.sc.data.trlevel.frames[frame++], transZ = -this.sc.data.trlevel.frames[frame++];

                let numAnimatedMeshesUnknown = 99999, numAnimatedMeshes = numAnimatedMeshesUnknown;
                if (this.sc.data.trlevel.rversion == 'TR1') {
                    numAnimatedMeshes = this.sc.data.trlevel.frames[frame++];
                }

                let mesh = 0, keyData = [];
                // Loop through all the meshes of the key
                while (mesh < numAnimatedMeshes) {
                    let angleX = 0.0, angleY = 0.0, angleZ = 0.0;

                    if (numAnimatedMeshes == numAnimatedMeshesUnknown && (frame - sframe) >= frameStep) { break; }

                    let frameData = this.sc.data.trlevel.frames[frame++];
                    if (frameData < 0) { frameData += 65536; }

                    if ((frameData & 0xC000) && (this.sc.data.trlevel.rversion != 'TR1')) { // single axis of rotation
                        let angle = this.sc.data.trlevel.rversion == 'TR4' ? (frameData & 0xFFF) >> 2 : frameData & 0x3FF;

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
                    } else { // 3 axis of rotation
                        if (numAnimatedMeshes == numAnimatedMeshesUnknown && (frame - sframe) >= frameStep) { break; }

                        let frameData2 = this.sc.data.trlevel.frames[frame++];
                        if (frameData2 < 0) { frameData2 += 65536; }

                        if (this.sc.data.trlevel.rversion == 'TR1') {
                            let temp = frameData;
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

                    const qx = glMatrix.quat.create(), qy = glMatrix.quat.create(), qz = glMatrix.quat.create();

                    glMatrix.quat.setAxisAngle(qx, [1, 0, 0], angleX);
                    glMatrix.quat.setAxisAngle(qy, [0, 1, 0], -angleY);
                    glMatrix.quat.setAxisAngle(qz, [0, 0, 1], -angleZ);

                    glMatrix.quat.mul(qy, qy, qx);
                    glMatrix.quat.mul(qy, qy, qz);

                    keyData.push({
                        "position": 	{ x: transX, y: transY, z: transZ },
                        "quaternion":	{ x: qy[0], y: qy[1], z: qy[2], w: qy[3] }
                    });

                    transX = transY = transZ = 0;

                    mesh++;
                }

                animKeys.push({
                    "time": 		key * anim.frameRate,
                    "boundingBox": 	{ xmin: BBLoX, ymin: BBHiY, zmin: BBHiZ, xmax: BBHiX, ymax: BBLoY, zmax: BBLoZ },
                    "data":  		keyData
                });

            }

            const animCommands = [], numAnimCommands = anim.numAnimCommands;

            if (numAnimCommands < 0x100) {
                let aco = anim.animCommand;
                for (let ac = 0; ac < numAnimCommands; ++ac) {
                    let cmd = this.sc.data.trlevel.animCommands[aco++].value, numParams = Commands.numParams[cmd];

                    const command = {
                        "cmd": cmd,
                        "params": Array<number>()
                    };

                    while (numParams-- > 0) {
                        command.params.push(this.sc.data.trlevel.animCommands[aco++].value);
                    }

                    animCommands.push(command);
                }
            } else {
                console.log('Invalid num anim commands (' + numAnimCommands + ') ! ', anim);
            }

            if (this.sc.data.trlevel.animations[anim.nextAnimation] != undefined) { // to avoid bugging for lost artifact TR3 levels
                animTracks.push({
                    "name": 			"anim" + anm,
                    "numKeys":  		animNumKeys,
                    "numFrames":  		numFrames,
                    "frameRate": 		anim.frameRate,
                    "fps":  			animFPS,
                    "nextTrack":  		anim.nextAnimation,
                    "nextTrackFrame": 	anim.nextFrame - this.sc.data.trlevel.animations[anim.nextAnimation].frameStart,
                    "keys":  			animKeys,
                    "commands":     	animCommands,
                    "frameStart":    	anim.frameStart
                });
            }

        }

        this.sc.data.animTracks = animTracks;

    }

    private createAllMoveables(): void {
        const objIdAnim: any  = this.confMgr.param('behaviour[name="ScrollTexture"]', true, true),
              lstIdAnim: any  =  {};

        if (objIdAnim) {
            for (let i = 0; i < objIdAnim.length; ++i) {
                const node = objIdAnim[i];
                lstIdAnim[parseInt(node.getAttribute("objectid"))] = true;
            }
        }

        for (let m = 0; m < this.sc.data.trlevel.moveables.length; ++m) {
            const moveable = this.sc.data.trlevel.moveables[m];

            this.createMoveable(moveable, lstIdAnim);
        }
    }

    private createMoveable(moveable: any, lstIdAnim: any): void {
        const jsonid = 'moveable' + moveable.objectID;

        const objIDForVisu = this.confMgr.number('moveable[id="' + moveable.objectID + '"] > visuid', true, moveable.objectID);

        const moveableGeom: any = this.sc.data.trlevel.moveables[this.movObjID2Index[objIDForVisu]];

        let numMeshes = moveableGeom.numMeshes, meshIndex = moveableGeom.startingMesh, meshTree = moveableGeom.meshTree,
            moveableIsExternallyLit = false, materials = null, meshJSON = null;
        const isDummy = numMeshes == 1 && this.sc.data.trlevel.meshes[meshIndex].dummy && !(moveableGeom.objectID == this.laraObjectID);

        const trType = this.sc.data.trlevel.rversion;

        if (!isDummy) {
            meshJSON = this.helper.createNewGeometryData();

            delete meshJSON.attributes.vertColor;

            const tiles2material = {};
            let stackIdx = 0, stack = [], parent = -1;
            let px = 0, py = 0, pz = 0, bones = [];

            meshJSON.objHasScrollAnim = moveableGeom.objectID in lstIdAnim;

            meshJSON.skinIndices = [];
            meshJSON.skinWeights = [];

            for (let idx = 0; idx < numMeshes; ++idx, meshIndex++) {
                if (idx != 0) {
                    const sflag = this.sc.data.trlevel.meshTrees[meshTree++].coord;
                    px = this.sc.data.trlevel.meshTrees[meshTree++].coord;
                    py = this.sc.data.trlevel.meshTrees[meshTree++].coord;
                    pz = this.sc.data.trlevel.meshTrees[meshTree++].coord;
                    if (sflag & 1) {
                        if (stackIdx == 0) { stackIdx = 1; } // some moveables can have stackPtr == -1 without this test... (look in joby1a.tr4 for eg)
                        parent = stack[--stackIdx];
                    }
                    if (sflag & 2) {
                        stack[stackIdx++] = parent;
                    }
                }

                const mesh = this.sc.data.trlevel.meshes[meshIndex];

                let isDummyMesh = true;

                if (!mesh.dummy  ||  (mesh.dummy && (
                    ((trType == 'TR3' || trType == 'TR4')  &&  objIDForVisu == 1  &&  idx == 1)  ||
                    ((trType == 'TR1' || trType == 'TR2') &&  objIDForVisu == 0) ||
                    (trType == 'TR1' && objIDForVisu == 77)
                ))) {
                    isDummyMesh = false;
                }

                if ((isDummyMesh && trType == 'TR4') || (idx == 0 && trType == 'TR4' && moveableGeom.objectID == ObjectID.LaraJoints)) {
                    // dummy mesh + hack to remove bad data from joint #0 of Lara joints in TR4
                } else {
                    const internalLit = this.helper.makeMeshGeometry(mesh, meshJSON, tiles2material, this.sc.data.trlevel.objectTextures, this.sc.data.trlevel.mapObjTexture2AnimTexture, idx);

                    moveableIsExternallyLit = moveableIsExternallyLit || !internalLit;
                }

                bones.push({
                    "parent": parent,
                    "name": "mesh#" + meshIndex,
                    "pos": [ 0, 0, 0 ],
                    "pos_init": [ px, -py, -pz ],
                    "rotq": [ 0, 0, 0, 1]
                });

                parent = idx;
            }

            delete meshJSON.objHasScrollAnim;

            materials = this.helper.makeMaterialList(tiles2material, 'moveable', jsonid);

            this.sc.geometries.push({
                "uuid": jsonid,
                "type": "BufferGeometry",
                "data": meshJSON
            });

            if (materials) {
                this.sc.materials.push(...materials);
            }

            this.objects.push({
                "uuid"                  : jsonid,
                "type"                  : "Mesh",
                "name"                  : jsonid,
                "geometry" 				: !isDummy ? jsonid : null,
                "material" 				: !isDummy ? materials.map((m: any) => m.uuid) : null,
                "position" 				: [ 0, 0, 0 ],
                "quaternion" 			: [ 0, 0, 0, 1 ],
                "scale"	   				: [ 1, 1, 1 ]
            });

            this.sc.data.objects[jsonid] = {
                "type"   				: 'moveable',
                "raw"                   : moveable,
                "has_anims"				: !isDummy,
                "numAnimations"         : !isDummy ? moveable.numAnimations : 0,
                "roomIndex"				: -1,
                "animationStartIndex"	: moveable.animation,
                "objectid"              : moveable.objectID,
                "visible"  				: false,
                "bonesStartingPos"      : !isDummy ? bones : null,
                "internallyLit"         : !moveableIsExternallyLit,
                "startingMesh"          : moveableGeom.startingMesh
            };
        }
    }

    private createAllSpriteSequences(): void {
        for (let s = 0; s < this.sc.data.trlevel.spriteSequences.length; ++s) {
            const spriteSeq = this.sc.data.trlevel.spriteSequences[s];

            this.createSpriteSequence(spriteSeq);
        }
    }

    private createSpriteSequence(spriteSeq: number | any): void {
        const geometry = this.createSpriteSeq(spriteSeq);

        const spriteid = 'spriteseq' + spriteSeq.objectID;

        this.sc.materials.push(...geometry.materials);

        this.objects.push({
            "uuid"          : spriteid,
            "type"          : "Mesh",
            "name"          : spriteid,
            "geometry" 	    : geometry.uuid,
            "material" 		: geometry.materials.map((m: any) => m.uuid),
            "position" 	    : [ 0, 0, 0 ],
            "quaternion"    : [ 0, 0, 0, 1 ],
            "scale"	   	    : [ 1, 1, 1 ]
        });

        this.sc.data.objects[spriteid] = {
            "type" 	        : 'spriteseq',
            "raw"           : spriteSeq,
            "roomIndex"	    : -1,
            "objectid"      : spriteSeq.objectID,
            "visible"  	    : false
        };
    }

    private collectLightsExt(): void {
        let addedLights = 0;

        for (let objID in this.sc.data.objects) {
            const objData = this.sc.data.objects[objID];

            if (objData.type != 'room') {
                continue;
            }

            const portals = objData.portals;

            const lights = objData.lights.slice(0);
            for (let p = 0; p < portals.length; ++p) {
                const portal = portals[p], r = portal.adjoiningRoom, adjRoom = this.sc.data.objects['room' + r];
                if (!adjRoom) { continue; }

                const portalCenter = {
                    x: (portal.vertices[0].x + portal.vertices[1].x + portal.vertices[2].x + portal.vertices[3].x) / 4.0,
                    y: (portal.vertices[0].y + portal.vertices[1].y + portal.vertices[2].y + portal.vertices[3].y) / 4.0,
                    z: (portal.vertices[0].z + portal.vertices[1].z + portal.vertices[2].z + portal.vertices[3].z) / 4.0
                };

                const rlights = adjRoom.lights;
                for (let l = 0; l < rlights.length; ++l) {
                    const rlight = rlights[l];

                    switch (rlight.type) {
                        case 'directional':
                            continue;
                    }

                    const distToPortalSq =
                            (portalCenter.x - rlight.x) * (portalCenter.x - rlight.x) +
                            (portalCenter.y - rlight.y) * (portalCenter.y - rlight.y) +
                            (portalCenter.z - rlight.z) * (portalCenter.z - rlight.z);

                    if (distToPortalSq > rlight.fadeOut * rlight.fadeOut) { continue; }

                    lights.push(rlight);
                    addedLights++;
                }
            }

            objData.lightsExt = lights;
        }

        console.log('Number of additional lights added: ' + addedLights);
    }

    private createVertexNormals(): void {

        let vA, vB, vC, vD;
        let cb, ab, db, dc, bc, cross;

        for (let i = 0; i < this.sc.geometries.length; ++i) {
            const geom = this.sc.geometries[i].data;

            const vertices = geom.vertices,
                  normals = geom.normals,
                  faces = geom.faces;

            for (let v = 0; v < vertices.length; ++v) {
                normals.push(0);
            }

            for (let f = 0; f < faces.length; ++f) {
                const face = faces[f], isTri = face.length == 3;

                if (isTri) {
                    vA = [ vertices[ face[0].idx * 3 + 0 ], vertices[ face[0].idx * 3 + 1 ], vertices[ face[0].idx * 3 + 2 ] ];
                    vB = [ vertices[ face[1].idx * 3 + 0 ], vertices[ face[1].idx * 3 + 1 ], vertices[ face[1].idx * 3 + 2 ] ];
                    vC = [ vertices[ face[1].idx * 3 + 0 ], vertices[ face[2].idx * 3 + 1 ], vertices[ face[2].idx * 3 + 2 ] ];

                    cb = [ vC[0] - vB[0], vC[1] - vB[1], vC[2] - vB[2] ];
                    ab = [ vA[0] - vB[0], vA[1] - vB[1], vA[2] - vB[2] ];
                    cross = [
                        cb[1] * ab[2] - cb[2] * ab[1],
                        cb[2] * ab[0] - cb[0] * ab[2],
                        cb[0] * ab[1] - cb[1] * ab[0]
                    ];

                    normals[ face[0].idx * 3 + 0 ] += cross[0]; normals[ face[0].idx * 3 + 1 ] += cross[1]; normals[ face[0].idx * 3 + 2 ] += cross[2];
                    normals[ face[1].idx * 3 + 0 ] += cross[0]; normals[ face[1].idx * 3 + 1 ] += cross[1]; normals[ face[1].idx * 3 + 2 ] += cross[2];
                    normals[ face[2].idx * 3 + 0 ] += cross[0]; normals[ face[2].idx * 3 + 1 ] += cross[1]; normals[ face[2].idx * 3 + 2 ] += cross[2];
                } else {
                    vA = [ vertices[ face[0].idx * 3 + 0 ], vertices[ face[0].idx * 3 + 1 ], vertices[ face[0].idx * 3 + 2 ] ];
                    vB = [ vertices[ face[1].idx * 3 + 0 ], vertices[ face[1].idx * 3 + 1 ], vertices[ face[1].idx * 3 + 2 ] ];
                    vC = [ vertices[ face[2].idx * 3 + 0 ], vertices[ face[2].idx * 3 + 1 ], vertices[ face[2].idx * 3 + 2 ] ];
                    vD = [ vertices[ face[3].idx * 3 + 0 ], vertices[ face[3].idx * 3 + 1 ], vertices[ face[3].idx * 3 + 2 ] ];

                    // abd

                    db = [ vD[0] - vB[0], vD[1] - vB[1], vD[2] - vB[2] ];
                    ab = [ vA[0] - vB[0], vA[1] - vB[1], vA[2] - vB[2] ];
                    cross = [
                        db[1] * ab[2] - db[2] * ab[1],
                        db[2] * ab[0] - db[0] * ab[2],
                        db[0] * ab[1] - db[1] * ab[0]
                    ];

                    normals[ face[0].idx * 3 + 0 ] += cross[0]; normals[ face[0].idx * 3 + 1 ] += cross[1]; normals[ face[0].idx * 3 + 2 ] += cross[2];
                    normals[ face[1].idx * 3 + 0 ] += cross[0]; normals[ face[1].idx * 3 + 1 ] += cross[1]; normals[ face[1].idx * 3 + 2 ] += cross[2];
                    normals[ face[3].idx * 3 + 0 ] += cross[0]; normals[ face[3].idx * 3 + 1 ] += cross[1]; normals[ face[3].idx * 3 + 2 ] += cross[2];

                    // bcd

                    dc = [ vD[0] - vC[0], vD[1] - vC[1], vD[2] - vC[2] ];
                    bc = [ vB[0] - vC[0], vB[1] - vC[1], vB[2] - vC[2] ];
                    cross = [
                        dc[1] * bc[2] - dc[2] * bc[1],
                        dc[2] * bc[0] - dc[0] * bc[2],
                        dc[0] * bc[1] - dc[1] * bc[0]
                    ];

                    normals[ face[1].idx * 3 + 0 ] += cross[0]; normals[ face[1].idx * 3 + 1 ] += cross[1]; normals[ face[1].idx * 3 + 2 ] += cross[2];
                    normals[ face[2].idx * 3 + 0 ] += cross[0]; normals[ face[2].idx * 3 + 1 ] += cross[1]; normals[ face[2].idx * 3 + 2 ] += cross[2];
                    normals[ face[3].idx * 3 + 0 ] += cross[0]; normals[ face[3].idx * 3 + 1 ] += cross[1]; normals[ face[3].idx * 3 + 2 ] += cross[2];

                }
            }

            for (let n = 0; n < normals.length / 3; ++n) {
                let x = normals[n * 3 + 0], y = normals[n * 3 + 1], z = normals[n * 3 + 2];
                let nrm = Math.sqrt(x * x + y * y + z * z);
                if (x == 0 && y == 0 && z == 0) { x = 0; y = 1; z = 0; nrm = 1; } // it's possible some vertices are not used in the object, so normal==0 at this point - put a (fake) valid normal
                normals[n * 3 + 0] = x / nrm;
                normals[n * 3 + 1] = y / nrm;
                normals[n * 3 + 2] = z / nrm;

            }

        }
    }

    private weldSkinJoints(mainSkinId: number, jointSkinId: number): void {
        const joints = this.helper.getGeometryFromId('moveable' + jointSkinId).data,
              jointsVertices = joints.vertices,
              main = this.helper.getGeometryFromId('moveable' + mainSkinId).data,
              mainVertices = main.vertices;

        const bones = this.sc.data.objects['moveable' + mainSkinId].bonesStartingPos,
              numBones = bones.length,
              posStack: Array<any> = [];

        for (let j = 0; j < numBones; ++j) {
            const bone = bones[j], pos = bone.pos_init.slice(0);
            if (bone.parent >= 0) {
                pos[0] += posStack[bone.parent][0];
                pos[1] += posStack[bone.parent][1];
                pos[2] += posStack[bone.parent][2];
            }
            posStack.push(pos);
        }

        function findVertex(x: number, y: number, z: number, b1: number, b2: number): number {
            for (let v = 0; v < mainVertices.length / 3; ++v) {
                const bidx = main.skinIndices[v * 2 + 0];
                if (bidx != b1 && bidx != b2) { continue; }
                const boneTrans = posStack[bidx],
                      dx = mainVertices[v * 3 + 0] + boneTrans[0] - x, dy = mainVertices[v * 3 + 1] + boneTrans[1] - y, dz = mainVertices[v * 3 + 2] + boneTrans[2] - z,
                      dist = dx * dx + dy * dy + dz * dz;
                if (dist < 24) {
                //if (Math.abs(dx) <= 1 && Math.abs(dy) <= 1 && Math.abs(dz) <= 1) {
                    return v;
                }
            }
            return -1;
        }

        for (let i = 0; i < jointsVertices.length / 3; ++i) {
            const boneIdx = joints.skinIndices[i * 2 + 0],
                  boneParentIdx = boneIdx > 0 ? bones[boneIdx].parent : boneIdx,
                  jointTrans = posStack[boneIdx],
                  x = jointsVertices[i * 3 + 0] + jointTrans[0], y = jointsVertices[i * 3 + 1] + jointTrans[1], z = jointsVertices[i * 3 + 2] + jointTrans[2];
            const idx = findVertex(x, y, z, boneIdx, boneParentIdx);
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

    }

    private makeLaraBraid(): void {
        const braidId =  this.confMgr.number('behaviour[name="Ponytail"] > id', true, -1),
              young = this.confMgr.boolean('behaviour[name="Ponytail"] > young', true, false);

        if (braidId < 0) { return; }

        this.weldSkinJoints(braidId, braidId);

        const braid = this.helper.getGeometryFromId('moveable' + braidId).data,
              vertices = braid.vertices;

        if (this.sc.data.trlevel.rversion == 'TR4') {
            if (!young) {
                vertices[0 * 3 + 0] -= 5;
                vertices[1 * 3 + 0] -= 5;
                vertices[2 * 3 + 0] += 5;
                vertices[3 * 3 + 0] += 5;
            }
        }
    }

    private makeSkinnedLara(): void {
        const laraID = 0;

        this.weldSkinJoints(laraID, ObjectID.LaraJoints);

        const joints = this.helper.getGeometryFromId('moveable' + ObjectID.LaraJoints).data,
              main = this.helper.getGeometryFromId('moveable' + laraID).data,
              mainVertices = main.vertices;

        let numMatInMain = 0;
        for (let f = 0; f < main.faces.length; ++f) {
            const face = main.faces[f];
            numMatInMain = Math.max(numMatInMain, face.matIndex + 1);
        }

        const faces = joints.faces;
        for (let f = 0; f < faces.length; ++f) {
            let face = faces[f];
            face.matIndex += this.sc.data.trlevel.atlas.make ? 0 : numMatInMain;
            for (let v = 0; v < face.length; ++v) {
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

        const laraObject = this.helper.getObjectFromId('moveable' + laraID);
        const laraJointObject = this.helper.getObjectFromId('moveable' + ObjectID.LaraJoints);

        if (!this.sc.data.trlevel.atlas.make) {
            laraObject.material = laraObject.material.concat(laraJointObject.material);
        }

        this.sc.geometries.splice(this.sc.geometries.indexOf(this.helper.getGeometryFromId('moveable' + ObjectID.LaraJoints)), 1);
        this.objects.splice(this.objects.indexOf(laraJointObject), 1);
    }

    private makeGeometryData(): void {
        for (let i = 0; i < this.sc.geometries.length; ++i) {
            const geom = this.sc.geometries[i].data;

            const attributes = geom.attributes,
                  vertices = geom.vertices,
                  normals = geom.normals,
                  colors = attributes.vertColor ? geom.colors : null,
                  _flags = attributes._flags ? geom._flags : null,
                  skinIndices = geom.skinIndices,
                  skinWeights = geom.skinWeights,
                  faces = geom.faces;

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

            const indices = [];

            for (let f = 0; f < faces.length; ++f) {
                const face = faces[f];

                const matIndex = face.matIndex, posIdx = attributes.position.array.length / 3;
                for (let v = 0; v < face.length; ++v) {
                    const vertex = face[v];
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

                let lsti: Array<number> = indices[matIndex];
                if (!lsti) {
                    lsti = [];
                    indices[matIndex] = lsti;
                }

                if (face.length == 3) {
                    lsti.push(posIdx, posIdx + 1, posIdx + 2);
                } else {
                    lsti.push(posIdx, posIdx + 1, posIdx + 3);
                    lsti.push(posIdx + 1, posIdx + 2, posIdx + 3);
                }
            }

            geom.groups = [];

            for (let i = 0, ofst = 0; i < indices.length; ++i) {
                const lst = indices[i];
                geom.groups.push({ "start": ofst, "count": lst.length, "materialIndex": i });
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
    }

    public convert(trlevel: RawLevel) {
        glMatrix.glMatrix.setMatrixArrayType(Array);

        this.confMgr = trlevel.confMgr;

        this.sc =  {
            "metadata": {
                "version": 4.3,
                "type" : "Object"
            },

            "object": {
                "type": "Scene",
                "children": [ ]
            },

            "geometries": [ ],

            "materials": [ ],

            "textures": [ ],

            "images": [ ],

            "data": {
                "objects": {
                },

                "trlevel": trlevel
            }
        };

        this.objects = this.sc.object.children;

        this.sc.data.levelFileName = this.sc.data.trlevel.filename;
        this.sc.data.levelShortFileName = this.sc.data.levelFileName;
        this.sc.data.levelShortFileNameNoExt = this.sc.data.levelShortFileName.substring(0, this.sc.data.levelShortFileName.indexOf('.'));
        this.sc.data.waterColor = {
            "in" : this.confMgr.globalColor('water > colorin'),
            "out" : this.confMgr.globalColor('water > colorout')
        };
        this.sc.data.rversion = this.sc.data.trlevel.rversion;
        this.sc.data.soundPath = "/resources/sound/" + this.sc.data.rversion.toLowerCase() + "/";

        this.helper = new LevelConverterHelper(this.sc, this.objects);

        this.laraObjectID = this.confMgr.number('lara > id', true, 0);

        const hasUVRotate = this.confMgr.param('behaviour[name="UVRotate"]', true, true);
        if (!hasUVRotate) {
            this.sc.data.trlevel.animatedTexturesUVCount = 0;
        }

        this.movObjID2Index = {};

        for (let m = 0; m < this.sc.data.trlevel.moveables.length; ++m) {
            const moveable = this.sc.data.trlevel.moveables[m];
            this.movObjID2Index[moveable.objectID] = m;
        }

        this.objects.push({
            "uuid"      : "camera1",
            "type"      : "PerspectiveCamera",
            "name"      : "camera1",
            "fov"       : this.confMgr.float('camera > fov', true, 50),
            "near"      : this.confMgr.float('camera > neardist', true, 50),
            "far"       : this.confMgr.float('camera > fardist', true, 10000),
            "position"  : [ 0, 0, 0 ],
            "quaternion": [ 0, 0, 0, 1 ]
        });

        this.sc.data.objects['camera1'] = {
            "type"      : "camera",
            "objectid"  : 0,
            "roomIndex" : -1,
            "visible"   : false
        };

        // get the number of animations for each moveable
        for (let m = 0; m < this.sc.data.trlevel.moveables.length; ++m) {
            const moveable = this.sc.data.trlevel.moveables[m];

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
    }

}
