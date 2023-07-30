import WORKER_MESSAGES from "../../static/WORKER_MESSAGES"
import CameraAPI from "./CameraAPI"
import Entity from "../../instances/Entity"
import QueryAPI from "./QueryAPI"


let maxWorkers
let currentActiveWorker = 0
export default class TransformationWorkerAPI {
	static hasChangeBuffer = new Uint8Array(new SharedArrayBuffer(1))

	static linkedEntities = new Map()
	static #initialized = false
	static #workers = []


	static updateEntityReference(entity:Entity) {
		TransformationWorkerAPI.removeEntity(entity)
		TransformationWorkerAPI.registerEntity(entity)
	}


	static initialize() {
		if (TransformationWorkerAPI.#initialized)
			return
		TransformationWorkerAPI.#initialized = true
		maxWorkers = Math.max(navigator.hardwareConcurrency - 2, 1)
		for (let i = 0; i < maxWorkers; i++) {
			const currentWorker = new Worker("./entity-worker.js")
			currentWorker.postMessage({type: WORKER_MESSAGES.INITIALIZE, payload: [TransformationWorkerAPI.hasChangeBuffer, CameraAPI.notificationBuffers, CameraAPI.position, i, maxWorkers]})
			TransformationWorkerAPI.#workers.push(currentWorker)
		}
	}


	static removeEntity(entity:Entity) {
		if (!entity.hasWorkerBound)
			return
		TransformationWorkerAPI.#workers.forEach(worker => {
			worker.postMessage({type: WORKER_MESSAGES.REMOVE_ENTITY, payload: entity.id})
		})

		TransformationWorkerAPI.linkedEntities.delete(entity.id)
		entity.hasWorkerBound = false
	}


	static removeBlock(entities:Entity[]) {
		const toRemove = []
		for(let i = 0; i < entities.length; i++){
			const entity = entities[i]
			if(entity.hasWorkerBound) {
				toRemove.push(entity.id)
				TransformationWorkerAPI.linkedEntities.delete(entity.id)
				entity.hasWorkerBound = false
			}
		}

		TransformationWorkerAPI.#workers.forEach(worker => {
			worker.postMessage({type: WORKER_MESSAGES.REMOVE_ENTITY_BLOCK, payload: toRemove})
		})
	}
	static #getEntityInfo(entity:Entity): WorkerEntity{
		const parent = QueryAPI.getClosestEntityParent(entity)
		const newEntity = <WorkerEntity> {
			id: entity.id,
			changedBuffer: entity.__changedBuffer,
			previousModelMatrix: entity.previousModelMatrix,
			matrix: <Float32Array>entity.matrix,

			parentMatrix: <Float32Array|undefined>parent?.matrix,
			parentChangedBuffer: <Uint8Array|undefined>parent?.__changedBuffer,
			rotationQuaternion: <Float32Array>entity.rotationQuaternion,
			translation:<Float32Array> entity.translation,
			scaling: <Float32Array>entity.scaling,
			pivotPoint: <Float32Array>entity.pivotPoint,
			baseTransformationMatrix: <Float32Array>entity.baseTransformationMatrix,
			absoluteTranslation: <Float32Array>entity.absoluteTranslation,
			cullingMetadata: <Float32Array>entity.__cullingMetadata,
			rotationType: <Float32Array>entity.rotationType,
			rotationEuler: <Float32Array>entity.rotationEuler,
			rotationQuaternionFinal: <Float32Array>entity.rotationQuaternionFinal,
		}
		entity.changed = true
		entity.hasWorkerBound = true
		return newEntity
	}
	static registerEntity(entity:Entity) {
		if (!TransformationWorkerAPI.#initialized || (entity.hasWorkerBound && TransformationWorkerAPI.linkedEntities.get(entity.id)))
			return
		TransformationWorkerAPI.linkedEntities.set(entity.id, entity)
		TransformationWorkerAPI.#workers.forEach(worker => {
			worker.postMessage({
				type: WORKER_MESSAGES.REGISTER_ENTITY,
				payload: TransformationWorkerAPI.#getEntityInfo(entity)
			})
		})
	}

	static registerBlock(entities:Entity[]) {
		if (!TransformationWorkerAPI.#initialized)
			return
		console.time("BUILDING")
		for (let i = 0; i < entities.length; i++){
			const e = entities[i]
			// TODO - CHECK FOR TRANSFORMATION COMPONENT
			if(e.hasWorkerBound )
				continue
			TransformationWorkerAPI.linkedEntities.set(e.id, e)
			TransformationWorkerAPI.#workers.forEach(worker => {
				worker.postMessage({
					type: WORKER_MESSAGES.REGISTER_ENTITY,
					payload: TransformationWorkerAPI.#getEntityInfo(e)
				})
			})
		}
		console.timeEnd("BUILDING")
	}

	static syncThreads() {
		if (currentActiveWorker >= maxWorkers)
			currentActiveWorker = 0
		const worker = TransformationWorkerAPI.#workers[currentActiveWorker]
		worker.postMessage(0)
		currentActiveWorker++
	}
}

