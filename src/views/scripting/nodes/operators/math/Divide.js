import Node from "../../../../../components/flow/Node";
import {TYPES} from "../../../../../components/flow/TYPES";
import NODE_TYPES from "../../../../../components/flow/NODE_TYPES";


export default class Divide extends Node {
    constructor() {
        super([
            {label: 'A', key: 'a', accept: [TYPES.NUMBER]},
            {label: 'B', key: 'b', accept: [TYPES.NUMBER]}
        ], [
            {label: 'Result', key: 'res', type: TYPES.NUMBER}
        ]);
        this.name = 'Divide'
    }

    get type (){
        return NODE_TYPES.FUNCTION
    }
    static compile(tick, {a, b}, entity, entities, attr, nodeID) {
        const attributes = {...attr}
        attributes[nodeID] = {}
        attributes[nodeID].res = a / b
        return attributes
    }
}