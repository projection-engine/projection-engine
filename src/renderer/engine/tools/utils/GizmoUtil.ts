import {mat4, quat, vec3} from "gl-matrix"
import EditorEntity from "../EditorEntity"
import GizmoState from "../state/GizmoState"
import AXIS from "../static/AXIS"
import ConversionAPI from "@engine-core/lib/math/ConversionAPI"
import EngineToolsState from "../state/EngineToolsState";
import {Components} from "@engine-core/engine.enum";
import TransformationComponent from "@engine-core/lib/components/TransformationComponent";
import EntityManager from "@engine-core/managers/EntityManager";
import GizmoEntity from "../gizmo/GizmoEntity";
import PickingUtil from "@engine-core/utils/PickingUtil";
import CameraState from "@engine-core/states/CameraState";


export default class GizmoUtil {
    static updateGizmosTransformation(clearState = false) {
        for (let i = 0; i < GizmoState.targetGizmos.length; i++) {
            const gizmo = GizmoState.targetGizmos[i]
            if (clearState)
                gizmo.clearState()
            gizmo.transformGizmo()
        }
    }

    static createTransformationCache(entity: EditorEntity) {
        if (!entity)
            return
        const component = EntityManager.getComponent(entity.id, Components.TRANSFORMATION) as TransformationComponent
        const pivotChanged = EngineToolsState.pivotChanged.get(entity.id);
        if (component != null && (component.changesApplied || !entity.__cacheCenterMatrix || pivotChanged)) {
            const m = !entity.__cacheCenterMatrix ? mat4.create() : entity.__cacheCenterMatrix
            GizmoUtil.#getPivotPointTranslation(entity)

            mat4.fromRotationTranslationScale(m, component.rotationQuaternionFinal, entity.__pivotOffset, [.25, .25, .25])
            entity.__cacheCenterMatrix = m
            if (!entity.__cacheIconMatrix)
                entity.__cacheIconMatrix = mat4.create()
            mat4.copy(entity.__cacheIconMatrix, entity.__cacheCenterMatrix)

            entity.__cacheIconMatrix[12] = component.absoluteTranslation[0]
            entity.__cacheIconMatrix[13] = component.absoluteTranslation[1]
            entity.__cacheIconMatrix[14] = component.absoluteTranslation[2]

            EngineToolsState.pivotChanged.set(entity.id, false)
        }
    }

    static #getPivotPointTranslation(entity: EditorEntity) {
        const component = EntityManager.getComponent(entity.id, Components.TRANSFORMATION) as TransformationComponent
        if (!component)
            return
        const p = component.pivotPoint
        const a = component.absoluteTranslation
        if (!entity.__pivotOffset)
            entity.__pivotOffset = new Float32Array([0, 0, 0])
        vec3.add(<Float32Array>entity.__pivotOffset, a, p)

    }

    static getGizmoEntity(index: number, rotation: vec3, scaling: vec3): GizmoEntity {
        const TO_DEG = 57.29
        const entity = new GizmoEntity()
        const pickID = PickingUtil.getPickerId(index)
        vec3.copy(entity.pickID, <vec3>pickID)
        vec3.copy(<vec3>entity.scaling, scaling)
        quat.fromEuler(<quat>entity.rotationQuaternion, TO_DEG * rotation[0], TO_DEG * rotation[1], TO_DEG * rotation[2])
        quat.normalize(entity.rotationQuaternion, entity.rotationQuaternion)
        mat4.fromRotationTranslationScale(entity.matrix, entity.rotationQuaternion, entity.translation, entity.scaling)
        return entity
    }

    static translateMatrix(entity: GizmoEntity) {
        GizmoUtil.applyTransformation(entity.matrix, entity.rotationQuaternion, entity.translation, entity.scaling)
    }

    static applyTransformation(matrix: mat4 | Float32Array, quaternion: quat | Float32Array, translation: vec3 | Float32Array, scale: vec3 | Float32Array): void {
        const mainEntity = GizmoState.mainEntity
        if (!mainEntity)
            return
        const isRelative = !GizmoState.isGlobal
        if (isRelative) {
            const quatToMultiply = GizmoState.targetRotation
            let cacheVec3 = vec3.create()
            let cacheQuat = quat.create()

            vec3.add(cacheVec3, mainEntity.__pivotOffset, translation)
            quat.multiply(cacheQuat, quatToMultiply, quaternion)
            mat4.fromRotationTranslationScaleOrigin(
                matrix,
                cacheQuat,
                cacheVec3,
                scale,
                translation
            )
            cacheQuat = null
            cacheVec3 = null
        } else {
            matrix[12] += mainEntity.__pivotOffset[0]
            matrix[13] += mainEntity.__pivotOffset[1]
            matrix[14] += mainEntity.__pivotOffset[2]
        }
    }

    static nearestX(num, x) {
        return num === 0 ? 0 : Math.round(num / x) * x
    }

    static assignValueToVector(vecValue: vec3, target: vec3) {
        if (vecValue[0] !== 0) {
            target[0] = vecValue[0]
        }
        if (vecValue[1] !== 0) {
            target[1] = vecValue[1]
        }
        if (vecValue[2] !== 0) {
            target[2] = vecValue[2]
        }
    }

    static mapToScreenMovement(x: number, y: number, scaleVec = false): vec3 {
        if (GizmoState.clickedAxis === AXIS.NONE)
            return [0, 0, 0]
        const distanceFrom = <vec3>CameraState.position
        const scale = vec3.len(distanceFrom)
        const worldCoordinates = ConversionAPI.toWorldCoordinates(x, y)
        if (scaleVec) {
            vec3.scale(worldCoordinates, worldCoordinates, scale)
            vec3.add(worldCoordinates, worldCoordinates, distanceFrom)
        }
        GizmoUtil.#mapToAxis(worldCoordinates)
        return worldCoordinates
    }

    static #mapToAxis(vec: vec3 | Float32Array) {
        switch (GizmoState.clickedAxis) {
            case AXIS.X:
                vec[1] = 0
                vec[2] = 0
                break
            case AXIS.Y:
                vec[0] = 0
                vec[2] = 0
                break
            case AXIS.Z:
                vec[0] = 0
                vec[1] = 0
                break
            case AXIS.XZ:
                vec[1] = 0
                break
            case AXIS.XY:
                vec[2] = 0
                break
            case AXIS.ZY:
                vec[0] = 0
                break
            case AXIS.NONE:
                vec[0] = 0
                vec[1] = 0
                vec[2] = 0
                break
        }
    }

    static callListeners(updateTransformation = true) {
        if (updateTransformation)
            GizmoUtil.updateGizmosTransformation()
        const arr = GizmoState.listeners.array
        for (let i = 0; i < arr.length; i++) {
            arr[i]()
        }
    }

}
