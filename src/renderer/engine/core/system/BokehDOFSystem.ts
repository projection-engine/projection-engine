import StaticMeshesState from "../states/StaticMeshesState"
import StaticFBOState from "../states/StaticFBOState"
import StaticShadersState from "../states/StaticShadersState"
import CameraAPI from "../lib/utils/CameraAPI"
import MetricsController from "../lib/utils/MetricsController"
import METRICS_FLAGS from "../static/METRICS_FLAGS"
import GPUUtil from "../utils/GPUUtil";
import AbstractSystem from "../AbstractSystem";


export default class BokehDOFSystem extends AbstractSystem {

    shouldExecute(): boolean {
        return CameraAPI.DOF;
    }

    execute() {
        StaticShadersState.bokeh.bind()
        StaticFBOState.postProcessing2.startMapping()

        GPUUtil.bind2DTextureForDrawing(StaticShadersState.bokehUniforms.sceneColor, 0, StaticFBOState.postProcessing1Sampler)
        GPUUtil.bind2DTextureForDrawing(StaticShadersState.bokehUniforms.sceneDepth, 1, StaticFBOState.sceneDepthVelocity)
        StaticMeshesState.drawQuad()
        StaticFBOState.postProcessing2.stopMapping()
        MetricsController.currentState = METRICS_FLAGS.BOKEH
    }
}
