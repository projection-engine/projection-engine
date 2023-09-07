import {mat4, quat, vec3} from "gl-matrix"
import DynamicMap from "../lib/DynamicMap"
import {TransformationRotationTypes,} from "@engine-core/engine.enum";
import {WorkerMessages,} from "@engine-core/engine.enum";

const MIN_SCALE = 5e-10
const EMPTY_QUATERNION = quat.create()
const cacheDistance = vec3.create()
/**
 * @field controlBuffer {Uint8Array [hasUpdatedItem]} - Transferred array from MovementWorker, will be written to in case of changes to linked entities.
 */
class TransformationPass {
    static targets = new DynamicMap<EngineEntity, WorkerEntity>()
    static childParent = new Map<EngineEntity, EngineEntity>()
    static parentChildren = new Map<EngineEntity, EngineEntity[]>()
    static controlBuffer?: Float32Array
    static cameraPosition?: Float32Array
    static cameraBuffer?: Float32Array
    static #initialized = false
    static index = -1
    static maxWorkers = -1
    static threadEntityOffset = 0
    static threadMaxEntities = 0
    static cache = 0

    static #needsCacheUpdate = new Map<EngineEntity, boolean>()

    static onMessage(event: MessageEvent) {
        if (event.data) {
            const {type, payload} = event.data
            switch (type) {
                case WorkerMessages.INITIALIZE:
                    TransformationPass.initialize(payload)
                    break
                case WorkerMessages.REGISTER_ENTITY:
                    if (TransformationPass.targets.has(payload.id))
                        TransformationPass.targets.delete(payload.id)
                    TransformationPass.targets.set(payload.id, payload)
                    TransformationPass.updateThreadInfo()
                    break
                case WorkerMessages.REMOVE_ENTITY:
                    TransformationPass.targets.delete(payload)
                    TransformationPass.updateThreadInfo()
                    break
                case WorkerMessages.REMOVE_ENTITY_BLOCK:
                    TransformationPass.targets.removeBlock(payload, data => data.id)
                    TransformationPass.updateThreadInfo()
                    break

                case WorkerMessages.ADD_BLOCK:
                    TransformationPass.targets.addBlock(payload, data => data.id)
                    TransformationPass.updateThreadInfo()
                    break
                case WorkerMessages.HIERARCHY_CHANGE:
                    TransformationPass.childParent = payload.childParent
                    TransformationPass.parentChildren = payload.parentChildren
                    TransformationPass.targets.forEach(t => t.changedBuffer[0] = 1)
                    break
            }
        } else
            TransformationPass.execute()
    }

