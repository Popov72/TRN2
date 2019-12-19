#version 300 es
precision highp float;

const vec3  fogColor = vec3(0.0, 0.0, 0.0);
const float fogNear = 14000.0;
const float fogFar = 21000.0;

uniform int useFog;
uniform sampler2D map;
uniform sampler2D mapBump;
uniform vec4 offsetBump;

uniform vec3 volFogCenter;
uniform float volFogRadius;
uniform vec3 volFogColor;

in vec3 vColor;
in vec2 vUv;
in vec4 vwPos;
in vec3 vwCamPos;

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
	glFragColor = glFragColor * vec4( vColor, 1.0 );

    float volFogRadius2 = volFogRadius * volFogRadius;
    float distCamToPos = distance(vwPos.xyz, vwCamPos);
    vec3 dir = normalize(vwPos.xyz - vwCamPos);
    vec3 L = volFogCenter - vwCamPos;
    float tca = dot(L, dir);
    float d2 = dot(L, L) - tca * tca;

    float thc = sqrt(max(volFogRadius2 - d2, 0.0));
    float t0 = tca - thc;
    float t1 = tca + thc;
    float dist =  mix(0.0, min(distCamToPos, t1), max(sign(-t0), 0.0)*max(sign(t1), 0.0))
                + mix(0.0, min(distCamToPos, t1) - t0, max(sign(t0), 0.0)*max(sign(t1), 0.0)*max(sign(distCamToPos - t0), 0.0));
    float distToCenter = length(cross(volFogCenter - vwCamPos, dir));
    float fr = smoothstep(0.0, 1.0, cos(distToCenter/volFogRadius*3.141592/2.0));
    float e = dist/(volFogRadius*2.0);
    e = 1.0 - exp(-e * 4.0);
    vec4 glFragColorWithFog = mix(glFragColor, vec4(volFogColor, glFragColor.a), e*fr, 0.0, 1.0));

    glFragColor = mix(glFragColor, glFragColorWithFog, max(sign(volFogRadius2 - d2), 0.0));

    if (useFog == 1) {
        float depth = gl_FragCoord.z / gl_FragCoord.w;
        float fogFactor = smoothstep( fogNear, fogFar, depth );
        glFragColor = mix( glFragColor, vec4( fogColor, glFragColor.w ), fogFactor );
    }
}
