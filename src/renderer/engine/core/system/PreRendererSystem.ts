import StaticFBOState from "../states/StaticFBOState"
import UberShader from "../lib/UberShader"
import Mesh from "@engine-core/lib/resources/Mesh"
import GPUState from "../states/GPUState"
import AbstractSystem from "../AbstractSystem";


export default class PreRendererSystem extends AbstractSystem {
    shouldExecute = (): boolean => {
        return UberShader.uber != null;
    }

    execute = () => {
        GPUState.context.flush()
        Mesh.finishIfUsed()
        StaticFBOState.postProcessing2.startMapping()
    }

}
