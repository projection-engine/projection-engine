import AbstractSingleton from "@engine-core/AbstractSingleton";
import {glMatrix, quat, vec3} from "gl-matrix";
import GizmoState from "../state/GizmoState";
import TransformationComponent from "@engine-core/lib/components/TransformationComponent";
import {Components, TransformationRotationTypes} from "@engine-core/engine.enum";
import GizmoTransformationType from "../../../../shared/enums/GizmoTransformationType";
import AXIS from "../static/AXIS";
import GizmoUtil from "../utils/GizmoUtil";
import EngineToolsState from "../state/EngineToolsState";

export default class GizmoManager extends AbstractSingleton {
    #currentRotation = vec3.create()
    #currentIncrement = 0
    #hasCloned = false
    #scaleInverseCache = vec3.create()

    static rotate(accelerationX: number, integerMovement: boolean) {
        const instance = GizmoManager.get<GizmoManager>()
        const grid = integerMovement ? 1 : GizmoState.rotationGridSize
        instance.#currentIncrement -= accelerationX
        if (Math.abs(instance.#currentIncrement) < grid) {
            return
        }
        const mappedValue = glMatrix.toRadian(GizmoUtil.nearestX(instance.#currentIncrement, grid))
        instance.#currentIncrement = 0
        switch (GizmoState.clickedAxis) {
            case AXIS.X:
                GizmoManager.#gizmoRotateEntity(mappedValue, 0, 0)
                break
            case AXIS.Y:
                GizmoManager.#gizmoRotateEntity(0, mappedValue, 0)
                break
            case AXIS.Z:
                GizmoManager.#gizmoRotateEntity(0, 0, mappedValue)
                break
        }
        GizmoState.hasTransformationStarted = true
    }

    static setCurrentIncrement(value: number) {
        GizmoManager.get<GizmoManager>().#currentIncrement = value
    }

    static getCurrentRotation() {
        return GizmoManager.get<GizmoManager>().#currentRotation
    }

    static #gizmoRotateEntity(x: number, y: number, z: number) {
        const instance = GizmoManager.get<GizmoManager>()
        if (!GizmoState.mainEntity) {
            return
        }

        const firstEntity = GizmoState.mainEntity.getComponent<TransformationComponent>(Components.TRANSFORMATION)
        if (!firstEntity) {
            return;
        }
        const entities = EngineToolsState.selected
        const SIZE = entities.length
        if (SIZE === 1 && firstEntity.lockedRotation) {
            return
        }
        instance.#currentRotation[0] += x
        instance.#currentRotation[1] += y
        instance.#currentRotation[2] += z

        const quatA = quat.create()
        if (x !== 0)
            quat.rotateX(quatA, quatA, x)
        if (y !== 0)
            quat.rotateY(quatA, quatA, y)
        if (z !== 0)
            quat.rotateZ(quatA, quatA, z)

        const isGlobalRotation = GizmoState.transformationType === GizmoTransformationType.GLOBAL && SIZE === 1
        for (let i = 0; i < SIZE; i++) {
            const target = entities[i].getComponent<TransformationComponent>(Components.TRANSFORMATION)
            if (!target || target.lockedRotation)
                continue

            const isQuaternionRotation = target.rotationType[0] === TransformationRotationTypes.ROTATION_QUATERNION
            if (isQuaternionRotation) {
                if (isGlobalRotation)
                    quat.multiply(target.rotationQuaternion, quatA, target.rotationQuaternion)
                else
                    quat.multiply(target.rotationQuaternion, target.rotationQuaternion, quatA)
            } else {
                target.rotationEuler[0] += x
                target.rotationEuler[1] += y
                target.rotationEuler[2] += z
            }
            target.changed = true
        }
    }


    static translate(movementVec: vec3, integerMovement: boolean, movePivot: boolean, clone: boolean) {
        const instance = GizmoManager.get<GizmoManager>()
        if (!instance.#hasCloned && clone) {
            const clones = EngineToolsState.selected.map(m => m.clone())
            GizmoState.mainEntity = clones[0]
        }
        instance.#hasCloned = clone
        GizmoManager.#gizmoTranslateEntity(movementVec, integerMovement, movePivot)
    }

    static #gizmoTranslateEntity(movementVec: vec3, integerMovement: boolean, movePivot: boolean) {
        if (!GizmoState.mainEntity) {
            return
        }
        const entities = EngineToolsState.selected
        const SIZE = entities.length
        const grid = integerMovement ? 1 : GizmoState.translationGridSize
        const componentRoot = entities[0].getComponent<TransformationComponent>(Components.TRANSFORMATION)
        if (SIZE === 1 && (!componentRoot || componentRoot.lockedTranslation))
            return
        if (!GizmoState.isGlobal)
            vec3.transformQuat(movementVec, movementVec, componentRoot.rotationQuaternionFinal)

        movementVec[0] = GizmoUtil.nearestX(movementVec[0], grid)
        movementVec[1] = GizmoUtil.nearestX(movementVec[1], grid)
        movementVec[2] = GizmoUtil.nearestX(movementVec[2], grid)

        for (let i = 0; i < SIZE; i++) {
            const target = entities[i].getComponent<TransformationComponent>(Components.TRANSFORMATION)
            if (!target || target.lockedTranslation)
                continue
            if (SIZE === 1 && movePivot) {
                GizmoUtil.assignValueToVector(movementVec, target.pivotPoint)
                EngineToolsState.pivotChanged.set(target.entity, true)
                continue
            }
            GizmoUtil.assignValueToVector(movementVec, target._translation)
            target.changed = true
        }


    }

    static setHasCloned(hasCloned: boolean) {
        const instance = GizmoManager.get<GizmoManager>()
        instance.#hasCloned = hasCloned
    }

    static scale(x: number, y: number, integerMovement: boolean, globalMovement: boolean) {
        const instance = GizmoManager.get<GizmoManager>()
        if (!GizmoState.mainEntity)
            return
        const firstEntity = GizmoState.mainEntity.getComponent<TransformationComponent>(Components.TRANSFORMATION)
        if (!firstEntity)
            return;
        const grid = integerMovement ? 1 : GizmoState.scalingGridSize
        const vec = GizmoUtil.mapToScreenMovement(x, y)

        if (!GizmoState.isGlobal)
            vec3.transformQuat(vec, vec, firstEntity.rotationQuaternionFinal)
        vec[0] = GizmoUtil.nearestX(vec[0], grid)
        vec[1] = GizmoUtil.nearestX(vec[1], grid)
        vec[2] = GizmoUtil.nearestX(vec[2], grid)

        const hasToTranslate = GizmoState.isGlobal && globalMovement
        if (hasToTranslate)
            vec3.scale(instance.#scaleInverseCache, vec, -1)
        const entities = EngineToolsState.selected
        const SIZE = entities.length
        if (SIZE === 1 && firstEntity.lockedScaling)
            return
        for (let i = 0; i < SIZE; i++) {
            const target = entities[i].getComponent<TransformationComponent>(Components.TRANSFORMATION)
            if (!target || target.lockedScaling)
                continue
            GizmoUtil.assignValueToVector(vec, target._scaling)
            if (hasToTranslate) {
                vec3.add(target._translation, target._translation, instance.#scaleInverseCache)
            }
            target.changed = true
        }
    }
}
