precision lowp float;

uniform vec3 uID; 

layout (location = 0) out vec4 v_depth;
layout (location = 1) out vec4 v_entityid;
layout (location = 2) out vec4 v_velocity;

void main(){
    v_entityid = vec4(uID,1.);
    v_depth = vec4(0.);
    v_velocity = vec4(0.);
}