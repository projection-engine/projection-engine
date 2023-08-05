import SPRITE_FRAG from "../static/shaders/forward-rendering/SPRITE.frag"
import SPRITE_VERTEX from "../static/shaders/forward-rendering/SPRITE.vert"
import QUAD_VERTEX from "../static/shaders/post-processing/QUAD.vert"
import LENS_POST_PROCESSING_FRAG from "../static/shaders/post-processing/LENS_POST_PROCESSING.frag"
import SSAO from "../static/shaders/post-processing/SSAO.frag"
import BOX_BLUR_FRAG from "../static/shaders/post-processing/BOX-BLUR.frag"
import FXAA_FRAG from "../static/shaders/post-processing/FRAME_COMPOSITION.frag"
import BRIGHTNESS_FILTER_FRAG from "../static/shaders/post-processing/BRIGHTNESS_FILTER.frag"
import SSGI from "../static/shaders/post-processing/SSGI.frag"
import CUBEMAP from "../static/shaders/forward-rendering/CUBEMAP.vert"
import PREFILTERED_MAP from "../static/shaders/post-processing/PREFILTERED_MAP.frag"
import IRRADIANCE_MAP from "../static/shaders/post-processing/IRRADIANCE_MAP.frag"
import MOTION_BLUR_FRAG from "../static/shaders/post-processing/MOTION_BLUR.frag"
import GAUSSIAN_FRAG from "../static/shaders/post-processing/GAUSSIAN.frag"
import UPSAMPLING_TEND_FRAG from "../static/shaders/post-processing/UPSAMPLE_TENT.glsl"
import BOKEH_FRAG from "../static/shaders/post-processing/BOKEH.frag"
import BILATERAL_BLUR from "../static/shaders/post-processing/BILATERAL_BLUR.glsl"
import BILINEAR_DOWNSCALE from "../static/shaders/post-processing/BILINEAR_DOWNSCALE.glsl"
import TO_SCREEN from "../static/shaders/post-processing/TO_SCREEN.frag"
import V_BUFFER_VERT from "../static/shaders/forward-rendering/V_BUFFER.vert"
import V_BUFFER_FRAG from "../static/shaders/forward-rendering/V_BUFFER.frag"
import OMNIDIRECTIONAL_SHADOWS from "../static/shaders/forward-rendering/OMNIDIRECTIONAL_SHADOWS.frag"
import SHADOWS_VERTEX from "../static/shaders/forward-rendering/SHADOWS.vert"
import DIRECTIONAL_SHADOWS from "../static/shaders/forward-rendering/DIRECTIONAL_SHADOWS.frag"
import ATMOSPHERE_FRAG from "../static/shaders/forward-rendering/ATMOSPHERE.frag"
import Shader from "../instances/Shader"
import UberShader from "../resource-libs/UberShader"

export default class StaticShaders {

	static sprite?: Shader
	static spriteUniforms?: { [key: string]: WebGLUniformLocation }

	static visibility?: Shader
	static visibilityUniforms?: { [key: string]: WebGLUniformLocation }

	static toScreen?: Shader
	static toScreenUniforms?: { [key: string]: WebGLUniformLocation }

	static downscale?: Shader
	static downscaleUniforms?: { [key: string]: WebGLUniformLocation }

	static bilateralBlur?: Shader
	static bilateralBlurUniforms?: { [key: string]: WebGLUniformLocation }

	static bokeh?: Shader
	static bokehUniforms?: { [key: string]: WebGLUniformLocation }

	static irradiance?: Shader
	static irradianceUniforms?: { [key: string]: WebGLUniformLocation }

	static prefiltered?: Shader
	static prefilteredUniforms?: { [key: string]: WebGLUniformLocation }

	static ssgi?: Shader
	static ssgiUniforms?: { [key: string]: WebGLUniformLocation }

	static atmosphere?: Shader
	static atmosphereUniforms?: { [key: string]: WebGLUniformLocation }


	static mb?: Shader
	static mbUniforms?: { [key: string]: WebGLUniformLocation }

	static ssao?: Shader
	static ssaoUniforms?: { [key: string]: WebGLUniformLocation }

	static boxBlur?: Shader
	static boxBlurUniforms?: { [key: string]: WebGLUniformLocation }

	static directShadows?: Shader
	static directShadowsUniforms?: { [key: string]: WebGLUniformLocation }

	static omniDirectShadows?: Shader
	static omniDirectShadowsUniforms?: { [key: string]: WebGLUniformLocation }

	static composition?: Shader
	static compositionUniforms?: { [key: string]: WebGLUniformLocation }

