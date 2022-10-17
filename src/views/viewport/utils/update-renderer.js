import bindGizmo from "./bind-gizmo";
import Engine from "../../../../public/engine/production/Engine";
import CameraTracker from "../../../../public/engine/editor/libs/CameraTracker";
import Wrapper from "../../../../public/engine/editor/services/Wrapper";
import CameraAPI from "../../../../public/engine/production/apis/CameraAPI";
import ShadowMapPass from "../../../../public/engine/production/passes/rendering/ShadowMapPass";
import {GizmoSystem} from "../../../../public/engine/editor";
import {GPU} from "../../../../public/engine/production";
import GridSystem from "../../../../public/engine/editor/services/GridSystem";


export default function updateRenderer(selected, engine, settings) {
    const {executingAnimation} = engine

    CameraTracker.initialize(settings)
    CameraTracker.movementSpeed = settings.camera?.movementSpeed * .1
    CameraTracker.turnSpeed = settings.camera?.turnSpeed * .01
    if(settings.camera?.smoothing != null)
        CameraAPI.smoothing = settings.camera?.smoothing * .001
    if(executingAnimation)
        CameraAPI.smoothing = .001
    if (!settings.executingAnimation) {
        CameraAPI.zNear = settings.zNear
        CameraAPI.zFar = settings.zFar
        CameraAPI.fov = settings.fov

        CameraAPI.metadata.distortion = settings.distortion
        CameraAPI.metadata.distortionStrength = settings.distortionStrength
        CameraAPI.metadata.chromaticAberration = settings.chromaticAberration
        CameraAPI.metadata.chromaticAberrationStrength = settings.chromaticAberrationStrength
        CameraAPI.metadata.filmGrain = settings.filmGrain
        CameraAPI.metadata.filmGrainStrength = settings.filmGrainStrength
        CameraAPI.metadata.bloom = settings.bloom
        CameraAPI.metadata.bloomStrength = settings.bloomStrength
        CameraAPI.metadata.bloomThreshold = settings.bloomThreshold
        CameraAPI.metadata.gamma = settings.gamma
        CameraAPI.metadata.exposure = settings.exposure
    }
    GizmoSystem.transformationType = settings.transformationType
    ShadowMapPass.allocateBuffers(settings.shadowAtlasQuantity, settings.shadowMapResolution)

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
    })

    bindGizmo(selected, settings)
}