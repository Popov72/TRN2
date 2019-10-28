#version 300 es
precision highp float;

uniform sampler2D map;

in vec3 vColor;
in vec2 vUv;

out vec4 glFragColor;

void main() {
	vec4 texelColor = texture(map, vUv);

	glFragColor = texelColor;

	if (glFragColor.a < 0.5) discard;

	glFragColor = glFragColor * vec4(vColor, 1.0);
}
