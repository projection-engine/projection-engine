import Node from "../../../components/flow/Node";
import {TYPES} from "../../../components/flow/TYPES";
import NODE_TYPES from "../../../components/flow/NODE_TYPES";


export default class Getter extends Node {

    constructor(id, name, type) {
        super([], [{label: 'Value', key: 'value', type: type}]);

        this.id = id
        this.name = name
    }

    get type (){
        return NODE_TYPES.VARIABLE
    }
    static compile(tick, inputs, entity, entities, a, nodeID, executors, setExecutors) {
        const attributes = {...a}
        const id = nodeID.split('/')[0]
        attributes[nodeID] = {}
        attributes[nodeID].value = executors[id].value

        return attributes
    }
}