precision highp float;
#define BIGGER_RADIUS .5
#define SMALLER_RADIUS .43
// IN
in vec2 uv;
uniform int axis;
uniform int selectedAxis;
out vec4 fragColor;


void main(){
    float circle = pow((uv.x - .5), 2.) +pow((uv.y - .5), 2.);
    if(circle > pow(BIGGER_RADIUS, 2.))
        discard;

    bool isOnInnerCircle = circle <= pow(SMALLER_RADIUS, 2.);
    vec2 a = floor(gl_FragCoord.xy);
    bool checker = mod(a.x + a.y, 4.0 ) > 0.0;

    if( checker && isOnInnerCircle)
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
