export const vertex = `

layout (location = 0) in vec3 position; 


//import(cameraUBO)

uniform mat4 transformMatrix;

void main(){              
    gl_Position = viewProjection * transformMatrix * vec4(position, 1.0);
}
`

export const fragment = `
precision mediump float;
uniform vec3 meshID;
out vec4 fragColor;

void main(){  
    fragColor = vec4(meshID, 1.);
}
`

export const vertexSilhouette = `
layout (location = 0) in vec3 position;
out vec2 texCoords;
 
void main() {
    texCoords = position.xy * 0.5 + 0.5;
    gl_Position = vec4(position, 1);
}`

// THANKS https://stackoverflow.com/questions/53897949/opengl-object-outline
export const fragmentSilhouette = `
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
`