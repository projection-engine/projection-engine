import {mat4, quat} from "gl-matrix";

export default function parseNode(node, allNodes, parentTransform) {
    let res = []
    let children = node.children && node.children.length > 0 ? allNodes
            .map((n, index) => {
                if (node.children.includes(index))
                    return {...allNodes[index], index}
                else
                    return undefined
            }).filter(e => e !== undefined)
        :
        []

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

    children = children
        .map(child => parseNode(child, allNodes, transformationMatrix))
        .flat()
    res.push(...children)

    if (node.mesh !== undefined)
        res.push(parsedNode)
    return res
}
