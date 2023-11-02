import Engine from "../Engine"
import PhysicsManager from "../managers/PhysicsManager"
import EngineState from "../states/EngineState"
import {Environment} from "@engine-core/engine.enum";

export default class PhysicsSystem  {
	static #interval = null

	static start() {
		clearInterval(PhysicsSystem.#interval)
		PhysicsSystem.#interval = setInterval(PhysicsSystem.#execute, EngineState.physicsSimulationStep)
	}

	static stop() {
		clearInterval(PhysicsSystem.#interval)
		PhysicsSystem.#interval = null
	}

	static #execute() {
		if (Engine.environment === Environment.EXECUTION|| !PhysicsManager.ammo)
			return
		const rigidBodies = PhysicsManager.registered.array
		const length = rigidBodies.length
		const tempTransformation = PhysicsManager.tempTransformation
		PhysicsManager.world.stepSimulation(EngineState.physicsSimulationStep, EngineState.physicsSubSteps)
		for (let i = 0; i < length; i++) {
			const current = rigidBodies[i]
			current.motionState.getWorldTransform(tempTransformation)
			const position = tempTransformation.getOrigin()
			const quaternion = tempTransformation.getRotation()

			const t = current.translationVec
			const q = current.rotationQuat

			t[0] = position.x()
			t[1] = position.y()
			t[2] = position.z()

			q[0] = quaternion.x()
			q[1] = quaternion.y()
			q[2] = quaternion.z()
			q[3] = quaternion.w()

			current.setChanged()
		}
	}
}
