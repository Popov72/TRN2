#version 300 es
precision highp float;

uniform mat4 modelMatrix;
uniform mat4 modelViewMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;
uniform vec3 tintColor;
uniform vec4 offsetRepeat;

in vec3 position;
in vec2 uv;
in vec3 normal;

out vec2 vUv;
out vec3 vColor;

void main() {
	vUv = uv * offsetRepeat.zw + offsetRepeat.xy;

	vColor = tintColor;

	vec4 mvPosition;
	vec3 pos = position;
	
	mvPosition = modelViewMatrix * vec4(pos, 1.0);

	gl_Position = projectionMatrix * mvPosition;
}
