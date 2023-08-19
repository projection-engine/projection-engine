import StaticMeshesState from "../states/StaticMeshesState"
import StaticFBOState from "../states/StaticFBOState"
import StaticShadersState from "../states/StaticShadersState"
import MetricsManager from "../managers/MetricsManager"
import METRICS_FLAGS from "../static/METRICS_FLAGS"
import GPUUtil from "../utils/GPUUtil";
import AbstractSystem from "../AbstractSystem";


export default class PostProcessingSystem extends AbstractSystem{
	execute() {

		StaticFBOState.lens.startMapping()
		StaticShadersState.lens.bind()
		GPUUtil.bind2DTextureForDrawing(StaticShadersState.lensUniforms.bloomColor, 0, StaticFBOState.postProcessing2Sampler)

		GPUUtil.bind2DTextureForDrawing(StaticShadersState.lensUniforms.sceneColor, 1, StaticFBOState.postProcessing1Sampler)

		StaticMeshesState.drawQuad()
		StaticFBOState.lens.stopMapping()
		MetricsManager.currentState = METRICS_FLAGS.LENS
	}
}
