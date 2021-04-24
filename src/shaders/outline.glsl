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

const float offset = 1.0 / 32.0;

void main()
{
	vec4 col = texture2D(uMainSampler, outTexCoord) * outTint;
	if (col.a > 0.5)
		gl_FragColor = col;
	else {
		float a = texture2D(uMainSampler, vec2(outTexCoord.x + offset, outTexCoord.y)).a +
			texture2D(uMainSampler, vec2(outTexCoord.x, outTexCoord.y - offset)).a +
			texture2D(uMainSampler, vec2(outTexCoord.x - offset, outTexCoord.y)).a +
			texture2D(uMainSampler, vec2(outTexCoord.x, outTexCoord.y + offset)).a;
		if (col.a < 1.0 && a > 0.0)
			gl_FragColor = vec4(0.0, 0.0, 0.0, 0.8);
		else
			gl_FragColor = col;
	}
}