	static bloom?: Shader
	static bloomUniforms?: { [key: string]: WebGLUniformLocation }

	static lens?: Shader
	static lensUniforms?: { [key: string]: WebGLUniformLocation }

	static gaussian?: Shader
	static gaussianUniforms?: { [key: string]: WebGLUniformLocation }

	static upSampling?: Shader
	static upSamplingUniforms?: { [key: string]: WebGLUniformLocation }


	static #initialized = false

	static initialize() {
		if (StaticShaders.#initialized)
			return
		StaticShaders.#initialized = true


		StaticShaders.sprite = new Shader(SPRITE_VERTEX, SPRITE_FRAG)
		StaticShaders.visibility = new Shader(V_BUFFER_VERT, V_BUFFER_FRAG)
		StaticShaders.toScreen = new Shader(QUAD_VERTEX, TO_SCREEN)
		StaticShaders.downscale = new Shader(QUAD_VERTEX, BILINEAR_DOWNSCALE)
		StaticShaders.bilateralBlur = new Shader(QUAD_VERTEX, BILATERAL_BLUR)
		StaticShaders.bokeh = new Shader(QUAD_VERTEX, BOKEH_FRAG)
		StaticShaders.irradiance = new Shader(CUBEMAP, IRRADIANCE_MAP)
		StaticShaders.prefiltered = new Shader(CUBEMAP, PREFILTERED_MAP)
		StaticShaders.ssgi = new Shader(QUAD_VERTEX, SSGI)
		StaticShaders.mb = new Shader(QUAD_VERTEX, MOTION_BLUR_FRAG)
		StaticShaders.ssao = new Shader(QUAD_VERTEX, SSAO)
		StaticShaders.boxBlur = new Shader(QUAD_VERTEX, BOX_BLUR_FRAG)
		StaticShaders.directShadows = new Shader(SHADOWS_VERTEX, DIRECTIONAL_SHADOWS)
		StaticShaders.omniDirectShadows = new Shader(SHADOWS_VERTEX, OMNIDIRECTIONAL_SHADOWS)
		StaticShaders.composition = new Shader(QUAD_VERTEX, FXAA_FRAG)
		StaticShaders.bloom = new Shader(QUAD_VERTEX, BRIGHTNESS_FILTER_FRAG)
		StaticShaders.lens = new Shader(QUAD_VERTEX, LENS_POST_PROCESSING_FRAG)
		StaticShaders.gaussian = new Shader(QUAD_VERTEX, GAUSSIAN_FRAG)
		StaticShaders.upSampling = new Shader(QUAD_VERTEX, UPSAMPLING_TEND_FRAG)
		StaticShaders.atmosphere = new Shader(QUAD_VERTEX, ATMOSPHERE_FRAG)

		UberShader.compile()

		StaticShaders.atmosphereUniforms = StaticShaders.atmosphere.uniformMap
		StaticShaders.spriteUniforms = StaticShaders.sprite.uniformMap
		StaticShaders.visibilityUniforms = StaticShaders.visibility.uniformMap
		StaticShaders.toScreenUniforms = StaticShaders.toScreen.uniformMap
		StaticShaders.downscaleUniforms = StaticShaders.downscale.uniformMap
		StaticShaders.bilateralBlurUniforms = StaticShaders.bilateralBlur.uniformMap
		StaticShaders.bokehUniforms = StaticShaders.bokeh.uniformMap
		StaticShaders.irradianceUniforms = StaticShaders.irradiance.uniformMap
		StaticShaders.prefilteredUniforms = StaticShaders.prefiltered.uniformMap
		StaticShaders.ssgiUniforms = StaticShaders.ssgi.uniformMap
		StaticShaders.mbUniforms = StaticShaders.mb.uniformMap
		StaticShaders.ssaoUniforms = StaticShaders.ssao.uniformMap
		StaticShaders.boxBlurUniforms = StaticShaders.boxBlur.uniformMap
		StaticShaders.directShadowsUniforms = StaticShaders.directShadows.uniformMap
		StaticShaders.omniDirectShadowsUniforms = StaticShaders.omniDirectShadows.uniformMap
		StaticShaders.compositionUniforms = StaticShaders.composition.uniformMap
		StaticShaders.bloomUniforms = StaticShaders.bloom.uniformMap
		StaticShaders.lensUniforms = StaticShaders.lens.uniformMap
		StaticShaders.gaussianUniforms = StaticShaders.gaussian.uniformMap
		StaticShaders.upSamplingUniforms = StaticShaders.upSampling.uniformMap


	}

}
