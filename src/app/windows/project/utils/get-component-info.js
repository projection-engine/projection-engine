import COMPONENTS from "../libs/engine/data/COMPONENTS";

export default function getComponentInfo(key, component) {

    switch (key) {
        case COMPONENTS.TRANSFORM:
            return "transform"
        case COMPONENTS.MESH:
            return "category"
        case COMPONENTS.POINT_LIGHT:
            return "lightbulb"
        case COMPONENTS.DIRECTIONAL_LIGHT:
            return "light_mode"
        case COMPONENTS.SPOT_LIGHT:
            return "flashlight_on"
        case COMPONENTS.PHYSICS:
            return "public"
        case COMPONENTS.COLLIDER:
            return "compare_arrows"
        case COMPONENTS.CAMERA:
            return "videocam"
        case COMPONENTS.LINE:
            return "arrow_right_alt"
        case COMPONENTS.PROBE:
            return "lens_blur"
        default:
            return component.icon ? component.icon : "category"
    }
}