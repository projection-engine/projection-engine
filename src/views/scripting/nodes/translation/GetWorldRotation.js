import Node from "../../../../components/flow/Node";
import {TYPES} from "../../templates/TYPES";
import NODE_TYPES from "../../templates/NODE_TYPES";
import COMPONENTS from "../../../../services/utils/misc/COMPONENTS";

export default class GetWorldRotation extends Node {
    constructor() {
        super(
            [{label: 'Start', key: 'EXECUTION', type: TYPES.EXECUTION},],
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