export default {
    static: `

precision highp float;
    
#define PI  3.14159265359

//import(populateGBuffer)

uniform float elapsedTime; 
uniform vec3 cameraPosition;


`,
    wrapper: (body) => `
        void main(){   
            ${body}    
            populateGBuffer();
        }
        `,
    inputs: "",
    functions: ""
}
 