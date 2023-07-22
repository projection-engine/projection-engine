precision lowp float;
uniform sampler2D silhouette;

uniform bool isOutline;
uniform vec3 outlineColor;
uniform float outlineWidth;
uniform vec2 bufferSize;
uniform vec2 mouseCoordinates;

in vec2 texCoords;
out vec4 fragColor;

void main()
{
    vec2 size;
    if (!isOutline)
    size = 2. / bufferSize;
    else
    size = outlineWidth / bufferSize;
    float center = length(texture(silhouette, texCoords).rg);
    float left = length(texture(silhouette, texCoords + vec2(-1., 0.) * size).rg);
    float right = length(texture(silhouette, texCoords + vec2(1., 0.) * size).rg);
    float top = length(texture(silhouette, texCoords + vec2(0., -1.) * size).rg);
    float bottom = length(texture(silhouette, texCoords + vec2(0., 1.) * size).rg);
    if (left != center || right != center || top != center || bottom != center) {
        if (!isOutline)
        fragColor = vec4(1., .35, 0., 1.);
        else {
            vec2 texelSize = 1.0 / bufferSize;
            float hovered = length(texture(silhouette, mouseCoordinates * texelSize).rg);
            if (center > 0. && center == hovered || top > 0. && top == hovered || left > 0. && left == hovered || right > 0. && right == hovered || bottom > 0. && bottom == hovered) {
                fragColor = vec4(1., .35, 0., 1.);
            }
            else {
                fragColor = vec4(outlineColor, 1.);
            }
        }
    }
    else
    discard;
}
