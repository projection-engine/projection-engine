precision mediump float;
in vec2 texCoords;

uniform sampler2D image;
uniform float imageIndex;
uniform bool isSelected;

out vec4 finalColor;

void main()
{
    vec2 imageSize = vec2(textureSize(image, 0));
    vec4 color = texture(image, vec2(texCoords.x/6. +  imageIndex * imageSize.y/imageSize.x, texCoords.y)).rgba;
    if(color.a <= .1)
        discard;
    else {
        if(isSelected)
            finalColor = vec4(1., .5, 0., 1.);
        else
            finalColor = vec4(1.);
    }
}