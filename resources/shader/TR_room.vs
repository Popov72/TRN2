#version 300 es
precision highp float;

#define NUM_MAX_GLOBALLIGHTS 	6
#define APPLY_GLOBAL_LIGHTS     ##global_lights_in_vertex##
#define BLINK_GLOBAL_LIGHTS     1

#define saturate(a) clamp( a, 0.0, 1.0 )

const vec3 vec3Unit = vec3(1.0, 1.0, 1.0);

uniform mat4 modelMatrix;
uniform mat4 modelViewMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;

uniform vec3 tintColor;
uniform vec3 flickerColor;
uniform float curTime;
uniform vec4 offsetRepeat;
uniform float rnd;
uniform vec3 camPosition;

in vec3 position;
in vec2 uv;
in vec3 normal;
in vec3 vertColor;
in vec4 _flags;

out vec2 vUv;
out vec3 vColor;
out vec4 vwPos;
out vec3 vwCamPos;
out vec3 vNormal;

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
    };

    float punctualLightIntensityToIrradianceFactor( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
        if ( cutoffDistance > 0.0 && decayExponent > 0.0 ) {
            return pow( saturate( -lightDistance / cutoffDistance + 1.0 ), decayExponent );
        } else {
            return 1.0;
        }
    }

    void getGlobalDirectLightIrradiance(in int globalLight, const in GeometricContext geometry, out IncidentLight directLight) {
        vec3 lVector = globalLight_position[globalLight] - geometry.position;
        directLight.direction = normalize(lVector);
        float lightDistance = length(lVector);
        directLight.color = globalLight_color[globalLight];
        directLight.color *= punctualLightIntensityToIrradianceFactor(lightDistance, globalLight_distance[globalLight], 1.0);
    }
#endif

void main() {
    vwCamPos = camPosition;

	vec3 pos = position;

	vUv = uv * offsetRepeat.zw + offsetRepeat.xy;

	vColor = vertColor * tintColor * mix(vec3Unit, flickerColor, step(0.5, rnd));

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

    vNormal = normal;

#if APPLY_GLOBAL_LIGHTS == 1
    // apply lights
	vec3 vLightFront = vec3(0.0);

	GeometricContext geometry;

	geometry.position = vwPos.xyz;
	geometry.normal = normal;

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

    vColor += vLightFront;
#endif
}
