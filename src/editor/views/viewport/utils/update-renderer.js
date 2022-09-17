import bindGizmo from "./bind-gizmo";
import Engine from "../../../../../public/engine/production/Engine";
import CameraTracker from "../../../../../public/engine/editor/libs/CameraTracker";
import ENVIRONMENT from "../../../../../public/engine/static/ENVIRONMENT";
import EntityAPI from "../../../../../public/engine/production/apis/EntityAPI";
import Wrapper from "../../../../../public/engine/editor/services/Wrapper";
import CameraAPI from "../../../../../public/engine/production/apis/camera/CameraAPI";
import ShadowMapPass from "../../../../../public/engine/production/passes/rendering/ShadowMapPass";


export default function updateRenderer(selected, engine, settings) {
    const {executingAnimation} = engine

    if (!CameraTracker.cameraInitialized) {

        CameraTracker.cameraInitialized = true
        if (settings.cameraPosition)
            CameraTracker.centerOn = settings.cameraPosition
        if (typeof settings.yaw === "number")
            CameraTracker.yaw = settings.yaw
        if (typeof settings.pitch === "number")
            CameraTracker.pitch = settings.pitch
        CameraTracker.update()
    }


    CameraTracker.animated = settings.camera?.animated
    CameraTracker.movementSpeed = settings.camera?.movementSpeed
    CameraTracker.scrollSpeed = settings.camera?.scrollSpeed
    CameraTracker.scrollDelay = settings.camera?.scrollDelay
    CameraTracker.turnSpeed = settings.camera?.turnSpeed

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

    ShadowMapPass.allocateBuffers(settings.shadowAtlasQuantity, settings.shadowMapResolution)
    Engine.params = {
        ...settings,
        selected,
        onWrap: executingAnimation ? null : Wrapper,
    }
    if(!executingAnimation)
        CameraTracker.startTracking()
    bindGizmo(selected, settings)
}