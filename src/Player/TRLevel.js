TRN.TRLevel = function() {
    this.movObjID2Index = {};
}

TRN.TRLevel.prototype = {

    constructor : TRN.TRLevel,

    initialize : function(gameData) {
        this.trlevel = gameData.sceneData.trlevel;
        this.sceneRender = gameData.sceneRender;
        this.sceneData = gameData.sceneData;
        this.objMgr = gameData.objMgr;
        this.confMgr = gameData.confMgr;
        this.shdMgr = gameData.shdMgr;
    
        for (let m = 0; m < this.trlevel.moveables.length; ++m) {
            const moveable = this.trlevel.moveables[m];
            this.movObjID2Index[moveable.objectID] = m;
        }
    },

    getRoomByPos : function(pos) {
        const trlevel = this.trlevel,
              x = Math.floor(pos.x),
              y = -Math.floor(pos.y),
              z = -Math.floor(pos.z);

        for (let r = 0; r < trlevel.rooms.length; ++r) {
            const room = trlevel.rooms[r];
            if (room.isAlternate) {
                continue;
            }
            const mx = room.info.x + room.numXsectors * 1024;
            const mz = room.info.z + room.numZsectors * 1024;
            if (x >= room.info.x && x < mx && z >= room.info.z && z < mz && y >= room.info.yTop && y < room.info.yBottom) {
                return r;
            }
        }
        return -1;
    },

    isPointInRoom : function(pos, roomIndex) {
        const room = this.trlevel.rooms[roomIndex];

        const x = Math.floor(pos.x),
              y = -Math.floor(pos.y),
              z = -Math.floor(pos.z);

        const mx = room.info.x + room.numXsectors * 1024;
        const mz = room.info.z + room.numZsectors * 1024;

        if (x >= room.info.x && x < mx && z >= room.info.z && z < mz && y >= room.info.yTop && y < room.info.yBottom) {
            return true;
        }

        return false;
    },

    getItemsWithObjID : function(objID) {
        const items = [];
        for (let i = 0; i < this.trlevel.items.length; ++i) {
            const item = this.trlevel.items[i];

            if (item.objectID == objID) {
                items.push(item);
            }
        }
        return items;
    },

	convertIntensity : function(intensity) {
		let l = [intensity/8192.0, intensity/8192.0, intensity/8192.0];

		if (this.trlevel.rversion == 'TR3' || this.trlevel.rversion == 'TR4') {
            const b = ((intensity & 0x7C00) >> 10) << 3, 
                  g = ((intensity & 0x03E0) >> 5) << 3, 
                  r = (intensity & 0x001F) << 3;

			l = [r/255, g/255, b/255];
		}

		return l;
    },
    
    convertLighting : function(lighting1) {
		let color = [0, 0, 0];

		switch(this.trlevel.rversion) {
			case 'TR1':
            case 'TR2': {
                lighting = Math.floor((1.0-lighting1/8192.)*2*256);
				if (lighting > 255) lighting = 255;
				color = [lighting/255.0, lighting/255.0, lighting/255.0];
                break;
            }
			case 'TR3': {
				lighting = lighting1;
                const r = (lighting & 0x7C00) >> 10, g = (lighting & 0x03E0) >> 5, b = (lighting & 0x001F);
                color = [((r << 3) + 0x7)/255.0, ((g << 3) + 0x7)/255.0, ((b << 3) + 0x7)/255.0];
                break;
            }
			case 'TR4': {
				lighting = lighting1;
				let r = (((lighting & 0x7C00) >> 7) + 7) << 1, g = (((lighting & 0x03E0) >> 2) + 7) << 1, b = (((lighting & 0x001F) << 3) + 7) << 1;
				if (r > 255) r = 255;
				if (g > 255) g = 255;
                if (b > 255) b = 255;
                color = [r/255.0, g/255.0, b/255.0];
                break;
            }
		}

        return color;
    },

	createObjectsInLevel : function () {
		for (let i = 0; i < this.trlevel.items.length; ++i) {
			const item = this.trlevel.items[i];

			const roomIndex = item.room, lighting = item.intensity1, q = glMatrix.quat.create();

			glMatrix.quat.setAxisAngle(q, [0,1,0], glMatrix.glMatrix.toRadian(-(item.angle >> 14) * 90) );

			const m = this.movObjID2Index[item.objectID];
			if (m == null) {
                const obj = this.objMgr.createSprite(-item.objectID, roomIndex, this.convertLighting(lighting), true);
                //console.log('spriteseq', item.objectID, this.convertLighting(lighting))
                if (obj != null) {
                    obj.position.set(item.x, -item.y, -item.z);
                    obj.updateMatrix();
                }
			} else {
                let obj = this.objMgr.createMoveable(item.objectID, roomIndex, lighting != -1 ? this.convertIntensity(lighting) : undefined);

                if (obj != null) {
                    obj.position.set(item.x, -item.y, -item.z);
                    obj.quaternion.set(q[0], q[1], q[2], q[3]);
                    //this.sceneRender.add(new THREE.BoxHelper(obj, new THREE.Color(1,1,1)));
                } else {
                    // moveable is a placeholder with no geometry
                    const spriteSeqObjID = this.confMgr.number('moveable[id="' + item.objectID + '"] > spritesequence', true, -1);

                    if (spriteSeqObjID >= 0) {
                        obj = this.objMgr.createSprite(-spriteSeqObjID, roomIndex, [1, 1, 1], true);
                        if (obj != null) {
                            obj.position.set(item.x, -item.y, -item.z);
                            obj.updateMatrix();
                        }
                    }
                }
            }
        }
        
		for (let m = 0; m < this.trlevel.rooms.length; ++m) {
            const room = this.trlevel.rooms[m],
                  info = room.info, 
                  rdata = room.roomData,
                  data = this.sceneData.objects['room' + m];

            // create portals
            const portals = data.portals, meshPortals = [];
            data.meshPortals = meshPortals;
            for (let p = 0; p < portals.length; ++p) {
                const portal = portals[p], geom = new THREE.Geometry();
                geom.vertices.push(
                    new THREE.Vector3(portal.vertices[0].x, portal.vertices[0].y, portal.vertices[0].z),
                    new THREE.Vector3(portal.vertices[1].x, portal.vertices[1].y, portal.vertices[1].z),
                    new THREE.Vector3(portal.vertices[2].x, portal.vertices[2].y, portal.vertices[2].z),
                    new THREE.Vector3(portal.vertices[3].x, portal.vertices[3].y, portal.vertices[3].z)
                );
                geom.colors.push(
                    new THREE.Color(0xff0000),
                    new THREE.Color(0x00ff00),
                    new THREE.Color(0x0000ff),
                    new THREE.Color(0xffffff)
                );
                geom.faces.push(new THREE.Face3(0, 1, 2, undefined, [geom.colors[0], geom.colors[1], geom.colors[2]]));
                geom.faces.push(new THREE.Face3(0, 2, 3, undefined, [geom.colors[0], geom.colors[2], geom.colors[3]]));
                var mesh = new THREE.Mesh(geom, new THREE.ShaderMaterial( {
                    uniforms: {
                    },
                    vertexShader: this.shdMgr.getVertexShader('portal'),
                    fragmentShader: this.shdMgr.getFragmentShader('portal'),
                    depthTest: true,
                    depthWrite: false,
                    fog: false,
                    vertexColors: THREE.VertexColors,
                    transparent: true
                }));
                mesh.name = 'room' + m + '_portal' + p;
                mesh.position.x = mesh.position.y = mesh.position.z = 0;
                mesh.updateMatrix();
                mesh.matrixAutoUpdate = false;
                mesh.visible = false;
				mesh.geometry.computeBoundingBox();
				mesh.geometry.computeBoundingSphere();
                meshPortals.push(mesh);
                this.sceneRender.add(mesh);
            }

			// static meshes in the room
			for (let s = 0; s < room.staticMeshes.length; ++s) {
				const staticMesh = room.staticMeshes[s],
				      x = staticMesh.x, y = -staticMesh.y, z = -staticMesh.z, rot = ((staticMesh.rotation & 0xC000) >> 14) * 90,
				      objectID = staticMesh.objectID;

				const mflags = this.sceneData.objects['staticmesh' + objectID].flags,
				      nonCollisionable = (mflags & 1) != 0, visible = (mflags & 2) != 0;

				if (!visible) {
                    continue;
                }

                const q = glMatrix.quat.create();
                
				glMatrix.quat.setAxisAngle( q, [0,1,0], glMatrix.glMatrix.toRadian(-rot) );

				const obj = this.objMgr.createStaticMesh(objectID, m, this.convertIntensity(staticMesh.intensity1), true);

                if (obj != null) {
                    obj.visible = !data.isAlternateRoom;
                    obj.position.set(x, y, z);
                    obj.quaternion.set(q[0], q[1], q[2], q[3]);
                    obj.updateMatrix();
                    //this.sceneRender.add(new THREE.BoxHelper(obj, new THREE.Color(1,1,1)));
                }
            }
            
			// sprites in the room
			for (let s = 0; s < rdata.sprites.length; ++s) {
                const sprite = rdata.sprites[s], 
                      spriteIndex = sprite.texture;
                      rvertex = rdata.vertices[sprite.vertex],
                      lighting = this.trlevel.rversion == 'TR1' ? rvertex.lighting1 : rvertex.lighting2;

                const obj = this.objMgr.createSprite(spriteIndex, m, this.convertLighting(lighting), true);

                if (obj != null) {
                    obj.visible = !data.isAlternateRoom;
                    obj.position.set(rvertex.vertex.x + info.x, -rvertex.vertex.y, -rvertex.vertex.z - info.z);
                    obj.updateMatrix();
                    //this.sceneRender.add(new THREE.BoxHelper(obj, new THREE.Color(1,1,1)));
                }
			}
        }
	}

}
