#version 300 es
precision highp float;

const vec3 vec3Unit = vec3(1.0, 1.0, 1.0);

uniform mat4 modelMatrix;
uniform mat4 modelViewMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;

uniform vec3 	tintColor;
uniform vec3 	flickerColor;
uniform float 	curTime;
uniform vec4 	offsetRepeat;
uniform float 	rnd;
uniform float 	lighting; /* not used */
uniform vec3    camPosition;
uniform vec3 	ambientColor;
uniform mat4    boneMatrices[64];

in vec3 position;
in vec2 uv;
in vec3 normal;
in vec4 skinIndex;
in vec4 skinWeight;
in vec4 _flags;

out vec2 vUv;
out vec3 vColor;
out vec4 vwPos;
out vec3 vwCamPos;
out vec3 vNormal;

mat4 getBoneMatrix( const in float i ) {
    mat4 bone = boneMatrices[ int(i) ];
    return bone;
}

void main() {
    vwCamPos = camPosition;
    
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );

	vec4 skinVertex = vec4( position, 1.0 );
	vec4 skinned  = boneMatX * skinVertex * skinWeight.x
		          + boneMatY * skinVertex * skinWeight.y;

	vUv = uv * offsetRepeat.zw + offsetRepeat.xy;

	vColor = vec3(1.0, 1.0, 1.0);

	vec4 pos = skinned;

    vwPos = modelMatrix * pos;

	vec4 mvPosition;
	mvPosition = modelViewMatrix * pos;

	mat4 skinMatrix  = skinWeight.x * boneMatX;
		 skinMatrix	+= skinWeight.y * boneMatY;

	vec4 skinnedNormal = skinMatrix * vec4( normal, 0.0 );

    vNormal = (modelMatrix * skinnedNormal).xyz;

	gl_Position = projectionMatrix * mvPosition;
}
