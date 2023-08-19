import MeshComponent from "@engine-core/lib/components/MeshComponent"
import AtmosphereComponent from "@engine-core/lib/components/AtmosphereComponent"
import CameraComponent from "@engine-core/lib/components/CameraComponent"
import SpriteComponent from "@engine-core/lib/components/SpriteComponent"
import PhysicsColliderComponent from "@engine-core/lib/components/PhysicsColliderComponent"
import RigidBodyComponent from "@engine-core/lib/components/RigidBodyComponent"
import CullingComponent from "@engine-core/lib/components/CullingComponent"
import UIComponent from "@engine-core/lib/components/UIComponent"
import LightComponent from "@engine-core/lib/components/LightComponent"
import Component from "@engine-core/lib/components/Component"
import DecalComponent from "@engine-core/lib/components/DecalComponent"
import LightProbeComponent from "@engine-core/lib/components/LightProbeComponent"
import TransformationComponent from "@engine-core/lib/components/TransformationComponent";
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
