import AssimpJS from "./assimp/assimpjs";
import PrimitiveProcessor from "../../engine/production/apis/PrimitiveProcessor";
import resolveFileName from "../utils/resolve-file-name";
import FILE_TYPES from "shared-resources/FILE_TYPES";
import createRegistryEntry from "../utils/create-registry-entry";
import {v4} from "uuid";
import ProjectMap from "./ProjectMap";
import {mat4} from "gl-matrix";


const path = require("path")
const fs = require("fs")
const IDENTITY = Array.from(mat4.create())

export default class AssimpLoader {
    static instance

    static async initialize() {
        AssimpLoader.instance = await AssimpJS()
    }

    static async loader(pathToDir, files) {
        if (!AssimpLoader.instance)
            return
        const dir = path.resolve(pathToDir)
        if (!fs.existsSync(dir))
            fs.mkdirSync(dir)

        for (let j = 0; j < files.length; j++) {
            const buffer = await fs.promises.readFile(files[j])
            await AssimpLoader.#load(dir, files[j], buffer)
        }
    }

    static async #load(dir, file, bufferData) {
        const ajs = AssimpLoader.instance
        const fileList = new ajs.FileList();
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

        AssimpLoader.#mapChildren(data.rootnode, nodes)

        const meshesLoaded = {}
        for (let i = 0; i < nodes.length; i++) {
            const currentNode = nodes[i]
            if (!currentNode.meshes)
                continue
            for (let m = 0; m < currentNode.meshes.length; m++) {
                const meshIndex = currentNode.meshes[m]
                const mesh = data.meshes[meshIndex]
                if (meshesLoaded[`${meshIndex}`] === true || !mesh)
                    continue
                meshesLoaded[`${meshIndex}`] = true

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

                    const localName = resolveFileName(mesh.name, FILE_TYPES.MESH)

                    await fs.promises.writeFile(
                        path.resolve(dir + path.sep + localName),
                        jsonText
                    );
                    await createRegistryEntry(v4(), dir.replace(ProjectMap.pathToAssets, '') + path.sep + localName)
                } catch (err) {
                    console.error(err)
                }
            }
        }
    }

    static #mapChildren(node, nodes, parent = IDENTITY) {
        if (!node)
            return;
        const {transformation, meshes, children, name} = node

        const cache = mat4.multiply(
            [],
            parent,
            mat4.transpose([], transformation)
        )
        nodes.push({
            baseTransformationMatrix: Array.from(cache),
            meshes,
            name
        })
        if (!children)
            return;
        children.forEach(n => {
            AssimpLoader.#mapChildren(n, nodes, cache)
        })
    }
}