precision mediump float;
#define BIGGER_RADIUS .5
#define SMALLER_RADIUS .43

in vec2 texCoords;
in mat4 S;

uniform sampler2D image;


out vec4 finalColor;

void main(){
    float imageIndex = S[1][0];
    bool isSelected = S[1][1] == 1.;
    bool drawSphere = S[0][1] == 1.;
    bool removeSphereCenter = S[0][2] == 1.;
    vec3 iconColor = vec3(S[2][0],S[2][1],S[2][2])/255.;

    if(drawSphere){
        float circle = pow((texCoords.x - .5), 2.) +pow((texCoords.y - .5), 2.);
        if(circle > pow(BIGGER_RADIUS, 2.))
        discard;
        if(removeSphereCenter){
            bool isOnInnerCircle = circle <= pow(SMALLER_RADIUS, 2.);
            if (isOnInnerCircle)
            discard;
        }
        finalColor = vec4(iconColor, 1.);
    }else{
        vec2 imageSize = vec2(textureSize(image, 0));
        float color = texture(image, vec2(texCoords.x/6. +  imageIndex * imageSize.y/imageSize.x, 1. - texCoords.y)).a;
        if(color <= .1) discard;
    }
    if(isSelected)
        finalColor = vec4(1., .5, 0., 1.);
    else
        finalColor = vec4(iconColor, 1.);
}