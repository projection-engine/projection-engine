import COMPONENTS from "../../../engine-core/static/COMPONENTS";
import LOCALIZATION_EN from "../../../static/objects/LOCALIZATION_EN";

export default function getComponentLabel(component) {
    switch (component) {
        case COMPONENTS.MESH:
            return  LOCALIZATION_EN.MESH
        case COMPONENTS.CAMERA:
            return  LOCALIZATION_EN.CAMERA
        case COMPONENTS.SPRITE:
            return  LOCALIZATION_EN.SPRITE
        case COMPONENTS.DECAL:
            return LOCALIZATION_EN.DECAL
        case COMPONENTS.LIGHT:
            return LOCALIZATION_EN.LIGHT
        case COMPONENTS.ATMOSPHERE:
            return LOCALIZATION_EN.ATMOSPHERE_RENDERER
        case COMPONENTS.LIGHT_PROBE:
            return LOCALIZATION_EN.LIGHT_PROBE
        case COMPONENTS.PHYSICS_COLLIDER:
            return  LOCALIZATION_EN.PHYSICS_COLLIDER
        case COMPONENTS.RIGID_BODY:
            return  LOCALIZATION_EN.RIGID_BODY
        case COMPONENTS.CULLING:
            return  LOCALIZATION_EN.CULLING
        case COMPONENTS.UI:
            return  LOCALIZATION_EN.UI_WRAPPER
        // case COMPONENTS.TERRAIN:
        //     return "Terrain"

    }
}