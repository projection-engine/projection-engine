import bindGizmo from "./bind-gizmo";
import Engine from "../../../../public/engine/Engine";
import CameraTracker from "../../../../public/engine/editor-environment/libs/CameraTracker";
import Wrapper from "../../../../public/engine/editor-environment/services/Wrapper";
import CameraAPI from "../../../../public/engine/api/CameraAPI";
import DirectionalShadows from "../../../../public/engine/runtime/occlusion/DirectionalShadows";
import GridSystem from "../../../../public/engine/editor-environment/services/GridSystem";
import GizmoSystem from "../../../../public/engine/editor-environment/services/GizmoSystem";
import GPUResources from "../../../../public/engine/GPUResources";


export default function updateRenderer(selected, engine, settings) {
    const {executingAnimation} = engine

    CameraTracker.initialize(settings)
    CameraTracker.movementSpeed = settings.camera?.movementSpeed * .1
    CameraTracker.turnSpeed = settings.camera?.turnSpeed * .01
    console.log(settings.camera)
    if(settings.camera) {
        if(settings.camera.smoothing != null)
        CameraAPI.translationSmoothing = settings.camera?.smoothing * .001
        if(settings.camera.rotationSmoothing != null)
        CameraAPI.rotationSmoothing = settings.camera?.rotationSmoothing * .001
    }
    if(executingAnimation) {
        CameraAPI.translationSmoothing = .001
        CameraAPI.rotationSmoothing = .1
    }

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

    GPUResources.internalResolution = {w: settings.resolution[0], h: settings.resolution[1]}
    Engine.updateParams({
        ...settings,
        selected,
        onWrap: executingAnimation ? null : Wrapper,
    })

    bindGizmo(selected, settings)
}