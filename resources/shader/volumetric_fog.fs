uniform int useFog;
uniform sampler2D map;
uniform sampler2D mapBump;
uniform vec4 offsetBump;

uniform vec3 volFogCenter;
uniform float volFogRadius;
uniform vec3 volFogColor;

varying vec3 vColor;
varying vec2 vUv;
varying vec4 vwPos;
varying vec3 vwCamPos;

const vec3  fogColor = vec3(0.0, 0.0, 0.0);
const float fogNear = 14000.0;
const float fogFar = 21000.0;

//const vec3 volFogCenter = vec3(36220.0, 5170.0, -45540.0);
//const float volFogRadius = 4000.0;

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

    float volFogRadius2 = volFogRadius * volFogRadius;
    float distCamToPos = distance(vwPos.xyz, vwCamPos);
    vec3 dir = normalize(vwPos.xyz - vwCamPos);
    vec3 L = volFogCenter - vwCamPos;
    float tca = dot(L, dir);
    float d2 = dot(L, L) - tca * tca;
    if (d2 < volFogRadius2) {
        float thc = sqrt(volFogRadius2 - d2);
        float t0 = tca - thc;
        float t1 = tca + thc;
        float dist = 0.0;
        if (t0 < 0.0 && t1 > 0.0) {
            dist = min(distCamToPos, t1);
        } else if (t0 > 0.0 && t1 > 0.0 && t0 < distCamToPos) {
            dist = min(t1, distCamToPos) - t0;
        }
        float distToCenter = length(cross(volFogCenter - vwCamPos, dir));
        float fr = distToCenter < volFogRadius ? smoothstep(0.0, 1.0, cos(distToCenter/volFogRadius*3.141592/2.0)) : 0.0;
        //float fr = distToCenter < volFogRadius ? smoothstep(0.0, 1.0, 1.0-distToCenter/volFogRadius) : 0.0;
        gl_FragColor = mix(gl_FragColor, vec4(volFogColor, gl_FragColor.a), clamp(dist/(volFogRadius*2.0)*fr, 0.0, 1.0));
    }

    if (useFog == 1) {
        float depth = gl_FragCoord.z / gl_FragCoord.w;
        float fogFactor = smoothstep( fogNear, fogFar, depth );
        gl_FragColor = mix( gl_FragColor, vec4( fogColor, gl_FragColor.w ), fogFactor );
    }
}
