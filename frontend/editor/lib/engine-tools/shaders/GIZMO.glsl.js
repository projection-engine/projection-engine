import AXIS from "../static/AXIS";


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
#define FRAG_DEPTH_THRESHOLD .00001
precision highp float;

in vec4 worldSpacePosition;
uniform int axis;
uniform int selectedAxis;
out vec4 fragColor; 
uniform bool isSurface;
uniform sampler2D depthSampler;
uniform vec2 bufferResolution;


void main(){
    vec3 color = vec3(1.);
    vec3 loc = vec3(0.0, 1.0, 0.0);
    bool isSelected = selectedAxis == axis;
    vec2 a = floor(gl_FragCoord.xy);  
    if(selectedAxis > 0 && !isSelected){
        bool checker = mod(a.x + a.y, 2.0 ) > 0.0;
        if( checker )
            discard; 
    }
    if(isSelected)
        color = vec3(2., 2., 0.);
    else
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
            case ${AXIS.XZ}:{
                color = vec3(0., 1., 0.);  
                bool checker = mod(a.x + a.y, 1.0 ) > 0.0;
                if( checker )
                    discard;
                break;
            }
            case ${AXIS.XY}:{
                color = vec3(0., 0., 1.);
                
                bool checker = mod(a.x + a.y, 1.0 ) > 0.0;
                if( checker )
                    discard;
                break;
            }
            case ${AXIS.ZY}:{
                color = vec3(1., 0., 0.); 
                bool checker = mod(a.x + a.y, 1.0 ) > 0.0;
                if( checker )
                    discard;
                break;
            }
            default:
                break;
        }
    
    fragColor = vec4(color, 1.);
    
    vec2 quadUV = gl_FragCoord.xy/bufferResolution;
    float currentDepth = texture(depthSampler, quadUV).r;
    if(currentDepth > 0. && abs(currentDepth - gl_FragCoord.z) > FRAG_DEPTH_THRESHOLD)
        fragColor.rgb *= .75;
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
    if(selectedAxis == axis)
        color = vec3(2., 2., 0.);
    else
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
  
  
        
    fragColor = vec4(color, 1.);
}
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
