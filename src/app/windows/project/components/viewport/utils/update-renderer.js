import bindGizmo from "./bind-gizmo";
import Entity from "../../../libs/engine/templates/basic/Entity";
import TransformComponent from "../../../libs/engine/templates/components/TransformComponent";
import Transformation from "../../../libs/engine/services/Transformation";
import COMPONENTS from "../../../libs/engine/data/COMPONENTS";
import RendererController from "../../../libs/engine/RendererController";
import CameraTracker from "../../../libs/engine-extension/libs/CameraTracker";


function getCursor() {
    const entity = new Entity()
    const t = new TransformComponent()
    t.lockedRotation = true
    t.lockedScaling = true
    t.transformationMatrix = Transformation.transform(t.translation, [0, 0, 0, 1], t.scaling)
    entity.components[COMPONENTS.TRANSFORM] = t

    return entity
}

export default function updateRenderer( engine, settings) {
    const {
        meshes,
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
    RendererController.meshes = meshes
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