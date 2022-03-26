import Node from "../../../../components/flow/Node";
import COMPONENTS from "../../../../services/engine/utils/misc/COMPONENTS";
import {TYPES} from "../../../../components/flow/TYPES";
import NODE_TYPES from "../../../../components/flow/NODE_TYPES";

export default class GetWorldRotation extends Node {
    constructor() {
        super(
            [{label: 'Start', key: 'start', accept: [TYPES.EXECUTION]}],
            [
                {label: 'Execute', key: 'EXECUTION', type: TYPES.EXECUTION},
                {label: 'Quat', key: 'quat', type: TYPES.VEC4},
                {label: 'Euler', key: 'euler', type: TYPES.VEC3}
            ]);
        this.name = 'GetWorldRotation'
    }

    get type() {
        return NODE_TYPES.FUNCTION
    }

    compile(_, [], entity) {
        this.quat = entity.components[COMPONENTS.TRANSFORM].rotationQuat
        this.euler = entity.components[COMPONENTS.TRANSFORM].rotation

    }
}