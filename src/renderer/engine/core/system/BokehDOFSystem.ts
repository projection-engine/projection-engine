import StaticMeshesState from "../states/StaticMeshesState"
import StaticFBOState from "../states/StaticFBOState"
import StaticShadersState from "../states/StaticShadersState"
import GPUUtil from "../utils/GPUUtil";
import AbstractSystem from "../AbstractSystem";
import CameraState from "@engine-core/states/CameraState";


export default class BokehDOFSystem extends AbstractSystem {

     shouldExecute = (): boolean =>  {
        return CameraState.DOF;
    }

     execute = () => {
        StaticShadersState.bokeh.bind()
        StaticFBOState.postProcessing2.startMapping()

        GPUUtil.bind2DTextureForDrawing(StaticShadersState.bokehUniforms.sceneColor, 0, StaticFBOState.postProcessing1Sampler)
        GPUUtil.bind2DTextureForDrawing(StaticShadersState.bokehUniforms.sceneDepth, 1, StaticFBOState.sceneDepthVelocity)
        StaticMeshesState.drawQuad()
        StaticFBOState.postProcessing2.stopMapping()
    }
}
