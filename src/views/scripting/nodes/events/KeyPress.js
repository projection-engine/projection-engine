import Node from "../../../../components/flow/Node";
import {TYPES} from "../../../../components/flow/TYPES";
import NODE_TYPES from "../../../../components/flow/NODE_TYPES";


export default class keyPressed extends Node {
    tick = 0
    canBeDeleted = true
    constructor() {
        super(
            [],
            [
            {label: 'Pressed', key: 'pressed', type: TYPES.EXECUTION},
            {label: 'Released', key: 'Released', type: TYPES.EXECUTION}
        ]);
        this.name = 'keyPressed'
    }

    get type (){
        return NODE_TYPES.START_POINT
    }
    static compile({c}, obj) {
        return c ? obj.branchA : obj.branchB
    }
}