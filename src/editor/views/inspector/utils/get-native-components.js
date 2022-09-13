import getComponentIcon from "../../../utils/get-component-icon";
import COMPONENTS from "../../../../../public/engine/static/COMPONENTS.json";
import DirectionalLightComponent
    from "../../../../../public/engine/production/components/rendering/DirectionalLightComponent";
import PointLightComponent from "../../../../../public/engine/production/components/rendering/PointLightComponent";
import CameraComponent from "../../../../../public/engine/production/components/misc/CameraComponent";
import MeshComponent from "../../../../../public/engine/production/components/rendering/MeshComponent";
import SpriteComponent from "../../../../../public/engine/production/components/rendering/SpriteComponent";
import ProbeComponent from "../../../../../public/engine/production/components/rendering/ProbeComponent";
import PhysicsColliderComponent
    from "../../../../../public/engine/production/components/physics/PhysicsColliderComponent";
import RigidBodyComponent from "../../../../../public/engine/production/components/physics/RigidBodyComponent";
import CullingComponent from "../../../../../public/engine/production/components/misc/CullingComponent";

export default function getNativeComponents(){
    return [
        [COMPONENTS.MESH, MeshComponent, "Mesh", getComponentIcon(COMPONENTS.MESH)],
        [COMPONENTS.CAMERA, CameraComponent, "Camera", getComponentIcon(COMPONENTS.CAMERA)],
        [COMPONENTS.POINT_LIGHT, PointLightComponent, "Point Light", getComponentIcon(COMPONENTS.POINT_LIGHT)],
        [COMPONENTS.DIRECTIONAL_LIGHT, DirectionalLightComponent, "Directional Light", getComponentIcon(COMPONENTS.DIRECTIONAL_LIGHT)],
        [COMPONENTS.SPRITE, SpriteComponent, "Sprite", getComponentIcon(COMPONENTS.SPRITE)],

        [COMPONENTS.PROBE, ProbeComponent, "Probe", getComponentIcon(COMPONENTS.PROBE)],
        [COMPONENTS.PHYSICS_COLLIDER, PhysicsColliderComponent, "Physics collider", getComponentIcon(COMPONENTS.PHYSICS_COLLIDER)],
        [COMPONENTS.RIGID_BODY, RigidBodyComponent, "Rigid body", getComponentIcon(COMPONENTS.RIGID_BODY)],
        [COMPONENTS.CULLING, CullingComponent, "Culling", getComponentIcon(COMPONENTS.CULLING)],
    ]
}