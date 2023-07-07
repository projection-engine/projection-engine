import SSGI from "./runtime/SSGI"
import DirectionalShadows from "./runtime/DirectionalShadows"
import LensPostProcessing from "./runtime/LensPostProcessing"
import FrameComposition from "./runtime/FrameComposition"

import Engine from "./Engine"
import EntityWorkerAPI from "./lib/utils/EntityWorkerAPI"
import OmnidirectionalShadows from "./runtime/OmnidirectionalShadows"
import CameraAPI from "./lib/utils/CameraAPI"
import MetricsController from "./lib/utils/MetricsController"

import VisibilityRenderer from "./runtime/VisibilityRenderer"
import LightsAPI from "./lib/utils/LightsAPI"
import SceneComposition from "./runtime/SceneComposition"
import GPU from "./GPU"
import GPUAPI from "./lib/rendering/GPUAPI"
import StaticFBO from "./lib/StaticFBO"
import ScriptsAPI from "./lib/utils/ScriptsAPI"
import METRICS_FLAGS from "./static/METRICS_FLAGS"

let previous = 0

export default class Renderer {
	static elapsed = 0
	static currentTimeStamp = 0

	static copyToCurrentFrame() {
		GPUAPI.copyTexture(StaticFBO.postProcessing1, StaticFBO.postProcessing2, GPU.context.COLOR_BUFFER_BIT)
	}

	static loop() {
		Renderer.#prepareLoop()
		MetricsController.init()
		Renderer.#executeScripts()
		DirectionalShadows.execute()
		OmnidirectionalShadows.execute()
		VisibilityRenderer.execute()
		SceneComposition.execute()
		Renderer.copyToCurrentFrame()
		SSGI.execute()
		LensPostProcessing.execute()
		FrameComposition.execute()
		Renderer.#sync()
		MetricsController.end()
	}

	static #prepareLoop() {
		const current = Renderer.currentTimeStamp
		Renderer.elapsed = current - previous
		previous = current
		CameraAPI.updateUBOs()
		GPU.context.clear(GPU.context.COLOR_BUFFER_BIT | GPU.context.DEPTH_BUFFER_BIT)
		if (EntityWorkerAPI.hasChangeBuffer[0] === 1)
			LightsAPI.packageLights(false, true)
	}


	static #executeScripts() {
		if (Engine.isDev)
			return
		const scripts = ScriptsAPI.mountedScripts
		const size = scripts.length
		if (size === 0)
			return
		for (let i = 0; i < size; i++) {
			try {
				const script = scripts[i]
				if (script.onUpdate)
					script.onUpdate()
			} catch (err) {
				console.error(err)
			}
		}
		MetricsController.currentState = METRICS_FLAGS.SCRIPT
	}

	static #sync() {
		EntityWorkerAPI.hasChangeBuffer[0] = 0
		CameraAPI.syncThreads()
		EntityWorkerAPI.syncThreads()
	}

}