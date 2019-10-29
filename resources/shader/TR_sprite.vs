#version 300 es
precision highp float;

#define NUM_MAX_GLOBALLIGHTS 	6
#define APPLY_GLOBAL_LIGHTS     ##global_lights_in_vertex##
#define BLINK_GLOBAL_LIGHTS     1
#define NUM_MAX_SYSTEMLIGHTS 	3

#define saturate(a) clamp( a, 0.0, 1.0 )

const vec3 vec3Unit = vec3(1.0, 1.0, 1.0);

uniform mat4 modelMatrix;
uniform mat4 modelViewMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;
uniform vec3 tintColor;
uniform vec3 flickerColor;
uniform vec4 offsetRepeat;
uniform float curTime;
uniform float rnd;
uniform vec3 lighting;
uniform vec3 camPosition;

uniform highp int numSystemLight;
uniform vec3 systemLight_position[NUM_MAX_SYSTEMLIGHTS];
uniform vec3 systemLight_color[NUM_MAX_SYSTEMLIGHTS];
uniform float systemLight_distance[NUM_MAX_SYSTEMLIGHTS];

in vec3 position;
in vec2 uv;
in vec3 normal;

out vec2 vUv;
out vec3 vColor;
out vec4 vwPos;
out vec3 vwCamPos;
out vec3 vNormal;

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

void getSystemDirectLightIrradiance(in int systemLight, const in GeometricContext geometry, out IncidentLight directLight) {
    vec3 lVector = systemLight_position[systemLight] - geometry.position;
    directLight.direction = normalize(lVector);
    float lightDistance = length(lVector);
    directLight.color = systemLight_color[systemLight];
    directLight.color *= punctualLightIntensityToIrradianceFactor(lightDistance, systemLight_distance[systemLight], 1.0);
}

#if APPLY_GLOBAL_LIGHTS == 1
    uniform highp int numGlobalLight;
    uniform vec3 globalLight_position[NUM_MAX_GLOBALLIGHTS];
    uniform vec3 globalLight_color[NUM_MAX_GLOBALLIGHTS];
    uniform float globalLight_distance[NUM_MAX_GLOBALLIGHTS];

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

	vColor = lighting * tintColor * mix(vec3Unit, flickerColor, step(0.5, rnd));

    vwPos = modelMatrix * vec4(pos, 1.0);

    vNormal = vec3(0.0, 0.0, 1.0);

	vec4 mvPosition;

	mvPosition = modelViewMatrix * vec4(pos, 1.0);

	gl_Position = projectionMatrix * mvPosition;

    // apply lights
	vec3 vLightFront = vec3(0.0);

	GeometricContext geometry;

	geometry.position = vwPos.xyz;
	geometry.normal = normal;

	IncidentLight directLight;

    for (int i = 0; i < NUM_MAX_SYSTEMLIGHTS; i++) {
        if (i >= numSystemLight) break;
        getSystemDirectLightIrradiance(i, geometry, directLight);
        float dotNL = dot(geometry.normal, directLight.direction);
        vLightFront += saturate(dotNL) * directLight.color;
    }

#if APPLY_GLOBAL_LIGHTS == 1
    vec3 vLightGlobal = vec3(0.0);
    for (int i = 0; i < NUM_MAX_GLOBALLIGHTS; i ++) {
        if (i >= numGlobalLight) break;
        getGlobalDirectLightIrradiance(i, geometry, directLight);
        float dotNL = dot(geometry.normal, directLight.direction);
        vLightGlobal += saturate(dotNL) * directLight.color;
    }

    #if BLINK_GLOBAL_LIGHTS == 1
        vLightGlobal *= mix(vec3Unit, vec3(0.1, 0.1, 0.1), rnd);
    #endif

    vLightFront += vLightGlobal;
#endif

    vColor += vLightFront;
}
