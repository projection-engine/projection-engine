import COMPONENTS from "../../../../../../engine-core/templates/COMPONENTS";

export default function getComponentIcon(key) {
    switch (key) {
        case COMPONENTS.MESH:
            return "category"
        case COMPONENTS.LIGHT:
            return "light_mode"
        case COMPONENTS.CAMERA:
            return "videocam"
        case COMPONENTS.SKYLIGHT:
            return "lens_blur"
        case "TRANSFORMATION":
            return "transform"
        case COMPONENTS.SPRITE:
        case COMPONENTS.DECAL:
            return "image"
        case COMPONENTS.PHYSICS_COLLIDER:
            return "compare_arrows"
        case COMPONENTS.RIGID_BODY:
            return "language"

        case COMPONENTS.CULLING:
            return "disabled_visible"
        case COMPONENTS.UI:
            return "widgets"
        // case COMPONENTS.TERRAIN:
        //     return "landscape"
        default:
            return "code"
    }
}