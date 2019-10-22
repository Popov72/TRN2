import {
	UVMapping,
	CubeReflectionMapping,
	CubeRefractionMapping,
	EquirectangularReflectionMapping,
	EquirectangularRefractionMapping,
	SphericalReflectionMapping,
	CubeUVReflectionMapping,
	CubeUVRefractionMapping,

	RepeatWrapping,
	ClampToEdgeWrapping,
	MirroredRepeatWrapping,

	NearestFilter,
	NearestMipmapNearestFilter,
	NearestMipmapLinearFilter,
	LinearFilter,
	LinearMipmapNearestFilter,
    LinearMipmapLinearFilter,

    AdditiveBlending, OneFactor, OneMinusSrcColorFactor,
    
    BufferGeometryLoader,
    CubeTexture,
    ImageLoader,
    Loader,
    LoadingManager,
    Material,
    MaterialLoader,
    Mesh as TMesh,
    PerspectiveCamera,
    Scene as TScene,
    Texture
} from 'three';

import { TextureList } from "../../src/Proxy/IScene";
import { ShaderManager } from "../../src/ShaderManager";

import Camera from "./Camera";
import Mesh from "./Mesh";
import Node from "./Node";
import Scene  from "./Scene";

export default class SceneParser extends Loader {

    protected _shdMgr: ShaderManager;

    constructor(shdMgr: ShaderManager, manager?: any) {
        super(manager);

        this._shdMgr = shdMgr;
    }

	public parse ( json: any, onLoad: any ): any {

		var geometries = this.parseGeometries( json.geometries );

		var images = this.parseImages( json.images, function () {

			if ( onLoad !== undefined ) {
                let tscene = object as Scene;
                tscene.traverse( (msh: Mesh) => {
                    for (let m = 0; m < msh.materials.length; ++m) {
                        const material = msh.materials[m];
                        for (const uname in material.uniforms) {
                            const uval = material.uniforms[uname];
                            if (uname == 'map' || uname == 'mapBump') {
                                uval.width = uval.value.image.width;
                                uval.height = uval.value.image.height;
                            }
                        }
                    }
                });
                onLoad( object, textures );
            }

		} );

		var textures = this.parseTextures( json.textures, images );
		var materials = this.parseMaterials( json.materials, textures );

		var object: any = this.parseObject( json.object, geometries, materials, textures );

        const camera = object.getObjectByName("camera1");
        
        object.setCamera(camera);
        object.remove(camera);

		return object;

	}

	protected parseGeometries ( json: any ) {

		var geometries: any = {};

		if ( json !== undefined ) {

			var bufferGeometryLoader = new BufferGeometryLoader();

			for ( var i = 0, l = json.length; i < l; i ++ ) {

				var geometry;
				var data = json[ i ];

				switch ( data.type ) {

					case 'BufferGeometry':
					case 'InstancedBufferGeometry':

						geometry = bufferGeometryLoader.parse( data );

						break;

					default:

						console.warn( 'THREE.ObjectLoader: Unsupported geometry type "' + data.type + '"' );

						continue;

				}

				geometry.uuid = data.uuid;

				if ( data.name !== undefined ) geometry.name = data.name;
				if ( geometry.isBufferGeometry === true && data.userData !== undefined ) geometry.userData = data.userData;

				geometries[ data.uuid ] = geometry;

			}

		}

		return geometries;

	}

	protected parseMaterials ( json: any, textures: any ) {

		var cache: any = {};
		var materials: any = {};

		if ( json !== undefined ) {

			var loader = new MaterialLoader();
			loader.setTextures( textures );

			for ( var i = 0, l = json.length; i < l; i ++ ) {

				var data = json[ i ];

                if ( cache[ data.uuid ] === undefined ) {

                    cache[ data.uuid ] = loader.parse( data );
                    cache[ data.uuid ].vertexShader = this._shdMgr.getVertexShader(cache[ data.uuid ].vertexShader);
                    cache[ data.uuid ].fragmentShader = this._shdMgr.getFragmentShader(cache[ data.uuid ].fragmentShader);

                }

                materials[ data.uuid ] = cache[ data.uuid ];

			}

		}

		return materials;

	}

