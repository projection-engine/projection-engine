import COMPONENTS from "../../../engine/templates/COMPONENTS"
import React from "react"
import {Icon} from "@f-ui/core"

export default function getComponentInfo(c) {
    const res = {}
    switch (c) {
    case COMPONENTS.TRANSFORM:
        res.key = c
        res.label = "Transform"
        res.icon =
                <Icon styles={{fontWeight: "1rem"}}>transform</Icon>
        break
    case COMPONENTS.CUBE_MAP:
        res.key = c
        res.label = "CubeMap"
        res.icon = <Icon
            styles={{fontWeight: "1rem"}}>panorama_photosphere</Icon>
        break
    case COMPONENTS.MESH:
        res.key = c
        res.label = "Mesh"
        res.icon =
                <Icon styles={{fontWeight: "1rem"}}>view_in_ar</Icon>
        break
    case COMPONENTS.MATERIAL:
        res.key = c
        res.label = "Material"
        res.icon = <Icon styles={{fontWeight: "1rem"}}>texture</Icon>
        break
    case COMPONENTS.POINT_LIGHT:
        res.key = c
        res.label = "PointLight"
        res.icon =
                <Icon styles={{fontWeight: "1rem"}}>lightbulb</Icon>
        break
    case COMPONENTS.SKYBOX:
        res.key = c
        res.label = "Skybox"
        res.icon = <Icon styles={{fontWeight: "1rem"}}>cloud</Icon>
        break
    case COMPONENTS.DIRECTIONAL_LIGHT:
    case COMPONENTS.SKYLIGHT:
        res.key = c
        res.label = c === COMPONENTS.DIRECTIONAL_LIGHT ? "DirectionalLight" : "Skylight"
        res.icon =
                <Icon styles={{fontWeight: "1rem"}}>light_mode</Icon>
        break
    case COMPONENTS.SPOT_LIGHT:
        res.key = c
        res.label = "Spotlight"
        res.icon =
                <Icon styles={{fontWeight: "1rem"}}>flashlight_on</Icon>
        break

    case COMPONENTS.PHYSICS:
        res.key = c
        res.label = "Physics"
        res.icon = <Icon styles={{fontWeight: "1rem"}}>public</Icon>
        break
    case COMPONENTS.COLLIDER:
        res.key = c
        res.label = "Collider"
        res.icon =
                <Icon styles={{fontWeight: "1rem"}}>compare_arrows</Icon>
        break
    case COMPONENTS.CAMERA:
        res.key = c
        res.label = "Camera"
        res.icon = <Icon styles={{fontWeight: "1rem"}}>videocam</Icon>
        break
    case COMPONENTS.LINE:
        res.key = c
        res.label = "Line"
        res.icon = <Icon styles={{fontWeight: "1rem"}}>arrow_right_alt</Icon>
        break
    case COMPONENTS.PROBE:
        res.key = c
        res.label = "Light probe"
        res.icon = <Icon styles={{fontWeight: "1rem"}}>lens_blur</Icon>
        break
    default:
        break
    }
    return res
}