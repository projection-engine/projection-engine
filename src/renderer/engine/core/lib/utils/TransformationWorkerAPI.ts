import CameraAPI from "./CameraAPI"
import {Components, WorkerMessages,} from "@engine-core/engine.enum";
import EntityManager from "@engine-core/EntityManager";
import TransformationComponent from "@engine-core/components/TransformationComponent";

let maxWorkers
let currentActiveWorker = 0
export default class TransformationWorkerAPI {
    static hasChangeBuffer = new Uint8Array(new SharedArrayBuffer(1))

    static #initialized = false
    static #workers = []
    static #cullingMetadata = new Map<EngineEntity, Float32Array>()

    static initialize() {
        if (TransformationWorkerAPI.#initialized)
            return
        TransformationWorkerAPI.#initialized = true
        maxWorkers = Math.max(navigator.hardwareConcurrency - 2, 1)
        for (let i = 0; i < maxWorkers; i++) {
            const currentWorker = new Worker("./entity-worker.js")
            currentWorker.postMessage({
                type: WorkerMessages.INITIALIZE,
                payload: [TransformationWorkerAPI.hasChangeBuffer, CameraAPI.notificationBuffers, CameraAPI.position, i, maxWorkers]
            })
            TransformationWorkerAPI.#workers.push(currentWorker)
        }
        EntityManager.addEventListener("hierarchy-change", () => {
            const ev = {type: WorkerMessages.HIERARCHY_CHANGE, payload: EntityManager.getState()}
            TransformationWorkerAPI.#workers.forEach(w => w.postMessage(ev))
        })
        EntityManager.addEventListener("component-add", ev => {
            const toAdd = []
            ev.all.forEach(e => {
                if (EntityManager.hasComponent(e, Components.TRANSFORMATION) && !this.#cullingMetadata.has(e))
                    toAdd.push(e)
            })
            this.#onCreate({type: "create", all: toAdd})
        })
        EntityManager.addEventListener("component-remove", ev => {
            const toRemove = []
            ev.all.forEach(e => {
                if (!EntityManager.hasComponent(e, Components.TRANSFORMATION))
                    toRemove.push(e)
            })
            this.#onDelete({type: "delete", all: toRemove})
        })
        EntityManager.addEventListener("create", this.#onCreate)
        EntityManager.addEventListener("delete", this.#onDelete)
    }


    static #onCreate(event: EntityListenerEvent<EngineEntity, Components>) {
        const all = []
        event.all.forEach(e => {
            if (EntityManager.hasComponent(e, Components.TRANSFORMATION)) {
                TransformationWorkerAPI.#cullingMetadata.set(e, new Float32Array(new SharedArrayBuffer(24)))
                all.push(e)
            }
        })
        const ev = {type: WorkerMessages.ADD_BLOCK, payload: all.map(this.#getEntityInfo)}
        TransformationWorkerAPI.#workers.forEach(w => w.postMessage(ev))
    }

    static #onDelete(event: EntityListenerEvent<EngineEntity, Components>) {
        const ev = {type: WorkerMessages.REMOVE_ENTITY_BLOCK, payload: event.all}
        event.all.forEach(TransformationWorkerAPI.#cullingMetadata.delete)
        TransformationWorkerAPI.#workers.forEach(w => w.postMessage(ev))
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
            cullingMetadata: <Float32Array>this.getCullingMetadata(entity),
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
        const worker = TransformationWorkerAPI.#workers[currentActiveWorker]
        worker.postMessage(0)
        currentActiveWorker++
    }

    static getCullingMetadata(entity: EngineEntity) {
        return this.#cullingMetadata.get(entity)
    }
}

