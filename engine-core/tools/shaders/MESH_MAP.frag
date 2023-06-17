precision mediump float;

in vec3 id;
out vec4 fragColor;

void main(){
    fragColor = vec4(id, 1.);
}