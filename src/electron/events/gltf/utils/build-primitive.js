const FILE_TYPES = require("../../../../static/FILE_TYPES");
const getPrimitive = require("./get-primitive");
const {v4} = require("uuid");
const PrimitiveProcessor = require("../libs/PrimitiveProcessor");
const parseMaterial = require("./parse-material");
const writeData = require("./write-data");
const getNormalizedName = require("./get-normalized-name");


function getName(name, partialPath, index) {
    if (name)
        return partialPath + name + "-" + index + FILE_TYPES.MESH
    return partialPath + "-primitive-" + index + FILE_TYPES.MESH
}

module.exports = async function (attributes) {
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
    const [min, max] = PrimitiveProcessor.computeBoundingBox(accessors[data.vertices]?.data)
    const normals = (data.normals === -1 || data.normals === undefined) ? PrimitiveProcessor.computeNormals(accessors[data.indices]?.data, accessors[data.vertices]?.data) : accessors[data.normals].data
    const tangents = (data.tangents === -1 || data.tangents === undefined) ? PrimitiveProcessor.computeTangents(accessors[data.indices]?.data, accessors[data.vertices]?.data, accessors[data.uvs]?.data, normals) : accessors[data.tangents].data
    primitiveIDs.push(regID)
    await writeData(
        getName(mesh.name, partialPath, index),
        {
            ...node,
            indices: accessors[data.indices]?.data,
            vertices: accessors[data.vertices]?.data,
            tangents: tangents,
            normals: normals,
            uvs: accessors[data.uvs].data,
            maxBoundingBox: max,
            minBoundingBox: min,
            material: materialID
        },
        regID,
        projectPath
    )

}

