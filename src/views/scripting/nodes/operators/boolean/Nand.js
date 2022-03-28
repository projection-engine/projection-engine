import Node from "../../../../../components/flow/Node";
import {TYPES} from "../../../../../components/flow/TYPES";
import NODE_TYPES from "../../../../../components/flow/NODE_TYPES";


export default class Nand extends Node {

    constructor() {
        super(
            [
                {label: 'A', key: 'a', accept: [TYPES.ANY]},
                {label: 'B', key: 'b', accept: [TYPES.ANY]}
            ],
            [
                {label: 'Truthful', key: 't', type: TYPES.BOOL}
            ],
            true
        );
        this.name = 'Nand'
    }

    get type (){
        return NODE_TYPES.FUNCTION
    }
    static compile(tick, {a, b}, entity, entities, attr, nodeID) {
        const attributes = {...attr}

        attributes[nodeID] = {}
        attributes[nodeID].t = !(a && b)

        return attributes
    }
}