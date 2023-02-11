import getComponentIcon from "../../../utils/get-component-icon";
import COMPONENTS from "../../../../../engine-core/static/COMPONENTS";
import getComponentLabel from "../../../utils/get-component-label";


export default [
    [COMPONENTS.LIGHT, getComponentLabel(COMPONENTS.LIGHT), getComponentIcon(COMPONENTS.LIGHT)],
    [COMPONENTS.SPRITE, getComponentLabel(COMPONENTS.SPRITE), getComponentIcon(COMPONENTS.SPRITE)],
    [COMPONENTS.DECAL, getComponentLabel(COMPONENTS.DECAL), getComponentIcon(COMPONENTS.DECAL)],
    [COMPONENTS.MESH, getComponentLabel(COMPONENTS.MESH), getComponentIcon(COMPONENTS.MESH)],
    [COMPONENTS.CAMERA, getComponentLabel(COMPONENTS.CAMERA), getComponentIcon(COMPONENTS.CAMERA)],
    [COMPONENTS.LIGHT_PROBE, getComponentLabel(COMPONENTS.LIGHT_PROBE), getComponentIcon(COMPONENTS.LIGHT_PROBE)],
    [COMPONENTS.ATMOSPHERE, getComponentLabel(COMPONENTS.ATMOSPHERE), getComponentIcon(COMPONENTS.ATMOSPHERE)],
    [COMPONENTS.PHYSICS_COLLIDER, getComponentLabel(COMPONENTS.PHYSICS_COLLIDER), getComponentIcon(COMPONENTS.PHYSICS_COLLIDER)],
    [COMPONENTS.RIGID_BODY, getComponentLabel(COMPONENTS.RIGID_BODY), getComponentIcon(COMPONENTS.RIGID_BODY)],
    [COMPONENTS.CULLING, getComponentLabel(COMPONENTS.CULLING), getComponentIcon(COMPONENTS.CULLING)],
    [COMPONENTS.UI, getComponentLabel(COMPONENTS.UI), getComponentIcon(COMPONENTS.UI)],
]
