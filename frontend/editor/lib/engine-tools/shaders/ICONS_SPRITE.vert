layout (location = 0) in vec3 position;

//import(cameraUBO)

uniform mat4 transformationMatrix;
uniform float scale;

out vec2 texCoords;

void main(){


    texCoords = position.xy * .5 + .5;
    mat4 m =  viewMatrix * transformationMatrix;
    m[0][0] = scale;
    m[1][1] = scale;
    m[2][2] = scale;

    m[0][1]  = 0.0;
    m[0][2]  = 0.0;
    m[0][3]  = 0.0;
    m[1][0] = 0.0;
    m[1][2] =0.0;
    m[1][3]  = 0.0;
    m[2][0] = 0.0;
    m[2][1] = 0.0;
    m[2][3]  = 0.0;


    gl_Position = projectionMatrix * m * vec4(position, 1.0);
}