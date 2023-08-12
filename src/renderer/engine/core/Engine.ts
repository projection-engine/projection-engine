import CameraAPI from "./lib/utils/CameraAPI"
import AmbientOcclusionSystem from "./system/AmbientOcclusionSystem"
import ConversionAPI from "./lib/math/ConversionAPI"
import CompositionSystem from "./system/CompositionSystem"
import GPU from "./GPU"
import OShadowsSystem from "./system/OShadowsSystem"
import PhysicsAPI from "./lib/rendering/PhysicsAPI"
import FileSystemAPI from "./lib/utils/FileSystemAPI"
import ScriptsAPI from "./lib/utils/ScriptsAPI"
import UIAPI from "./lib/rendering/UIAPI"
import LightProbe from "./instances/LightProbe"
import DynamicMap from "./resource-libs/DynamicMap"
import LightsAPI from "./lib/utils/LightsAPI"
import SystemManager from "./SystemManager";
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
import {Environment,} from "@engine-core/engine.enum";
import GarbageCollectorSystem from "@engine-core/system/GarbageCollectorSystem";
import PreLoopSystem from "@engine-core/system/PreLoopSystem";

export default class Engine {
    static #development = false
    static #onLevelLoadListeners = new DynamicMap<string, Function>()
    static UILayouts = new Map()
    static isDev = true
    static #environment: number = Environment.DEV
    static #isReady = false
    static #initialized = false

    static get isReady() {
        return Engine.#isReady
    }

    static get developmentMode() {
        return Engine.#development
    }

    static get environment(): number {
        return Engine.#environment
    }

    static set environment(data: number) {
        Engine.isDev = data === Environment.DEV
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
        LightsAPI.get()

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
        systemManager.enableSystem(PreLoopSystem)
        systemManager.enableSystem(GarbageCollectorSystem)
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
        UIAPI.buildUI(GPU.canvas.parentElement)
        await ScriptsAPI.updateAllScripts()
        Engine.environment = Environment.EXECUTION
    }

    static start() {
        if (!SystemManager.getInstance().isRunning && Engine.#isReady)
            SystemManager.getInstance().start()
    }

    static stop() {
        SystemManager.getInstance().stop()
    }
}
