#version 300 es
precision highp float;

uniform mat4 modelMatrix;
uniform mat4 modelViewMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;

in vec3 position;
in vec2 uv;
in vec3 normal;
in vec3 vertColor;

out vec2 vUv;
out vec3 vColor;

void main() {
	vColor = vertColor;
	vUv = uv;

	vec4 mvPosition;
	vec3 pos = position;

	mvPosition = modelViewMatrix * vec4( pos, 1.0 );
	gl_Position = projectionMatrix * mvPosition;
}
