precision highp float;
// THANKS TO https://www.shadertoy.com/view/stS3Rz
#define PI          3.14159265359
#define PI2         6.28318530718
#define PI2_INV     0.15915494309
#define DEG2RAD     0.01745329251// PI / 180
#define SMALLER_LINE 0.85
#define MEDIUM_LINE 0.75
#define BIGGER_LINE  0.65
#define THICKNESS .005
#define OUTER_CIRCLE  1.
#define INNER_CIRCLE  0.8

// IN
in vec2 uv;
uniform vec2 mouseCoordinates;
uniform sampler2D gizmoIDS;

uniform vec4 metadata;

out vec4 fragColor;

float sdfSegment(vec2 p, vec2 a, vec2 b) {
    vec2 pa = p - a, ba = b - a;
    float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
    return length(pa - ba * h);
}

float ring(vec2 coord, float outer, float inner) {
    float radius = dot(coord, coord);
    float dxdy = fwidth(radius);
    return smoothstep(inner - dxdy, inner + dxdy, radius) -
    smoothstep(outer - dxdy, outer + dxdy, radius);
}

// https://www.shadertoy.com/view/XtXyDn
float arc(vec2 uv, vec2 up, float angle, float radius, float thick) {
    float hAngle = angle * 0.5;

    // vector from the circle origin to the middle of the arc
    float c = cos(hAngle);

    // smoothing perpendicular to the arc
    float d1 = abs(length(uv) - radius) - thick;
    float w1 = 1.5 * fwidth(d1);// proportional to how much d1 change between pixels
    float s1 = smoothstep(w1 * 0.5, -w1 * 0.5, d1);

    // smoothing along the arc
    float d2 = dot(up, normalize(uv)) - c;
    float w2 = 1.5 * fwidth(d2);// proportional to how much d2 changes between pixels
    float s2 = smoothstep(w2 * 0.5, -w2 * 0.5, d2);

    // mix perpendicular and parallel smoothing
    return s1 * (1.0 - s2);
}


void main() {
    int axis = int(metadata.x);
    int selectedAxis = int(metadata.y);
    float rotated = metadata.z;
    float increment = metadata.w;
    if (axis == 2)
    rotated = -rotated;
    float d = 0.;
    float minimumAngle = radians(1.);
    float totalRotated = 0.;
    bool isSelected = selectedAxis == axis;
    vec2 c_uv = uv * 2.0 - 1.0;
    float minIncrement = max(increment, minimumAngle);

    if (isSelected) {
        float steps = PI2 / minIncrement;// 36 steps
        float frag_angle = atan(c_uv.y, c_uv.x);// Angle of Fragment from Center
        float grad_angle = fract(frag_angle * PI2_INV);// 0:360 mapped to 0:1

        float a_step = steps * grad_angle;// Divide the Gradient by the number of steps, Gives whole+fract value
        float grad_step = fract(a_step);// For each angle step, get a 0:1 Mapping

        // Snap Step to next whole number
        float snap_step = (grad_step >= 0.5) ? ceil(a_step) : floor(a_step);// round doesn't work
        float snap_angle = snap_step * minIncrement;// Get the Center Angle of the Sector
        vec2 dir = vec2(// Compute Direction, Normalized by default
            cos(snap_angle),
            sin(snap_angle)
        );

        // Set Different Lengths for different increments
        float len = SMALLER_LINE;
        if (mod(snap_step, 5.0) <= 0.9999)
        len = MEDIUM_LINE;
        if (mod(snap_step, 45.0) <= 0.9999)
        len = BIGGER_LINE;

        if (len == SMALLER_LINE && minimumAngle == minIncrement)
        len = 1.;
        d = sdfSegment(c_uv, dir * len, dir * 1.0) - THICKNESS;

        float fw = fwidth(c_uv.x);// Apply Anti-Alias to Lines
        d = 1.0 - clamp(d / fw, 0.0, 1.0);

        d *= 1.0 - step(.98, length(c_uv));// Mask out any lines outside of ring radius


        float rad_spread = -rotated * 2.;
        float rad_center = -rotated;
        vec2 rad_dir = vec2(cos(rad_center), sin(rad_center));

        totalRotated = max(d, arc(c_uv, rad_dir, rad_spread, 0.25, 0.39));
    }

    d = d + ring(c_uv, OUTER_CIRCLE, isSelected ? .92 : INNER_CIRCLE);
    vec2 a = floor(gl_FragCoord.xy);
    bool checker = mod(a.x + a.y, 4.0) > 0.0;

    if (d == 0. && (checker || isSelected) && totalRotated == 0.)
    discard;

    vec3 color = vec3(1.);
    if (isSelected) {
        color = vec3(2., 2., 0.);
    }
    else {
        switch (axis) {
            case 2:{
                color = vec3(0., 0., 1.);
                break;
            }
            case 3:{
                color = vec3(0., 1., 0.);
                break;
            }
            case 4:{
                color = vec3(1., 0., 0.);
                break;
            }
        }

    }
    if (totalRotated != 0. && isSelected && d == 0.) {
        fragColor = vec4(color, .75);}
    else {
        vec2 texelSize = 1.0 / vec2(textureSize(gizmoIDS, 0));
        vec3 hovered = texture(gizmoIDS, mouseCoordinates * texelSize).xyz * 255.;
        if (int(hovered.x + hovered.y + hovered.z) == axis) {
            color = vec3(2., 2., 0.);
        }
        fragColor = vec4(color, 1.);
    }
}
