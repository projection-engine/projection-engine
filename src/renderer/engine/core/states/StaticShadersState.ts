import TERRAIN_VERT from "@engine-core/shaders/TERRAIN.vert"
import TERRAIN_FRAG from "@engine-core/shaders/TERRAIN.frag"
import SPRITE_FRAG from "@engine-core/shaders/SPRITE.frag"
import SPRITE_VERTEX from "@engine-core/shaders/SPRITE.vert"
import QUAD_VERTEX from "@engine-core/shaders/QUAD.vert"
import LENS_POST_PROCESSING_FRAG from "@engine-core/shaders/LENS_POST_PROCESSING.frag"
import SSAO from "@engine-core/shaders/SSAO.frag"
import BOX_BLUR_FRAG from "@engine-core/shaders/BOX-BLUR.frag"
import FXAA_FRAG from "@engine-core/shaders/FRAME_COMPOSITION.frag"
import BRIGHTNESS_FILTER_FRAG from "@engine-core/shaders/BRIGHTNESS_FILTER.frag"
import SSGI from "@engine-core/shaders/SSGI.frag"
import CUBEMAP from "@engine-core/shaders/CUBEMAP.vert"
import PREFILTERED_MAP from "@engine-core/shaders/PREFILTERED_MAP.frag"
import IRRADIANCE_MAP from "@engine-core/shaders/IRRADIANCE_MAP.frag"
import MOTION_BLUR_FRAG from "@engine-core/shaders/MOTION_BLUR.frag"
import GAUSSIAN_FRAG from "@engine-core/shaders/GAUSSIAN.frag"
import UPSAMPLING_TEND_FRAG from "@engine-core/shaders/UPSAMPLE_TENT.glsl"
import BOKEH_FRAG from "@engine-core/shaders/BOKEH.frag"
import BILATERAL_BLUR from "@engine-core/shaders/BILATERAL_BLUR.glsl"
import BILINEAR_DOWNSCALE from "@engine-core/shaders/BILINEAR_DOWNSCALE.glsl"
import TO_SCREEN from "@engine-core/shaders/TO_SCREEN.frag"
import V_BUFFER_VERT from "@engine-core/shaders/V_BUFFER.vert"
import V_BUFFER_FRAG from "@engine-core/shaders/V_BUFFER.frag"
import OMNIDIRECTIONAL_SHADOWS from "@engine-core/shaders/OMNIDIRECTIONAL_SHADOWS.frag"
import SHADOWS_VERTEX from "@engine-core/shaders/SHADOWS.vert"
import DIRECTIONAL_SHADOWS from "@engine-core/shaders/DIRECTIONAL_SHADOWS.frag"
import ATMOSPHERE_FRAG from "@engine-core/shaders/ATMOSPHERE.frag"
import Shader from "@engine-core/lib/resources/Shader"
import UberShader from "../lib/UberShader"

export default class StaticShadersState {

	static sprite?: Shader
	static spriteUniforms?: UniformMap

	static terrain?: Shader
	static terrainUniforms?: UniformMap

	static visibility?: Shader
	static visibilityUniforms?: UniformMap

	static toScreen?: Shader
	static toScreenUniforms?: UniformMap

	static downscale?: Shader
	static downscaleUniforms?: UniformMap

	static bilateralBlur?: Shader
	static bilateralBlurUniforms?: UniformMap

	static bokeh?: Shader
	static bokehUniforms?: UniformMap

	static irradiance?: Shader
	static irradianceUniforms?: UniformMap

	static prefiltered?: Shader
	static prefilteredUniforms?: UniformMap

	static ssgi?: Shader
	static ssgiUniforms?: UniformMap

	static atmosphere?: Shader
	static atmosphereUniforms?: UniformMap


	static mb?: Shader
	static mbUniforms?: UniformMap

	static ssao?: Shader
	static ssaoUniforms?: UniformMap

	static boxBlur?: Shader
	static boxBlurUniforms?: UniformMap

	static directShadows?: Shader
	static directShadowsUniforms?: UniformMap

	static omniDirectShadows?: Shader
	static omniDirectShadowsUniforms?: UniformMap

	static composition?: Shader
	static compositionUniforms?: UniformMap

	static bloom?: Shader
	static bloomUniforms?: UniformMap

	static lens?: Shader
	static lensUniforms?: UniformMap

	static gaussian?: Shader
	static gaussianUniforms?: UniformMap

	static upSampling?: Shader
	static upSamplingUniforms?: UniformMap


