uniform sampler2D map;

varying vec3 vColor;
varying vec2 vUv;

void main() {
	vec4 texelColorOrig = texture2D( map, vUv );
	vec4 texelColor = vec4(1,1,1,texelColorOrig.a);
	gl_FragColor = texelColor;
	if ( gl_FragColor.a < 0.5 ) discard;
	gl_FragColor = gl_FragColor * vec4( vColor, 1.0 );
}
