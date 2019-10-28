#version 300 es
precision highp float;

#define NUM_MAX_GLOBALLIGHTS 	6
#define APPLY_GLOBAL_LIGHTS     ##global_lights_in_fragment##
#define BLINK_GLOBAL_LIGHTS     1

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

#if APPLY_GLOBAL_LIGHTS == 1
    uniform highp int numGlobalLight;
    uniform vec3 globalLight_position[NUM_MAX_GLOBALLIGHTS];
    uniform vec3 globalLight_color[NUM_MAX_GLOBALLIGHTS];
    uniform float globalLight_distance[NUM_MAX_GLOBALLIGHTS];

    struct IncidentLight {
        vec3 color;
        vec3 direction;
    };

    struct GeometricContext {
        vec3 position;
        vec3 normal;
        /*vec3 viewDir;*/
    };

    float punctualLightIntensityToIrradianceFactor( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
        if ( cutoffDistance > 0.0 && decayExponent > 0.0 ) {
            return pow( saturate( -lightDistance / cutoffDistance + 1.0 ), decayExponent );
        } else {
            return 1.0;
        }
    }

    void getGlobalDirectLightIrradiance(const in int globalLight, const in GeometricContext geometry, out IncidentLight directLight) {
        vec3 lVector = globalLight_position[globalLight] - geometry.position;
        directLight.direction = normalize(lVector);
        float lightDistance = length(lVector);
        directLight.color = globalLight_color[globalLight];
        directLight.color *= punctualLightIntensityToIrradianceFactor(lightDistance, globalLight_distance[globalLight], 1.0);
    }
#endif

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

    vec3 color = vColor;

    // apply lights
#if APPLY_GLOBAL_LIGHTS == 1
	vec3 vLightFront = vec3(0.0);

	GeometricContext geometry;

	geometry.position = vwPos.xyz;
	geometry.normal = normalize(vNormal);

	IncidentLight directLight;
	vec3 directLightColor_Diffuse;
	float dotNL;

    for ( int i = 0; i < NUM_MAX_GLOBALLIGHTS; i ++ ) {
        if (i >= numGlobalLight) break;
        getGlobalDirectLightIrradiance(i, geometry, directLight);
        dotNL = dot(geometry.normal, directLight.direction);
        vLightFront += saturate(dotNL) * directLight.color;
    }

    #if BLINK_GLOBAL_LIGHTS == 1
        vLightFront *= mix(vec3Unit, vec3(0.1, 0.1, 0.1), rnd);
    #endif

    color += vLightFront;
#endif

	glFragColor = glFragColor * vec4( color, 1.0 );

    if (useFog == 1) {
        float depth = gl_FragCoord.z / gl_FragCoord.w;
        float fogFactor = smoothstep( fogNear, fogFar, depth );
        glFragColor = mix( glFragColor, vec4( fogColor, glFragColor.w ), fogFactor );
    }
}
