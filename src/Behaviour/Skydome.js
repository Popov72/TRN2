TRN.Behaviours.Skydome = function(nbhv, gameData) {
    this.nbhv = nbhv;
    this.sceneData = gameData.sceneData;
    this.sceneBackground = gameData.sceneBackground;
    this.objMgr = gameData.objMgr;
    this.shdMgr = gameData.shdMgr;
    this.camera = gameData.camera;

    this.createSkyDome();
}

TRN.Behaviours.Skydome.prototype = {

    constructor : TRN.Behaviours.Skydome,

    init : async function(lstObjs, resolve) {
        const objSky = this.objMgr.objectList['skydome'];

        if (!objSky || !objSky['0']) {
            resolve(TRN.Consts.Behaviour.retDontKeepBehaviour);
            return;
        }

        this.objSky = objSky['0'][0];

        this.objSky.renderDepth = 0;
        this.objSky.matrixAutoUpdate = true;
        
        this.sceneBackground.add(this.objSky);

        const skyColor = [this.nbhv.color.r/255.0, this.nbhv.color.g/255.0, this.nbhv.color.b/255.0],
              material = this.objSky.material[0];

        material.uniforms.tintColor.value = skyColor;

        resolve(TRN.Consts.Behaviour.retKeepBehaviour);
    },

    frameEnded : function(curTime) {
        this.objSky.position.set(this.camera.position.x, this.camera.position.y, this.camera.position.z);

        const material = this.objSky.material[0];

        let pgr = curTime / 50.0;
        
        material.uniforms.offsetRepeat.value[0] = pgr - Math.floor(pgr);
    },

    createSkyDome : function() {
        let geom = new THREE.Geometry();

        geom.name = "skydome";
        geom.dynamic = false;

        const meshData = TRN.SkyDome.create(
            /*curvature*/ 10.0,
            /*tiling*/ 3,
            /*distance*/ 2000.0,
            /*orientation*/ [0,0,0,1],
            /*xsegments*/ 16, 
            /*ysegments*/ 16,
            /*ySegmentsToKeep*/ 8
        );

        for (let v = 0; v < meshData.vertices.length/3; ++v) {
            const x = meshData.vertices[v * 3 + 0],
                  y = meshData.vertices[v * 3 + 1],
                  z = meshData.vertices[v * 3 + 2];

            geom.vertices.push(new THREE.Vector3(x, y, z));
        }

        const faces = meshData.faces, 
              numFaces = faces.length / 3;
        for (let f = 0; f < numFaces; ++f) {
            const a = meshData.faces[f * 3 + 0],
                  b = meshData.faces[f * 3 + 1],
                  c = meshData.faces[f * 3 + 2];

            const face = new THREE.Face3();

            face.materialIndex = 0;
            face.a = a;
            face.b = b;
            face.c = c;

            geom.faces.push(face);

            let uvs = [];
            for (j = 0; j < 3; j ++) {
                const u = meshData.textures[meshData.faces[f * 3 + j] * 2 + 0],
                      v = meshData.textures[meshData.faces[f * 3 + j] * 2 + 1];

                uvs.push(new THREE.Vector2(u, v));
            }

            geom.faceVertexUvs[0].push(uvs);
        }

        let materials = [];
        
        const skyTexture = this.sceneData.textures["texture" + (TRN.Helper.objSize(this.sceneData.textures)-1)];

        skyTexture.wrapS = skyTexture.wrapT = THREE.RepeatWrapping;

        let material = new THREE.ShaderMaterial({
            "fragmentShader": this.shdMgr.getFragmentShader("skydome"),
            "vertexShader": this.shdMgr.getVertexShader("skydome"),
            "uniforms": {
                "map" :             { type: "t",    value: skyTexture },
                "offsetRepeat" :    { type: "f4",   value: [0, 0, 1, 1] },
                "tintColor" :       { type: "f3",   value: null }
            },
            "depthWrite": false
        });

        materials.push(material);

        let sky = new THREE.Mesh(geom, materials);

        sky.frustumCulled = false;
        sky.name = "skydome";

        this.sceneData.objects['skydome'] = {
            "type"					: 'skydome',
            "objectid"              : '0',
            "roomIndex"             : -1,
            "visible"  				: true
        };

        this.objMgr.objectList['skydome'] = {'0': [sky] };
    }

}
