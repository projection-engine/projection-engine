import GridSystem from "./icons/GridSystem"
import IconsSystem from "./icons/IconsSystem"
import GizmoSystem from "./gizmo/GizmoSystem"
import SelectedSystem from "./outline/SelectedSystem"
import Engine from "../core/Engine"
import CameraTracker from "./utils/CameraTracker"
import WireframeRenderer from "./outline/WireframeRenderer"
import ENVIRONMENT from "../core/static/ENVIRONMENT"
import LineRenderer from "./icons/LineRenderer"
import Entity from "../core/instances/Entity"
import GPU from "../core/GPU"
import StaticEditorMeshes from "./utils/StaticEditorMeshes"
import StaticEditorShaders from "./utils/StaticEditorShaders"
import StaticFBO from "../core/lib/StaticFBO"
import GizmoState from "./gizmo/util/GizmoState"
import StaticEditorFBO from "./utils/StaticEditorFBO";
import GPUUtil from "../core/utils/GPUUtil";
import ConversionAPI from "../core/lib/math/ConversionAPI";
import EngineToolsState from "./EngineToolsState";

export default class EngineTools {
    static selected: Entity[] = []
    static #initialized = false

    static async initialize() {
        if (EngineTools.#initialized)
            return

        EngineTools.#initialized = true
        StaticEditorShaders.initialize()
        await StaticEditorMeshes.initialize()

        Engine.environment = ENVIRONMENT.DEV
        LineRenderer.initialize()
        StaticEditorFBO.initialize()
    }

    static onMouseMove(event: MouseEvent) {
        EngineToolsState.unconvertedMouseCoordinates[0] = event.clientX
        EngineToolsState.unconvertedMouseCoordinates[1] = event.clientY
    }

    static updateSelectionData(data: string[]) {
        const selected = EngineTools.selected
        for (let i = 0; i < selected.length; i++) {
            const entity = selected[i]
            entity.__isSelected = false
        }

        selected.length = 0
        for (let i = 0; i < data.length; i++) {
            const d = data[i]
            const entity = Engine.entities.get(d)
            if (entity !== undefined) {
                selected.push(entity)
                entity.__isSelected = true
            }
        }

        GizmoState.mainEntity = selected[0]
    }

    static drawIconsToBuffer() {
        GPU.context.disable(GPU.context.DEPTH_TEST)
        StaticFBO.visibility.use()
        StaticEditorShaders.iconToDepth.bind()
        GPUUtil.bind2DTextureForDrawing(StaticEditorShaders.iconToDepthUniforms.image, 0, IconsSystem.iconsTexture)
        IconsSystem.loop(IconsSystem.drawIcon, StaticEditorShaders.iconToDepthUniforms)
        StaticFBO.visibility.stopMapping()
        GPU.context.enable(GPU.context.DEPTH_TEST)
    }

    static #loop() {
        const coords = ConversionAPI.toQuadCoordinates(EngineToolsState.unconvertedMouseCoordinates[0], EngineToolsState.unconvertedMouseCoordinates[1], GPU.internalResolution.w, GPU.internalResolution.h)
        EngineToolsState.mouseCoordinates[0] = coords.x
        EngineToolsState.mouseCoordinates[1] = coords.y
        CameraTracker.updateFrame()
        SelectedSystem.drawToBuffer()
        EngineTools.#setContextState()
        GridSystem.execute()
        WireframeRenderer.execute()
        SelectedSystem.drawSilhouette()
        IconsSystem.execute()
        GizmoSystem.execute()
    }

    static bindSystems() {
        Engine.addSystem("ENGINE_TOOLS_RENDERER", EngineTools.#loop)
    }

    static unbindSystems() {
        Engine.removeSystem("ENGINE_TOOLS_RENDERER")
    }

    static #setContextState() {
        const context = GPU.context
        context.clear(context.DEPTH_BUFFER_BIT)
        context.disable(context.CULL_FACE)
        context.disable(context.DEPTH_TEST)
    }
}
