precision lowp float;

#define BIGGER_RADIUS .5
#define SMALLER_RADIUS .43
#define IMAGE_QUANTITY 7.


in vec2 texCoords;
in mat4 S;
uniform sampler2D iconSampler;
out vec4 finalColor;

//import(sceneDepthUtils)

void main() {

    float imageIndex = S[1][0];
    bool isSelected = S[1][1] == 1.;
    bool drawSphere = S[0][1] == 1.;
    bool removeSphereCenter = S[0][2] == 1.;
    vec3 iconColor = vec3(S[2][0], S[2][1], S[2][2]) / 255.;

    if (drawSphere) {
        float circle = pow((texCoords.x - .5), 2.) + pow((texCoords.y - .5), 2.);
        if (circle > pow(BIGGER_RADIUS, 2.))
        discard;
        if (removeSphereCenter) {
            bool isOnInnerCircle = circle <= pow(SMALLER_RADIUS, 2.);
            if (isOnInnerCircle)
            discard;
        }
    } else {
        vec2 imageSize = vec2(textureSize(iconSampler, 0));
        float color = texture(iconSampler, vec2(texCoords.x / IMAGE_QUANTITY + imageIndex * imageSize.y / imageSize.x, 1. - texCoords.y)).a;
        if (color <= .1) discard;
    }
    if (isSelected)
    finalColor = vec4(1., .5, 0., 1.);
    else {
        finalColor = vec4(iconColor, 1.);
        vec2 quadUV = gl_FragCoord.xy / bufferResolution;
        float currentDepth = getLogDepth(quadUV);
        if (currentDepth > 0. && currentDepth < gl_FragCoord.z)
        finalColor.rgb *= .5;
    }
}