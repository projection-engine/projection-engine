import StaticMeshes from "../lib/StaticMeshes"
import StaticFBO from "../lib/StaticFBO"
import StaticShaders from "../lib/StaticShaders"
import MetricsController from "../lib/utils/MetricsController"
import METRICS_FLAGS from "../static/METRICS_FLAGS"
import GPUUtil from "../utils/GPUUtil";
import AbstractSystem from "../AbstractSystem";


export default class PostProcessingSystem extends AbstractSystem{
	execute() {

		StaticFBO.lens.startMapping()
		StaticShaders.lens.bind()
		GPUUtil.bind2DTextureForDrawing(StaticShaders.lensUniforms.bloomColor, 0, StaticFBO.postProcessing2Sampler)

		GPUUtil.bind2DTextureForDrawing(StaticShaders.lensUniforms.sceneColor, 1, StaticFBO.postProcessing1Sampler)

		StaticMeshes.drawQuad()
		StaticFBO.lens.stopMapping()
		MetricsController.currentState = METRICS_FLAGS.LENS
	}
}
