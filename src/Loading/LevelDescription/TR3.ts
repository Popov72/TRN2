const descr = {
	part1 : [
		'version', 'uint32',
		'palette', ['', ['r', 'uint8', 'g', 'uint8', 'b', 'uint8'], 256],
		'palette16', ['', ['r', 'uint8', 'g', 'uint8', 'b', 'uint8', 'u', 'uint8'], 256],
		'numTextiles', 'uint32',
		'textile8', ['', ['', 'uint8', 256*256], 'numTextiles'],
		'textile16', ['', ['', 'uint16', 256*256], 'numTextiles'],
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
			], function(struct: any, dataStream: any, type: any){ return struct.numZsectors*struct.numXsectors; }],
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

	part2 : [
		'center', ['x', 'int16', 'y', 'int16', 'z', 'int16'],
		'collisionSize', 'int32',
		'numVertices', 'int16',
		'vertices', ['', ['x', 'int16', 'y', 'int16', 'z', 'int16'], 'numVertices'],
		'numNormals', 'int16',
		'normals', ['', ['x', 'int16', 'y', 'int16', 'z', 'int16'], function(struct: any, dataStream: any, type: any){ return struct.numNormals < 0 ? 0 : struct.numNormals; }],
		'lights', ['', 'int16', function(struct: any, dataStream: any, type: any){ return struct.numNormals < 0 ? -struct.numNormals : 0; }],
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
		'lightmap', ['', 'uint8', 32*256],
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

export default descr;
