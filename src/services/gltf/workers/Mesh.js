import groupInto from "../../engine/utils/groupInto";

export default class Mesh{
    constructor(data) {
        this.data = data
    }
    build(accessors){
        const [min, max] = GLTF.computeBoundingBox(accessors[meshes[m.meshIndex]?.vertices].data)
        return {
                name: m.name,
                data: {
                    ...m,
                    material: meshes[m.meshIndex].material ? materials[meshes[m.meshIndex].material].id : undefined,
                    indices: accessors[meshes[m.meshIndex].indices]?.data,
                    vertices: accessors[meshes[m.meshIndex].vertices]?.data,
                    tangents: accessors[meshes[m.meshIndex].tangents]?.data,
                    normals: accessors[meshes[m.meshIndex].normals]?.data,
                    uvs: accessors[meshes[m.meshIndex].uvs].data,

                    maxBoundingBox: max,
                    minBoundingBox: min,
                }
            }

    }

    _computeBoundingBox(vertices) {
        if (vertices && vertices.length > 0) {
            const toVector = groupInto(3, vertices)
            let min = [], max = []
            for (let i = 0; i < toVector.length; i++) {
                const current = toVector[i]
                if (!min[0] || current[0] < min[0])
                    min[0] = current[0]

                if (!min[1] || current[1] < min[1])
                    min[1] = current[1]

                if (!min[2] || current[2] < min[2])
                    min[2] = current[2]

                if (!max[0] || current[0] > max[0])
                    max[0] = current[0]

                if (!max[1] || current[1] > max[1])
                    max[1] = current[1]

                if (!max[2] || current[2] > max[2])
                    max[2] = current[2]
            }

            return [min, max]

        } else
            return [0, 0]
    }
}