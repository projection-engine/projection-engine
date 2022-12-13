export const vertexRot = `
#define SIZE .15
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