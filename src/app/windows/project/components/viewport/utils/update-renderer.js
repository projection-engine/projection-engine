import bindGizmo from "./bind-gizmo";
import Entity from "../../../libs/engine/production/templates/basic/Entity";
import Movable from "../../../libs/engine/production/templates/basic/Movable";
import Transformation from "../../../libs/engine/production/services/Transformation";
import COMPONENTS from "../../../libs/engine/production/data/COMPONENTS";
import RendererController from "../../../libs/engine/production/RendererController";
import CameraTracker from "../../../libs/engine/editor/libs/CameraTracker";


function getCursor() {
    const entity = new Entity()
    entity.lockedRotation = true
    entity.lockedScaling = true
    entity.transformationMatrix = Transformation.transform(entity.translation, [0, 0, 0, 1], entity.scaling)
    return entity
}

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
    renderer.gizmo = settings.gizmo
    if (!renderer.cursor)
        renderer.cursor = getCursor()

    renderer.updatePackage(
        executingAnimation,
        {selected, ...settings},
        scripts
    )
    bindGizmo(selected, settings)

    renderer.start()
}