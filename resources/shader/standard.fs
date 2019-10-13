uniform int useFog;
uniform sampler2D map;
uniform sampler2D mapBump;
uniform vec4 offsetBump;

varying vec3 vColor;
varying vec2 vUv;
varying vec4 vwPos;
varying vec3 vwCamPos;

const vec3  fogColor = vec3(0.0, 0.0, 0.0);
const float fogNear = 14000.0;
const float fogFar = 21000.0;

void main() {
	vec4 texelColor = texture2D( map, vUv );
    if (offsetBump.w == 1.0) {
        vec4 bumpColor = texture2D( mapBump, vUv + offsetBump.xy);
        float a = texelColor.a;
        texelColor = texelColor * (bumpColor + 0.25) * 1.25;
    	texelColor.a = a;
    }
	gl_FragColor = texelColor;

	if ( gl_FragColor.a < 0.5 ) discard;
	gl_FragColor = gl_FragColor * vec4( vColor, 1.0 );

    if (useFog == 1) {
        float depth = gl_FragCoord.z / gl_FragCoord.w;
        float fogFactor = smoothstep( fogNear, fogFar, depth );
        gl_FragColor = mix( gl_FragColor, vec4( fogColor, gl_FragColor.w ), fogFactor );
    }
}
