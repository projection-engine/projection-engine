import Component from "./Component"
import {Components,} from "@engine-core/engine.enum";

export default class RigidBodyComponent extends Component {
	getDependencies(): Components[] {
		return [Components.TRANSFORMATION, Components.PHYSICS_COLLIDER];
	}

	static get componentKey(): Components {
		return Components.RIGID_BODY
	}
	getComponentKey(): Components {
		return RigidBodyComponent.componentKey
	}

	mass = 1
	drag = 0
	inertia: [number, number, number] = [0, 0, 0]

	#motionState?: btDefaultMotionState
	#body?: btRigidBody
	#transform?: btTransform
	#inertia?: btVector3

	initialized =false

	get body(): btRigidBody | undefined {
		return this.#body
	}

	set body(data) {
		this.#body = data
	}

	get transform(): btTransform | undefined {
		return this.#transform
	}

	set transform(data) {
		this.#transform = data
	}

	get inertiaBody(): btVector3 | undefined {
		return this.#inertia
	}

	set inertiaBody(data: btVector3) {
		this.#inertia = data
	}

	get motionState(): btDefaultMotionState | undefined {
		return this.#motionState
	}

	set motionState(data) {
		this.#motionState = data
	}
}
