import bindGizmo from "./bind-gizmo";
import Engine from "../../../../../public/engine/production/Engine";
import CameraTracker from "../../../../../public/engine/editor/libs/CameraTracker";
import Wrapper from "../../../../../public/engine/editor/services/Wrapper";
import CameraAPI from "../../../../../public/engine/production/apis/CameraAPI";
import ShadowMapPass from "../../../../../public/engine/production/passes/rendering/ShadowMapPass";
import {GizmoSystem} from "../../../../../public/engine/editor";
import {GPU} from "../../../../../public/engine/production";


export default function updateRenderer(selected, engine, settings) {
    const {executingAnimation} = engine

    CameraTracker.initialize(settings)

    CameraTracker.animated = settings.camera?.animated
    CameraTracker.movementSpeed = settings.camera?.movementSpeed * .01
    CameraTracker.scrollSpeed = settings.camera?.scrollSpeed * .5
    CameraTracker.turnSpeed = settings.camera?.turnSpeed * .01


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

    GPU.internalResolution = {w: settings.resolution[0], h: settings.resolution[1]}
    Engine.updateParams({
        ...settings,
        selected,
        onWrap: executingAnimation ? null : Wrapper,
    })
    if (!executingAnimation)
        CameraTracker.startTracking()
    bindGizmo(selected, settings)
}