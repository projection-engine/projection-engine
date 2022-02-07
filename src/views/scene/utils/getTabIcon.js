import TransformComponent from "../forms/TransformComponent";
import MeshComponent from "../forms/MeshComponent";
import MaterialComponent from "../forms/MaterialComponent";
import CubeMapComponent from "../forms/CubeMapComponent";
import SkyboxComponent from "../forms/SkyboxComponent";
import React from "react";


export default function getTabIcon(key) {
    console.log(key)
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
        case 'SkyboxComponent':
            return 'cloud'
        default:
            return
    }
}