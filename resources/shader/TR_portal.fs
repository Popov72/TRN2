#version 300 es
precision highp float;

in vec2 vUv;
in vec3 vColor;

out vec4 glFragColor;

void main() {
	glFragColor = vec4(vColor, 0.5);
}
