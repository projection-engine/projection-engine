import Node from "../../../../components/flow/Node";
import {TYPES} from "../../../../components/flow/TYPES";
import NODE_TYPES from "../../../../components/flow/NODE_TYPES";


export default class MousePosition extends Node {

    constructor() {
        super(
            [],
            [{label: 'Position', key: 'pos', type: TYPES.VEC2}],
        );
        this.name = 'MousePosition'
    }

    get type() {
        return NODE_TYPES.DATA
    }

    static compile(tick, inputs, entity, entities, attr, nodeID, exec, setExec, rTarget, keys, mousePos) {
        const attributes = {...attr}
        attributes[nodeID] = {}
        attributes[nodeID].pos = mousePos
        return attributes
    }
}