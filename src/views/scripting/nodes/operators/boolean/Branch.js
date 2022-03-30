import Node from "../../../../../components/flow/Node";
import {TYPES} from "../../../../../components/flow/TYPES";
import NODE_TYPES from "../../../../../components/flow/NODE_TYPES";


export default class Branch extends Node {

    constructor() {
        super(
            [
                {label: 'A', key: 'line', accept: [TYPES.EXECUTION]},
                {label: 'Condition', key: 'c', accept: [TYPES.BOOL]}
            ],
            [
                {label: 'True', key: 'a', type: TYPES.EXECUTION},
                {label: 'False', key: 'b', type: TYPES.EXECUTION},
            ],
        );
        this.name = 'Branch'
    }

    get type() {
        return NODE_TYPES.BRANCH
    }

    static compile({c}, obj) {
        return c ? obj.branchA : obj.branchB
    }
}