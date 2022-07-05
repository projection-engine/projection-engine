import {mat4, quat} from "gl-matrix"
import {primitive} from "../utils/getPrimitive"
import PrimitiveProcessor from "./PrimitiveProcessor"
import {v4} from "uuid"
import FILE_TYPES from "../../../static/FILE_TYPES"
import REG_PATH from "../../../static/REG_PATH"
import parseMaterial from "../utils/parseMaterial"
import PREVIEW_PATH from "../../../static/PREVIEW_PATH"

const fs = require("fs")
const path = require("path")

export function getNormalizedName(name) {
    const pName= !name || typeof name !== "string" ? "Scene-" + v4().toString() : name
    return pName.replaceAll(/((\s|<|>|\}|\\|\.|´|`|{|\/|\||\*|\?|'|")+)/g, "_")
}

function getChildren(allNodes, node) {
    const children = []
    if (node.children !== undefined && node.children.length > 0) {
        node.children.forEach(child => {
            children.push(allNodes[child])
        })
    }
    return children.filter(c => c !== undefined)
}

export default class Node {
    data = {}
    children = []
    id = v4().toString()

    constructor(node, allNodes, parentTransform, projectPath) {
        this.projectPath = projectPath
        this.#extractTransformation(node, parentTransform)
        this.#processChildren(allNodes, node)
    }

    #processChildren(allNodes, node) {
        this.children = getChildren(allNodes, node)
            .map(child => new Node(child, allNodes, this.transformationMatrix, this.projectPath))
    }

    #extractTransformation(node, parentTransform) {

        let parsedNode = {
            name: node.name,
            meshIndex: node.mesh,
            scaling: [1, 1, 1],
            rotation: [0, 0, 0],
            translation: [0, 0, 0],
            children: [],
            baseTransformationMatrix: Array.from(mat4.create())
        }
        let transformationMatrix
        if (node.matrix) {
            parsedNode.translation = [0, 0, 0],
            parsedNode.rotationQuat = [0, 0, 0, 1],
            parsedNode.scaling = [1, 1, 1],
            parsedNode.baseTransformationMatrix = Array.from(node.matrix)
            transformationMatrix = node.matrix
        } else {
            let translation = node.translation,
                rotation = node.rotation,
                scale = node.scale

            if (!translation)
                translation = [0, 0, 0]
            if (!scale)
                scale = [1, 1, 1]
            if (!rotation)
                parsedNode.rotationQuat = [0, 0, 0, 1]
            else
                parsedNode.rotationQuat = quat.normalize([], rotation)

            parsedNode.scaling = scale
            parsedNode.translation = translation
            parsedNode.pivotPoint = translation
            transformationMatrix = mat4.fromRotationTranslationScale([], parsedNode.rotationQuat, parsedNode.translation, parsedNode.scaling)
        }

        if (parentTransform) {
            mat4.multiply(
                transformationMatrix,
                parentTransform,
                transformationMatrix
            )
            parsedNode.translation = [0, 0, 0]
            parsedNode.rotationQuat = [0, 0, 0, 1]
            parsedNode.scaling = [1, 1, 1]
            parsedNode.baseTransformationMatrix = Array.from(transformationMatrix)

            parsedNode.pivotPoint = mat4.getTranslation([], parsedNode.baseTransformationMatrix)
        }

        this.data = parsedNode
        this.transformationMatrix = transformationMatrix
    }

    async write(partialPath, meshes, accessors, options, fileSourcePath, materials=[], textures=[], images=[]) {

        const mesh = meshes[this.data.meshIndex]
        if (mesh !== undefined) {
            const primitiveIDs = []
            for(let i =0; i < mesh.primitives.length; i++){
                const p = mesh.primitives[i]
                const primitivePath = partialPath + mesh.name + "-primitive-" + i + FILE_TYPES.MESH
                const primitiveData = primitive(p)
                const regID = v4().toString(),matID= v4().toString()
                const [min, max] = PrimitiveProcessor.computeBoundingBox(accessors[primitiveData.vertices].data)
                const normals = (primitiveData.normals === -1 || primitiveData.normals === undefined) ? PrimitiveProcessor.computeNormals(accessors[primitiveData.indices]?.data, accessors[primitiveData.vertices]?.data) : accessors[primitiveData.normals].data
                const tangents = (primitiveData.tangents === -1 || primitiveData.tangents === undefined) ? PrimitiveProcessor.computeTangents(accessors[primitiveData.indices]?.data, accessors[primitiveData.vertices]?.data, accessors[primitiveData.uvs]?.data, normals) : accessors[primitiveData.tangents].data
                if(p.material !== undefined){
                    const matData = await parseMaterial(fileSourcePath, materials[p.material], textures, images, partialPath, this.projectPath)

                    if(matData)
                        await Node.writeData(partialPath + getNormalizedName(materials[p.material].name) + FILE_TYPES.MATERIAL, matData, matID, this.projectPath)
                }
                primitiveIDs.push(regID)
                await Node.writeData(
                    primitivePath, 
                    {
                        ...this.data,
                        indices: accessors[primitiveData.indices]?.data,
                        vertices: accessors[primitiveData.vertices]?.data,
                        tangents: tangents,
                        normals: normals,
                        uvs: accessors[primitiveData.uvs].data,
                        maxBoundingBox: max,
                        minBoundingBox: min,
                        material: matID
                    }, 
                    regID,
                    this.projectPath
                )
            }
            this.primitives = primitiveIDs
        }
        for (let i in this.children) {
            const child = this.children[i]
            await child.write(partialPath, meshes, accessors, options)
        }
    }

    childNodes() {
        return {
            id: this.id,
            name: this.data.name,
            primitives: this.primitives,
            children: this.children.map(n => {
                return n.childNodes()
            })
        }
    }

    static async writeData(pathName, data, regID, projectPath, preview) {
        await new Promise(resolve => {
            fs.writeFile(
                pathName,
                JSON.stringify(data),
                () => {
                    fs.writeFile(
                        projectPath + path.sep + REG_PATH + path.sep + regID + FILE_TYPES.REGISTRY,
                        JSON.stringify({
                            path: path.resolve(pathName).replace(path.resolve(projectPath + path.sep + "assets") + path.sep, ""),
                            id: regID
                        }),
                        () => {
                            if(preview)
                                fs.writeFile(
                                    projectPath + path.sep + PREVIEW_PATH + path.sep + regID + FILE_TYPES.PREVIEW,
                                    preview,
                                    () => resolve()
                                )
                            else
                                resolve()
                        }
                    )
                }
            )
        })
    }
}