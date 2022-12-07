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


//    vec3 translation = vec3(transformationMatrix[3]);
//    float len = length(placement.xyz - translation);
//    mat4 sc;
//    for (int x = 0; x < 4; x++)
//    for (int y = 0; y < 4; y++)
//    if (x == y && x <= 2)
//    sc[x][y] = len * scale;
//    else if (x == y)
//    sc[x][y] = 1.;
//    else
//    sc[x][y] = 0.;
//    m = m * sc;

    gl_Position = projectionMatrix * m * vec4(position, 1.0);
}