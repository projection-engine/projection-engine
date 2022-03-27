import Node from "../../../../components/flow/Node";
import COMPONENTS from "../../../../services/engine/templates/COMPONENTS";
import {TYPES} from "../../../../components/flow/TYPES";
import NODE_TYPES from "../../../../components/flow/NODE_TYPES";

export default class GetWorldRotation extends Node {

    constructor() {
        super(
            [
                {label: 'Start', key: 'start', accept: [TYPES.EXECUTION]}
            ],
            [
                {label: 'Execute', key: 'EXECUTION', type: TYPES.EXECUTION},
                {label: 'Quat', key: 'quat', type: TYPES.VEC4},
                {label: 'Euler', key: 'euler', type: TYPES.VEC3}
            ]);
        this.name = 'GetWorldRotation'
    }

    get type() {
        return NODE_TYPES.FUNCTION
    }

    static compile(tick, inputs, entity, entities, a, nodeID) {
        const attributes = {...a}

        attributes[nodeID] = {}
        attributes[nodeID].quat = entity.components[COMPONENTS.TRANSFORM].rotationQuat
        attributes[nodeID].euler = entity.components[COMPONENTS.TRANSFORM].rotation

        return attributes
    }
}