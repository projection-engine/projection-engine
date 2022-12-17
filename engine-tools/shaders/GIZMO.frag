#define FRAG_DEPTH_THRESHOLD .00001
precision mediump float;

in vec4 worldSpacePosition;
uniform int axis;
uniform int selectedAxis;
out vec4 fragColor;

const int   SCREEN_SPACE =1;
const int   X =2;
const int   Y =3;
const int   Z =4;
const int   XY =5;
const int   XZ =6;
const int   ZY =7;

void main(){
    vec3 color = vec3(1.);
    vec3 loc = vec3(0.0, 1.0, 0.0);
    bool isSelected = selectedAxis == axis;
    vec2 a = floor(gl_FragCoord.xy);
    if (selectedAxis > 0 && !isSelected){
        bool checker = mod(a.x + a.y, 2.0) > 0.0;
        if (checker)
        discard;
    }
    if (isSelected)
    color = vec3(2., 2., 0.);
    else
    switch (axis) {
        case X:
        color = vec3(1., 0., 0.);
        break;
        case Y:
        color = vec3(0., 1., 0.);
        break;
        case Z:
        color = vec3(0., 0., 1.);
        break;
        case XZ:{
            color = vec3(0., 1., 0.);
            bool checker = mod(a.x + a.y, 1.0) > 0.0;
            if (checker)
            discard;
            break;
        }
        case XY:{
            color = vec3(0., 0., 1.);

            bool checker = mod(a.x + a.y, 1.0) > 0.0;
            if (checker)
            discard;
            break;
        }
        case ZY:{
            color = vec3(1., 0., 0.);
            bool checker = mod(a.x + a.y, 1.0) > 0.0;
            if (checker)
            discard;
            break;
        }
    }

    fragColor = vec4(color, 1.);
}

