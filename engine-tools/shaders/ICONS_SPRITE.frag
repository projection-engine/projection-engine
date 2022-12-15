precision mediump float;
#define BIGGER_RADIUS .5
#define SMALLER_RADIUS .43

in vec2 texCoords;

uniform sampler2D image;
uniform float imageIndex;
uniform bool isSelected;
uniform bool drawSphere;
uniform bool removeSphereCenter;

out vec4 finalColor;

void main()
{
    if(drawSphere){
        float circle = pow((texCoords.x - .5), 2.) +pow((texCoords.y - .5), 2.);
        if(circle > pow(BIGGER_RADIUS, 2.))
        discard;
        if(removeSphereCenter){
            bool isOnInnerCircle = circle <= pow(SMALLER_RADIUS, 2.);
            if (isOnInnerCircle)
            discard;
        }
        finalColor = vec4(1.);
    }else{
        vec2 imageSize = vec2(textureSize(image, 0));
        vec4 color = texture(image, vec2(texCoords.x/6. +  imageIndex * imageSize.y/imageSize.x, 1. - texCoords.y)).rgba;
        if(color.a <= .1) discard;
    }
    if(isSelected)
    finalColor = vec4(1., .5, 0., 1.);
    else
    finalColor = vec4(1.);
}