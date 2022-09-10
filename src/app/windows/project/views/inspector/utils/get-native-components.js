import getComponentIcon from "../../../utils/get-component-icon";
import COMPONENTS from "../../../../../../../public/engine/production/data/COMPONENTS";
import DirectionalLightComponent from "../../../../../../../public/engine/production/components/rendering/DirectionalLightComponent";
import PointLightComponent from "../../../../../../../public/engine/production/components/rendering/PointLightComponent";
import CameraComponent from "../../../../../../../public/engine/production/components/misc/CameraComponent";
import MeshComponent from "../../../../../../../public/engine/production/components/rendering/MeshComponent";
import SpriteComponent from "../../../../../../../public/engine/production/components/rendering/SpriteComponent";
import ProbeComponent from "../../../../../../../public/engine/production/components/rendering/ProbeComponent";
import SphereColliderComponent from "../../../../../../../public/engine/production/components/physics/SphereColliderComponent";
import CapsuleColliderComponent from "../../../../../../../public/engine/production/components/physics/CapsuleColliderComponent";
import BoxColliderComponent from "../../../../../../../public/engine/production/components/physics/BoxColliderComponent";
import RigidBodyComponent from "../../../../../../../public/engine/production/components/physics/RigidBodyComponent";

export default function getNativeComponents(){
    return [
        [COMPONENTS.MESH, MeshComponent, "Mesh", getComponentIcon(COMPONENTS.MESH)],
        [COMPONENTS.CAMERA, CameraComponent, "Camera", getComponentIcon(COMPONENTS.CAMERA)],
        [COMPONENTS.POINT_LIGHT, PointLightComponent, "Point Light", getComponentIcon(COMPONENTS.POINT_LIGHT)],
        [COMPONENTS.DIRECTIONAL_LIGHT, DirectionalLightComponent, "Directional Light", getComponentIcon(COMPONENTS.DIRECTIONAL_LIGHT)],
        [COMPONENTS.SPRITE, SpriteComponent, "Sprite", getComponentIcon(COMPONENTS.SPRITE)],

        [COMPONENTS.PROBE, ProbeComponent, "Probe", getComponentIcon(COMPONENTS.PROBE)],
        [COMPONENTS.SPHERE_COLLIDER, SphereColliderComponent, "Sphere collider", getComponentIcon(COMPONENTS.SPHERE_COLLIDER)],
        // [COMPONENTS.CAPSULE_COLLIDER, CapsuleColliderComponent, "Capsule collider", getComponentIcon(COMPONENTS.CAPSULE_COLLIDER)],
        [COMPONENTS.BOX_COLLIDER, BoxColliderComponent, "Box collider", getComponentIcon(COMPONENTS.BOX_COLLIDER)],
        [COMPONENTS.RIGID_BODY, RigidBodyComponent, "Rigid body", getComponentIcon(COMPONENTS.RIGID_BODY)],
    ]
}