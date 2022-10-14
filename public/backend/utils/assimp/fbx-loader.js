import AssimpJS from "../../libs/assimp/assimpjs";
import {mat4} from "gl-matrix";
import Transformation from "../../../engine/production/apis/math/TransformationAPI";
import PrimitiveProcessor from "../../../engine/production/apis/PrimitiveProcessor";

const fs = require("fs")
export default async function fbxLoader(resolvePath, newRoot, file, options, createRegistryEntry, path) {

    fs.mkdirSync(resolvePath(newRoot))
    const data = await AssimpJS([file])
    let promises = [], nodes = [], rejectedMeshes = []
    mapChildren(data.rootnode, nodes, data.rootnode.transformation)
    for (let i = 0; i < nodes.length; i++) {
        const d = nodes[i]
        if (!d.meshes)
            continue
        for (let m = 0; m < d.meshes.length; m++) {
            const mesh = data.meshes[m]
            if (mesh?.texturecoords?.length > 0) {
                const b = PrimitiveProcessor.computeBoundingBox(mesh.vertices)
                const jsonText = JSON.stringify({
                    indices: mesh.faces.flat(),
                    vertices: mesh.vertices,
                    tangents: PrimitiveProcessor.computeTangents(mesh.faces.flat(), mesh.vertices, mesh.texturecoords[0], mesh.normals),
                    normals: mesh.normals,
                    uvs: mesh.texturecoords[0],
                    maxBoundingBox: b[1] ? b[1] : [0, 0, 0],
                    minBoundingBox: b[0] ? b[0] : [0, 0, 0],
                    name: mesh.name,
                    scaling: file.name.includes('.fbx') ? d.scaling.map(s => s / 100) : d.scaling,
                    rotation: [0, 0, 0],
                    translation: d.translation,
                    rotationQuat: d.rotationQuat
                })
                try{
                    await fs.promises.writeFile(
                        resolvePath(newRoot + `\\${mesh.name + ' - ' + m}.mesh`),
                        jsonText);
                    await createRegistryEntry(undefined, newRoot.replace(path + '\\assets\\', '') + `\\${mesh.name + ' - ' + m}.mesh`)
                }catch (err){
                    console.error(err)
                }
                continue
            }
            if (mesh) {
                rejectedMeshes.push({
                    name: mesh.name,
                    reason: 'No UV data'
                })

            }
        }


    }

    await Promise.all(promises.flat())
    return rejectedMeshes

}

function mapChildren(node, nodes, parent) {
    if (!node?.transformation)
        return
    const {transformation, children, meshes, name} = node

    if (parent)
        mat4.multiply(transformation, parent, transformation)
    const d = Transformation.extractTransformations(transformation)
    nodes.push({
        ...d,
        meshes,
        entityName: name
    })
    if (!children)
        return;
    children.forEach(n => {
        mapChildren(n, nodes, transformation)
    })
}