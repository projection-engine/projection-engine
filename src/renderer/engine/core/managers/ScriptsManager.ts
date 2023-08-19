import GPUState from "../states/GPUState"
import GPUManager from "./GPUManager"
import PhysicsManager from "./PhysicsManager"
import UIManager from "./UIManager"
import ConsoleManager from "./ConsoleManager"
import Component from "@engine-core/lib/components/Component"
import CameraManager from "./CameraManager"
import EngineFileSystemManager from "./EngineFileSystemManager"
import Engine from "../Engine"
import {Components} from "@engine-core/engine.enum";

export default class ScriptsManager {
	static scriptInstances = new Map()
	static mountedScripts = []
	static mountedScriptsMap = new Map()

	static async updateAllScripts() {
		ScriptsManager.mountedScripts = []
		ScriptsManager.mountedScriptsMap.clear()
		const scriptsToUpdate = Array.from(ScriptsManager.scriptInstances.keys())
		for (let i = 0; i < scriptsToUpdate.length; i++) {
			const current = scriptsToUpdate[i]
			const data = await EngineFileSystemManager.readAsset(current)
			ScriptsManager.scriptInstances.set(current, data)
		}
		// TODO - REWORK SCRIPTING SYSTEM
		// for (let i = 0; i < Engine.entities.array.length; i++) {
		// 	const current = Engine.entities.array[i]
		// 	for (let j = 0; j < current.scripts.length; j++)
		// 		ScriptsManager.#updateEntityScript(current.scripts[j].id, current, j)
		// }
	}

	static async linkScript(entity, scriptID) {
		const scriptFound = ScriptsManager.scriptInstances.get(scriptID)
		const found = entity.scripts.findIndex(s => s.id === scriptID)
		if (!scriptFound) {
			const data = await EngineFileSystemManager.readAsset(scriptID)
			if (data != null)
				ScriptsManager.scriptInstances.set(scriptID, data)
			else if (found > -1) {
				entity.scripts.splice(found, 1)
				return
			}
		}
		ScriptsManager.#updateEntityScript(scriptID, entity, found)
	}


	static #updateEntityScript(scriptID, entity, index) {
		const scriptData = ScriptsManager.scriptInstances.get(scriptID)
		if (!scriptData)
			return
		try {
			const generator = new Function("GPUState, GPUManager, PhysicsManager, UIManager, ConsoleManager, Component, Components, CameraManager, entity, EngineFileSystemManager", scriptData)
			try {
				const script = generator(GPUState, GPUManager, PhysicsManager, UIManager, ConsoleManager, Component, Components, CameraManager,  entity, EngineFileSystemManager)
				if (index > -1) {
					const ref = entity.scripts[index]
					Object.entries(ref).forEach(([key, value]) => {
						if (typeof value !== "function" && key !== "_props" && key !== "_name")
							script[key] = value
					})
					entity.scripts[index] = script
				} else
					entity.scripts.push(script)
				script.id = scriptID

				if (!Engine.isDev && script.onCreation)
					script.onCreation()
				const oldIndex = ScriptsManager.mountedScriptsMap.get(scriptID + entity.id)
				if (oldIndex !== undefined)
					ScriptsManager.mountedScripts[oldIndex] = script
				else {
					ScriptsManager.mountedScripts.push(script)
					ScriptsManager.mountedScriptsMap.set(scriptID + entity.id, ScriptsManager.mountedScripts.length - 1)
				}
				return true
			} catch (runtimeError) {
				console.error(runtimeError)
			}
		} catch (syntaxError) {
			console.error(syntaxError)
		}
	}
}

//
