import COMPONENTS from "../libs/engine/production/data/COMPONENTS";

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
        default:
            return component.icon ? component.icon : "category"
    }
}