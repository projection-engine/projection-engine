precision lowp float;

uniform vec3 uID; 

layout (location = 0) out vec4 v_depth_velocity;
layout (location = 1) out vec4 v_entity;

void main(){
    v_entity = vec4(uID.rg, 0., 1.);
    v_depth_velocity = vec4(0.);
}