import Node from "../../../../components/flow/Node";
import {TYPES} from "../../../../components/flow/TYPES";
import NODE_TYPES from "../../../../components/flow/NODE_TYPES";


export default class RandomInt extends Node {

    constructor() {
        super([

                {label: 'Max', key: 'max', accept: [TYPES.NUMBER]},
                {label: 'Min', key: 'min', accept: [TYPES.NUMBER]}
            ],
            [{label: 'Number', key: 'num', type: TYPES.NUMBER}]);
        this.name = 'RandomInt'
    }

    get type (){
        return NODE_TYPES.FUNCTION
    }
    static compile(tick, {max, min}, entity, entities, a, nodeID) {
        const attributes = {...a}
        attributes[nodeID] = {}
        attributes[nodeID].num = Math.round(Math.random() * (max - min + 1) + min)
        return attributes

    }
}