#version 300 es
precision highp float;

uniform int useFog;
uniform sampler2D map;
uniform sampler2D mapBump;
uniform vec4 offsetBump;

#define saturate(a) clamp( a, 0.0, 1.0 )

const vec3  fogColor = vec3(0.0, 0.0, 0.0);
const float fogNear = 14000.0;
const float fogFar = 21000.0;
const vec3  vec3Unit = vec3(1.0, 1.0, 1.0);

uniform int         useFog;
uniform sampler2D   map;
uniform sampler2D   mapBump;
uniform vec4        offsetBump;
uniform float 	    rnd;

in vec3 vColor;
in vec2 vUv;
in vec4 vwPos;
in vec3 vwCamPos;
in vec3 vNormal;


out vec4 glFragColor;

void main() {
	vec4 texelColor = texture( map, vUv );
    if (offsetBump.w == 1.0) {
        vec4 bumpColor = texture( mapBump, vUv + offsetBump.xy);
        float a = texelColor.a;
        texelColor = texelColor * (bumpColor + 0.25) * 1.25;
    	texelColor.a = a;
    }
	glFragColor = texelColor;

	if ( glFragColor.a < 0.5 ) discard;

	if ( gl_FragColor.a < 0.5 ) discard;
	gl_FragColor = gl_FragColor * vec4( vColor, 1.0 );

    if (useFog == 1) {
        float depth = gl_FragCoord.z / gl_FragCoord.w;
        float fogFactor = smoothstep( fogNear, fogFar, depth );
        glFragColor = mix( glFragColor, vec4( fogColor, glFragColor.w ), fogFactor );
    }
}
