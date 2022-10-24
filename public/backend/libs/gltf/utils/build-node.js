import {mat4, quat} from "gl-matrix";
import {v4} from "uuid";

const IDENTITY = Array.from(mat4.create())
export default function buildNode(index, allNodes, sceneMap, nodesMap, primitivesMap, node, parentID, primitiveID) {

    if (!primitiveID && node.mesh !== undefined) {
        const meshes = primitivesMap[node.mesh]
        for (let i = 0; i < meshes.length; i++)
            buildNode(undefined, allNodes, sceneMap, nodesMap, primitivesMap, node, parentID, meshes[i])

    }

    if (index !== undefined && nodesMap[index])
        return;
    else if (index !== undefined)
        nodesMap[index] = true

    const ID = v4()
    const parsedNode = {
        id: ID,
        parent: parentID,
        meshID: primitiveID,
        name: node.name,
        scaling: [1, 1, 1],
        _rotationQuat: [0, 0, 0],
        translation: [0, 0, 0],
        baseTransformationMatrix: IDENTITY
    }

    if (node.matrix) {
        parsedNode.translation = [0, 0, 0],
            parsedNode._rotationQuat = [0, 0, 0, 1],
            parsedNode.scaling = [1, 1, 1],
            parsedNode.baseTransformationMatrix = Array.from(node.matrix)
    } else {
        let translation = node.translation,
            rotation = node.rotation,
            scale = node.scale

        if (!translation)
            translation = [0, 0, 0]
        if (!scale)
            scale = [1, 1, 1]
        if (!rotation)
            parsedNode._rotationQuat = [0, 0, 0, 1]
        else
            parsedNode._rotationQuat = quat.normalize([], rotation)

        parsedNode.scaling = scale
        parsedNode.translation = translation
        parsedNode.pivotPoint = translation
    }

    sceneMap.entities.push(parsedNode)
    if (!node.children || primitiveID !== undefined)
        return
    for (let i = 0; i < node.children.length; i++)
        buildNode(node.children[i], allNodes, sceneMap, nodesMap, primitivesMap, allNodes[node.children[i]], ID)
}
