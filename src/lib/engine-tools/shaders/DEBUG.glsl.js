const vertex = `
layout (location = 0) in vec3 position;
out vec2 texCoords; 
void main() {
    texCoords = position.xy * 0.5 + 0.5;
    gl_Position = vec4(position, 1);
}`
const fragment = `
precision mediump float;
#define THRESHOLD .0001

//import(cameraUBO)

in vec2 texCoords;
uniform sampler2D uSampler;
uniform int debugFlag;
out vec4 fragColor;

float linearize(float depth){ 
    float near = .1;
    float far = 1000.;
    return (2. * near ) / (far + near - depth*(far -near)) ;
}
float rand(vec2 co){
    return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
}

vec3 randomColor(float seed){
    float r = rand(vec2(seed));
    float g = rand(vec2(seed + r));
    return vec3(
        r,
        g,
        rand(vec2(seed + g))
    );
}

void main(){
  
    vec4 samplerData = texture(uSampler, texCoords);
    if(samplerData.a < 1.)
        discard;
    vec3 color = samplerData.rgb; 
    
    if(debugFlag == 2){
        vec4 pos =  invViewMatrix * samplerData;
        color = vec3(linearize(pos.z/pos.w) * 2.);
    }
    else if (debugFlag == 9)
        color = vec3(color.b);
    else if (debugFlag == 10)
        color = vec3(color.g);
    else if (debugFlag == 3)
        color = vec3(color.r);
    else if (debugFlag == 11)
        color = vec3(color.r);
    else if(debugFlag == 16)
        color = vec3(color.gb, 0.);
    else if (debugFlag == 19)
        color = vec3(color.rg, 0.);
    else if (debugFlag == 13){
        if (samplerData.a < 1.) discard;
        color = vec3(invViewMatrix * samplerData );
    }
    else if(debugFlag == 21){
        color = randomColor(length(color));
    }
    else if (debugFlag == 22){ 
        color = randomColor(color.b * 255.);
    }
    fragColor = vec4(color, 1.);
}
`


export default {
    fragment,
    vertex
}