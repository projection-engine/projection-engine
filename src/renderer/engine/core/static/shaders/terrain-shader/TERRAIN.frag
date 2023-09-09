precision highp float;

in vec3 normalVec;
in vec3 positionVec;
in vec2 texCoordVec;

uniform sampler2D heightMap;
uniform int samples;

out vec4 fragColor;

void main() {
    vec4 height = texture(heightMap, texCoordVec);
    fragColor = vec4(height.xyz, 1.);
}
