#version 450

layout(location = 0) in vec2 v_Uv;

layout(location = 0) out vec4 o_Target;

layout(set = 2, binding = 0) uniform texture2D tex;
layout(set = 2, binding = 1) uniform sampler samp;

void main() {
	vec4 col = texture(sampler2D(tex, samp), v_Uv);

	o_Target.rgb = mix(col.rgb/6., col.rgb, col.a);
	o_Target.a = 1.0;
}
