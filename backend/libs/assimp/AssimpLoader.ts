import AssimpJS from "./Assimp.js";
import PrimitiveProcessor from "../../../engine-core/lib/math/PrimitiveProcessor";
import FILE_TYPES from "../../../static/objects/FILE_TYPES";
import createRegistryEntry from "../../utils/create-registry-entry";
import WindowController from "../WindowController";

import {mat4} from "gl-matrix";
import MutableObject from "../../../engine-core/static/MutableObject";
import * as fs from "fs";
import * as path from "path";

const CACHE_MATRIX = new Float32Array(16);

interface NodeType {
    meshes: string[] | undefined,
    transformation: number[],
    children: undefined | NodeType[],
    name: string
}

interface GLTFType {
    meshes: undefined | MutableObject[],
    rootnode: NodeType | undefined
}

export default class AssimpLoader {
    static instance

    static async initialize() {
        // @ts-ignore
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

    static async #load(dir, file, bufferData): Promise<void> {
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

            const meshes: {} = {}
            const data = <GLTFType | undefined>JSON.parse(new TextDecoder().decode(result.GetFile(0).GetContent()))
            const collection = {
                name: collectionDirectory,
                entities: []
            }

            if (!data?.meshes)
                return
            for (let m = 0; m < data.meshes.length; m++)
                await AssimpLoader.#createMesh(dir, meshes, m, data.meshes, collectionDirectory)
            if (data.rootnode)
                AssimpLoader.#mapChildren(collection.entities, meshes, data.rootnode)

            const collectionPath = path.resolve(dir + path.sep + collectionDirectory + path.sep + collectionDirectory + FILE_TYPES.COLLECTION)
            await fs.promises.writeFile(
                collectionPath,
                JSON.stringify(collection)
            )
            await createRegistryEntry(crypto.randomUUID(), collectionPath.replace(WindowController.pathToAssets, ''))
        } catch (err) {
            console.error(err)
        }
    }

    static async #createMesh(dir, meshes, index, data, collectionName): Promise<void> {
        const PRIMITIVE_PATH = path.resolve(dir + path.sep + collectionName + path.sep + "primitives")
        const mesh = data[index]
        const meshID =crypto.randomUUID()
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
            name: mesh.name
        })
        try {
            if (!fs.existsSync(PRIMITIVE_PATH))
                fs.mkdirSync(PRIMITIVE_PATH)
            const localName = PRIMITIVE_PATH + path.sep + mesh.name + FILE_TYPES.PRIMITIVE
            await fs.promises.writeFile(
                path.resolve(localName),
                jsonText
            );
            await createRegistryEntry(meshID, localName.replace(WindowController.pathToAssets, ''))
        } catch (err) {
            console.error(err)
        }
    }

    static #mapChildren(collection, meshes: MutableObject, node: NodeType, parent?: string): undefined {
        if (!node)
            return;
        const nodeID = crypto.randomUUID()
        const {transformation, children, name} = node

        // @ts-ignore
        mat4.transpose(CACHE_MATRIX, transformation)


        const baseTransformationMatrix = Array.from(CACHE_MATRIX)
        if (node.meshes)
            for (let i = 0; i < node.meshes.length; i++) {
                const meshID = meshes[node.meshes[i]]
                if (meshID == null)
                    continue
                collection.push({
                    id: nodeID,
                    meshID,
                    baseTransformationMatrix,
                    name: name + "-" + i,
                    parent
                })
            }
        else
            collection.push({
                id: nodeID,
                baseTransformationMatrix,
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