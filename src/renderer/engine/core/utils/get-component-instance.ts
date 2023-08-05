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


export default function getComponentInstance(key: Components): Component | undefined {
	switch (key) {
	case  Components.LIGHT:
		return new LightComponent()
	case  Components.MESH:
		return new MeshComponent()
	case  Components.ATMOSPHERE:
		return new AtmosphereComponent()
	case  Components.LIGHT_PROBE:
		return new LightProbeComponent()
	case  Components.CAMERA:
		return new CameraComponent()
	case  Components.SPRITE:
		return new SpriteComponent()
	case  Components.DECAL:
		return new DecalComponent()
	case  Components.PHYSICS_COLLIDER:
		return new PhysicsColliderComponent()
	case  Components.RIGID_BODY:
		return new RigidBodyComponent()
	case  Components.CULLING:
		return new CullingComponent()
	case  Components.UI:
		return new UIComponent()

	}
	return undefined
}
