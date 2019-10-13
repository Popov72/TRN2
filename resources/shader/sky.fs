uniform sampler2D map;

varying vec2 vUv;

void main() {
	vec4 texelColor = texture2D( map, vUv );
	gl_FragColor = texelColor;
	if ( gl_FragColor.a < 0.5 ) discard;
}
