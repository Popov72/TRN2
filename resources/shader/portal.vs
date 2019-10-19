precision highp float;

uniform mat4 modelMatrix;
uniform mat4 modelViewMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;
attribute vec3 position;
attribute vec2 uv;
attribute vec3 normal;

attribute vec3 vertColor;

varying vec2 vUv;
varying vec3 vColor;

void main() {
	vColor = vertColor;
	vUv = uv;

	vec4 mvPosition;
	vec3 pos = position;

	mvPosition = modelViewMatrix * vec4( pos, 1.0 );
	gl_Position = projectionMatrix * mvPosition;
}
