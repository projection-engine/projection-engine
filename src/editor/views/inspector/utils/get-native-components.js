import getComponentIcon from "./get-component-icon";
import COMPONENTS from "../../../../../public/engine/static/COMPONENTS.json";

export default function getNativeComponents() {
    return [
        [COMPONENTS.MESH, "Mesh", getComponentIcon(COMPONENTS.MESH)],
        [COMPONENTS.CAMERA, "Camera", getComponentIcon(COMPONENTS.CAMERA)],
        [COMPONENTS.POINT_LIGHT, "Point Light", getComponentIcon(COMPONENTS.POINT_LIGHT)],
        [COMPONENTS.DIRECTIONAL_LIGHT, "Directional Light", getComponentIcon(COMPONENTS.DIRECTIONAL_LIGHT)],
        [COMPONENTS.SPRITE, "Sprite", getComponentIcon(COMPONENTS.SPRITE)],

        [COMPONENTS.PROBE, "Probe", getComponentIcon(COMPONENTS.PROBE)],
        [COMPONENTS.PHYSICS_COLLIDER, "Physics collider", getComponentIcon(COMPONENTS.PHYSICS_COLLIDER)],
        [COMPONENTS.RIGID_BODY, "Rigid body", getComponentIcon(COMPONENTS.RIGID_BODY)],
        [COMPONENTS.CULLING, "Culling", getComponentIcon(COMPONENTS.CULLING)],
        [COMPONENTS.UI, "UI wrapper", getComponentIcon(COMPONENTS.UI)],
    ]
}