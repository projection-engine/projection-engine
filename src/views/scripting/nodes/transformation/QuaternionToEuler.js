import Node from "../../../../components/flow/Node";
import Transformation from "../../../../services/engine/utils/workers/Transformation";
import {TYPES} from "../../../../components/flow/TYPES";
import NODE_TYPES from "../../../../components/flow/NODE_TYPES";

export default class QuaternionToEuler extends Node {
    euler = [0, 0, 0]
    x = 0
    y = 0
    z = 0
    constructor() {
        super(
            [
                {label: 'Quaternion', key: 'q', accept: [TYPES.VEC4]}
            ],
            [
            {label: 'Euler', key: 'euler', type: TYPES.VEC3},
            {label: 'X', key: 'x', type: TYPES.NUMBER},
            {label: 'Y', key: 'y', type: TYPES.NUMBER},
            {label: 'Z', key: 'z', type: TYPES.NUMBER}
        ]);
        this.name = 'QuaternionToEuler'
    }

    get type() {
        return NODE_TYPES.FUNCTION
    }
    static compile(tick, {quat}, entity, entities, a, nodeID) {
        const attributes = {...a}
        attributes[nodeID] = {}
        const q = Transformation.getEuler(quat)
        attributes[nodeID].euler = q
        attributes[nodeID].x = q[0]
        attributes[nodeID].y = q[1]
        attributes[nodeID].z = q[2]

        return attributes

    }
}