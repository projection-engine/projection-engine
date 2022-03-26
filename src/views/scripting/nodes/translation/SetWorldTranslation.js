import Node from "../../../../components/flow/Node";
import COMPONENTS from "../../../../services/engine/utils/misc/COMPONENTS";
import {TYPES} from "../../../../components/flow/TYPES";
import NODE_TYPES from "../../../../components/flow/NODE_TYPES";

export default class SetWorldTranslation extends Node {

    constructor() {
        super([

            {label: 'Start', key: 'start', accept: [TYPES.EXECUTION]},
            {label: 'X', key: 'x', accept: [TYPES.NUMBER]},
            {label: 'Y', key: 'y', accept: [TYPES.NUMBER]},
            {label: 'Z', key: 'z', accept: [TYPES.NUMBER]},

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