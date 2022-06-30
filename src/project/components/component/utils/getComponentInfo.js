import COMPONENTS from "../../../engine/templates/COMPONENTS"


export default function getComponentInfo(c) {
    const res = {}
    switch (c) {
    case COMPONENTS.TRANSFORM:
        res.key = c
        res.label = "Transform"
        res.icon = "transform"
        break

    case COMPONENTS.MESH:
        res.key = c
        res.label = "Mesh"
        res.icon = "view_in_ar"
        break
    case COMPONENTS.MATERIAL:
        res.key = c
        res.label = "Material"
        res.icon = "texture"
        break
    case COMPONENTS.POINT_LIGHT:
        res.key = c
        res.label = "PointLight"
        res.icon = "lightbulb"
        break
    case COMPONENTS.DIRECTIONAL_LIGHT:
        res.key = c
        res.label = "DirectionalLight"
        res.icon = "light_mode"
        break
    case COMPONENTS.SPOT_LIGHT:
        res.key = c
        res.label = "Spotlight"
        res.icon = "flashlight_on"
        break

    case COMPONENTS.PHYSICS:
        res.key = c
        res.label = "Physics"
        res.icon = "public"
        break
    case COMPONENTS.COLLIDER:
        res.key = c
        res.label = "Collider"
        res.icon = "compare_arrows"
        break
    case COMPONENTS.CAMERA:
        res.key = c
        res.label = "Camera"
        res.icon = "videocam"
        break
    case COMPONENTS.LINE:
        res.key = c
        res.label = "Line"
        res.icon = "arrow_right_alt"
        break
    case COMPONENTS.PROBE:
        res.key = c
        res.label = "Light probe"
        res.icon = "lens_blur"
        break
    default:
        break
    }
    return res
}