layout (location = 0) in vec3 position;
layout (location = 2) in vec2 uvTexture;
//import(cameraViewInfo)

out vec3 worldPosition;
out vec3 cameraPosition;

void main(){

    cameraPosition = placement.xyz;
    worldPosition = position * 100. + vec3(placement.x, 0., placement.z);
    gl_Position = viewProjection * vec4(worldPosition, 1.);
}