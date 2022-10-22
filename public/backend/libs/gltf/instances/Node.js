import buildPrimitive from "../primitive/build-primitive";
import extractTransformations from "../primitive/extract-transformations";
import getNormalizedName from "../utils/get-normalized-name";
import getPrimitive from "../primitive/get-primitive";
import {v4} from "uuid";
import FILE_TYPES from "shared-resources/FILE_TYPES";
import parseMaterial from "../material/parse-material";
import writeData from "../utils/write-data";


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
        const [parsedNode, transformationMatrix] = extractTransformations(node, parentTransform)
        this.data = parsedNode
        this.transformationMatrix = transformationMatrix
    }

    async write(partialPath, meshes, accessors, options, fileSourcePath, materials = [], textures = [], images = []) {
        const mesh = meshes[this.data.meshIndex]
        if (mesh !== undefined) {
            const primitiveIDs = []
            for (let i = 0; i < mesh.primitives.length; i++) {
                const current = mesh.primitives[i]
                const primitiveData = getPrimitive(current)
                const materialID = v4().toString()
                const materialIndex = current.material

                if (materialIndex !== undefined) {
                    const matData = await parseMaterial(
                        fileSourcePath,
                        materials[materialIndex],
                        textures,
                        images,
                        partialPath,
                        this.projectPath,
                        materialIndex
                    )
                    if (matData)
                        await writeData(
                            partialPath + getNormalizedName(materials[materialIndex].name, materialIndex) + FILE_TYPES.SIMPLE_MATERIAL,
                            matData,
                            materialID,
                            this.projectPath
                        )
                }
                await buildPrimitive({
                    data: primitiveData,
                    mesh,
                    partialPath,
                    index: i,
                    primitiveIDs,
                    accessors,
                    node: this.data,
                    projectPath: this.projectPath,
                    materialID
                })
            }
            this.primitives = primitiveIDs
        }
        await Promise.all(this.children.map(child => child.write(partialPath, meshes, accessors, options)))
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
}

