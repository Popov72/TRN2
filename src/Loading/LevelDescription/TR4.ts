import { LevelLoader } from "../LevelLoader";

const descr = {
	part1 : [
		'version', 'uint32',
		'numRoomTextiles', 'uint16',
		'numObjTextiles', 'uint16',
		'numBumpTextiles', 'uint16',
		'textile32_uncompSize', 'uint32',
		'textile32_compSize', 'uint32',
		'', function(dataStream: any, struct: any) { LevelLoader.unzip(dataStream, struct, struct.textile32_compSize); return ''; },
		'textile32', ['', ['', 'uint32', 256*256], function(struct: any, dataStream: any, type: any) 
			{ return struct.numRoomTextiles + struct.numObjTextiles + struct.numBumpTextiles }],
		'textile16_uncompSize', 'uint32',
		'textile16_compSize', 'uint32',
		'', function(dataStream: any, struct: any) { dataStream.position += struct.textile16_compSize; return ''; },
		'textile32misc_uncompSize', 'uint32',
		'textile32misc_compSize', 'uint32',
		'', function(dataStream: any, struct: any) { LevelLoader.unzip(dataStream, struct, struct.textile32misc_compSize); return ''; },
		'textile32misc', ['', ['', 'uint32', 256*256], 2],
		'levelData_uncompSize', 'uint32',
		'levelData_compSize', 'uint32',
		'', function(dataStream: any, struct: any) { LevelLoader.unzip(dataStream, struct, struct.levelData_compSize); return ''; },
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
			], function(struct: any, dataStream: any, type: any){ return struct.numZsectors*struct.numXsectors; }],
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

	part2 : [
		'center', ['x', 'int16', 'y', 'int16', 'z', 'int16'],
		'collisionSize', 'int32',
		'numVertices', 'int16',
		'vertices', ['', ['x', 'int16', 'y', 'int16', 'z', 'int16'], 'numVertices'],
		'numNormals', 'int16',
		'normals', ['', ['x', 'int16', 'y', 'int16', 'z', 'int16'], function(struct: any, dataStream: any, type: any) { return struct.numNormals < 0 ? 0 : struct.numNormals; }],
		'lights', ['', 'int16', function(struct: any, dataStream: any, type: any) { return struct.numNormals <= 0 ? -struct.numNormals : 0; }],
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

	part3 : [
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

export default descr;