	static #initialized = false

	static initialize() {
		if (StaticShadersState.#initialized)
			return
		StaticShadersState.#initialized = true


		StaticShadersState.terrain = new Shader(TERRAIN_VERT, TERRAIN_FRAG)
		StaticShadersState.sprite = new Shader(SPRITE_VERTEX, SPRITE_FRAG)
		StaticShadersState.visibility = new Shader(V_BUFFER_VERT, V_BUFFER_FRAG)
		StaticShadersState.toScreen = new Shader(QUAD_VERTEX, TO_SCREEN)
		StaticShadersState.downscale = new Shader(QUAD_VERTEX, BILINEAR_DOWNSCALE)
		StaticShadersState.bilateralBlur = new Shader(QUAD_VERTEX, BILATERAL_BLUR)
		StaticShadersState.bokeh = new Shader(QUAD_VERTEX, BOKEH_FRAG)
		StaticShadersState.irradiance = new Shader(CUBEMAP, IRRADIANCE_MAP)
		StaticShadersState.prefiltered = new Shader(CUBEMAP, PREFILTERED_MAP)
		StaticShadersState.ssgi = new Shader(QUAD_VERTEX, SSGI)
		StaticShadersState.mb = new Shader(QUAD_VERTEX, MOTION_BLUR_FRAG)
		StaticShadersState.ssao = new Shader(QUAD_VERTEX, SSAO)
		StaticShadersState.boxBlur = new Shader(QUAD_VERTEX, BOX_BLUR_FRAG)
		StaticShadersState.directShadows = new Shader(SHADOWS_VERTEX, DIRECTIONAL_SHADOWS)
		StaticShadersState.omniDirectShadows = new Shader(SHADOWS_VERTEX, OMNIDIRECTIONAL_SHADOWS)
		StaticShadersState.composition = new Shader(QUAD_VERTEX, FXAA_FRAG)
		StaticShadersState.bloom = new Shader(QUAD_VERTEX, BRIGHTNESS_FILTER_FRAG)
		StaticShadersState.lens = new Shader(QUAD_VERTEX, LENS_POST_PROCESSING_FRAG)
		StaticShadersState.gaussian = new Shader(QUAD_VERTEX, GAUSSIAN_FRAG)
		StaticShadersState.upSampling = new Shader(QUAD_VERTEX, UPSAMPLING_TEND_FRAG)
		StaticShadersState.atmosphere = new Shader(QUAD_VERTEX, ATMOSPHERE_FRAG)

		UberShader.compile()

		StaticShadersState.terrainUniforms = StaticShadersState.terrain.uniformMap
		StaticShadersState.atmosphereUniforms = StaticShadersState.atmosphere.uniformMap
		StaticShadersState.spriteUniforms = StaticShadersState.sprite.uniformMap
		StaticShadersState.visibilityUniforms = StaticShadersState.visibility.uniformMap
		StaticShadersState.toScreenUniforms = StaticShadersState.toScreen.uniformMap
		StaticShadersState.downscaleUniforms = StaticShadersState.downscale.uniformMap
		StaticShadersState.bilateralBlurUniforms = StaticShadersState.bilateralBlur.uniformMap
		StaticShadersState.bokehUniforms = StaticShadersState.bokeh.uniformMap
		StaticShadersState.irradianceUniforms = StaticShadersState.irradiance.uniformMap
		StaticShadersState.prefilteredUniforms = StaticShadersState.prefiltered.uniformMap
		StaticShadersState.ssgiUniforms = StaticShadersState.ssgi.uniformMap
		StaticShadersState.mbUniforms = StaticShadersState.mb.uniformMap
		StaticShadersState.ssaoUniforms = StaticShadersState.ssao.uniformMap
		StaticShadersState.boxBlurUniforms = StaticShadersState.boxBlur.uniformMap
		StaticShadersState.directShadowsUniforms = StaticShadersState.directShadows.uniformMap
		StaticShadersState.omniDirectShadowsUniforms = StaticShadersState.omniDirectShadows.uniformMap
		StaticShadersState.compositionUniforms = StaticShadersState.composition.uniformMap
		StaticShadersState.bloomUniforms = StaticShadersState.bloom.uniformMap
		StaticShadersState.lensUniforms = StaticShadersState.lens.uniformMap
		StaticShadersState.gaussianUniforms = StaticShadersState.gaussian.uniformMap
		StaticShadersState.upSamplingUniforms = StaticShadersState.upSampling.uniformMap


	}

}
