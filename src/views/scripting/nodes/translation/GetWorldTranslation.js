import Node from "../../../../components/flow/Node";
import COMPONENTS from "../../../../services/engine/utils/misc/COMPONENTS";
import {TYPES} from "../../../../components/flow/TYPES";
import NODE_TYPES from "../../../../components/flow/NODE_TYPES";

export default class GetWorldTranslation extends Node {
    constructor() {
        super(
            [{label: 'Start', key: 'start', accept: [TYPES.EXECUTION]},],
            [
            {label: 'Execute', key: 'EXECUTION', type: TYPES.EXECUTION},

            {label: 'X', key: 'x', type: TYPES.NUMBER},
            {label: 'Y', key: 'y', type: TYPES.NUMBER},
            {label: 'Z', key: 'z', type: TYPES.NUMBER}
        ]);
        this.name = 'GetWorldTranslation'
    }

    get type() {
        return NODE_TYPES.FUNCTION
    }

    compile(_, [], entity) {
        this.translation = entity.components[COMPONENTS.TRANSFORM].translation

        this.x = this.translation[0]
        this.y = this.translation[1]
        this.z = this.translation[2]

        this.ready = true
    }
}