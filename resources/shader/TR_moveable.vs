#version 300 es
precision highp float;

#define TR_VERSION			    ##tr_version##

#define NUM_MAX_GLOBALLIGHTS 	6
#define APPLY_GLOBAL_LIGHTS     ##global_lights_in_vertex##
#define BLINK_GLOBAL_LIGHTS     1

#define NUM_MAX_POINTLIGHTS 	20

#if TR_VERSION == 4
    #define NUM_MAX_DIRLIGHTS 		5
    #define NUM_MAX_SPOTLIGHTS 	    10
#else
    #define NUM_MAX_DIRLIGHTS 		0
    #define numDirectionalLight     0
    #define NUM_MAX_SPOTLIGHTS 	    0
    #define numSpotLight            0
#endif

#define saturate(a) clamp( a, 0.0, 1.0 )

const vec3 vec3Unit = vec3(1.0, 1.0, 1.0);

uniform mat4 modelMatrix;
uniform mat4 modelViewMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;

uniform vec3 	tintColor;
uniform vec3 	flickerColor;
uniform float 	curTime;
uniform vec4 	offsetRepeat;
uniform float 	rnd;
uniform float 	lighting; /* not used */
uniform vec3    camPosition;
uniform vec3 	ambientColor;
uniform mat4    boneMatrices[64];

in vec3 position;
in vec2 uv;
in vec3 normal;
in vec4 skinIndex;
in vec4 skinWeight;
in vec4 _flags;

out vec2 vUv;
out vec3 vColor;
out vec4 vwPos;
out vec3 vwCamPos;
out vec3 vNormal;

mat4 getBoneMatrix( const in float i ) {
    mat4 bone = boneMatrices[ int(i) ];
    return bone;
}

struct IncidentLight {
	vec3 color;
	vec3 direction;
};

struct GeometricContext {
	vec3 position;
	vec3 normal;
	/*vec3 viewDir;*/
};

vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}

float punctualLightIntensityToIrradianceFactor( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	if ( cutoffDistance > 0.0 && decayExponent > 0.0 ) {
		return pow( saturate( -lightDistance / cutoffDistance + 1.0 ), decayExponent );
	} else {
	    return 1.0;
    }
}

#if APPLY_GLOBAL_LIGHTS == 1
    uniform highp int numGlobalLight;
    uniform vec3 globalLight_position[NUM_MAX_GLOBALLIGHTS];
    uniform vec3 globalLight_color[NUM_MAX_GLOBALLIGHTS];
    uniform float globalLight_distance[NUM_MAX_GLOBALLIGHTS];

    void getGlobalDirectLightIrradiance(in int globalLight, const in GeometricContext geometry, out IncidentLight directLight) {
        vec3 lVector = (viewMatrix*vec4(globalLight_position[globalLight], 1.0)).xyz - geometry.position;
        directLight.direction = normalize(lVector);
        float lightDistance = length(lVector);
        directLight.color = globalLight_color[globalLight];
        directLight.color *= punctualLightIntensityToIrradianceFactor(lightDistance, globalLight_distance[globalLight], 1.0);
    }
#endif

#if NUM_MAX_DIRLIGHTS > 0
    uniform int numDirectionalLight;
    uniform vec3 directionalLight_direction[NUM_MAX_DIRLIGHTS];
    uniform vec3 directionalLight_color[NUM_MAX_DIRLIGHTS];
    void getDirectionalDirectLightIrradiance( in int directionalLight, const in GeometricContext geometry, out IncidentLight directLight ) {
        directLight.color = directionalLight_color[directionalLight];
        directLight.direction = transformDirection(directionalLight_direction[directionalLight], viewMatrix);
    }
#endif 

#if NUM_MAX_POINTLIGHTS > 0
    uniform int numPointLight;
    uniform vec3 pointLight_position[NUM_MAX_POINTLIGHTS];
    uniform vec3 pointLight_color[NUM_MAX_POINTLIGHTS];
    uniform float pointLight_distance[NUM_MAX_POINTLIGHTS];
    void getPointDirectLightIrradiance( in int pointLight, const in GeometricContext geometry, out IncidentLight directLight ) {
        vec3 lVector = (viewMatrix*vec4(pointLight_position[pointLight], 1.0)).xyz - geometry.position;
        directLight.direction = normalize( lVector );
        float lightDistance = length( lVector );
        directLight.color = pointLight_color[pointLight];
        #if TR_VERSION < 4
            directLight.color *= min(pointLight_distance[pointLight] / lightDistance, 1.0);
        #else
            directLight.color *= punctualLightIntensityToIrradianceFactor( lightDistance, pointLight_distance[pointLight], 1.0 );
        #endif
    }
#endif

