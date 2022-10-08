import {mat4, quat} from "gl-matrix";

export default function extractTransformations (node, parentTransform){

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
            parsedNode._rotationQuat  = [0, 0, 0, 1],
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
            parsedNode._rotationQuat  = [0, 0, 0, 1]
        else
            parsedNode._rotationQuat  = quat.normalize([], rotation)

        parsedNode.scaling = scale
        parsedNode.translation = translation
        parsedNode.pivotPoint = translation
        transformationMatrix = mat4.fromRotationTranslationScale([], parsedNode._rotationQuat , parsedNode.translation, parsedNode.scaling)
    }

    if (parentTransform) {
        mat4.multiply(
            transformationMatrix,
            parentTransform,
            transformationMatrix
        )
        parsedNode.translation = [0, 0, 0]
        parsedNode._rotationQuat  = [0, 0, 0, 1]
        parsedNode.scaling = [1, 1, 1]
        parsedNode.baseTransformationMatrix = Array.from(transformationMatrix)

        parsedNode.pivotPoint = mat4.getTranslation([], parsedNode.baseTransformationMatrix)
    }

    return [parsedNode, transformationMatrix]
}