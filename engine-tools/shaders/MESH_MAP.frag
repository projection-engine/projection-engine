precision mediump float;
uniform vec3 meshID;
out vec4 fragColor;

void main(){
    fragColor = vec4(meshID, 1.);
}