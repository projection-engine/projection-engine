import Node from "../../../components/flow/Node";
import {TYPES} from "../templates/TYPES";
import NODE_TYPES from "../templates/NODE_TYPES";
import Transformation from "../../../services/engine/utils/workers/Transformation";

export default class QuaternionToEuler extends Node {
    euler = [0, 0, 0]
    x = 0
    y = 0
    z = 0

    constructor() {
        super(
            [
                {label: 'Quaternion', key: 'q', type: TYPES.VEC4}
            ],
            [
            {label: 'Euler', key: 'euler', type: TYPES.VEC3},
            {label: 'X', key: 'x', type: TYPES.NUMBER},
            {label: 'Y', key: 'y', type: TYPES.NUMBER},
            {label: 'Z', key: 'z', type: TYPES.NUMBER}
        ]);
        this.name = 'QuaternionToEuler'
    }

    get type() {
        return NODE_TYPES.FUNCTION
    }

    compile(_, [quat]) {
        const q = Transformation.getEuler(quat)
        this.euler = q
        this.x = q[0]
        this.y = q[1]
        this.z = q[2]

        this.ready = true
    }
}