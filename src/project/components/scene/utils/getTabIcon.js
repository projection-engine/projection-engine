import Transform from "../components/Transform";
import Mesh from "../components/Mesh";
import Material from "../components/Material";
import CubeMap from "../components/CubeMap";
import Skybox from "../components/Skybox";
import React from "react";
import COMPONENTS from "../../../engine/templates/COMPONENTS";


export default function getTabIcon(key) {

    switch (key) {
        case 'TransformComponent':
            return 'transform'
        case 'MeshComponent':
            return 'view_in_ar'
        case 'MaterialComponent':
            return 'texture'
        case 'DirectionalLightComponent':
            return 'light_mode'
        case 'PointLightComponent':
            return 'lightbulb'
        case 'SpotLightComponent':
            return 'flashlight_on'
        case 'CubeMapComponent':
            return 'panorama_photosphere'
        case COMPONENTS.SKYBOX:
            return 'cloud'
        case COMPONENTS.PROBE:
            return 'lens_blur'
        case COMPONENTS.LINE:
            return 'arrow_right_alt'
        default:
            return
    }
}