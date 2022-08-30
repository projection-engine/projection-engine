import getComponentIcon from "../../../utils/get-component-icon";
import COMPONENTS from "../../../libs/engine/production/data/COMPONENTS";
import DirectionalLightComponent from "../../../libs/engine/production/templates/DirectionalLightComponent";
import PointLightComponent from "../../../libs/engine/production/templates/PointLightComponent";
import CameraComponent from "../../../libs/engine/production/templates/CameraComponent";
import MeshComponent from "../../../libs/engine/production/templates/MeshComponent";

export default function getNativeComponents(){
    return [
        [COMPONENTS.MESH, MeshComponent, "Mesh", getComponentIcon(COMPONENTS.MESH)],
        [COMPONENTS.CAMERA, CameraComponent, "Camera", getComponentIcon(COMPONENTS.CAMERA)],
        [COMPONENTS.POINT_LIGHT, PointLightComponent, "Point Light", getComponentIcon(COMPONENTS.POINT_LIGHT)],
        [COMPONENTS.DIRECTIONAL_LIGHT, DirectionalLightComponent, "Directional Light", getComponentIcon(COMPONENTS.DIRECTIONAL_LIGHT)]
    ]
}