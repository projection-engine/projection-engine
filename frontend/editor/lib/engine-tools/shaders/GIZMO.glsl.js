import AXIS from "../static/AXIS";


export const lineFragment = `

precision lowp float;
out vec4 finalColor;
void main() {
    finalColor = vec4(1., 1., .0, 1);
}
`

export const lineVertex = `
layout (location = 0) in vec3 position; 
 
 
//import(cameraUBO)

uniform mat4 transformMatrix; 
uniform vec3 axis; 
uniform float size;
uniform bool atOrigin;

void main() {
 
    mat4 sc = mat4(0.);
    for ( int x = 0; x < 4; x++ )
        for ( int y = 0; y < 4; y++ )
            if ( x == y && x <= 2)
                sc[x][y] = 1.;
            else if ( x == y )
                sc[x][y] = 1.;

    if(axis.x > 0.){
           sc[0][0] = size;
           sc[3][0] = atOrigin ? 0. : -size/2.;
    }
    if(axis.y > 0.){
           sc[1][1] = size;
           sc[3][1] = atOrigin ? 0. : -size/2.;
    }
    if(axis.z > 0.){
           sc[2][2] = size;
           sc[3][2] = atOrigin ? 0. : -size/2.;
    } 
    gl_Position = viewProjection * transformMatrix * sc * vec4(position, 1.0);
}

`
const SIZE_DEFINITION = `#define SIZE .15`
const TRANSLATION_METHOD = `
vec3 t = translation - placement.xyz;
float len = length(placement.xyz - translation) * SIZE;
mat4 tt = transformMatrix;
if(!cameraIsOrthographic){
    tt[3][0]  += t.x;
    tt[3][1]  += t.y;
    tt[3][2]  += t.z;
}
`
const SCALE_METHOD = `
mat4 sc;
for ( int x = 0; x < 4; x++ )
    for ( int y = 0; y < 4; y++ )
        if ( x == y && x <= 2)
            sc[x][y] = cameraIsOrthographic ? 1.75 : len;
        else if ( x == y )
            sc[x][y] = 1.;
        else
            sc[x][y] = 0.;

`
export const sameSizeVertex = `
${SIZE_DEFINITION}
layout (location = 0) in vec3 position;


//import(cameraUBO)

uniform mat4 transformMatrix;  
uniform vec3 translation;
uniform bool cameraIsOrthographic;
 
void main(){
    ${TRANSLATION_METHOD}
    ${SCALE_METHOD}        
    gl_Position =  viewProjection * tt * sc * vec4(position,1.0);
}
`
export const vertex = `
${SIZE_DEFINITION}
layout (location = 0) in vec3 position; 

//import(cameraUBO)

uniform mat4 transformMatrix; 
uniform vec3 translation;
uniform bool cameraIsOrthographic;
uniform bool isSurface;

void main(){
    ${TRANSLATION_METHOD}
    if(!isSurface){
        ${SCALE_METHOD}
        tt = tt * sc;
        gl_Position =  viewProjection * tt *  vec4(position,1.0);
    }  
    else{
        mat4 sc;
        for ( int x = 0; x < 4; x++ )
            for ( int y = 0; y < 4; y++ )
                if ( x == y && x <= 2)
                    sc[x][y] = 1000.;
                else if ( x == y )
                    sc[x][y] = 1.;
                else
                    sc[x][y] = 0.;
 
      
        gl_Position =  viewProjection * tt * sc *  vec4(position,1.0);
    }
}
`

