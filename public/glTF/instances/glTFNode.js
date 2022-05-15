import {mat4, quat} from "gl-matrix";
import {primitive} from "../utils/getPrimitive";
import PrimitiveProcessor from "./PrimitiveProcessor";
import {v4} from "uuid";
import FILE_TYPES from "../FILE_TYPES";
import {createDirectory} from "../glTF";
import REG_PATH from "../REG_PATH";

const fs = require('fs')
const path = require('path')

export function getNormalizedName(name) {
    return name.replaceAll(/((\s|<|>|\}|\\|\.|´|`|{|\/|\||\*|\?|'|")+)/g, '_')
}

function getChildren(allNodes, node) {
    return node.children && node.children.length > 0 ? allNodes
            .map((n, index) => {
                if (node.children.includes(index))
                    return {...allNodes[index], index}
                else
                    return undefined
            }).filter(e => e !== undefined)
        :
        []
}

export default class glTFNode {
    data = {}
    children = []
    id = v4().toString()

    constructor(node, allNodes, parentTransform, projectPath) {
        this.#processChildren(allNodes, node)
        this.#extractTransformation(node, parentTransform)

        this.projectPath = projectPath
    }

    #processChildren(allNodes, node) {
        this.children = getChildren(allNodes, node)
            .map(child => new glTFNode(allNodes, child, this.transformationMatrix, this.projectPath))
            .flat()
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
            parsedNode = {
                ...parsedNode,
                translation: [0, 0, 0],
                rotationQuat: [0, 0, 0, 1],
                scaling: [1, 1, 1],
                baseTransformationMatrix: Array.from(node.matrix)
            }

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
            transformationMatrix = mat4.fromRotationTranslationScale([], parsedNode.rotationQuat, parsedNode.translation, parsedNode.scaling)
        }

        if (parentTransform) {
            mat4.multiply(
                transformationMatrix,
                parentTransform,
                transformationMatrix
            )

            parsedNode = {
                ...parsedNode,
                translation: [0, 0, 0],
                rotationQuat: [0, 0, 0, 1],
                scaling: [1, 1, 1],
                baseTransformationMatrix: Array.from(transformationMatrix)
            }
        }
        this.data = parsedNode
        this.transformationMatrix = transformationMatrix
    }

    async write(partialPath, meshes, accessors, options) {

        if (meshes[this.data.meshIndex] !== undefined) {
            const mesh = meshes[this.data.meshIndex]
            const primitiveIDs = []
            createDirectory(partialPath + getNormalizedName(mesh.name))
            await Promise.all(mesh.primitives.map((p, i) => {
                const primitivePath = partialPath + getNormalizedName(mesh.name) + path.sep + 'primitive-' + i + FILE_TYPES.MESH
                const primitiveData = primitive(p)
                const regID = v4().toString()
                const [min, max] = PrimitiveProcessor.computeBoundingBox(accessors[primitiveData.vertices].data)
                const normals = !options.keepNormals || (primitiveData.normals === -1 || primitiveData.normals === undefined) ? PrimitiveProcessor.computeNormals(accessors[primitiveData.indices]?.data, accessors[primitiveData.vertices]?.data) : accessors[primitiveData.normals].data
                const tangents = !options.keepTangents || (primitiveData.tangents === -1 || primitiveData.tangents === undefined) ? PrimitiveProcessor.computeTangents(accessors[primitiveData.indices]?.data, accessors[primitiveData.vertices]?.data, accessors[primitiveData.uvs]?.data, normals) : accessors[primitiveData.tangents].data

                primitiveIDs.push(regID)
                return glTFNode.writeData(primitivePath, {
                    ...this.data,
                    indices: accessors[primitiveData.indices]?.data,
                    vertices: accessors[primitiveData.vertices]?.data,
                    tangents: tangents,
                    normals: normals,
                    uvs: accessors[primitiveData.uvs].data,
                    maxBoundingBox: max,
                    minBoundingBox: min,

                }, regID, this.projectPath)
            }))
            await glTFNode.writeData(partialPath + getNormalizedName(mesh.name) + FILE_TYPES.MESH_WRAP, {
                name: mesh.name,
                primitives: primitiveIDs
            }, this.id, this.projectPath)
        }
        await Promise.all(this.children.map(c => c.write(partialPath, meshes, accessors, options)))
    }

    getChildren() {
        const names = this.children.map(c => c.getChildren())
        return [this.id, ...(names.flat())].flat()
    }

    static async writeData(pathName, data, regID, projectPath) {
        await new Promise(resolve => {
            fs.writeFile(
                pathName,
                JSON.stringify(data),
                (e1) => {
                    fs.writeFile(
                        projectPath + path.sep + REG_PATH + path.sep + regID + FILE_TYPES.REGISTRY,
                        JSON.stringify({
                            path: path.resolve(pathName).replace(path.resolve(projectPath + '\\assets') + path.sep, ''),
                            id: regID
                        }),
                        (e2) => {
                            console.log(e2)
                            resolve()
                        }
                    )
                }
            )
        })
    }
}