export default {
    static: `
    
precision highp float;
// IN
#define PI  3.14159265359 

in vec3 worldSpacePosition;
in  vec2 texCoords;
in mat3 toTangentSpace;
uniform vec3 cameraPosition;
in vec3 normalVec; 
in vec3 viewDirection;  
uniform float elapsedTime;
  

// OUTPUTS
out vec4 finalColor;
        `,
    wrapper: (body) => `
void main(){
    ${body}
     finalColor = vec4(gAlbedo.rgb, 1.);
}
        `,
    inputs: "",
    functions: ""
}
