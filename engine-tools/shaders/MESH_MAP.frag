precision mediump float;

in mat3 entityMetadata;
out vec4 fragColor;

void main(){
    fragColor = vec4(entityMetadata[2], 1.);
}