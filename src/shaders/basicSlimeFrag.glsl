#ifdef GL_ES
#define LOWP lowp
precision mediump float;
#else
#define LOWP
#endif

uniform sampler2D uMainSampler;
uniform vec2 uResolution;
uniform float uTime;

varying vec2 outTexCoord;
varying vec4 outTint;

const float offset = 1.0 / 64.0;

const float LIGHT_BAND_1 = 0.0015;
const float LIGHT_BAND_2 = 0.003;
const float LIGHT_BAND_3 = 0.05;
const float LIGHT_BAND_4 = 0.07;

float blendDarken(float base, float blend) {
	return min(blend,base);
}

vec3 blendDarken(vec3 base, vec3 blend) {
	return vec3(blendDarken(base.r,blend.r),blendDarken(base.g,blend.g),blendDarken(base.b,blend.b));
}

vec3 blendDarken(vec3 base, vec3 blend, float opacity) {
	return (blendDarken(base, blend) * opacity + base * (1.0 - opacity));
}

float blendLighten(float base, float blend) {
	return max(blend,base);
}

vec3 blendLighten(vec3 base, vec3 blend) {
	return vec3(blendLighten(base.r,blend.r),blendLighten(base.g,blend.g),blendLighten(base.b,blend.b));
}

vec3 blendLighten(vec3 base, vec3 blend, float opacity) {
	return (blendLighten(base, blend) * opacity + base * (1.0 - opacity));
}

const float colorBlendRadius = 0.01;
vec4 getAvgColor(vec4 col) {
    vec3 left = mix(texture2D(uMainSampler, vec2(outTexCoord.x - colorBlendRadius, outTexCoord.y)).rgb, col.rgb, 1.0 - floor(col.a + 0.5));
    vec3 right = mix(texture2D(uMainSampler, vec2(outTexCoord.x + colorBlendRadius, outTexCoord.y)).rgb, col.rgb, 1.0 - floor(col.a + 0.5));
    vec3 up = mix(texture2D(uMainSampler, vec2(outTexCoord.x, outTexCoord.y + colorBlendRadius)).rgb, col.rgb, 1.0 - floor(col.a + 0.5));
    vec3 down = mix(texture2D(uMainSampler, vec2(outTexCoord.x, outTexCoord.y - colorBlendRadius)).rgb, col.rgb, 1.0 - floor(col.a + 0.5));
    vec3 avg = (
        left +
        right +
        up +
        down
    ) / 4.0;
    return vec4(avg, col.a);
}

vec4 light(vec4 col) {
    float t = uTime / 15000.0;
    if (col.a > 0.1) {

        float isLitUp1 = texture2D(uMainSampler, vec2(outTexCoord.x, outTexCoord.y - LIGHT_BAND_1)).a;
        float isLitUp2 = texture2D(uMainSampler, vec2(outTexCoord.x, outTexCoord.y - LIGHT_BAND_2)).a;
        float isLitUp3 = texture2D(uMainSampler, vec2(outTexCoord.x, outTexCoord.y - LIGHT_BAND_3)).a;
        float isLitUp4 = texture2D(uMainSampler, vec2(outTexCoord.x, outTexCoord.y - LIGHT_BAND_4)).a;

        float isLitTopRight1 = texture2D(uMainSampler, vec2(outTexCoord.x + LIGHT_BAND_1, outTexCoord.y - LIGHT_BAND_1)).a;
        float isLitTopRight2 = texture2D(uMainSampler, vec2(outTexCoord.x + LIGHT_BAND_2, outTexCoord.y - LIGHT_BAND_2)).a;
        float isLitTopRight3 = texture2D(uMainSampler, vec2(outTexCoord.x + LIGHT_BAND_3, outTexCoord.y - LIGHT_BAND_3)).a;
        float isLitTopRight4 = texture2D(uMainSampler, vec2(outTexCoord.x + LIGHT_BAND_4, outTexCoord.y - LIGHT_BAND_4)).a;

        float isLitRight1 = texture2D(uMainSampler, vec2(outTexCoord.x + LIGHT_BAND_1, outTexCoord.y)).a;
        float isLitRight2 = texture2D(uMainSampler, vec2(outTexCoord.x + LIGHT_BAND_2, outTexCoord.y)).a;
        float isLitRight3 = texture2D(uMainSampler, vec2(outTexCoord.x + LIGHT_BAND_3, outTexCoord.y)).a;
        float isLitRight4 = texture2D(uMainSampler, vec2(outTexCoord.x + LIGHT_BAND_4, outTexCoord.y)).a;

        float isLitLeft1 = texture2D(uMainSampler, vec2(outTexCoord.x - LIGHT_BAND_1, outTexCoord.y)).a;
        float isLitLeft2 = texture2D(uMainSampler, vec2(outTexCoord.x - LIGHT_BAND_2, outTexCoord.y)).a;
        float isLitLeft3 = texture2D(uMainSampler, vec2(outTexCoord.x - LIGHT_BAND_3, outTexCoord.y)).a;
        float isLitLeft4 = texture2D(uMainSampler, vec2(outTexCoord.x - LIGHT_BAND_4, outTexCoord.y)).a;

        float isLitTopLeft1 = texture2D(uMainSampler, vec2(outTexCoord.x - LIGHT_BAND_1, outTexCoord.y - LIGHT_BAND_1)).a;
        float isLitTopLeft2 = texture2D(uMainSampler, vec2(outTexCoord.x - LIGHT_BAND_2, outTexCoord.y - LIGHT_BAND_2)).a;
        float isLitTopLeft3 = texture2D(uMainSampler, vec2(outTexCoord.x - LIGHT_BAND_3, outTexCoord.y - LIGHT_BAND_3)).a;
        float isLitTopLeft4 = texture2D(uMainSampler, vec2(outTexCoord.x - LIGHT_BAND_4, outTexCoord.y - LIGHT_BAND_4)).a;

        float isLitUpwardsSum = (
            // isLitLeft4 +
            // isLitLeft3 +
            isLitLeft2 +
            isLitLeft1 +
            // isLitTopLeft4 +
            // isLitTopLeft3 +
            isLitTopLeft2 +
            isLitTopLeft1 +
            // isLitRight4 +
            // isLitRight3 +
            isLitRight2 +
            isLitRight1 +
            // isLitTopRight4 +
            // isLitTopRight3 +
            isLitTopRight2 +
            isLitTopRight1 +
            // isLitUp4 +
            // isLitUp3 +
            isLitUp2 +
            isLitUp1
        );

        float lightFac = (10.0 - isLitUpwardsSum) / 10.0;

        // float cosT = cos(outTexCoord.y * 5.0);
        // float lightFac1 = step(0.95, cosT);
        // float lightFac2 = step(0.9, cosT);
        // float lightFac3 = step(0.85, cosT);
        // float lightFac4 = step(0.7, cosT);
        // float lightFac5 = step(0.5, cosT);
        // float lightFac6 = step(0.3, cosT);
        // float lightFac = (
        //     lightFac1 +
        //     lightFac2 +
        //     lightFac3 +
        //     lightFac4 +
        //     lightFac5 +
        //     lightFac6
        // ) / 6.0;

        //  return mix(vec4(blendLighten(
        //     col.rgb,
        //     vec3(1.0, 1.0, 1.0),
        //     lightFac
        // ), col.a), col, 0.5);

         return mix(
            col,
            vec4(1.0, 1.0, 1.0, 1.0),
            lightFac
        );
    } else {
        return col;
    }
}

