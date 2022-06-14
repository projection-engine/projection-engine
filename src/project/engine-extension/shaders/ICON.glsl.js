
export const fragment = `#version 300 es

precision mediump float;
in vec2 texCoord;

uniform sampler2D iconSampler;
out vec4 finalColor;

void main()
{
    vec3 color = texture(iconSampler, texCoord).rgb;
    if(color.r < 0.5 && color.g < 0.5 && color.b < 0.5)
        discard;
    else
        finalColor = vec4(color, 1.);
}
`

export const vertex = `#version 300 es

// IN
layout (location = 0) in vec3 position;
layout (location = 1) in mat4 transformation;

// UNIFORM
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;
uniform float iconSize;


out vec2 texCoord;

void main(){
    texCoord = (position.xy) * 0.5 + 0.5;
    mat4 m =  viewMatrix * transformation;

    float d = .75 * iconSize; 

    m[0][0]  = d;
    m[0][1]  = 0.0;
    m[0][2]  = 0.0;
    m[0][3]  = 0.0;

    m[1][0] = 0.0;
    m[1][1] =d;
    m[1][2] =0.0;
    m[1][3]  = 0.0;

    m[2][0] = 0.0;
    m[2][1] = 0.0;
    m[2][2] = d;
    m[2][3]  = 0.0;


    vec4 transformed =projectionMatrix * m * vec4(position, 1.0);
    transformed /= transformed.w;

    gl_Position = vec4(transformed.xyz, 1.0);
}
`


export const cursorVertex = `#version 300 es

#define SIZE .2
layout (location = 0) in vec3 position; 

uniform mat4 viewMatrix;
uniform mat4 transformMatrix;
uniform mat4 projectionMatrix;
uniform vec3 camPos;
uniform vec3 translation;

uniform bool forceAsIcon;
out vec2 uv;
uniform float iconSize;


void main(){
 
    uv = (position.xy) * 0.5 + 0.5;
    vec3 t = translation - camPos;
     
    float len = length(camPos - translation) * SIZE; 
    mat4 tt = transformMatrix;
    
     
    mat4 sc;
    for ( int x = 0; x < 4; x++ )
        for ( int y = 0; y < 4; y++ )
            if ( x == y && x <= 2 )
                sc[x][y] =  len;
            else if ( x == y )
                sc[x][y] = 1.;
            else
                sc[x][y] = 0.;  
                
    tt[3][0]  += t.x;
    tt[3][1]  += t.y;
    tt[3][2]  += t.z;
    
    
    mat4 m =  viewMatrix * tt;

    float d = forceAsIcon ?  .5 : .3; 
 
    m[0][0]  = d;
    m[0][1]  = 0.0;
    m[0][2]  = 0.0;
    m[0][3]  = 0.0;

    m[1][0] = 0.0;
    m[1][1] = d;
    m[1][2] = 0.0;
    m[1][3]  = 0.0;

    m[2][0] = 0.0;
    m[2][1] = 0.0;
    m[2][2] = d;
    m[2][3]  = 0.0;


    vec4 transformed =projectionMatrix * m  * sc * vec4(position, 1.0);
    transformed /= transformed.w;

    gl_Position = vec4(transformed.xyz, 1.0);   
}
`


export const cursorFragment =`#version 300 es
precision highp float;

in vec2 uv; 
uniform sampler2D sampler;
out vec4 fragColor;
uniform bool forceAsIcon;
void main(){
	vec4 color = texture(sampler, uv);
	if(color.a == 0. || length(color) == .0)
		discard;
	else	
		fragColor = vec4(forceAsIcon == true ? vec3(1., .5, 0.) : color.rgb, 1.);
}
`
