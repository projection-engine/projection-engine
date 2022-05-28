import {mat4, quat, vec3} from "gl-matrix";

export default function extractTransformations(matrix) {
    let m = [...matrix]
    const translation = [m[12], m[13], m[14]]

    const scaling = new Array(3).fill(1)
    scaling[0] = m[15] * Math.sqrt(m[0] ** 2 + m[1] ** 2 + m[2] ** 2)
    scaling[1] = m[15] * Math.sqrt(m[4] ** 2 + m[5] ** 2 + m[6] ** 2)
    scaling[2] = m[15] * Math.sqrt(m[8] ** 2 + m[9] ** 2 + m[10] ** 2)

    let indices = [0, 1, 2]
    indices.forEach((v) => m[v] /= scaling[0])
    indices = [4, 5, 6]
    indices.forEach((v) => m[v] /= scaling[1])
    indices = [8, 9, 10]
    indices.forEach((v) => m[v] /= scaling[2])
    m[15] = 1.0

    const tmp_z_axis = vec3.cross([], [m[0], m[1], m[2]], [m[4], m[5], m[6]]);
    if (vec3.dot(tmp_z_axis, [m[8], m[9], m[10]]) < 0) {
        scaling[0] *= -1;
        m[0] = -m[0];
        m[1] = -m[1];
        m[2] = -m[2]
    }

    const theta1 = Math.atan2(m[6], m[10]),
        c2 = Math.sqrt(m[0] ** 2 + m[1] ** 2),
        theta2 = Math.atan2(-m[2], c2),
        s1 = Math.sin(theta1),
        c1 = Math.cos(theta1),
        theta3 = Math.atan2(s1 * m[8] - c1 * m[4], c1 * m[5] - s1 * m[9]),
        rotation = [-theta1, -theta2, -theta3]

    return {
        translation,
        scaling,
        rotationQuat: Array.from(mat4.getRotation([], matrix)) // quat.fromEuler([], rotation[0], rotation[1], rotation[2])
    }
}