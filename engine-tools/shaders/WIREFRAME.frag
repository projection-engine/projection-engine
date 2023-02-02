precision lowp float;
uniform bool isSelected;
out vec4 finalColor;

//import(sceneDepthUtils)
void main() {
    float currentDepth = getLogDepth(gl_FragCoord.xy / bufferResolution);

    if (!isSelected) {
        finalColor = vec4(0., 5., .0, 1.);
        if(currentDepth > 0. && currentDepth < gl_FragCoord.z)
        finalColor.rgb = vec3(1., 0., 0.);
    }
    else
    finalColor = vec4(1., 1., .0, 1.);

}