// THANKS https://stackoverflow.com/questions/53897949/opengl-object-outline

precision mediump float;
uniform sampler2D silhouette;

uniform bool isOutline;
uniform vec3 outlineColor;

in vec2 texCoords;
out vec4 fragColor;

void main()
{
    vec2 size;
    if(!isOutline)
        size = 2./vec2(textureSize(silhouette, 0));
    else
        size = .5/vec2(textureSize(silhouette, 0));
    vec3 center = texture(silhouette, texCoords).rgb;
    vec3 left = texture(silhouette, texCoords + vec2(-1., 0.) * size).rgb;
    vec3 right = texture(silhouette, texCoords + vec2(1., 0.) * size).rgb;
    vec3 top = texture(silhouette, texCoords + vec2(0., -1.) * size).rgb;
    vec3 bottom = texture(silhouette, texCoords + vec2(0., 1.) * size).rgb;
    if(left != center || right != center || top != center || bottom != center ){
        if(!isOutline)
            fragColor = vec4(1., .35, 0., 1.);
        else
            fragColor = vec4(outlineColor, 1.);
    }
    else
        discard;
}