	public parseImages ( json: any, onLoad: any ) {

		var scope = this;
		var images: any = {};

		function loadImage( url: string ) {

			scope.manager.itemStart( url );

			return loader.load( url, function () {

				scope.manager.itemEnd( url );

			}, undefined, function () {

				scope.manager.itemError( url );
				scope.manager.itemEnd( url );

			} );

		}

		if ( json !== undefined && json.length > 0 ) {

			var manager = new LoadingManager( onLoad );

			var loader = new ImageLoader( manager );
			loader.setCrossOrigin( this.crossOrigin );

			for ( var i = 0, il = json.length; i < il; i ++ ) {

				var image = json[ i ];
				var url = image.url;

				if ( Array.isArray( url ) ) {

					// load array of images e.g CubeTexture

					images[ image.uuid ] = [];

					for ( var j = 0, jl = url.length; j < jl; j ++ ) {

						var currentUrl = url[ j ];

						var path = /^(\/\/)|([a-z]+:(\/\/)?)/i.test( currentUrl ) ? currentUrl : scope.resourcePath + currentUrl;

						images[ image.uuid ].push( loadImage( path ) );

					}

				} else {

					// load single image

					var path = /^(\/\/)|([a-z]+:(\/\/)?)/i.test( image.url ) ? image.url : scope.resourcePath + image.url;

					images[ image.uuid ] = loadImage( path );

				}

			}

		}

		return images;

	}

	public parseTextures ( json: any, images: any ) {

		function parseConstant( value: any, type: any ) {

			if ( typeof value === 'number' ) return value;

			console.warn( 'THREE.ObjectLoader.parseTexture: Constant should be in numeric form.', value );

			return type[ value ];

		}

		var textures: any = {};

		if ( json !== undefined ) {

			for ( var i = 0, l = json.length; i < l; i ++ ) {

				var data = json[ i ];

				if ( data.image === undefined ) {

					console.warn( 'THREE.ObjectLoader: No "image" specified for', data.uuid );

				}

				if ( images[ data.image ] === undefined ) {

					console.warn( 'THREE.ObjectLoader: Undefined image', data.image );

				}

				var texture;

				if ( Array.isArray( images[ data.image ] ) ) {

					texture = new CubeTexture( images[ data.image ] );

				} else {

					texture = new Texture( images[ data.image ] );

				}

				texture.needsUpdate = true;

				texture.uuid = data.uuid;

				if ( data.name !== undefined ) texture.name = data.name;

				if ( data.mapping !== undefined ) texture.mapping = parseConstant( data.mapping, TEXTURE_MAPPING );

				if ( data.offset !== undefined ) texture.offset.fromArray( data.offset );
				if ( data.repeat !== undefined ) texture.repeat.fromArray( data.repeat );
				if ( data.center !== undefined ) texture.center.fromArray( data.center );
				if ( data.rotation !== undefined ) texture.rotation = data.rotation;

				if ( data.wrap !== undefined ) {

					texture.wrapS = parseConstant( data.wrap[ 0 ], TEXTURE_WRAPPING );
					texture.wrapT = parseConstant( data.wrap[ 1 ], TEXTURE_WRAPPING );

				}

				if ( data.format !== undefined ) texture.format = data.format;
				if ( data.type !== undefined ) texture.type = data.type;
				if ( data.encoding !== undefined ) texture.encoding = data.encoding;

				if ( data.minFilter !== undefined ) texture.minFilter = parseConstant( data.minFilter, TEXTURE_FILTER );
				if ( data.magFilter !== undefined ) texture.magFilter = parseConstant( data.magFilter, TEXTURE_FILTER );
				if ( data.anisotropy !== undefined ) texture.anisotropy = data.anisotropy;

				if ( data.flipY !== undefined ) texture.flipY = data.flipY;

				if ( data.premultiplyAlpha !== undefined ) texture.premultiplyAlpha = data.premultiplyAlpha;
				if ( data.unpackAlignment !== undefined ) texture.unpackAlignment = data.unpackAlignment;

				textures[ data.uuid ] = texture;

			}

		}

		return textures;

	}

