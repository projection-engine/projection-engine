import Engine from "../../../../public/engine/Engine";
import CameraTracker from "../../../lib/engine-tools/lib/CameraTracker";
import Wrapper from "../../../lib/engine-tools/Wrapper";
import CameraAPI from "../../../../public/engine/lib/utils/CameraAPI";
import DirectionalShadows from "../../../../public/engine/runtime/rendering/DirectionalShadows";
import GridSystem from "../../../lib/engine-tools/runtime/GridSystem";
import GizmoSystem from "../../../lib/engine-tools/runtime/GizmoSystem";
import GPU from "../../../../public/engine/GPU";
import ENVIRONMENT from "../../../../public/engine/static/ENVIRONMENT";
import SHADING_MODELS from "../../../../public/engine/static/SHADING_MODELS";
import Loop from "../../../../public/engine/Loop";
import RotationGizmo from "../../../lib/engine-tools/lib/transformation/RotationGizmo";
import TranslationGizmo from "../../../lib/engine-tools/lib/transformation/TranslationGizmo";
import ScalingGizmo from "../../../lib/engine-tools/lib/transformation/ScalingGizmo";
import GIZMOS from "../../../static/GIZMOS";


export default function updateRenderer(selected, engine, settings) {
    CameraTracker.initialize(settings)
    Wrapper.updateSelectionData(selected)
    RotationGizmo.gridSize = settings.gizmoGrid.rotationGizmo || .001
    TranslationGizmo.gridSize = settings.gizmoGrid.translationGizmo || .001
    ScalingGizmo.gridSize = settings.gizmoGrid.scaleGizmo || .001
    if (Engine.environment === ENVIRONMENT.DEV && !engine.focusedCamera) {
        CameraAPI.trackingEntity = undefined
        if (settings.camera) {
            CameraTracker.movementSpeed = settings.camera.movementSpeed * .1
            CameraTracker.turnSpeed = settings.camera.turnSpeed * .01
            if (settings.camera.smoothing != null)
                CameraAPI.translationSmoothing = settings.camera?.smoothing * .001
            if (settings.camera.rotationSmoothing != null)
                CameraAPI.rotationSmoothing = settings.camera?.rotationSmoothing * .001
        }

        CameraAPI.zNear = settings.zNear
        CameraAPI.zFar = settings.zFar
        CameraAPI.fov = settings.fov

        CameraAPI.metadata.gamma = settings.gamma
        CameraAPI.metadata.exposure = settings.exposure
        CameraAPI.metadata.fxaa = settings.fxaa

        if (settings.shadingModel === SHADING_MODELS.DETAIL)
            CameraAPI.updateMotionBlurState(settings.motionBlurEnabled)
    }
    if (Engine.environment === ENVIRONMENT.DEV)
        Loop.linkToExecutionPipeline(Wrapper.beforeDrawing, Wrapper.duringDrawing, Wrapper.afterDrawing)
    else
        Loop.linkToExecutionPipeline()

    GizmoSystem.transformationType = settings.transformationType
    DirectionalShadows.allocateBuffers(settings.shadowAtlasQuantity, settings.shadowMapResolution)

    if (settings.gizmoGrid.sensitivity != null)
        GizmoSystem.sensitivity = settings.gizmoGrid.sensitivity
    GridSystem.buffer[0] = CameraAPI.metadata.gamma
    GridSystem.buffer[1] = CameraAPI.metadata.exposure
    GridSystem.buffer[2] = CameraAPI.zFar
    GridSystem.buffer[3] = CameraAPI.zNear

    GridSystem.metadataBuffer[0] = settings.gridOpacity
    GridSystem.metadataBuffer[1] = settings.gizmoGrid.translationGizmo
    GridSystem.metadataBuffer[2] = settings.showGridSubdivision ? 1 : 0

    GPU.internalResolution = {w: settings.resolution[0], h: settings.resolution[1]}
    Engine.updateParams(settings, settings.physicsSimulationStep, settings.physicsSubSteps)

    switch (settings.gizmo) {
        case GIZMOS.TRANSLATION:
            GizmoSystem.targetGizmo = GizmoSystem.translationGizmo
            break
        case GIZMOS.ROTATION:
            GizmoSystem.targetGizmo = GizmoSystem.rotationGizmo
            break
        case GIZMOS.SCALE:
            GizmoSystem.targetGizmo = GizmoSystem.scaleGizmo
            break
    }
}