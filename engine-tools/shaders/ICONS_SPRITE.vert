layout (location = 0) in vec3 position;
const mat4 ROTATION_MATRIX = mat4(
    1., 0., 0., 0.,
    0., 6.123233995736766e-17, 1., 0.,
    0., -1, 6.123233995736766e-17, 0.,
    0., 0., 0., 1.
);

uniform mat4 transformationMatrix;
uniform mat4 viewM;
uniform mat4 projectionM;
uniform mat4 settings;
out vec2 texCoords;
out mat4 S;

void main() {
    S = settings;

    float scale = settings[0][3];
    bool doNotFaceCamera = settings[0][0] == 1.;

    texCoords = position.xy * .5 + .5;
    mat4 m;
    if (!doNotFaceCamera) {
        m = viewM * transformationMatrix;
        m[0][0] = scale;
        m[1][1] = scale;
        m[2][2] = scale;

        m[0][1] = 0.0;
        m[0][2] = 0.0;
        m[0][3] = 0.0;
        m[1][0] = 0.0;
        m[1][2] = 0.0;
        m[1][3] = 0.0;
        m[2][0] = 0.0;
        m[2][1] = 0.0;
        m[2][3] = 0.0;
    } else {
        mat4 sc = ROTATION_MATRIX * mat4(
            scale, 0.0, 0.0, 0.,
            0.0, scale, 0., 0.,
            0.0, 0., scale, 0.,
            0., 0., 0., 1.
        );
        m = viewM * transformationMatrix * sc;
    }

    gl_Position = projectionM * m * vec4(position, 1.0);
}