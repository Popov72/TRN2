attribute vec4 skinIndex;
attribute vec4 skinWeight;

varying vec2 vUv;

uniform mat4 boneMatrices[ 64 ];
mat4 getBoneMatrix( const in float i ) {
    mat4 bone = boneMatrices[ int(i) ];
    return bone;
}

void main() {
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );

	vec4 skinVertex = vec4( position, 1.0 );
	vec4 skinned  = boneMatX * skinVertex * skinWeight.x
	 	          + boneMatY * skinVertex * skinWeight.y;

	vUv = uv;

	gl_Position = projectionMatrix * modelViewMatrix * skinned;
}