    static initialize([controlBuffer, cameraBuffer, cameraPosition, index, maxWorkers]) {
        if (TransformationPass.#initialized)
            return

        TransformationPass.maxWorkers = maxWorkers
        TransformationPass.index = index
        TransformationPass.cameraPosition = cameraPosition
        TransformationPass.cameraBuffer = cameraBuffer
        TransformationPass.controlBuffer = controlBuffer
        TransformationPass.#initialized = true
    }

    static updateThreadInfo() {
        TransformationPass.threadMaxEntities = Math.ceil(TransformationPass.targets.array.length / TransformationPass.maxWorkers)
        TransformationPass.threadEntityOffset = TransformationPass.index * TransformationPass.threadMaxEntities

    }

    static execute() {
        if (!TransformationPass.#initialized)
            return
        const entities = TransformationPass.targets.array
        const size = entities.length
        const hasToUpdate = TransformationPass.cache === 4
        for (let i = 0; i < size; i++) {
            const entity = entities[i]
            /**
             * Skip if is under change from other thread
             */
            if (entity.changedBuffer[2]) {
                continue
            }
            const parent = this.childParent.get(entity.id)
            const parentEntity = parent ? this.targets.get(parent) : undefined
            if (!entity.changedBuffer[0] && (!parentEntity || !parentEntity.changedBuffer[1])) {
                entity.changedBuffer[1] = 0
                if (this.#needsCacheUpdate.get(entity.id)) {
                    this.#needsCacheUpdate.set(entity.id, false)
                    mat4.copy(entity.previousModelMatrix, entity.matrix)
                }
                continue
            }

            TransformationPass.controlBuffer[0] = 1
            entity.changedBuffer[1] = 1
            TransformationPass.transform(entity, parentEntity)
        }
        TransformationPass.cache++
        if (hasToUpdate) {
            TransformationPass.cache = 0
            for (let i = 0; i < TransformationPass.threadMaxEntities; i++) {
                const entity = entities[i + TransformationPass.threadEntityOffset]
                if (!entity)
                    continue
                if (entity.cullingMetadata != null && (entity.changedBuffer[1] || TransformationPass.cameraBuffer[3])) {
                    const cullingBuffer = entity.cullingMetadata

                    cullingBuffer[0] = vec3.length(vec3.sub(cacheDistance, entity.absoluteTranslation, TransformationPass.cameraPosition))

                    const distanceFromCamera = cullingBuffer[0]
                    const cullingDistance = cullingBuffer[1]
                    const hasDistanceCullingEnabled = cullingBuffer[2]
                    const screenDoorDistance = cullingBuffer[4]

                    cullingBuffer[3] = hasDistanceCullingEnabled && distanceFromCamera > cullingDistance ? 1 : 0

                    cullingBuffer[5] = screenDoorDistance < distanceFromCamera ? 1 : 0
                }
            }
        }
    }

    static transform(entity: WorkerEntity, parentEntity: WorkerEntity | undefined) {
        entity.changedBuffer[2] = 1
        entity.changedBuffer[0] = 0
        const scaling = entity.scaling
        if (scaling[0] === 0)
            scaling[0] = MIN_SCALE
        if (scaling[1] === 0)
            scaling[1] = MIN_SCALE
        if (scaling[2] === 0)
            scaling[2] = MIN_SCALE

        mat4.copy(entity.previousModelMatrix, entity.matrix)
        this.#needsCacheUpdate.set(entity.id, true)
        if (entity.rotationType[0] === TransformationRotationTypes.ROTATION_QUATERNION)
            quat.normalize(entity.rotationQuaternionFinal, entity.rotationQuaternion)

        else {
            quat.copy(entity.rotationQuaternionFinal, EMPTY_QUATERNION)
            switch (entity.rotationType[0]) {
                case TransformationRotationTypes.ROTATION_EULER_XZY:
                    quat.rotateX(entity.rotationQuaternionFinal, entity.rotationQuaternionFinal, entity.rotationEuler[0])
                    quat.rotateY(entity.rotationQuaternionFinal, entity.rotationQuaternionFinal, entity.rotationEuler[1])
                    quat.rotateZ(entity.rotationQuaternionFinal, entity.rotationQuaternionFinal, entity.rotationEuler[2])
                    break
                case TransformationRotationTypes.ROTATION_EULER_XYZ:
                    quat.rotateX(entity.rotationQuaternionFinal, entity.rotationQuaternionFinal, entity.rotationEuler[0])
                    quat.rotateZ(entity.rotationQuaternionFinal, entity.rotationQuaternionFinal, entity.rotationEuler[2])
                    quat.rotateY(entity.rotationQuaternionFinal, entity.rotationQuaternionFinal, entity.rotationEuler[1])
                    break
                case TransformationRotationTypes.ROTATION_EULER_YZX:
                    quat.rotateY(entity.rotationQuaternionFinal, entity.rotationQuaternionFinal, entity.rotationEuler[1])
                    quat.rotateZ(entity.rotationQuaternionFinal, entity.rotationQuaternionFinal, entity.rotationEuler[2])
                    quat.rotateX(entity.rotationQuaternionFinal, entity.rotationQuaternionFinal, entity.rotationEuler[0])
                    break
                case TransformationRotationTypes.ROTATION_EULER_YXZ:
                    quat.rotateY(entity.rotationQuaternionFinal, entity.rotationQuaternionFinal, entity.rotationEuler[1])
                    quat.rotateX(entity.rotationQuaternionFinal, entity.rotationQuaternionFinal, entity.rotationEuler[0])
                    quat.rotateZ(entity.rotationQuaternionFinal, entity.rotationQuaternionFinal, entity.rotationEuler[2])
                    break
                case TransformationRotationTypes.ROTATION_EULER_ZXY:
                    quat.rotateZ(entity.rotationQuaternionFinal, entity.rotationQuaternionFinal, entity.rotationEuler[2])
                    quat.rotateX(entity.rotationQuaternionFinal, entity.rotationQuaternionFinal, entity.rotationEuler[0])
                    quat.rotateY(entity.rotationQuaternionFinal, entity.rotationQuaternionFinal, entity.rotationEuler[1])

                    break
                case TransformationRotationTypes.ROTATION_EULER_ZYX:
                    quat.rotateZ(entity.rotationQuaternionFinal, entity.rotationQuaternionFinal, entity.rotationEuler[2])
                    quat.rotateY(entity.rotationQuaternionFinal, entity.rotationQuaternionFinal, entity.rotationEuler[1])
                    quat.rotateX(entity.rotationQuaternionFinal, entity.rotationQuaternionFinal, entity.rotationEuler[0])
                    break
            }
        }
        mat4.fromRotationTranslationScaleOrigin(entity.matrix, entity.rotationQuaternionFinal, entity.translation, scaling, entity.pivotPoint)
        mat4.multiply(entity.matrix, entity.matrix, entity.baseTransformationMatrix)

        if (parentEntity.matrix)
            mat4.multiply(
                entity.matrix,
                parentEntity.matrix,
                entity.matrix
            )
        entity.absoluteTranslation[0] = entity.matrix[12]
        entity.absoluteTranslation[1] = entity.matrix[13]
        entity.absoluteTranslation[2] = entity.matrix[14]
        entity.changedBuffer[2] = 0
    }
}

self.onmessage = TransformationPass.onMessage
