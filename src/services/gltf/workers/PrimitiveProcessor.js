import {vec2, vec3} from "gl-matrix";
import groupInto from "../../engine/utils/groupInto";

export default class PrimitiveProcessor {
    static computeNormals(faces, vertices) {

    }

    static computeTangents(indices, vertices, uvs) {
        let tangents = []


        let groupedVertices = groupInto(3, vertices), groupedUVs = groupInto(2, uvs)

        console.log(indices.length / 3)
        for (let i = 0; i < indices.length / 3; i += 3) {
            let i0 = indices[i], i1 = indices[i + 1], i2 = indices[i + 2]

            let v0 = groupedVertices[i0],
                v1 = groupedVertices[i1],
                v2 = groupedVertices[i2],
                uv0 = groupedUVs[i],
                uv1 = groupedUVs[i + 1],
                uv2 = groupedUVs[i + 2]

            let deltaPositionOne = [],
                deltaPositionTwo = [],
                deltaUVOne = [],
                deltaUVTwo = []

            vec3.sub(deltaPositionOne, v1, v0)
            vec3.sub(deltaPositionTwo, v2, v0)

            vec2.sub(deltaUVOne, uv1, uv0)
            vec2.sub(deltaUVTwo, uv2, uv0)
            console.log(deltaUVOne, deltaUVTwo)

            let r = 1 / Math.max(.1, (deltaUVOne[0] * deltaUVTwo[1] - deltaUVOne[1] * deltaUVTwo[0])),
                tangent = [],
                tangentP1 = [],
                tangentP2 = []


            // TANGENT
            vec3.scale(tangentP1, deltaPositionOne, deltaUVTwo[1])
            vec3.scale(tangentP2, deltaPositionTwo, deltaUVOne[1])
            vec3.sub(tangent, tangentP1, tangentP2)
            vec3.scale(tangent, tangent, r)

            tangents.push(...tangent)
        }
        console.log(tangents)
        return tangents
    }

}