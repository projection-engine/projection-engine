import CameraManager from "./managers/CameraManager"
import AmbientOcclusionSystem from "./system/AmbientOcclusionSystem"
import ConversionAPI from "./lib/math/ConversionAPI"
import CompositionSystem from "./system/CompositionSystem"
import GPUState from "./states/GPUState"
import OShadowsSystem from "./system/OShadowsSystem"
import PhysicsManager from "./managers/PhysicsManager"
import EngineFileSystemManager from "./managers/EngineFileSystemManager"
import ScriptsManager from "./managers/ScriptsManager"
import UIManager from "./managers/UIManager"
import LightProbe from "@engine-core/lib/resources/LightProbe"
import LightsManager from "./managers/LightsManager"
import SystemManager from "./managers/SystemManager";
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
import GPUManager from "@engine-core/managers/GPUManager";
import TerrainRendererSystem from "@engine-core/system/TerrainRendererSystem";
import CameraState from "@engine-core/states/CameraState";
import PhysicsSystem from "@engine-core/system/PhysicsSystem";
import Framebuffer from "@engine-core/lib/resources/Framebuffer";
import Shader from "@engine-core/lib/resources/Shader";
import StaticMeshesState from "@engine-core/states/StaticMeshesState";
import EngineState from "@engine-core/states/EngineState";
import QUADVert from "@engine-core/shaders/QUAD.vert";
import BRDF_GENFrag from "@engine-core/shaders/BRDF_GEN.frag";

export default class Engine {
    static UILayouts = new Map()
    static isDev = true
    static #environment: number = Environment.DEV

    static get environment(): number {
        return Engine.#environment
    }

    static set environment(data: number) {
        Engine.isDev = data === Environment.DEV
        Engine.#environment = data
        if (Engine.isDev)
            CameraManager.updateAspectRatio()
    }

    static #isReady = false
    static #initialized = false

    static get isReady() {
        return Engine.#isReady
    }



    static async initializeContext(
        canvas: HTMLCanvasElement,
        mainResolution: { w: number, h: number } | undefined,
        readAsset: GenericNonVoidFunctionWithP<string, Promise<string>>,
        devAmbient: boolean
    ) {
        if (Engine.#initialized)
            return
        Engine.#initialized = true

        EngineState.developmentMode = devAmbient
        await GPUManager.initializeContext(canvas, mainResolution)
        Engine.#generateBRDF();
        EngineFileSystemManager.initialize(readAsset)
        await PhysicsManager.initialize()
        LightsManager.get()

        ConversionAPI.canvasBBox = GPUState.canvas.getBoundingClientRect()
        const OBS = new ResizeObserver(() => {
            const bBox = GPUState.canvas.getBoundingClientRect()
            ConversionAPI.canvasBBox = bBox
            CameraState.aspectRatio = bBox.width / bBox.height
            CameraManager.updateProjection()
        })
        OBS.observe(GPUState.canvas.parentElement)
        OBS.observe(GPUState.canvas)
        Engine.#isReady = true
        GPUState.skylightProbe = new LightProbe(128)
        Engine.#startSystems()
    }

    static #generateBRDF() {
        const FBO = new Framebuffer(512, 512).texture({precision: GPUState.context.RG32F, format: GPUState.context.RG})
        const brdfShader = new Shader(QUADVert, BRDF_GENFrag)

        FBO.startMapping()
        brdfShader.bind()
        StaticMeshesState.drawQuad()
        FBO.stopMapping()
        GPUState.BRDF = FBO.colors[0]
        GPUState.context.deleteProgram(brdfShader.program)
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
        systemManager.enableSystem(TerrainRendererSystem)
        systemManager.enableSystem(OpaqueRendererSystem)
        systemManager.enableSystem(DecalRendererSystem)
        systemManager.enableSystem(SpriteRenderer)
        systemManager.enableSystem(PostRendererSystem)
        systemManager.enableSystem(TransparencyRendererSystem)

        systemManager.enableSystem(GlobalIlluminationSystem)
        systemManager.enableSystem(BokehDOFSystem)
        systemManager.enableSystem(MotionBlurSystem)
        systemManager.enableSystem(BloomSystem)
        systemManager.enableSystem(PostProcessingSystem)
        systemManager.enableSystem(CompositionSystem)
        systemManager.enableSystem(ThreadSyncSystem)
    }

    static async startSimulation() {
        UIManager.buildUI(GPUState.canvas.parentElement)
        await ScriptsManager.updateAllScripts()
        Engine.environment = Environment.EXECUTION
    }

    static start() {
        if (!SystemManager.getInstance().isRunning() && Engine.#isReady) {
            SystemManager.getInstance().start()
            PhysicsSystem.start()
        }
    }

    static stop() {
        SystemManager.getInstance().stop()
        PhysicsSystem.stop()
    }
}
