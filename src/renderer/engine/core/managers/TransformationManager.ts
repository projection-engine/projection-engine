import {Components, WorkerMessages,} from "@engine-core/engine.enum";
import EntityManager from "@engine-core/managers/EntityManager";
import TransformationComponent from "@engine-core/lib/components/TransformationComponent";
import CameraState from "@engine-core/states/CameraState";

let maxWorkers
let currentActiveWorker = 0
export default class TransformationManager {
    static hasChangeBuffer = new Uint8Array(new SharedArrayBuffer(1))
    static #initialized = false
    static #workers = []
    static #cullingMetadata = new Map<EngineEntity, Float32Array>()

    static initialize() {
        if (TransformationManager.#initialized)
            return
        TransformationManager.#initialized = true
        maxWorkers = Math.max(navigator.hardwareConcurrency - 2, 1)
        for (let i = 0; i < maxWorkers; i++) {
            const currentWorker = new Worker("./entity-worker.js")
            currentWorker.postMessage({
                type: WorkerMessages.INITIALIZE,
                payload: [TransformationManager.hasChangeBuffer, CameraState.notificationBuffers, CameraState.position, i, maxWorkers]
            })
            TransformationManager.#workers.push(currentWorker)
        }
        EntityManager.addEventListener("hierarchy-change", () => {
            const ev = {type: WorkerMessages.HIERARCHY_CHANGE, payload: EntityManager.getState()}
            TransformationManager.#workers.forEach(w => w.postMessage(ev))
        })
        EntityManager.addEventListener("component-add", ev => {
            const toAdd = []
            ev.all.forEach(e => {
                if (EntityManager.hasComponent(e, Components.TRANSFORMATION) && !TransformationManager.#cullingMetadata.has(e))
                    toAdd.push(e)
            })
            TransformationManager.#onCreate({type: "create", all: toAdd})
        })
        EntityManager.addEventListener("component-remove", ev => {
            const toRemove = []
            ev.all.forEach(e => {
                if (!EntityManager.hasComponent(e, Components.TRANSFORMATION))
                    toRemove.push(e)
            })
            TransformationManager.#onDelete({type: "delete", all: toRemove})
        })
        EntityManager.addEventListener("create", TransformationManager.#onCreate)
        EntityManager.addEventListener("delete", TransformationManager.#onDelete)
    }


    static #onCreate(event: EntityListenerEvent<EngineEntity, Components>) {
        const all = []
        event.all.forEach(e => {
            if (EntityManager.hasComponent(e, Components.TRANSFORMATION) && EntityManager.hasComponent(e, Components.CULLING)) {
                TransformationManager.#registerEntity(e);
                all.push(e)
            }
        })
        const ev = {type: WorkerMessages.ADD_BLOCK, payload: all.map(TransformationManager.#getEntityInfo)}
        TransformationManager.#workers.forEach(w => w.postMessage(ev))
    }

    static #registerEntity(e: EngineEntity) {
        TransformationManager.#cullingMetadata.set(e, new Float32Array(new SharedArrayBuffer(24)))
    }

    static #onDelete(event: EntityListenerEvent<EngineEntity, Components>) {
        const ev = {type: WorkerMessages.REMOVE_ENTITY_BLOCK, payload: event.all}
        event.all.forEach(TransformationManager.#cullingMetadata.delete)
        TransformationManager.#workers.forEach(w => w.postMessage(ev))
    }

    static #getEntityInfo(entity: EngineEntity): WorkerEntity {
        const transformComp = EntityManager.getComponent<TransformationComponent>(entity, Components.TRANSFORMATION)
        const newEntity = <WorkerEntity>{
            id: entity,
            changedBuffer: transformComp.__changedBuffer,
            previousModelMatrix: transformComp.previousModelMatrix,
            matrix: <Float32Array>transformComp.matrix,

            rotationQuaternion: <Float32Array>transformComp.rotationQuaternion,
            translation: <Float32Array>transformComp.translation,
            scaling: <Float32Array>transformComp.scaling,
            pivotPoint: <Float32Array>transformComp.pivotPoint,
            baseTransformationMatrix: <Float32Array>transformComp.baseTransformationMatrix,
            absoluteTranslation: <Float32Array>transformComp.absoluteTranslation,
            cullingMetadata: <Float32Array>TransformationManager.getCullingMetadata(entity),
            rotationType: <Float32Array>transformComp.rotationType,
            rotationEuler: <Float32Array>transformComp.rotationEuler,
            rotationQuaternionFinal: <Float32Array>transformComp.rotationQuaternionFinal,
        }
        transformComp.changed = true
        transformComp.hasWorkerBound = true
        return newEntity
    }

    static syncThreads() {
        if (currentActiveWorker >= maxWorkers)
            currentActiveWorker = 0
        const worker = TransformationManager.#workers[currentActiveWorker]
        worker.postMessage(0)
        currentActiveWorker++
    }

    static getCullingMetadata(entity: EngineEntity) {
        const map = TransformationManager.#cullingMetadata

        if (!map.has(entity)) {
            TransformationManager.#registerEntity(entity)
        }
        return TransformationManager.#cullingMetadata.get(entity)
    }
}

