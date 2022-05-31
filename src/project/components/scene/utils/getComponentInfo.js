import COMPONENTS from "../../../engine/templates/COMPONENTS"
import React from "react"

export default function getComponentInfo(c) {
    const res = {}
    switch (c) {
    case COMPONENTS.TRANSFORM:
        res.key = c
        res.label = "Transform"
        res.icon =
                <span className={"material-icons-round"} style={{fontWeight: "1rem"}}>transform</span>
        break
    case COMPONENTS.CUBE_MAP:
        res.key = c
        res.label = "CubeMap"
        res.icon = <span className={"material-icons-round"}
            style={{fontWeight: "1rem"}}>panorama_photosphere</span>
        break
    case COMPONENTS.MESH:
        res.key = c
        res.label = "Mesh"
        res.icon =
                <span className={"material-icons-round"} style={{fontWeight: "1rem"}}>view_in_ar</span>
        break
    case COMPONENTS.MATERIAL:
        res.key = c
        res.label = "Material"
        res.icon = <span className={"material-icons-round"} style={{fontWeight: "1rem"}}>texture</span>
        break
    case COMPONENTS.POINT_LIGHT:
        res.key = c
        res.label = "PointLight"
        res.icon =
                <span className={"material-icons-round"} style={{fontWeight: "1rem"}}>lightbulb</span>
        break
    case COMPONENTS.SKYBOX:
        res.key = c
        res.label = "Skybox"
        res.icon = <span className={"material-icons-round"} style={{fontWeight: "1rem"}}>cloud</span>
        break
    case COMPONENTS.DIRECTIONAL_LIGHT:
    case COMPONENTS.SKYLIGHT:
        res.key = c
        res.label = c === COMPONENTS.DIRECTIONAL_LIGHT ? "DirectionalLight" : "Skylight"
        res.icon =
                <span className={"material-icons-round"} style={{fontWeight: "1rem"}}>light_mode</span>
        break
    case COMPONENTS.SPOT_LIGHT:
        res.key = c
        res.label = "Spotlight"
        res.icon =
                <span className={"material-icons-round"} style={{fontWeight: "1rem"}}>flashlight_on</span>
        break
    case COMPONENTS.SCRIPT:
        res.key = c
        res.label = "Script"
        res.icon = <span className={"material-icons-round"} style={{fontWeight: "1rem"}}>code</span>
        break
    case COMPONENTS.PHYSICS:
        res.key = c
        res.label = "Physics"
        res.icon = <span className={"material-icons-round"} style={{fontWeight: "1rem"}}>public</span>
        break
    case COMPONENTS.COLLIDER:
        res.key = c
        res.label = "Collider"
        res.icon =
                <span className={"material-icons-round"} style={{fontWeight: "1rem"}}>compare_arrows</span>
        break
    case COMPONENTS.CAMERA:
        res.key = c
        res.label = "Camera"
        res.icon = <span className={"material-icons-round"} style={{fontWeight: "1rem"}}>videocam</span>
        break
    case COMPONENTS.LINE:
        res.key = c
        res.label = "Line"
        res.icon = <span className={"material-icons-round"} style={{fontWeight: "1rem"}}>arrow_right_alt</span>
        break
    case COMPONENTS.PROBE:
        res.key = c
        res.label = "Light probe"
        res.icon = <span className={"material-icons-round"} style={{fontWeight: "1rem"}}>lens_blur</span>
        break
    default:
        break
    }
    return res
}