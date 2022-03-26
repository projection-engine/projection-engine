import Node from "../../../../components/flow/Node";
import {TYPES} from "../../templates/TYPES";
import NODE_TYPES from "../../templates/NODE_TYPES";
import COMPONENTS from "../../../../services/utils/misc/COMPONENTS";

export default class GetWorldTranslation extends Node {
    constructor() {
        super(
            [{label: 'Start', key: 'EXECUTION', type: TYPES.EXECUTION},],
            [
            {label: 'Execute', key: 'EXECUTION', type: TYPES.EXECUTION},
            {label: 'Translation', key: 'translation', type: TYPES.VEC3},
            {label: 'X', key: 'x', type: TYPES.VEC3},
            {label: 'Y', key: 'y', type: TYPES.VEC3},
            {label: 'Z', key: 'z', type: TYPES.VEC3}
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