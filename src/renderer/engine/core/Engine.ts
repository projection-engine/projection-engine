import CameraAPI from "./lib/utils/CameraAPI"
import ENVIRONMENT from "./static/ENVIRONMENT"
import AmbientOcclusionSystem from "./system/AmbientOcclusionSystem"
import ConversionAPI from "./lib/math/ConversionAPI"
import PhysicsSystem from "./system/PhysicsSystem"
import CompositionSystem from "./system/CompositionSystem"
import GPU from "./GPU"
import OShadowsSystem from "./system/OShadowsSystem"
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
import ResourceGarbageCollector from "./resource-libs/ResourceGarbageCollector"
import LightsAPI from "./lib/utils/LightsAPI"
import {UUID} from "crypto";
import SystemManager from "./SystemManager";
import EntityManager from "./EntityManager";
import PreRendererSystem from "./system/PreRendererSystem";
import ScriptExecutorSystem from "./system/ScriptExecutorSystem";
import DShadowsSystem from "./system/DShadowsSystem";
import VisibilityRendererSystem from "./system/VisibilityRendererSystem";
import AtmosphereRendererSystem from "./system/AtmosphereRendererSystem";
import OpaqueRendererSystem from "./system/OpaqueRendererSystem";
import DecalRendererSystem from "./system/DecalRendererSystem";
import SpriteRenderer from "./system/SpriteRenderer";
import TransparencyRendererSystem from "./system/TransparencyRendererSystem";
import PostRendererSystem from "./system/PostRendererSystem";
import GlobalIlluminationSystem from "./system/GlobalIlluminationSystem";
import ThreadSyncSystem from "./system/ThreadSyncSystem";
import BokehDOFSystem from "./system/BokehDOFSystem";
import MotionBlurSystem from "./system/MotionBlurSystem";
import BloomSystem from "./system/BloomSystem";
import PostProcessingSystem from "./system/PostProcessingSystem";
import EngineState from "./EngineState";


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

    static get entities(): DynamicMap<UUID, Entity> {
        return EntityManager.getInstance().getEntities()
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

    static async initializeContext(
        canvas: HTMLCanvasElement,
        mainResolution: { w: number, h: number } | undefined,
        readAsset: Function,
        devAmbient: boolean
    ) {
        if (Engine.#initialized)
            return
        Engine.#initialized = true

        Engine.#development = devAmbient
        await GPU.initializeContext(canvas, mainResolution)
        FileSystemAPI.initialize(readAsset)
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
        Engine.#startSystems()
        Engine.start()
    }

    static #startSystems() {
        const systemManager = SystemManager.getInstance()
        systemManager.enableSystem(PreRendererSystem)
        systemManager.enableSystem(ScriptExecutorSystem)
        systemManager.enableSystem(DShadowsSystem)
        systemManager.enableSystem(OShadowsSystem)
        systemManager.enableSystem(VisibilityRendererSystem)
        systemManager.enableSystem(AmbientOcclusionSystem)
        systemManager.enableSystem(PreRendererSystem)
        systemManager.enableSystem(AtmosphereRendererSystem)
        systemManager.enableSystem(OpaqueRendererSystem)
        systemManager.enableSystem(DecalRendererSystem)
        systemManager.enableSystem(SpriteRenderer)
        systemManager.enableSystem(TransparencyRendererSystem)
        systemManager.enableSystem(PostRendererSystem)
        systemManager.enableSystem(GlobalIlluminationSystem)
        systemManager.enableSystem(BokehDOFSystem)
        systemManager.enableSystem(MotionBlurSystem)
        systemManager.enableSystem(BloomSystem)
        systemManager.enableSystem(PostProcessingSystem)
        systemManager.enableSystem(CompositionSystem)
        systemManager.enableSystem(ThreadSyncSystem)
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
            PhysicsSystem.start()
            ResourceGarbageCollector.start()
            Engine.#frameID = requestAnimationFrame(Engine.#loop)
        } else
            Engine.#initializationWasTried = true
    }

    static #loop(c) {
        const queue = SystemManager.getExecutionQueue().array
        const queueLength = queue.length
        EngineState.currentTimeStamp = c
        for (let i = 0; i < queueLength; i++) {
            queue[i].execute()
        }
        Engine.#frameID = requestAnimationFrame(Engine.#loop)
    }

    static stop() {
        cancelAnimationFrame(Engine.#frameID)
        Engine.#frameID = undefined
        ResourceGarbageCollector.stop()
        PhysicsSystem.stop()
    }

    static async loadLevel(levelID: UUID, cleanEngine?: boolean) {
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
                levelEntity = EntityAPI.getNewEntityInstance(levelID)
            else
                levelEntity = EntityAPI.parseEntityObject({...entity})
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
}
