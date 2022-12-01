import getComponentIcon from "./get-component-icon";
import COMPONENTS from "../../../../public/engine/static/COMPONENTS.js";
import getComponentLabel from "./get-component-label";

export default function getNativeComponents() {
    return [
        [COMPONENTS.SPOTLIGHT, getComponentLabel(COMPONENTS.SPOTLIGHT), getComponentIcon(COMPONENTS.SPOTLIGHT)],
        [COMPONENTS.POINT_LIGHT, getComponentLabel(COMPONENTS.POINT_LIGHT), getComponentIcon(COMPONENTS.POINT_LIGHT)],
        [COMPONENTS.DIRECTIONAL_LIGHT, getComponentLabel(COMPONENTS.DIRECTIONAL_LIGHT), getComponentIcon(COMPONENTS.DIRECTIONAL_LIGHT)],

        [COMPONENTS.SPRITE, getComponentLabel(COMPONENTS.SPRITE), getComponentIcon(COMPONENTS.SPRITE)],
        [COMPONENTS.MESH, getComponentLabel(COMPONENTS.MESH), getComponentIcon(COMPONENTS.MESH)],

        [COMPONENTS.CAMERA, getComponentLabel(COMPONENTS.CAMERA), getComponentIcon(COMPONENTS.CAMERA)],
        [COMPONENTS.SKYLIGHT, getComponentLabel(COMPONENTS.SKYLIGHT), getComponentIcon(COMPONENTS.SKYLIGHT)],
        [COMPONENTS.PHYSICS_COLLIDER, getComponentLabel(COMPONENTS.PHYSICS_COLLIDER), getComponentIcon(COMPONENTS.PHYSICS_COLLIDER)],
        [COMPONENTS.RIGID_BODY, getComponentLabel(COMPONENTS.RIGID_BODY), getComponentIcon(COMPONENTS.RIGID_BODY)],
        [COMPONENTS.CULLING, getComponentLabel(COMPONENTS.CULLING), getComponentIcon(COMPONENTS.CULLING)],
        [COMPONENTS.UI, getComponentLabel(COMPONENTS.UI), getComponentIcon(COMPONENTS.UI)],
        [COMPONENTS.TERRAIN, getComponentLabel(COMPONENTS.TERRAIN), getComponentIcon(COMPONENTS.UI)],

    ]
}