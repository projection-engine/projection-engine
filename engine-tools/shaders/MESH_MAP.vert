layout (location = 0) in vec3 position;
//import(cameraViewInfo)
//import(cameraProjectionInfo)

uniform mat4 transformMatrix;
uniform mat3 metadata;

out vec3 id;
void main(){
    id = vec3(metadata[2]);
    bool isSprite = metadata[0][0] == 1.;
    if (isSprite) {
        bool alwaysFaceCamera = metadata[0][1] == 1.;
        bool keepSameSize = metadata[0][2] == 1.;
        vec3 scale = vec3(metadata[1]);

        mat4 m =  viewMatrix * transformMatrix;
        if(alwaysFaceCamera){
            m[0][0] = scale.x;
            m[1][1] = scale.y;
            m[2][2] = scale.z;

            m[0][1]     = 0.0;
            m[0][2]     = 0.0;
            m[0][3]     = 0.0;
            m[1][0]     = 0.0;
            m[1][2]     = 0.0;
            m[1][3]     = 0.0;
            m[2][0]     = 0.0;
            m[2][1]     = 0.0;
            m[2][3]     = 0.0;
        }

        if(keepSameSize){
            vec3 translation = vec3(transformMatrix[3]);
            float len = length(placement.xyz - translation);
            mat4 sc;
            for ( int x = 0; x < 4; x++ )
            for ( int y = 0; y < 4; y++ )
            if ( x == y && x <= 2 )
            sc[x][y] = len * scale[x];
            else if ( x == y )
            sc[x][y] = 1.;
            else
            sc[x][y] = 0.;
            m = m * sc;
        }

        gl_Position = projectionMatrix * m * vec4(position, 1.0);
    }
    else
        gl_Position = viewProjection * transformMatrix * vec4(position, 1.0);
}