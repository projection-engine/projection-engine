import AssimpJS from "./assimpjs";
import PrimitiveProcessor from "../../../engine/lib/apis/PrimitiveProcessor";
import FILE_TYPES from "shared-resources/FILE_TYPES";
import createRegistryEntry from "../../utils/create-registry-entry";
import {v4} from "uuid";
import ProjectMap from "../ProjectMap";
import {mat4} from "gl-matrix";

const path = require("path")
const fs = require("fs")

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
        try {
            const collectionDirectory = file.split(path.sep).pop().split(".").shift()
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
            if (!fs.existsSync(dir + path.sep + collectionDirectory))
                fs.mkdirSync(dir + path.sep + collectionDirectory)

            const meshes = {}
            const data = JSON.parse(new TextDecoder().decode(result.GetFile(0).GetContent()))
            const collection = {
                name: collectionDirectory,
                entities: []
            }

            if (!data?.meshes)
                return
            for (let m = 0; m < data.meshes.length; m++)
                await AssimpLoader.#createMesh(dir, meshes, m, data.meshes, collectionDirectory)
            AssimpLoader.#mapChildren(collection.entities, meshes, data.rootnode)

            const collectionPath = path.resolve(dir + path.sep + collectionDirectory + path.sep + collectionDirectory + FILE_TYPES.COLLECTION)
            await fs.promises.writeFile(
                collectionPath,
                JSON.stringify(collection)
            )
            await createRegistryEntry(v4(), collectionPath.replace(ProjectMap.pathToAssets, ''))
        } catch (err) {
            console.error(err)
        }
    }

    static async #createMesh(dir, meshes, index, data, collectionName) {
        const PRIMITIVE_PATH = path.resolve(dir + path.sep + collectionName + path.sep + "primitives")
        const mesh = data[index]
        // if (mesh.materialindex !== undefined)
        //     AssimpLoader.#loadMaterial(data, mesh.materialindex)
        const meshID = v4()
        meshes[index] = meshID

        const indices = mesh.faces.flat(), uvs = mesh.texturecoords[0]
        const b = PrimitiveProcessor.computeBoundingBox(mesh.vertices)
        const jsonText = JSON.stringify({
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
            scaling: [1, 1, 1],
            pivotPoint: [0, 0, 0]
        })
        try {
            if (!fs.existsSync(PRIMITIVE_PATH))
                fs.mkdirSync(PRIMITIVE_PATH)
            const localName = PRIMITIVE_PATH + path.sep + mesh.name + FILE_TYPES.PRIMITIVE
            await fs.promises.writeFile(
                path.resolve(localName),
                jsonText
            );
            await createRegistryEntry(meshID, localName.replace(ProjectMap.pathToAssets, ''))
        } catch (err) {
            console.error(err)
        }
    }

    // static #loadMaterial(data, index) {
    //     const material = data.materials[index]
    //     if (!material)
    //         return
    //     const properties = material.properties
    //     const materialNameProperty = properties.findIndex(v => v.key.match(/^\?mat/) != null)
    //     const mtTemplate = SIMPLE_MATERIAL_UNIFORMS
    //
    //     for (let i = 0; i < properties.length; i++) {
    //         if(i === materialNameProperty)
    //             continue
    //
    //         const current = properties[i]
    //         const name = current.key.split(".").pop()
    //
    //         switch (name){
    //             case "diffuse":
    //
    //         }
    //
    //     }
    // }

    static #mapChildren(collection, meshes, node, parent) {
        if (!node)
            return;
        const nodeID = v4()
        const {transformation, children, name} = node

        const baseTransformationMatrix = Array.from(mat4.transpose([], transformation))
        if (node.meshes)
            for (let i = 0; i < node.meshes.length; i++) {
                const meshID = meshes[node.meshes[i]]
                if (meshID == null)
                    continue
                collection.push({
                    id: nodeID,
                    meshID,
                    baseTransformationMatrix,
                    _rotationQuat: [0, 0, 0, 1],
                    translation: [0, 0, 0],
                    scaling: [1, 1, 1],
                    pivotPoint: [...mat4.getTranslation([], baseTransformationMatrix)],
                    name: name + "-" + i,
                    parent
                })
            }
        else
            collection.push({
                id: nodeID,
                baseTransformationMatrix,
                _rotationQuat: [0, 0, 0, 1],
                translation: [0, 0, 0],
                scaling: [1, 1, 1],
                pivotPoint: [...mat4.getTranslation([], baseTransformationMatrix)],
                name,
                parent
            })

        if (!children)
            return;
        for (let i = 0; i < children.length; i++) {
            const child = children[i]
            AssimpLoader.#mapChildren(collection, meshes, child, nodeID)
        }
    }
}