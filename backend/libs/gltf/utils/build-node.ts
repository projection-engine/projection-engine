import {mat4, quat} from "gl-matrix";
import DataController from "../instances/DataController";
import MutableObject from "../../../../engine-core/static/MutableObject";
import * as crypto from "node:crypto";

export default function buildNode(index, node, sceneMap, primitivesMap) {
    if (!node.children && node.mesh === undefined)
        return;
    const parsedNode = <MutableObject>{
        id: crypto.randomUUID(),
        children: node.children,
        mesh: node.mesh,
        index,
        name: node.name,
        baseTransformationMatrix: []
    }

    if (node.matrix)
        parsedNode.baseTransformationMatrix = node.matrix
    else
        mat4.fromRotationTranslationScale(
            parsedNode.baseTransformationMatrix,
            quat.normalize([0,0,0,0], node.rotation || [0, 0, 0, 1]),
            node.translation || [0, 0, 0],
            node.scale || [1, 1, 1]
        )
    parsedNode.baseTransformationMatrix = Array.from(parsedNode.baseTransformationMatrix)

    sceneMap.entities.push(parsedNode)
    !DataController.glTFHierarchyNodes.get(parsedNode.index) && DataController.glTFHierarchyNodes.set(parsedNode.index, [])
    const m = DataController.glTFHierarchyNodes.get(parsedNode.index)
    m.push(parsedNode)
    if (parsedNode.mesh !== undefined) {
        const primitives = primitivesMap[parsedNode.mesh]
        for (let i = 0; i < primitives.length; i++) {
            const primitiveID = primitives[i]
            if (!primitiveID)
                continue
            if (i > 1) {
                const clone = <MutableObject>{...parsedNode}
                clone.id = crypto.randomUUID()
                clone.meshID = primitiveID
                sceneMap.entities.push(clone)
                m.push(clone)
            } else
                parsedNode.meshID = primitiveID

        }
    }
}
