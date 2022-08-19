import bindGizmo from "./bind-gizmo";
import Entity from "../../../libs/engine/templates/basic/Entity";
import TransformComponent from "../../../libs/engine/templates/components/TransformComponent";
import Transformation from "../../../libs/engine/services/Transformation";
import COMPONENTS from "../../../libs/engine/data/COMPONENTS";
import Renderer from "../../../libs/engine/Renderer";


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
    if (!renderer.camera.cameraInitialized) {
        renderer.camera.cameraInitialized = true
        if (settings.cameraPosition)
            renderer.camera.centerOn = settings.cameraPosition
        if (typeof settings.yaw === "number")
            renderer.camera.yaw = settings.yaw
        if (typeof settings.pitch === "number")
            renderer.camera.pitch = settings.pitch
        renderer.camera.updateViewMatrix()
    }

    Renderer.entitiesMap = entities
    Renderer.meshes = meshes
    renderer.materials = materials
    renderer.camera.animated = settings.cameraAnimation
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