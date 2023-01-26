precision lowp float;

uniform vec3 uID; 

layout (location = 0) out vec4 v_depth;
layout (location = 1) out vec4 v_entity;
layout (location = 2) out vec4 v_velocity;

void main(){
    v_velocity = vec4(0.);
    v_entity = vec4(uID.rg, 0., 1.);
    v_depth = vec4(0.);
}