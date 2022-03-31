import Node from "../../../../components/flow/Node";
import COMPONENTS from "../../../../services/engine/templates/COMPONENTS";
import {mat4, quat} from "gl-matrix";
import NODE_TYPES from "../../../../components/flow/NODE_TYPES";
import {TYPES} from "../../../../components/flow/TYPES";

const toDeg = 57.29
export default class SetTransformationRelativeOrigin extends Node {

    constructor() {
        super([
            {label: 'Start', key: 'start', accept: [TYPES.EXECUTION]},
            {label: 'Entity', key: 'entity', accept: [TYPES.ENTITY]},
            {label: 'Translation', key: 't', accept: [TYPES.VEC3]},
            {label: 'Rotation', key: 'r', accept: [TYPES.VEC4, TYPES.VEC3]},
            {label: 'Scale', key: 's', accept: [TYPES.VEC3]},
            {label: 'Origin', key: 'o', accept: [TYPES.VEC3]},

        ], [
            {label: 'Execute', key: 'EXECUTION', type: TYPES.EXECUTION}
        ]);
        this.name = 'SetTransformationRelativeOrigin'
    }

    get type() {
        return NODE_TYPES.VOID_FUNCTION
    }

    static compile(tick, {t, r, s, o, entity}, entities, attributes, nodeID) {
        let rotation = r
        if (r.length === 3)
            rotation = quat.fromEuler([], r[0] * toDeg, r[1] * toDeg, r[2] * toDeg)

        const m = mat4.fromRotationTranslationScaleOrigin([], rotation, t, s, o)

        entity.components[COMPONENTS.TRANSFORM].translation = mat4.getTranslation([], m)
        entity.components[COMPONENTS.TRANSFORM].scaling = mat4.getScaling([], m)
        entity.components[COMPONENTS.TRANSFORM].rotationQuat = mat4.getRotation([], m)

        return attributes
    }
}