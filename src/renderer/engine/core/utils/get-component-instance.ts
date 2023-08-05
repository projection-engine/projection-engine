import MeshComponent from "../components/MeshComponent"
import AtmosphereComponent from "../components/AtmosphereComponent"
import CameraComponent from "../components/CameraComponent"
import SpriteComponent from "../components/SpriteComponent"
import PhysicsColliderComponent from "../components/PhysicsColliderComponent"
import RigidBodyComponent from "../components/RigidBodyComponent"
import CullingComponent from "../components/CullingComponent"
import UIComponent from "../components/UIComponent"
import LightComponent from "../components/LightComponent"
import Component from "../components/Component"
import DecalComponent from "../components/DecalComponent"
import LightProbeComponent from "../components/LightProbeComponent"
import TransformationComponent from "../components/TransformationComponent";
import {Components} from "../engine.enum";

export default function getComponentInstance(entity: EngineEntity, key: Components): Component | undefined {
    switch (key) {
        case  Components.LIGHT:
            return new LightComponent(entity)
        case  Components.MESH:
            return new MeshComponent(entity)
        case  Components.ATMOSPHERE:
            return new AtmosphereComponent(entity)
        case  Components.LIGHT_PROBE:
            return new LightProbeComponent(entity)
        case  Components.CAMERA:
            return new CameraComponent(entity)
        case  Components.SPRITE:
            return new SpriteComponent(entity)
        case  Components.DECAL:
            return new DecalComponent(entity)
        case  Components.PHYSICS_COLLIDER:
            return new PhysicsColliderComponent(entity)
        case  Components.RIGID_BODY:
            return new RigidBodyComponent(entity)
        case  Components.CULLING:
            return new CullingComponent(entity)
        case  Components.UI:
            return new UIComponent(entity)
        case  Components.TRANSFORMATION:
            return new TransformationComponent(entity)
    }
}
