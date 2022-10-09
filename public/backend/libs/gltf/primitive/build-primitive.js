import FILE_TYPES from "shared-resources/FILE_TYPES";
import PrimitiveProcessor from "../../../../engine/production/apis/PrimitiveProcessor";
import writeData from "../../../utils/gltf/write-data";
import {v4} from "uuid";


function getName(name, partialPath, index) {
    if (name)
        return partialPath + name + "-" + index + FILE_TYPES.MESH
    return partialPath + "-primitive-" + index + FILE_TYPES.MESH
}

export default async function buildPrimitive(attributes) {
    const {
        data,
        mesh,
        partialPath,
        index,
        primitiveIDs,
        accessors,
        node,
        projectPath,
        materialID
    } = attributes
    if (!accessors[data.vertices])
        return
    const regID = v4().toString()
    const [min, max] = PrimitiveProcessor.computeBoundingBox(accessors[data.vertices].data)

    const normals = (data.normals === -1 || data.normals === undefined) ? PrimitiveProcessor.computeNormals(accessors[data.indices]?.data, accessors[data.vertices]?.data, true) : accessors[data.normals]?.data
    const tangents = (data.tangents === -1 || data.tangents === undefined) ? PrimitiveProcessor.computeTangents(accessors[data.indices]?.data, accessors[data.vertices]?.data, accessors[data.uvs]?.data, normals, true) : accessors[data.tangents]?.data
    primitiveIDs.push(regID)

    await writeData(
        getName(mesh.name, partialPath, index),
        {
            ...node,
            indices: accessors[data.indices]?.data,
            vertices: accessors[data.vertices]?.data,
            tangents: tangents,
            normals: normals,
            uvs: accessors[data.uvs]?.data,
            maxBoundingBox: max,
            minBoundingBox: min,
            material: materialID
        },
        regID,
        projectPath
    )

}

