import bindGizmo from "./bind-gizmo";
import Engine from "../../../../public/engine/Engine";
import CameraTracker from "../../../../public/engine/editor-environment/libs/CameraTracker";
import Wrapper from "../../../../public/engine/editor-environment/services/Wrapper";
import CameraAPI from "../../../../public/engine/api/CameraAPI";
import DirectionalShadows from "../../../../public/engine/runtime/occlusion/DirectionalShadows";
import GridSystem from "../../../../public/engine/editor-environment/services/GridSystem";
import GizmoSystem from "../../../../public/engine/editor-environment/services/GizmoSystem";
import GPU from "../../../../public/engine/GPU";
import ENVIRONMENT from "../../../../public/engine/static/ENVIRONMENT";
import SHADING_MODELS from "../../../../public/engine/editor-environment/data/SHADING_MODELS";


export default function updateRenderer(selected, engine, settings) {
    const {executingAnimation} = engine
    CameraTracker.initialize(settings)

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
    Engine.updateParams({
        ...settings,
        selected,
        onWrap: executingAnimation ? null : Wrapper,
    }, settings.physicsSimulationStep, settings.physicsSubSteps)

    bindGizmo(selected, settings)
}