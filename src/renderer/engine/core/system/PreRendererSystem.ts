import StaticFBOState from "../states/StaticFBOState"
import UberShader from "../lib/UberShader"
import Mesh from "@engine-core/lib/resources/Mesh"
import GPU from "../GPU"
import AbstractSystem from "../AbstractSystem";


export default class PreRendererSystem extends AbstractSystem{
	shouldExecute(): boolean {
		return UberShader.uber != null;
	}

	execute() {
		GPU.context.flush()
		Mesh.finishIfUsed()
		StaticFBOState.postProcessing2.startMapping()
	}

}
