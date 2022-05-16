export default function getPrimitives(mesh, materials = []) {
    const primitives = mesh.primitives;

    primitives.forEach(primitive => {
        primitive.attributes = Object.keys(primitive.attributes).map(name => ({
            name,
            index: primitive.attributes[name]
        }))

        if (typeof primitive.material !== "undefined") {
            primitive.material = materials[primitive.material];
        }
    });
    return primitives.map((p, i) => {
        const vert = p.attributes.find(d => d.name === 'POSITION')
        const norm = p.attributes.find(d => d.name === 'NORMAL')
        const tang = p.attributes.find(d => d.name === 'TANGENT')
        const uv = p.attributes.find(d => d.name === 'TEXCOORD_0')

        return {
            name: mesh.name + '_' + i,
            indices: p.indices,
            vertices: vert ? vert.index : -1,
            tangents: tang ? tang.index : -1,
            normals: norm ? norm.index : -1,
            uvs: uv ? uv.index : -1,
            material: p.material
        }
    })
}


export function primitive(p, materials = []) {
    const primitive = {...p}
    primitive.attributes = Object.keys(primitive.attributes).map(name => ({
        name,
        index: primitive.attributes[name]
    }))

    if (typeof primitive.material !== "undefined") {
        primitive.material = materials[primitive.material];
    }


    const vert = primitive.attributes.find(d => d.name === 'POSITION')
    const norm = primitive.attributes.find(d => d.name === 'NORMAL')
    const tang = primitive.attributes.find(d => d.name === 'TANGENT')
    const uv = primitive.attributes.find(d => d.name === 'TEXCOORD_0')

    return {
        indices: primitive.indices,
        vertices: vert ? vert.index : -1,
        tangents: tang ? tang.index : -1,
        normals: norm ? norm.index : -1,
        uvs: uv ? uv.index : -1,
        material: primitive.material
    }

}
