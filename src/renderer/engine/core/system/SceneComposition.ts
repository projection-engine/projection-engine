import StaticFBO from "../lib/StaticFBO"
import UberShader from "../resource-libs/UberShader"
import SceneRenderingUtil from "./SceneRenderingUtil"
import SpriteRenderer from "./SpriteRenderer"
import DecalRendererSystem from "./DecalRendererSystem"
import OpaqueRendererSystem from "./OpaqueRendererSystem"
import AtmosphereRendererSystem from "./AtmosphereRendererSystem"
import Mesh from "../instances/Mesh"
import GPU from "../GPU"
import TransparencyRendererSystem from "./TransparencyRendererSystem";


export default class SceneComposition {
	static execute() {
		if (!UberShader.uber)
			return
		GPU.context.flush()
		Mesh.finishIfUsed()
		StaticFBO.postProcessing2.startMapping()

		AtmosphereRendererSystem.execute()
		SceneRenderingUtil.bindGlobalResources()
		OpaqueRendererSystem.execute()
		DecalRendererSystem.execute()
		SpriteRenderer.execute()

		StaticFBO.postProcessing2.stopMapping()

		TransparencyRendererSystem.execute()
		GPU.context.flush()
	}

}
