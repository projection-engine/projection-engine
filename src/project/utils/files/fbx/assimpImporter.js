// import PrimitiveProcessor from "../gltf/workers/PrimitiveProcessor";
import AssimpJS from "../AssimpJS"
import Transformation from "../../../engine/templates/Transformation"
import {mat4} from "gl-matrix"
// import GLTF from "../gltf/GLTF";
import {lzwEncode} from "../functions/lzString"
import FILE_TYPES from "../../../../../public/static/FILE_TYPES"

const {fs} = window.require('fs')
export default function assimpImporter(resolvePath, newRoot, file, options, createRegistryEntry, path, importImage) {
    return new Promise(resolve => {
        fs.mkdir(resolvePath(newRoot), async () => {

            const data = await AssimpJS([file])

            let promises = [], nodes = [], rejectedMeshes = []

            mapChildren(data.rootnode, nodes, data.rootnode.transformation)

            promises.push(...nodes.map(d => {
                if (d.meshes) {

                    return d.meshes.map(m => {
                        const mesh = data.meshes[m]
                        if (mesh && mesh.texturecoords !== undefined && mesh.texturecoords[0] !== undefined) {
                            // const b = GLTF.computeBoundingBox(mesh.vertices)
                            const jsonText = JSON.stringify({
                                indices: mesh.faces.flat(),
                                vertices: mesh.vertices,
                                // tangents: PrimitiveProcessor.computeTangents(mesh.faces.flat(), mesh.vertices, mesh.texturecoords[0], mesh.normals),
                                normals: mesh.normals,
                                uvs: mesh.texturecoords[0],
                                // maxBoundingBox: b[1] ? b[1] : [0, 0, 0],
                                // minBoundingBox: b[0] ? b[0] : [0, 0, 0],
                                name: mesh.name,
                                scaling: file.name.includes('.fbx') ? d.scaling.map(s => s / 100) : d.scaling,
                                rotation: [0, 0, 0],
                                translation: d.translation,
                                rotationQuat: d.rotationQuat
                            })
                            return [
                                new Promise(r => {

                                    fs.writeFile(
                                        resolvePath(newRoot + FileSystem.sep + `${mesh.name + ' - ' + m + FILE_TYPES.MESH}`),
                                        lzwEncode(jsonText),
                                        (err) => {
                                            r()
                                        });
                                }),
                                createRegistryEntry(undefined, newRoot.replace(path + '\\assets\\', '') + FileSystem.sep + `${mesh.name + ' - ' + m + FILE_TYPES.MESH}`)
                            ]
                        } else if (mesh) {
                            rejectedMeshes.push({
                                name: mesh.name,
                                reason: 'No UV data'
                            })
                            return []
                        } else
                            return []
                    })
                }
                return []
            }))
            await Promise.all(promises.flat())
            resolve(rejectedMeshes)
        })
    })
}

function mapChildren(node, nodes, parent) {
    const transform = node.transformation
    if (transform) {
        if (parent)
            mat4.multiply(transform, parent, transform)
        const d = Transformation.extractTransformations(transform)
        nodes.push({
            ...d,
            meshes: node.meshes,
            entityName: node.name
        })

        if (node.children)
            node.children.forEach(n => {
                mapChildren(n, nodes, transform)
            })
    }
}