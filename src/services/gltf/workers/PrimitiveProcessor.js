import {vec3} from "gl-matrix";
import groupInto from "../../engine/utils/groupInto";

export default class PrimitiveProcessor {
    static computeNormals(indices, vertices) {
        const faces = groupInto(3, indices)
        const positions = groupInto(3, vertices)
        let quantity = positions.length;
        let normals = (new Array(quantity));

        // FILL NÃO FUNCIONA DESGRETA
        for (let i = 0; i < quantity; ++i) {
            normals[i] = [0, 0, 0];
        }
        for (let i = 0; i < faces.length; ++i) {
            let f = faces[i], p = 0, c = f[f.length - 1], n = f[0]
            for (let j = 0; j < f.length; ++j) {
                p = c
                c = n
                n = f[(j + 1) % f.length]

                let v0 = positions[p],
                    v1 = positions[c],
                    v2 = positions[n]

                let d01 = new Array(3),
                    m01 = 0,
                    d21 = new Array(3),
                    m21 = 0
                if (v0 && v1) {
                    vec3.sub(d01, v0, v1)
                    vec3.sub(d21, v2, v1)
                    m01 = vec3.dot(d01, d01);
                    m21 = vec3.dot(d21, d21);

                    if (m01 * m21 > 1e-6) {
                        let norm = normals[c];
                        let w = 1.0 / Math.sqrt(m01 * m21);
                        for (let k = 0; k < 3; ++k) {
                            let u = (k + 1) % 3, v = (k + 2) % 3
                            norm[k] += w * (d21[u] * d01[v] - d21[v] * d01[u]);
                        }
                    }
                }
            }
        }

        return normals.flat()
    }

    static computeTangents(indices, vertices, uvs, normals) {
        let tangents = new Array(vertices.length / 3).fill([0, 0, 0])
        let biTangents = new Array(vertices.length / 3).fill([0, 0, 0])
        const norm = groupInto(3, normals)

        let groupedVertices = groupInto(3, vertices), groupedUVs = groupInto(2, uvs)

        for (let i = 0; i < indices.length / 3; i += 3) {
            let i0 = indices[i],
                i1 = indices[i + 1],
                i2 = indices[i + 2]

            let v0 = groupedVertices[i0],
                v1 = groupedVertices[i1],
                v2 = groupedVertices[i2],
                uv0 = groupedUVs[i0],
                uv1 = groupedUVs[i1],
                uv2 = groupedUVs[i2]

            let e1 = [], e2 = []
            vec3.sub(e1, v1, v0)
            vec3.sub(e2, v2, v0)

            let x1 = uv1[0] - uv0[0],
                x2 = uv2[0] - uv0[0],
                y1 = uv1[1] - uv0[1],
                y2 = uv2[1] - uv0[1]

            const r = 1 / (x1 * y2 - x2 * y1)
            let tangent = [],
                tangentP1 = [],
                tangentP2 = []
            let biTangent = [],
                biTangentP1 = [],
                biTangentP2 = []

            // TANGENT
            vec3.scale(tangentP1, e1, y2)
            vec3.scale(tangentP2, e2, y1)
            vec3.sub(tangent, tangentP1, tangentP2)
            vec3.scale(tangent, tangent, r)

            vec3.add(tangents[i0], tangents[i0], tangent)
            vec3.add(tangents[i1], tangents[i1], tangent)
            vec3.add(tangents[i2], tangents[i2], tangent)

            // BI TANGENT
            vec3.scale(biTangentP1, e2, x1)
            vec3.scale(biTangentP2, e1, x2)
            vec3.sub(biTangent, biTangentP1, biTangentP2)
            vec3.scale(biTangent, biTangent, r)

            vec3.add(biTangents[i0], biTangents[i0], biTangent)
            vec3.add(biTangents[i1], biTangents[i1], biTangent)
            vec3.add(biTangents[i2], biTangents[i2], biTangent)


        }
        let tangentArray = new Array(vertices.length).fill([0, 0, 0, 0])
        for (let i = 0; i < vertices.length; i++) {
            let t0 = tangents[i],
                t1 = biTangents[i],
                n = norm[i]

            if (n !== undefined) {
                let t = [0, 0, 0]
                const nCop = [0, 0, 0]
                vec3.scale(nCop, n, vec3.dot(n, t0))
                vec3.sub(t, t0, nCop)
                vec3.normalize(t, t)

                let c = [0, 0, 0]
                vec3.cross(c, n, t0)
                const w = vec3.dot(c, t1) < 0 ? -1 : 1

                tangentArray[i] = [t[0], t[1], t[2], w]
            }

        }

        return tangentArray.flat()
    }

}