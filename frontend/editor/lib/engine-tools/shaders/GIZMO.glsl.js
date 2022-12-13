import AXIS from "../static/AXIS";



export const vertex = `
#define SIZE .15
layout (location = 0) in vec3 position; 

//import(cameraUBO)

uniform mat4 transformMatrix; 
uniform vec3 translation;
uniform bool cameraIsOrthographic; 

void main(){
    vec3 t = translation - placement.xyz;
    float len = length(placement.xyz - translation) * SIZE;
    mat4 tt = transformMatrix;
    if(!cameraIsOrthographic){
        tt[3][0]  += t.x;
        tt[3][1]  += t.y;
        tt[3][2]  += t.z;
    } 
    mat4 sc;
    for ( int x = 0; x < 4; x++ )
        for ( int y = 0; y < 4; y++ )
            if ( x == y && x <= 2)
                sc[x][y] = cameraIsOrthographic ? 1.75 : len;
            else if ( x == y )
                sc[x][y] = 1.;
            else
                sc[x][y] = 0.;
    tt = tt * sc;
    gl_Position =  viewProjection * tt *  vec4(position,1.0);  
}
`

export const fragment = `
#define FRAG_DEPTH_THRESHOLD .00001
precision mediump float;

in vec4 worldSpacePosition;
uniform int axis;
uniform int selectedAxis;
out vec4 fragColor;  
 


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
  
}
`

