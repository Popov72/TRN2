uniform vec3 tintColor;
uniform vec3 flickerColor;
uniform float curTime;
uniform vec4 offsetRepeat;
uniform float rnd;

attribute vec4 _flags;

varying vec2 vUv;
varying vec3 vColor;
varying vec4 vwPos;
varying vec3 vwCamPos;

const vec3 vec3Unit = vec3(1.0, 1.0, 1.0);

void main() {
    vwCamPos = cameraPosition;

	vec3 pos = position;

	vUv = uv * offsetRepeat.zw + offsetRepeat.xy;

	vColor = color * tintColor * mix(vec3Unit, flickerColor, step(0.5, rnd));

    float sum = (position[0] + position[1] + position[2]);
    float time = curTime * 1.57;

    // perturb the vertex color (for underwater effect, for eg)
    float perturb = 0.5 * abs( sin(sum * 8.0 + time) ) + 0.5;
    vColor *= mix(1.0, perturb, _flags.x);

    // perturb the vertex position
    pos.x += mix(0.0, 8.0 * sin(sum * 10.0 + time), _flags.z);
    pos.y -= mix(0.0, 8.0 * sin(sum * 10.0 + time), _flags.z);
    pos.z -= mix(0.0, 8.0 * sin(sum * 10.0 + time), _flags.z);

    vwPos = modelMatrix * vec4(pos, 1.0);

	vec4 mvPosition;
	mvPosition = modelViewMatrix * vec4( pos, 1.0 );
	gl_Position = projectionMatrix * mvPosition;
}
