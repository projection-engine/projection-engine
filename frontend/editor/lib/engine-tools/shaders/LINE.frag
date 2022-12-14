#define FRAG_DEPTH_THRESHOLD .00001

precision lowp float;
out vec4 fragColor;
uniform bool darker;
uniform sampler2D depthSampler;
uniform vec2 bufferResolution;

void main() {

    if(darker)
        fragColor = vec4(1.);
    else
        fragColor = vec4(1., 1., .0, 1);
        
    vec2 quadUV = gl_FragCoord.xy/bufferResolution;
    float currentDepth = texture(depthSampler, quadUV).r;
    if(currentDepth > 0. && currentDepth < gl_FragCoord.z)
        fragColor.rgb *= .5;
}