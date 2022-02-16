import groupInto from "../engine/utils/groupInto";
import {vec2, vec3} from "gl-matrix";

export default class PrimitiveProcessor{
    static computeNormals(faces, vertices){

    }
    static computeTangents(faces, vertices, uvs, uvGroups){
        let tangents = []
        const mappedUVS = uvGroups.map(face => {
            return [uvs[face[0]], uvs[face[1]], uvs[face[2]]]
        })

        const mappedPositions = faces.map(face => {
            return [vertices[face[0]], vertices[face[1]], vertices[face[2]]]
        })

        for (let f = 0; f < mappedPositions.length; f++) {
            const currentFace = mappedPositions[f]
            const currentUV = mappedUVS[f]

            let deltaPositionOne = [],
                deltaPositionTwo = [],
                deltaUVOne = [],
                deltaUVTwo = []

            vec3.sub(deltaPositionOne, currentFace[1], currentFace[0])
            vec3.sub(deltaPositionTwo, currentFace[2], currentFace[0])

            vec2.sub(deltaUVOne, currentUV[1], currentUV[0])
            vec2.sub(deltaUVTwo, currentUV[2], currentUV[0])

            let r = 1 / Math.max(.1,  (deltaUVOne[0] * deltaUVTwo[1] - deltaUVOne[1] * deltaUVTwo[0])),
                tangent = [],
                tangentP1 = [],
                tangentP2 = []

            // TANGENT
            vec3.scale(tangentP1, deltaPositionOne, deltaUVTwo[1])
            vec3.scale(tangentP2, deltaPositionTwo, deltaUVOne[1])
            vec3.sub(tangent, tangentP1, tangentP2)
            vec3.scale(tangent, tangent, r)
            console.log(deltaUVOne, deltaUVTwo, (deltaUVOne[0] * deltaUVTwo[1] - deltaUVOne[1] * deltaUVTwo[0]))
            tangents.push(...tangent)
        }
        return tangents
    }

}