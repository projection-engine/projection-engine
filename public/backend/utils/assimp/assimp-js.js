import AssimpJS from "../../libs/assimp/assimpjs";
import PrimitiveProcessor from "../../../engine/production/apis/PrimitiveProcessor";
import resolveFileName from "../resolve-file-name";
import FILE_TYPES from "shared-resources/FILE_TYPES";
import fs from "fs";
import pathRequire from "path";
import createRegistryEntry from "../create-registry-entry";
import {v4} from "uuid";
import ProjectMap from "../../libs/ProjectMap";
import {mat4} from "gl-matrix";

const path = require("path")

export default async function assimpJs(dir, file, bufferData) {
    const ajs = await AssimpJS()
    let fileList = new ajs.FileList();

    const buffer = new Uint8Array(bufferData)
    fileList.AddFile(
        file.split(path.sep).pop(),
        buffer
    )

    const result = ajs.ConvertFileList(fileList, 'assjson');
    if (!result.IsSuccess() || result.FileCount() === 0) {
        console.error(result.GetErrorCode());
        return
    }

    if (!fs.existsSync(dir))
        fs.mkdirSync(dir)
    const nodes = []
    const data = JSON.parse(new TextDecoder().decode(result.GetFile(0).GetContent()))

    mapChildren(data.rootnode, nodes, data.rootnode.transformation)
    const meshesLoaded = {}
    for (let i = 0; i < nodes.length; i++) {
        const currentNode = nodes[i]
        if (!currentNode.meshes)
            continue
        for (let m = 0; m < currentNode.meshes.length; m++) {
            const meshIndex = currentNode.meshes[m]
            const mesh = data.meshes[meshIndex]
            if (meshesLoaded[`${meshIndex}`] === true)
                continue
            meshesLoaded[`${meshIndex}`] = true
            if (!mesh?.texturecoords?.length)
                continue
            console.warn(mesh)
            const indices = mesh.faces.flat(), uvs = mesh.texturecoords[0]
            const b = PrimitiveProcessor.computeBoundingBox(mesh.vertices)
            const jsonText = JSON.stringify({
                ...currentNode,
                indices,
                vertices: mesh.vertices,
                tangents: mesh.tangents ? mesh.tangents : PrimitiveProcessor.computeTangents(indices.flat(), mesh.vertices, uvs, mesh.normals),
                normals: mesh.normals ? mesh.normals : PrimitiveProcessor.computeNormals(indices, mesh.vertices),
                uvs,
                maxBoundingBox: b[1] ? b[1] : [0, 0, 0],
                minBoundingBox: b[0] ? b[0] : [0, 0, 0],
                name: mesh.name,
                _rotationQuat: [0, 0, 0, 1],
                translation: [0, 0, 0],
                scaling: [1, 1, 1]
            })
            try {

                const localName = resolveFileName(`${mesh.name + ' - ' + m}`, FILE_TYPES.MESH)

                await fs.promises.writeFile(
                    pathRequire.resolve(dir + pathRequire.sep + localName),
                    jsonText
                );
                await createRegistryEntry(v4(), dir.replace(ProjectMap.pathToAssets, '') + pathRequire.sep + localName)
            } catch (err) {
                console.error(err)
            }
        }
    }
}

function mapChildren(node, nodes, parent) {
    if (Array.isArray(node?.transformation)) {
        const {transformation, meshes, name} = node

        if (parent)
            mat4.multiply(transformation, parent, transformation)

        nodes.push({
            baseTransformationMatrix: transformation,
            meshes,
            name
        })
    }
    if (!node.children)
        return;
    node.children.forEach(n => {
        mapChildren(n, nodes, node?.transformation)
    })
}