vec4 shade(vec4 col) {
    // First, use edge-finding to add shadows and highglights
    if (col.a > 0.5) {
        return col;
	} else {
        float topA = texture2D(uMainSampler, vec2(outTexCoord.x, outTexCoord.y - (offset/2.0))).a;
        float bottomA = texture2D(uMainSampler, vec2(outTexCoord.x, outTexCoord.y + (offset/3.0))).a;
        float leftA = texture2D(uMainSampler, vec2(outTexCoord.x - offset, outTexCoord.y)).a;
		float rightA = texture2D(uMainSampler, vec2(outTexCoord.x + offset, outTexCoord.y)).a;

        float edgeA = topA + bottomA + leftA + rightA;

		if (col.a < 1.0 && edgeA > 0.0) {
            if (topA > 0.5 && bottomA < 0.25) {
                return vec4(blendDarken(
                    col.rgb,
                    vec3(0.0, 0.0, 0.0),
                    0.5
                ), 0.333);
            } else if (bottomA > 0.75) {
                return vec4(blendLighten(
                    col.rgb,
                    vec3(1.0, 1.0, 1.0),
                    1.0
                ), 1.0);
            } else {
                return col;
            }
        }
		else {
            return col;
        }
	}
}

vec4 globalLight(vec4 col) {
    if (col.a < 0.1) return col;
    float t = uTime / 5000.0;
    // float v = sin((outTexCoord.y + outTexCoord.x + t) * 30.0);
    float v = sin((outTexCoord.y + outTexCoord.x));
    vec3 mixed = blendDarken(col.rgb, vec3(0.0, 0.0, 0.0), v * 0.05);
    return vec4(mixed, col.a);
}


const float outlineOffset = 0.00175;
vec4 outline(vec4 col) {
    if (col.a > 0.5) {
        return col;
	} else {
        float topA = texture2D(uMainSampler, vec2(outTexCoord.x, outTexCoord.y - outlineOffset)).a;
        float bottomA = texture2D(uMainSampler, vec2(outTexCoord.x, outTexCoord.y + outlineOffset)).a;
        float leftA = texture2D(uMainSampler, vec2(outTexCoord.x - outlineOffset, outTexCoord.y)).a;
		float rightA = texture2D(uMainSampler, vec2(outTexCoord.x + outlineOffset, outTexCoord.y)).a;

        float edgeA = topA + bottomA + leftA + rightA;
        if (edgeA > 0.0) {
            return vec4(0.0, 0.0, 0.0, 1.0);
        } else {
            return col;
        }
    }
}

void main()
{
    // vec4 col = getAvgColor(texture2D(uMainSampler, outTexCoord));
    vec4 col = texture2D(uMainSampler, outTexCoord);
    gl_FragColor = outline(globalLight(shade(light(col))));
}