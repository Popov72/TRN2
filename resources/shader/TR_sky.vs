#version 300 es
precision highp float;

uniform mat4 modelMatrix;
uniform mat4 modelViewMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;
uniform mat4 boneMatrices[64];

in vec3 position;
in vec2 uv;
in vec3 normal;
in vec4 skinIndex;
in vec4 skinWeight;

out vec2 vUv;

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
