import StaticFBO from "../lib/StaticFBO"
import UberShader from "../resource-libs/UberShader"
import Mesh from "../instances/Mesh"
import GPU from "../GPU"
import AbstractSystem from "../AbstractSystem";


export default class PreRendererSystem extends AbstractSystem{
	shouldExecute(): boolean {
		return UberShader.uber != null;
	}

	execute() {
		GPU.context.flush()
		Mesh.finishIfUsed()
		StaticFBO.postProcessing2.startMapping()
	}

}
