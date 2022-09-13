import bindGizmo from "./bind-gizmo";
import Engine from "../../../../../public/engine/production/Engine";
import CameraTracker from "../../../../../public/engine/editor/libs/CameraTracker";
import ENVIRONMENT from "../../../../../public/engine/static/ENVIRONMENT";
import BundlerAPI from "../../../../../public/engine/production/apis/BundlerAPI";
import Wrapper from "../../../../../public/engine/editor/services/Wrapper";


export default function updateRenderer(selected, engine, settings) {
    const {
        materials,
        entities,
        executingAnimation,

        scripts
    } = engine

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

    Engine.entitiesMap = entities
    CameraTracker.animated = settings.camera?.animated
    CameraTracker.movementSpeed = settings.camera?.movementSpeed
    CameraTracker.scrollSpeed = settings.camera?.scrollSpeed
    CameraTracker.scrollDelay = settings.camera?.scrollDelay
    CameraTracker.turnSpeed = settings.camera?.turnSpeed

    Engine.environment = executingAnimation ? ENVIRONMENT.EXECUTION : ENVIRONMENT.DEV
    if (!executingAnimation)
        CameraTracker.startTracking()
    else
        CameraTracker.stopTracking()
    BundlerAPI.build(
        {
            ...settings,
            selected,
            onWrap: executingAnimation ? null : Wrapper,
        })

    bindGizmo(selected, settings)
    Engine.start()
}