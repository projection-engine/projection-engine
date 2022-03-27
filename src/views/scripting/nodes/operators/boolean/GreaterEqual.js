import Node from "../../../../../components/flow/Node";
import {TYPES} from "../../../../../components/flow/TYPES";
import NODE_TYPES from "../../../../../components/flow/NODE_TYPES";


export default class GreaterEqual extends Node {

    constructor() {
        super(
            [
                {label: 'A', key: 'a', accept: [TYPES.ANY]},
                {label: 'B', key: 'b', accept: [TYPES.ANY]}
            ],
            [
                {label: 'Truthful', key: 't', type: TYPES.BOOL}
            ]
        );
        this.name = 'GreaterEqual'
    }

    get type (){
        return NODE_TYPES.FUNCTION
    }
    static compile(tick, {data}, entity, entities, a, nodeID, executors, setExecutors, renderTarget) {
        renderTarget.innerText = JSON.stringify(data)
        return a
    }
}