export const fragment = `
precision highp float;

in vec4 worldSpacePosition;
uniform int axis;
uniform int selectedAxis;
out vec4 fragColor; 
uniform bool isSurface;


void main(){
    vec3 color = vec3(1.);
    vec3 loc = vec3(0.0, 1.0, 0.0);
    switch (axis) {
        case ${AXIS.X}:
            color = vec3(1., 0., 0.);
            break;
        case ${AXIS.Y}:
            color = vec3(0., 1., 0.);
            break;
        case ${AXIS.Z}:
            color = vec3(0., 0., 1.);
            break;
        case ${AXIS.XZ}:
            color = vec3(0., 1., 0.);
        break;
        case ${AXIS.XY}:
            color = vec3(0., 0., 1.);
        break;
        case ${AXIS.ZY}:
            color = vec3(1., 0., 0.);
        break;
        default:
            break;
    }
     
    if(selectedAxis == axis)
        color = vec3(1., 1., 0.);
    fragColor = vec4(color, 1.);
}
`
export const vertexRot = `
${SIZE_DEFINITION}
layout (location = 0) in vec3 position;
layout (location = 2) in vec2 uvs;
 

//import(cameraUBO)

uniform mat4 transformMatrix; 
uniform vec3 translation;
uniform bool cameraIsOrthographic;

out vec2 uv;


void main(){
 
    uv = uvs; 
    vec3 t = translation - placement.xyz;
     
    float len = length(placement.xyz - translation) * SIZE;
     if(cameraIsOrthographic)
    	len *= .5; 
    mat4 tt = transformMatrix;
    
     
    mat4 sc;
    for ( int x = 0; x < 4; x++ )
        for ( int y = 0; y < 4; y++ )
            if ( x == y && x <= 2 )
				sc[x][y] = cameraIsOrthographic ? 1.75 : len;
            else if ( x == y )
                sc[x][y] = 1.;
            else
                sc[x][y] = 0.;  
                
		if(!cameraIsOrthographic){
			tt[3][0]  += t.x;
			tt[3][1]  += t.y;
			tt[3][2]  += t.z;
		}
    
    gl_Position =  viewProjection * tt * sc * vec4(position,1.0);   
}
`

export const fragmentRot = `
precision highp float;

// IN
in vec4 worldSpacePosition;
in vec2 uv;
in vec3 normalVec;
uniform int axis;
uniform int selectedAxis;
uniform sampler2D circleSampler;
out vec4 fragColor;

void main(){
    vec4 colorS = texture(circleSampler, uv);

    vec2 a = floor(gl_FragCoord.xy);  
    bool checker = mod(a.x + a.y, 4.0 ) > 0.0;
    
    if( checker && colorS.a < .5)
        discard;
    
    
    vec3 color = vec3(1.);
    switch (axis) {
        case 2:
            color = vec3(0., 0., 1.);
            break;
        case 3:
            color = vec3(0., 1., 0.);
            break;
        case 4:
            color = vec3(1., 0., 0.);
            break;
        default:
            break;
    }
  
    if(selectedAxis == axis)
        color = vec3(1., 1., 0.);
        
    fragColor = vec4(color, 1.);
}
`


export const pickFragment = `
precision lowp float;

uniform vec3 uID; 

 
layout (location = 0) out vec4 v_depth;
layout (location = 1) out vec4 v_entityid;
layout (location = 2) out vec4 v_velocity;

void main(){
    v_entityid = vec4(uID,1.);
    v_depth = vec4(0.);
    v_velocity = vec4(0.);
}
`


export const cameraVertex = `

layout (location = 0) in vec3 position;
#define SIZE .15

//import(cameraUBO)

uniform vec3 translation; 
uniform bool sameSize;
 
uniform mat4 transformMatrix; 
 

void main(){ 
    mat4 sc  ;
    if(sameSize){
        float len = length(placement.xyz - translation) * SIZE;
            
        for ( int x = 0; x < 4; x++ )
            for ( int y = 0; y < 4; y++ )
                if ( x == y && x <= 2)
                    sc[x][y] = len;
                else if ( x == y )
                    sc[x][y] = 1.;
                else
                    sc[x][y] = 0.;
        sc = transformMatrix * sc;      
    }
    else
        sc = transformMatrix;
    gl_Position = viewProjection * sc * vec4(position,1.0);
}
`

export const cameraFragment = `
precision highp float;

 
uniform bool highlight; 
out vec4 fragColor;


void main(){
    vec3 color = vec3(0., 0., 1.);

    if(highlight)
        color = vec3(1., 1., 0.); 
    fragColor = vec4(color, .95);
}
`