#if NUM_MAX_SPOTLIGHTS > 0
    uniform int numSpotLight;
    uniform vec3 spotLight_position[NUM_MAX_SPOTLIGHTS];
    uniform vec3 spotLight_color[NUM_MAX_SPOTLIGHTS];
    uniform float spotLight_distance[NUM_MAX_SPOTLIGHTS];
    uniform vec3 spotLight_direction[NUM_MAX_SPOTLIGHTS];
    uniform float spotLight_coneCos[NUM_MAX_SPOTLIGHTS];
    uniform float spotLight_penumbraCos[NUM_MAX_SPOTLIGHTS];
    void getSpotDirectLightIrradiance( in int spotLight, const in GeometricContext geometry, out IncidentLight directLight  ) {
        vec3 lVector = (viewMatrix*vec4(spotLight_position[spotLight], 1.0)).xyz - geometry.position;
        directLight.direction = normalize( lVector );
        float lightDistance = length( lVector );
        float angleCos = dot( directLight.direction, transformDirection(spotLight_direction[spotLight], viewMatrix) );
        if ( angleCos > spotLight_coneCos[spotLight] ) {
            float spotEffect = smoothstep( spotLight_coneCos[spotLight], spotLight_penumbraCos[spotLight], angleCos );
            directLight.color = spotLight_color[spotLight];
            directLight.color *= spotEffect * punctualLightIntensityToIrradianceFactor( lightDistance, spotLight_distance[spotLight], 1.0/*spotLight.decay*/ );
            //directLight.color *= spotEffect * min(spotLight_distance[spotLight] / lightDistance, 1.0);
        } else {
            directLight.color = vec3( 0.0 );
        }
    }
#endif

void main() {
    vwCamPos = camPosition;
    
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );

	vec4 skinVertex = vec4( position, 1.0 );
	vec4 skinned  = boneMatX * skinVertex * skinWeight.x
		          + boneMatY * skinVertex * skinWeight.y;

	vUv = uv * offsetRepeat.zw + offsetRepeat.xy;

	vColor = tintColor * mix(vec3Unit, flickerColor, step(0.5, rnd));

	float sum = (position[0] + position[1] + position[2]);
	float time = curTime * 1.57;

	// perturb the vertex color (for underwater effect, for eg)
	float perturb = 0.5 * abs( sin(sum * 8.0 + time) ) + 0.5;
	vColor *= mix(1.0, perturb, _flags.x);

	// perturb the vertex position
	vec4 pos = skinned;

	pos.x += mix(0.0, 8.0 * sin(sum * 10.0 + time), _flags.z);
	pos.y -= mix(0.0, 8.0 * sin(sum * 10.0 + time), _flags.z);
	pos.z -= mix(0.0, 8.0 * sin(sum * 10.0 + time), _flags.z);

    vwPos = modelMatrix * pos;

	vec4 mvPosition;
	mvPosition = modelViewMatrix * pos;

	mat4 skinMatrix  = skinWeight.x * boneMatX;
		 skinMatrix	+= skinWeight.y * boneMatY;

	vec4 skinnedNormal = skinMatrix * vec4( normal, 0.0 );

    vNormal = (modelMatrix * skinnedNormal).xyz;

	vec3 objectNormal = skinnedNormal.xyz;

	vec3 transformedNormal = mat3(modelViewMatrix) * objectNormal; // transposeMat3(inverseMat3(mat3(modelViewMatrix)))

	transformedNormal = normalize( transformedNormal );

	vec3 vLightFront = vec3( 0.0 );

	GeometricContext geometry;

	geometry.position = mvPosition.xyz;
	geometry.normal = transformedNormal;

	IncidentLight directLight;
	float dotNL;

#if NUM_MAX_DIRLIGHTS > 0
    for ( int i = 0; i < NUM_MAX_DIRLIGHTS; i ++ ) {
        if (i >= numDirectionalLight) break;
        getDirectionalDirectLightIrradiance( i, geometry, directLight );
        dotNL = dot( geometry.normal, directLight.direction );
        vLightFront += saturate( dotNL ) * directLight.color;
    }
#endif

#if NUM_MAX_POINTLIGHTS > 0
    for ( int i = 0; i < NUM_MAX_POINTLIGHTS; i ++ ) {
        if (i >= numPointLight) break;
        getPointDirectLightIrradiance( i, geometry, directLight );
        dotNL = dot( geometry.normal, directLight.direction );
        #if TR_VERSION < 4
            dotNL = (dotNL + 1.0) / 2.0;
        #endif
        vLightFront += saturate( dotNL ) * directLight.color;
    }
#endif

#if NUM_MAX_SPOTLIGHTS > 0
    for ( int i = 0; i < NUM_MAX_SPOTLIGHTS; i ++ ) {
        if (i >= numSpotLight) break;
        getSpotDirectLightIrradiance( i, geometry, directLight );
        dotNL = dot( geometry.normal, directLight.direction );
        vLightFront += saturate( dotNL ) * directLight.color;
    }
#endif

    vec3 vGlobalLightFront = vec3(0.0);

#if APPLY_GLOBAL_LIGHTS == 1
    for ( int i = 0; i < NUM_MAX_GLOBALLIGHTS; i ++ ) {
        if (i >= numGlobalLight) break;
        getGlobalDirectLightIrradiance(i, geometry, directLight);
        dotNL = dot(geometry.normal, directLight.direction);
        vGlobalLightFront += saturate(dotNL) * directLight.color;
    }

    #if BLINK_GLOBAL_LIGHTS == 1
        vGlobalLightFront *= mix(vec3Unit, vec3(0.1, 0.1, 0.1), rnd);
    #endif

    vLightFront += vGlobalLightFront;
#endif

    if (numPointLight < 0) {
        float fcolor = max(0.0, 1.0 - 2.0 * max(0.0, ambientColor.r - _flags.w));
        vColor *= vec3(fcolor);
        vColor += vGlobalLightFront;
    } else {
        vLightFront += ambientColor;
        vColor *= vLightFront;
    }

	gl_Position = projectionMatrix * mvPosition;
}
