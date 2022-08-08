import getComponentInfo from "../../../utils/get-component-info";
import COMPONENTS from "../../../libs/engine/data/COMPONENTS";
import DirectionalLightComponent from "../../../libs/engine/libs/components/DirectionalLightComponent";
import PointLightComponent from "../../../libs/engine/libs/components/PointLightComponent";
import CameraComponent from "../../../libs/engine/libs/components/CameraComponent";
import MeshComponent from "../../../libs/engine/libs/components/MeshComponent";

export default function getNativeComponents(){
    return [
        [COMPONENTS.MESH, MeshComponent, "Mesh", getComponentInfo(COMPONENTS.MESH)],
        [COMPONENTS.CAMERA, CameraComponent, "Camera", getComponentInfo(COMPONENTS.CAMERA)],
        [COMPONENTS.POINT_LIGHT, PointLightComponent, "Point Light", getComponentInfo(COMPONENTS.POINT_LIGHT)],
        [COMPONENTS.DIRECTIONAL_LIGHT, DirectionalLightComponent, "Directional Light", getComponentInfo(COMPONENTS.DIRECTIONAL_LIGHT)]
    ]
}