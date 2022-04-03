import Node from "../../../../components/flow/Node";
import COMPONENTS from "../../../../services/engine/templates/COMPONENTS";
import {TYPES} from "../../../../components/flow/TYPES";
import NODE_TYPES from "../../../../components/flow/NODE_TYPES";

export default class GetWorldTranslation extends Node {

    constructor() {
        super(
            [
                {label: 'Start', key: 'start', accept: [TYPES.EXECUTION]},
                {label: 'Entity', key: 'entity', accept: [TYPES.ENTITY]}
            ],
            [
                {label: 'Execute', key: 'EXECUTION', type: TYPES.EXECUTION},

                {label: 'X', key: 'x', type: TYPES.NUMBER},
                {label: 'Y', key: 'y', type: TYPES.NUMBER},
                {label: 'Z', key: 'z', type: TYPES.NUMBER}
            ]);
        this.name = 'GetWorldTranslation'
    }

    get type() {
        return NODE_TYPES.FUNCTION
    }

    static compile(tick, {entity}, entities, attributes, nodeID) {

        attributes[nodeID] = {}
        attributes[nodeID].x = entity.components[COMPONENTS.TRANSFORM].translation[0]
        attributes[nodeID].y = entity.components[COMPONENTS.TRANSFORM].translation[1]
        attributes[nodeID].z = entity.components[COMPONENTS.TRANSFORM].translation[2]


        return attributes
    }
}