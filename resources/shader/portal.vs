varying vec2 vUv;
varying vec3 vColor;

void main() {
	vColor = color;
	vUv = uv;

	vec4 mvPosition;
	vec3 pos = position;

	mvPosition = modelViewMatrix * vec4( pos, 1.0 );
	gl_Position = projectionMatrix * mvPosition;
}
