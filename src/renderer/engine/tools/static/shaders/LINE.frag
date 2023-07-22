precision lowp float;

out vec4 fragColor;
uniform bool darker;

//import(sceneDepthUtils)

void main() {

    if(darker)
        fragColor = vec4(1.);
    else
        fragColor = vec4(1., 1., .0, 1);
        
    vec2 quadUV = gl_FragCoord.xy/bufferResolution;
    float currentDepth = getLogDepth(quadUV);
    if(currentDepth > 0. && currentDepth < gl_FragCoord.z)
        fragColor.rgb = vec3(1., 0., 0.);
}