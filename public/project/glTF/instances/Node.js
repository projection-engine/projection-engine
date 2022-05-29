import {mat4, quat} from "gl-matrix";
import {primitive} from "../utils/getPrimitive";
import PrimitiveProcessor from "./PrimitiveProcessor";
import {v4} from "uuid";
import FILE_TYPES from "../FILE_TYPES";
import {createDirectory} from "../glTF";
import REG_PATH from "../REG_PATH";
import extractTransformations from "../utils/extractTransformations";

const fs = require('fs')
const path = require('path')

export function getNormalizedName(name) {
    return name.replaceAll(/((\s|<|>|\}|\\|\.|´|`|{|\/|\||\*|\?|'|")+)/g, '_')
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

        const mesh = meshes[this.data.meshIndex]
        if (mesh !== undefined) {
            const primitiveIDs = []
            await Promise.all(mesh.primitives.map((p, i) => {
                const primitivePath = partialPath + mesh.name + '-primitive-' + i + FILE_TYPES.MESH
                const primitiveData = primitive(p)
                const regID = v4().toString()
                const [min, max] = PrimitiveProcessor.computeBoundingBox(accessors[primitiveData.vertices].data)
                const normals = !options.keepNormals || (primitiveData.normals === -1 || primitiveData.normals === undefined) ? PrimitiveProcessor.computeNormals(accessors[primitiveData.indices]?.data, accessors[primitiveData.vertices]?.data) : accessors[primitiveData.normals].data
                const tangents = !options.keepTangents || (primitiveData.tangents === -1 || primitiveData.tangents === undefined) ? PrimitiveProcessor.computeTangents(accessors[primitiveData.indices]?.data, accessors[primitiveData.vertices]?.data, accessors[primitiveData.uvs]?.data, normals) : accessors[primitiveData.tangents].data

                primitiveIDs.push(regID)
                return Node.writeData(primitivePath, {
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

    static async writeData(pathName, data, regID, projectPath) {
        await new Promise(resolve => {
            fs.writeFile(
                pathName,
                JSON.stringify(data),
                (e1) => {
                    fs.writeFile(
                        projectPath + path.sep + REG_PATH + path.sep + regID + FILE_TYPES.REGISTRY,
                        JSON.stringify({
                            path: path.resolve(pathName).replace(path.resolve(projectPath + path.sep + 'assets') + path.sep, ''),
                            id: regID
                        }),
                        (e2) => {
                            resolve()
                        }
                    )
                }
            )
        })
    }
}