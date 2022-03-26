import Node from "../../../../components/flow/Node";
import {TYPES} from "../../templates/TYPES";
import NODE_TYPES from "../../templates/NODE_TYPES";
import COMPONENTS from "../../../../services/utils/misc/COMPONENTS";

export default class SetWorldTranslation extends Node {

    constructor() {
        super([

            {label: 'X', key: 'x', accept: [TYPES.NUMBER]},
            {label: 'Y', key: 'y', accept: [TYPES.NUMBER]},
            {label: 'Z', key: 'z', accept: [TYPES.NUMBER]},

            {label: 'Start', key: 'EXECUTION', type: TYPES.EXECUTION},
        ], [
            {label: 'Execute', key: 'EXECUTION', type: TYPES.EXECUTION}
        ]);
        this.name = 'SetWorldTranslation'
    }

    get type() {
        return NODE_TYPES.VOID_FUNCTION
    }

    compile(_, [x, y, z], entity) {
        entity.components[COMPONENTS.TRANSFORM].translation[0] = x
        entity.components[COMPONENTS.TRANSFORM].translation[1] = y
        entity.components[COMPONENTS.TRANSFORM].translation[2] = z

        this.ready = true
    }
}