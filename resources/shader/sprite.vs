uniform vec3 tintColor;
uniform vec3 flickerColor;
uniform vec4 offsetRepeat;
uniform float curTime;
uniform float rnd;
uniform vec3 lighting;

varying vec2 vUv;
varying vec3 vColor;
varying vec4 vwPos;
varying vec3 vwCamPos;

const vec3 vec3Unit = vec3(1.0, 1.0, 1.0);

void main() {
    vwCamPos = cameraPosition;

	vec3 pos = position;

	vUv = uv * offsetRepeat.zw + offsetRepeat.xy;

	vColor = lighting * tintColor * mix(vec3Unit, flickerColor, step(0.5, rnd));

    vwPos = modelMatrix * vec4(pos, 1.0);

	vec4 mvPosition;
	mvPosition = modelViewMatrix * vec4( pos, 1.0 );
	gl_Position = projectionMatrix * mvPosition;
}
