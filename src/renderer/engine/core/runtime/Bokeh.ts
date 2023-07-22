import StaticMeshes from "../lib/StaticMeshes"
import StaticFBO from "../lib/StaticFBO"
import StaticShaders from "../lib/StaticShaders"
import CameraAPI from "../lib/utils/CameraAPI"
import MetricsController from "../lib/utils/MetricsController"
import METRICS_FLAGS from "../static/METRICS_FLAGS"
import GPUUtil from "../utils/GPUUtil";


export default class Bokeh {
	static execute() {

		if (!CameraAPI.DOF)
			return

		StaticShaders.bokeh.bind()
		StaticFBO.postProcessing2.startMapping()

		GPUUtil.bind2DTextureForDrawing(StaticShaders.bokehUniforms.sceneColor, 0,StaticFBO.postProcessing1Sampler)
		GPUUtil.bind2DTextureForDrawing(StaticShaders.bokehUniforms.sceneDepth, 1,StaticFBO.sceneDepthVelocity)
		StaticMeshes.drawQuad()
		StaticFBO.postProcessing2.stopMapping()
		MetricsController.currentState = METRICS_FLAGS.BOKEH
	}
}
