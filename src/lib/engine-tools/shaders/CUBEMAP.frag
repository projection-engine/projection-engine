precision lowp float;

in vec3 texCoords;
uniform samplerCube image;
out vec4 fragColor;

void main(){
    fragColor = vec4(texture(image, texCoords).rgb, 1.);
}