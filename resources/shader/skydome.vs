uniform vec3 tintColor;
uniform vec4 offsetRepeat;

varying vec2 vUv;
varying vec3 vColor;

void main() {
	vUv = uv * offsetRepeat.zw + offsetRepeat.xy;

	vColor = tintColor;

	vec4 mvPosition;
	vec3 pos = position;
	
	mvPosition = modelViewMatrix * vec4( pos, 1.0 );

	gl_Position = projectionMatrix * mvPosition;
}
