import COMPONENTS from "../../../public/engine/static/COMPONENTS.json";

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


        case COMPONENTS.PHYSICS_COLLIDER:
            return "compare_arrows"
        case COMPONENTS.RIGID_BODY:
            return "language"

        case COMPONENTS.CULLING:
            return "disabled_visible"
        default:
            return component.icon ? component.icon : "category"
    }
}