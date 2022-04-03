import Node from "../../../../components/flow/Node";
import {TYPES} from "../../../../components/flow/TYPES";
import NODE_TYPES from "../../../../components/flow/NODE_TYPES";

export const startKey = 'start'
export default class Setter extends Node {

    constructor(id, name, type) {
        super(
            [
                {label: 'Start', key: startKey, accept: [TYPES.EXECUTION]},
                {label: 'Value', key: 'value', accept: [type]}
            ],
            [
                {label: 'Execute', key: 'EXECUTION', type: TYPES.EXECUTION},
                {label: 'Value', key: 'value', type: type}
            ]);
        this.id = id
        this.name = name
    }

    get type() {
        return NODE_TYPES.FUNCTION
    }

    static compile(tick, {value}, entities, attributes, nodeID, executors, setExecutors) {

        setExecutors({
            ...executors,
            [nodeID.split('/')[0]]: {
                value
            }
        })
        return attributes
    }
}