precision lowp float;
uniform bool isSelected;
uniform sampler2D depth;
uniform vec2 bufferResolution;
out vec4 finalColor;
void main() {
    float currentDepth = texture(depth, gl_FragCoord.xy / bufferResolution).r;

    if (!isSelected) {
        finalColor = vec4(0., 5., .0, .75);
        if(currentDepth > 0. && currentDepth < gl_FragCoord.z)
        finalColor.rgb = vec3(1., 0., 0.);
    }
    else
    finalColor = vec4(1., 1., .0, .75);

}