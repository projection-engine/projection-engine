import bindGizmo from "./bind-gizmo";
import RendererController from "../../../libs/engine/production/controllers/RendererController";
import CameraTracker from "../../../libs/engine/editor/libs/CameraTracker";
import SelectionStore from "../../../stores/SelectionStore";
import {settings} from "../components/Header.svelte";


export default function updateRenderer(selected, engine, settings) {
    const {
        materials,
        entities,
        executingAnimation,

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

    CameraTracker.animated = settings.camera?.animated
    CameraTracker.movementSpeed = settings.camera?.movementSpeed
    CameraTracker.scrollSpeed = settings.camera?.scrollSpeed
    CameraTracker.scrollDelay = settings.camera?.scrollDelay
    CameraTracker.turnSpeed = settings.camera?.turnSpeed

    renderer.updatePackage(
        executingAnimation,
        {selected, ...settings},
        scripts
    )
    bindGizmo(selected, settings)
    renderer.start()
}