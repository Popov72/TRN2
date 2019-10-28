#version 300 es
precision highp float;

const vec3 vec3Unit = vec3(1.0, 1.0, 1.0);

uniform mat4 modelMatrix;
uniform mat4 modelViewMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;
uniform vec3 tintColor;
uniform vec3 flickerColor;
uniform vec4 offsetRepeat;
uniform float curTime;
uniform float rnd;
uniform vec3 lighting;
uniform vec3 camPosition;

in vec3 position;
in vec2 uv;
in vec3 normal;

out vec2 vUv;
out vec3 vColor;
out vec4 vwPos;
out vec3 vwCamPos;
out vec3 vNormal;

void main() {
    vwCamPos = camPosition;

	vec3 pos = position;

	vUv = uv * offsetRepeat.zw + offsetRepeat.xy;

	vColor = lighting * tintColor * mix(vec3Unit, flickerColor, step(0.5, rnd));

    vwPos = modelMatrix * vec4(pos, 1.0);

    vNormal = vec3(0.0, 0.0, 1.0);

	vec4 mvPosition;

	mvPosition = modelViewMatrix * vec4(pos, 1.0);

	gl_Position = projectionMatrix * mvPosition;
}
