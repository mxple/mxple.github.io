#version 450

layout(location = 0) in vec3 Vertex_Position;
layout(location = 2) in vec2 Vertex_Uv;

layout(location = 0) out vec2 v_Uv;

layout(set = 0, binding = 0) uniform Camera {
    mat4 ViewProj;
};

void main() {
    v_Uv = Vertex_Uv;
    vec3 position = Vertex_Position;
    gl_Position = ViewProj *vec4(position, 1.0);
}

