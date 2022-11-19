const vertex = `
layout (location = 0) in vec3 position; 
 
//import(cameraUBO)

uniform mat4 transformMatrix;  
 

void main() { 
    gl_Position = viewProjection * transformMatrix * vec4(position, 1.0);
}`
const fragment = `
precision lowp float;
out vec4 finalColor;
void main() {
    finalColor = vec4(0., 5., .0, .25);
}
`

export default {
    vertex,
    fragment
}