	public parseObject ( data: any, geometries: any, materials: any, textures: any ) {

        var object: any;
        var tobject: Node;

		function getGeometry( name: string ) {

			if ( geometries[ name ] === undefined ) {

				console.warn( 'THREE.ObjectLoader: Undefined geometry', name );

			}

			return geometries[ name ];

		}

		function getMaterial( name: string ) {

			if ( name === undefined ) return undefined;

			if ( Array.isArray( name ) ) {

				var array = [];

				for ( var i = 0, l = name.length; i < l; i ++ ) {

					var uuid = name[ i ];

					if ( materials[ uuid ] === undefined ) {

						console.warn( 'THREE.ObjectLoader: Undefined material', uuid );

					}

					array.push( materials[ uuid ] );

				}

				return array;

			}

			if ( materials[ name ] === undefined ) {

				console.warn( 'THREE.ObjectLoader: Undefined material', name );

			}

			return materials[ name ];

		}

		switch ( data.type ) {

			case 'Scene':

                const textureList: TextureList = [];

                for (const name in textures) {
                    const idx = name.substring("texture".length);
                    textureList[parseInt(idx)] = textures[name];
                }

                object = new TScene();
                tobject = new Scene(object, textureList);

				break;

			case 'PerspectiveCamera':

                object = new PerspectiveCamera( data.fov, data.aspect, data.near, data.far );
                tobject = new Camera(object);

				if ( data.focus !== undefined ) object.focus = data.focus;
				if ( data.zoom !== undefined ) object.zoom = data.zoom;
				if ( data.filmGauge !== undefined ) object.filmGauge = data.filmGauge;
				if ( data.filmOffset !== undefined ) object.filmOffset = data.filmOffset;
				if ( data.view !== undefined ) object.view = Object.assign( {}, data.view );

				break;

			case 'Mesh':

				var geometry = getGeometry( data.geometry );
				var material = getMaterial( data.material );

                object = new TMesh( geometry, material );
                tobject = new Mesh(object);

                object.geometry.computeBoundingBox();
                object.geometry.computeBoundingSphere();
                object.frustumCulled = true;

                const materials: Material | Material[] = object.material;

                if (Array.isArray(materials) && materials.length > 0) {
                    for (let i = 0; i < materials.length; ++i) {
                        const material = materials[i];
        
                        if (material.transparent) {
                            material.blending = AdditiveBlending;
                            material.blendSrc = OneFactor;
                            material.blendDst = OneMinusSrcColorFactor;
                            material.depthWrite = false;
                        }
                    }
                }
        
				if ( data.drawMode !== undefined ) object.setDrawMode( data.drawMode );

				break;

			default:

                console.log(data);

                throw "Unknown object type! " + data.type

		}

		object.uuid = data.uuid;

		if ( data.name !== undefined ) object.name = data.name;

		if ( data.matrix !== undefined ) {

			object.matrix.fromArray( data.matrix );

			if ( data.matrixAutoUpdate !== undefined ) object.matrixAutoUpdate = data.matrixAutoUpdate;
			if ( object.matrixAutoUpdate ) object.matrix.decompose( object.position, object.quaternion, object.scale );

		} else {

			if ( data.position !== undefined ) object.position.fromArray( data.position );
			if ( data.rotation !== undefined ) object.rotation.fromArray( data.rotation );
			if ( data.quaternion !== undefined ) object.quaternion.fromArray( data.quaternion );
			if ( data.scale !== undefined ) object.scale.fromArray( data.scale );

		}

		if ( data.castShadow !== undefined ) object.castShadow = data.castShadow;
		if ( data.receiveShadow !== undefined ) object.receiveShadow = data.receiveShadow;

		if ( data.shadow ) {

			if ( data.shadow.bias !== undefined ) object.shadow.bias = data.shadow.bias;
			if ( data.shadow.radius !== undefined ) object.shadow.radius = data.shadow.radius;
			if ( data.shadow.mapSize !== undefined ) object.shadow.mapSize.fromArray( data.shadow.mapSize );
			if ( data.shadow.camera !== undefined ) object.shadow.camera = this.parseObject( data.shadow.camera, geometries, materials, textures );

		}

		if ( data.visible !== undefined ) object.visible = data.visible;
		if ( data.frustumCulled !== undefined ) object.frustumCulled = data.frustumCulled;
		if ( data.renderOrder !== undefined ) object.renderOrder = data.renderOrder;
		if ( data.userData !== undefined ) object.userData = data.userData;
		if ( data.layers !== undefined ) object.layers.mask = data.layers;

		if ( data.children !== undefined ) {

			var children = data.children;

			for ( var i = 0; i < children.length; i ++ ) {

				tobject.add( this.parseObject( children[ i ], geometries, materials, textures ) );

			}

		}

		if ( data.type === 'LOD' ) {

			var levels = data.levels;

			for ( var l = 0; l < levels.length; l ++ ) {

				var level = levels[ l ];
				var child = object.getObjectByProperty( 'uuid', level.object );

				if ( child !== undefined ) {

					object.addLevel( child, level.distance );

				}

			}

		}

		return tobject;

	}

}

var TEXTURE_MAPPING = {
	UVMapping: UVMapping,
	CubeReflectionMapping: CubeReflectionMapping,
	CubeRefractionMapping: CubeRefractionMapping,
	EquirectangularReflectionMapping: EquirectangularReflectionMapping,
	EquirectangularRefractionMapping: EquirectangularRefractionMapping,
	SphericalReflectionMapping: SphericalReflectionMapping,
	CubeUVReflectionMapping: CubeUVReflectionMapping,
	CubeUVRefractionMapping: CubeUVRefractionMapping
};

var TEXTURE_WRAPPING = {
	RepeatWrapping: RepeatWrapping,
	ClampToEdgeWrapping: ClampToEdgeWrapping,
	MirroredRepeatWrapping: MirroredRepeatWrapping
};

var TEXTURE_FILTER = {
	NearestFilter: NearestFilter,
	NearestMipmapNearestFilter: NearestMipmapNearestFilter,
	NearestMipmapLinearFilter: NearestMipmapLinearFilter,
	LinearFilter: LinearFilter,
	LinearMipmapNearestFilter: LinearMipmapNearestFilter,
	LinearMipmapLinearFilter: LinearMipmapLinearFilter
};
