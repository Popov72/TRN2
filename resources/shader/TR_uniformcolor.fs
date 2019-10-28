#version 300 es
precision highp float;

uniform sampler2D map;

in vec3 vColor;
in vec2 vUv;

out vec4 glFragColor;

void main() {
	vec4 texelColorOrig = texture(map, vUv);
	vec4 texelColor = vec4(1, 1, 1, texelColorOrig.a);

	glFragColor = texelColor;

	if (glFragColor.a < 0.5) discard;

	glFragColor = glFragColor * vec4(vColor, 1.0);
}
