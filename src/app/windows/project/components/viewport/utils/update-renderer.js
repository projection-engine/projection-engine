import bindGizmo from "./bind-gizmo";
import RendererController from "../../../libs/engine/production/controllers/RendererController";
import CameraTracker from "../../../libs/engine/editor/libs/CameraTracker";


export default function updateRenderer( engine, settings) {
    const {
        materials,
        entities,
        executingAnimation,
        selected,
        scripts
    } = engine
    const renderer = window.renderer
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

    RendererController.entitiesMap = entities
    renderer.materials = materials
    CameraTracker.animated = settings.cameraAnimation


    renderer.updatePackage(
        executingAnimation,
        {selected, ...settings},
        scripts
    )
    bindGizmo(selected, settings)

    renderer.start()
}