import StaticMeshesState from "../states/StaticMeshesState"
import StaticFBOState from "../states/StaticFBOState"
import StaticShadersState from "../states/StaticShadersState"
import CameraManager from "../managers/CameraManager"
import MetricsManager from "../managers/MetricsManager"
import METRICS_FLAGS from "../static/METRICS_FLAGS"
import GPUUtil from "../utils/GPUUtil";
import AbstractSystem from "../AbstractSystem";


export default class BokehDOFSystem extends AbstractSystem {

     shouldExecute = (): boolean =>  {
        return CameraManager.DOF;
    }

     execute = () => {
        StaticShadersState.bokeh.bind()
        StaticFBOState.postProcessing2.startMapping()

        GPUUtil.bind2DTextureForDrawing(StaticShadersState.bokehUniforms.sceneColor, 0, StaticFBOState.postProcessing1Sampler)
        GPUUtil.bind2DTextureForDrawing(StaticShadersState.bokehUniforms.sceneDepth, 1, StaticFBOState.sceneDepthVelocity)
        StaticMeshesState.drawQuad()
        StaticFBOState.postProcessing2.stopMapping()
        MetricsManager.currentState = METRICS_FLAGS.BOKEH
    }
}
