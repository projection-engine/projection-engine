export default function getPrimitiveIndices(data) {
    const primitive = {...data}
    primitive.attributes = Object.keys(primitive.attributes)
        .map(name => ({
            name,
            index: primitive.attributes[name]
        }))


    const vert = primitive.attributes.find(d => d.name === "POSITION")
    const norm = primitive.attributes.find(d => d.name === "NORMAL")
    const tang = primitive.attributes.find(d => d.name === "TANGENT")
    const uv = primitive.attributes.find(d => d.name === "TEXCOORD_0")

    return {
        indices: primitive.indices,
        vertices: vert ? vert.index : -1,
        tangents: tang ? tang.index : -1,
        normals: norm ? norm.index : -1,
        uvs: uv ? uv.index : -1,
        material: primitive.material
    }

}
