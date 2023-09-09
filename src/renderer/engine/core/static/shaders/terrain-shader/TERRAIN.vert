layout (location = 0) in vec3 position;
layout (location = 1) in vec2 uvTexture;
layout (location = 2) in vec3 normal;

uniform mat4 viewProjection;
uniform mat4 modelMatrix;
uniform sampler2D heightMap;
uniform float heightScale;
out vec3 normalVec;
out vec3 positionVec;
out vec2 texCoordVec;

void main() {
    vec4 wPosition = vec4(position, 1.0);
    vec4 height = texture(heightMap, uvTexture);
    wPosition.y = height.y * heightScale;
    wPosition = modelMatrix * wPosition;

    positionVec = wPosition.xyz;
    normalVec = normalize(mat3(modelMatrix) * normal);
    texCoordVec = uvTexture;

    gl_Position = viewProjection * wPosition;
}

