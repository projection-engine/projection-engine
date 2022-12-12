export const lineVertex = `
layout (location = 0) in vec3 position; 
 
 
//import(cameraUBO)

uniform mat4 transformMatrix; 
uniform vec3 axis; 
uniform float size;
uniform bool atOrigin;

void main() {
 
    mat4 sc = mat4(0.);
    for ( int x = 0; x < 4; x++ )
        for ( int y = 0; y < 4; y++ )
            if ( x == y && x <= 2)
                sc[x][y] = 1.;
            else if ( x == y )
                sc[x][y] = 1.;

    if(axis.x > 0.){
           sc[0][0] = size;
           sc[3][0] = atOrigin ? 0. : -size/2.;
    }
    if(axis.y > 0.){
           sc[1][1] = size;
           sc[3][1] = atOrigin ? 0. : -size/2.;
    }
    if(axis.z > 0.){
           sc[2][2] = size;
           sc[3][2] = atOrigin ? 0. : -size/2.;
    } 
    gl_Position = viewProjection * transformMatrix * sc * vec4(position, 1.0);
}

`
export const lineFragment = `
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
    if(currentDepth > 0. && abs(currentDepth - gl_FragCoord.z) > FRAG_DEPTH_THRESHOLD)
        fragColor.rgb *= .75;
}
`