#define SIZE .15
layout (location = 0) in vec3 position;


//import(cameraViewInfo)

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

    gl_Position =  viewProjection * tt * sc * vec4(position,1.0);
}