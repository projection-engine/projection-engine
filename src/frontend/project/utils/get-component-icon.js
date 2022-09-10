import COMPONENTS from "../../../../public/engine/production/data/COMPONENTS";

export default function getComponentIcon(key, component) {
    switch (key) {
        case COMPONENTS.MESH:
            return "category"
        case COMPONENTS.POINT_LIGHT:
            return "lightbulb"
        case COMPONENTS.DIRECTIONAL_LIGHT:
            return "light_mode"
        case COMPONENTS.CAMERA:
            return "videocam"
        case COMPONENTS.PROBE:
            return "lens_blur"
        case "TRANSFORMATION":
            return "transformation"
        case COMPONENTS.SPRITE:
            return "image"


        case COMPONENTS.SPHERE_COLLIDER:
            return "circle"
        case COMPONENTS.BOX_COLLIDER:
            return "view_in_ar"
        case COMPONENTS.RIGID_BODY:
            return "language"
        case COMPONENTS.CAPSULE_COLLIDER:
            return "language"
        default:
            return component.icon ? component.icon : "category"
    }
}