import MaterialInstance from "../../../libs/engine/instances/MaterialInstance";
import * as shaderCode from "../../../libs/engine/shaders/mesh/FALLBACK.glsl"
import FALLBACK_MATERIAL from "../../../static/misc/FALLBACK_MATERIAL";
import bindGizmo from "./bind-gizmo";
import Entity from "../../../libs/engine/basic/Entity";
import TransformComponent from "../../../libs/engine/components/TransformComponent";
import Transformation from "../../../libs/engine/utils/Transformation";
import COMPONENTS from "../../../libs/engine/data/COMPONENTS";


function getCursor() {
    const entity = new Entity()
    const t = new TransformComponent()
    t.lockedRotation = true
    t.lockedScaling = true
    t.transformationMatrix = Transformation.transform(t.translation, [0, 0, 0, 1], t.scaling)
    entity.components[COMPONENTS.TRANSFORM] = t

    return entity
}

export default function updateRenderer(
    viewportInitialized,
    fallbackMaterial,
    meshes,
    materials,
    entities,
    cameraInitialized,
    setCameraInitialized,
    setFallbackMaterial,
    executingAnimation,
    selected,
    levelScript,
    settings
) {
    const renderer = window.renderer

    let fMat = fallbackMaterial
    if (!fallbackMaterial) {
        fMat = new MaterialInstance({
            vertex: shaderCode.fallbackVertex,
            fragment: shaderCode.fragment,
            settings: {isForward: false},
            cubeMapShaderCode: shaderCode.cubeMapShader,
            id: FALLBACK_MATERIAL
        })
        setFallbackMaterial(fMat)

    }
    if (settings.INITIALIZED && !cameraInitialized) {
        setCameraInitialized(true)
        if (settings.cameraPosition)
            renderer.camera.centerOn = settings.cameraPosition
        if (typeof settings.yaw === "number")
            renderer.camera.yaw = settings.yaw
        if (typeof settings.pitch === "number")
            renderer.camera.pitch = settings.pitch

        renderer.camera.updateViewMatrix()
    }


    renderer.camera.updateProjection()
    renderer.entitiesMap = entities
    renderer.meshes = meshes
    renderer.materials = materials
    renderer.camera.animated = settings.cameraAnimation
    renderer.gizmo = settings.gizmo
    if (!renderer.cursor)
        renderer.cursor = getCursor()


    renderer.updatePackage(
        executingAnimation,
        {selected, ...settings},
        levelScript,
        fMat
    )
    bindGizmo(selected)

    renderer.start()
}