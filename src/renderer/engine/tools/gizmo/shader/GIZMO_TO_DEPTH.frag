precision lowp float;

uniform vec3 uID;

layout (location = 0) out vec4 v_entity;

void main(){
    v_entity = vec4(uID, 1.);
}
