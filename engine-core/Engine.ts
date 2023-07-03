import CameraAPI from "./lib/utils/CameraAPI"
import ENVIRONMENT from "./static/ENVIRONMENT"
import Renderer from "./Renderer"
import SSAO from "./runtime/SSAO"
import ConversionAPI from "./lib/math/ConversionAPI"
import Physics from "./runtime/Physics"
import FrameComposition from "./runtime/FrameComposition"
import GPU from "./GPU"
import OmnidirectionalShadows from "./runtime/OmnidirectionalShadows"
import PhysicsAPI from "./lib/rendering/PhysicsAPI"
import FileSystemAPI from "./lib/utils/FileSystemAPI"
import ScriptsAPI from "./lib/utils/ScriptsAPI"
import UIAPI from "./lib/rendering/UIAPI"
import LightProbe from "./instances/LightProbe"
import Entity from "./instances/Entity"
import DynamicMap from "./resource-libs/DynamicMap"
import GPUAPI from "./lib/rendering/GPUAPI"
import EntityAPI from "./lib/utils/EntityAPI"
import ResourceEntityMapper from "./resource-libs/ResourceEntityMapper"
import ResourceManager from "./runtime/ResourceManager"
import LightsAPI from "./lib/utils/LightsAPI"


export default class Engine {
	static #development = false
	static #onLevelLoadListeners = new DynamicMap<string, Function>()
	static UILayouts = new Map()
	static isDev = true
	static #environment: number = ENVIRONMENT.DEV
	static #isReady = false
	static #initializationWasTried = false
	static #initialized = false
	static #loadedLevel: Entity
	static #executionQueue = new DynamicMap<string, Function>()
	static #frameID: number = undefined

	static get isExecuting() {
		return Engine.#frameID !== undefined
	}

	static removeLevelLoaderListener(id: string) {
		Engine.#onLevelLoadListeners.delete(id)
	}

	static addLevelLoaderListener(id: string, callback: Function) {
		Engine.#onLevelLoadListeners.set(id, callback)
	}

	static get entities(): DynamicMap<string, Entity> {
		return ResourceEntityMapper.entities
	}

	static get queryMap(): Map<string, Entity> {
		return ResourceEntityMapper.queryMap
	}

	static get isReady() {
		return Engine.#isReady
	}

	static get loadedLevel(): Entity {
		return Engine.#loadedLevel
	}

	static get developmentMode() {
		return Engine.#development
	}

	static get environment(): number {
		return Engine.#environment
	}

	static set environment(data: number) {
		Engine.isDev = data === ENVIRONMENT.DEV
		Engine.#environment = data
		if (Engine.isDev)
			CameraAPI.updateAspectRatio()
	}

	static async initializeContext(canvas: HTMLCanvasElement, mainResolution: {
        w: number,
        h: number
    } | undefined, readAsset: Function, devAmbient: boolean) {
		if (Engine.#initialized)
			return
		Engine.#initialized = true

		Engine.#development = devAmbient
		await GPU.initializeContext(canvas, mainResolution)
		FileSystemAPI.initialize(readAsset)
		FrameComposition.initialize()
		await SSAO.initialize()
		OmnidirectionalShadows.initialize()
		await PhysicsAPI.initialize()
		LightsAPI.initialize()

		ConversionAPI.canvasBBox = GPU.canvas.getBoundingClientRect()
		const OBS = new ResizeObserver(() => {
			const bBox = GPU.canvas.getBoundingClientRect()
			ConversionAPI.canvasBBox = bBox
			CameraAPI.aspectRatio = bBox.width / bBox.height
			CameraAPI.updateProjection()
		})
		OBS.observe(GPU.canvas.parentElement)
		OBS.observe(GPU.canvas)
		Engine.#isReady = true
		GPU.skylightProbe = new LightProbe(128)
		Engine.addSystem("start", Renderer.loop)
		Engine.start()
	}

	static async startSimulation() {
		Engine.environment = ENVIRONMENT.EXECUTION
		UIAPI.buildUI(GPU.canvas.parentElement)
		const entities = Engine.entities.array
		for (let i = 0; i < entities.length; i++) {
			const current = entities[i]
			PhysicsAPI.registerRigidBody(current)
		}
		await ScriptsAPI.updateAllScripts()
	}

	static start() {

		if (!Engine.isExecuting && Engine.#isReady) {
			Physics.start()
			ResourceManager.start()
			Engine.#frameID = requestAnimationFrame(Engine.#loop)
		} else
			Engine.#initializationWasTried = true
	}

	static #loop(c){
		const queue = Engine.#executionQueue.array
		const queueLength = queue.length
		Renderer.currentTimeStamp = c
		for (let i = 0; i < queueLength; i++){
			queue[i]()
		}
		Engine.#frameID = requestAnimationFrame(Engine.#loop)
	}

	static stop() {
		cancelAnimationFrame(Engine.#frameID)
		Engine.#frameID = undefined
		ResourceManager.stop()
		Physics.stop()
	}

	static async loadLevel(levelID: string, cleanEngine?: boolean) {
		if (!levelID || Engine.#loadedLevel?.id === levelID && !cleanEngine)
			return []
		try {

			if (cleanEngine) {
				GPU.meshes.forEach(m => GPUAPI.destroyMesh(m))
				GPU.textures.forEach(m => GPUAPI.destroyTexture(m.id))
				GPU.materials.clear()
			}

			const asset = await FileSystemAPI.readAsset(levelID)
			const {entities, entity} = JSON.parse(asset)
			let levelEntity
			if (!entity)
				levelEntity = EntityAPI.getNewEntityInstance(levelID, true)
			else
				levelEntity = EntityAPI.parseEntityObject({...entity, isCollection: true})
			if (!levelEntity.name)
				levelEntity.name = "New level"
			levelEntity.parentID = undefined
			Engine.#replaceLevel(levelEntity)
			const allEntities = []
			for (let i = 0; i < entities.length; i++) {
				try {
					const entity = EntityAPI.parseEntityObject(entities[i])

					for (let i = 0; i < entity.scripts.length; i++) {
						await ScriptsAPI.linkScript(entity, entity.scripts[i].id)
					}
					const imgID = entity.spriteComponent?.imageID
					if (imgID) {
						const textures = GPU.textures
						if (!textures.get(imgID))
							await FileSystemAPI.loadTexture(imgID)
					}
					const uiID = entity.uiComponent?.uiLayoutID
					const file = FileSystemAPI.readAsset(uiID)
					if (file)
						Engine.UILayouts.set(uiID, file)
					allEntities.push(entity)
				} catch (err) {
					console.error(err)
				}
			}

			EntityAPI.addGroup(allEntities)
		} catch (err) {
			console.error(err)
		}
		Engine.#onLevelLoadListeners.array.forEach(callback => callback())
	}

	static #replaceLevel(newLevel?: Entity) {
		const oldLevel = Engine.#loadedLevel
		Engine.#loadedLevel = newLevel
		if (oldLevel) {
			EntityAPI.removeEntity(oldLevel)
		}
		if (newLevel)
			EntityAPI.addEntity(newLevel)
	}

	static addSystem(id: string, callback: Function) {
		Engine.#executionQueue.set(id, callback)
	}

	static removeSystem(id: string) {
		Engine.#executionQueue.delete(id)
	}
}
