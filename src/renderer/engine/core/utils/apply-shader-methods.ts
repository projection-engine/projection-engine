import PB_LIGHT_COMPUTATION from "@engine-core/shaders/PB_LIGHT_COMPUTATION.glsl"
import POST_PROCESSING_UNIFORMS from "@engine-core/shaders/POST_PROCESSING_UNIFORMS.glsl"
import COMPUTE_AREA_LIGHT from "@engine-core/shaders/COMPUTE_AREALIGHT.glsl"
import RAY_MARCHER from "@engine-core/shaders/RAY_MARCHER.glsl"
import ACES from "@engine-core/shaders/ACES.glsl"
import DEPTH_UTILS from "@engine-core/shaders/SCENE_DEPTH_UTILS.glsl"
import COMPUTE_LIGHTS from "@engine-core/shaders/COMPUTE_DIRECTIONAL_LIGHTS.glsl"
import COMPUTE_POINT_LIGHTS from "@engine-core/shaders/COMPUTE_POINT_LIGHTS.glsl"
import COMPUTE_SPOTLIGHTS from "@engine-core/shaders/COMPUTE_SPOTLIGHT.glsl"
import BRDF_FUNCTIONS from "@engine-core/shaders/BRDF_FUNCTIONS.glsl"
import STRONG_BLUR from "@engine-core/shaders/STRONG_BLUR.glsl"
import UBER_ATTRIBUTES from "@engine-core/shaders/ATTRIBUTES.glsl"
import SSS from "@engine-core/shaders/SSS.glsl"
import {StaticUBONames} from "../states/StaticUBOState"
import GPUState from "@engine-core/states/GPUState";

const METHODS = {
	cameraViewInfo: "//import(cameraViewInfo)",
	cameraProjectionInfo: "//import(cameraProjectionInfo)",
	computeLights: "//import(computeLights)",
	rayMarcher: "//import(rayMarcher)",
	aces: "//import(aces)",
	uberAttributes: "//import(uberAttributes)",
	sceneDepthUtils: "//import(sceneDepthUtils)",
	pbLightComputation: "//import(pbLightComputation)",
	SSS: "//import(SSS)",
	computePointLights: "//import(computePointLights)",
	brdf: "//import(brdf)",
	computeSpotLights: "//import(computeSpotLights)",
	computeAreaLights: "//import(computeAreaLights)",
	ppUBO: "//import(ppUBO)",
	blur: "//import(blur)",
	MAX_LIGHTS: "//import(MAX_LIGHTS)"
}

const CAMERA_VIEW = `
uniform ${StaticUBONames.CAMERA_VIEW}{
    mat4 viewProjection;
    mat4 viewMatrix; 
    mat4 invViewMatrix; 
    vec4 placement;
};
`
const CAMERA_PROJECTION = `
uniform ${StaticUBONames.CAMERA_PROJECTION}{
    mat4 projectionMatrix;
    mat4 invProjectionMatrix;
    vec2 bufferResolution;
    float logDepthFC;
};
`

export default function applyShaderMethods(shaderCode) {
	let response = shaderCode

	for (let i = 0; i < 4; i++) {
		Object.keys(METHODS).forEach(key => {
			switch (true) {
			case key === "computeAreaLights":
				response = response.replaceAll(METHODS[key], COMPUTE_AREA_LIGHT)
				break
			case key === "MAX_LIGHTS":
				response = response.replaceAll(METHODS[key], "#define MAX_LIGHTS " + GPUState.MAX_LIGHTS)
				break
			case key === "blur":
				response = response.replaceAll(METHODS[key], STRONG_BLUR)
				break
			case key === "computeSpotLights":
				response = response.replaceAll(METHODS[key], COMPUTE_SPOTLIGHTS)
				break
			case key === "brdf":
				response = response.replaceAll(METHODS[key], BRDF_FUNCTIONS)
				break
			case key === "SSS":
				response = response.replaceAll(METHODS[key], SSS)
				break
			case key === "computePointLights":
				response = response.replaceAll(METHODS[key], COMPUTE_POINT_LIGHTS)
				break
			case key === "uberAttributes":
				response = response.replaceAll(METHODS[key], UBER_ATTRIBUTES)
				break
			case key === "computeLights":
				response = response.replaceAll(METHODS[key], COMPUTE_LIGHTS)
				break
			case key === "pbLightComputation":
				response = response.replaceAll(METHODS[key], PB_LIGHT_COMPUTATION)
				break
			case key === "sceneDepthUtils":
				response = response.replaceAll(METHODS[key], DEPTH_UTILS)
				break
			case key === "cameraViewInfo":
				response = response.replaceAll(METHODS[key], CAMERA_VIEW)
				break
			case key === "cameraProjectionInfo":
				response = response.replaceAll(METHODS[key], CAMERA_PROJECTION)
				break
			case key === "ppUBO":
				response = response.replaceAll(METHODS[key], POST_PROCESSING_UNIFORMS)
				break
			case key === "rayMarcher":
				response = response.replaceAll(METHODS[key], RAY_MARCHER)
				break
			case key === "aces":
				response = response.replaceAll(METHODS[key], ACES)
				break
			}
		})
	}

	return response
}
