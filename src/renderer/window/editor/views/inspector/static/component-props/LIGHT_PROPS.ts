import {LightTypes,} from "@engine-core/engine.enum";
import {array, boolean, color, group, number, options} from "./prop-types";
import LightComponent from "@engine-core/lib/components/LightComponent";

function checkShadows(comp){
	return  !comp.shadowMap || comp.type !== LightTypes.DIRECTIONAL && comp.type !== LightTypes.POINT
}
export default [
	group("TYPE", [
		options("type", [
			{
				label: "DIRECTIONAL_LIGHT",
				value: LightTypes.DIRECTIONAL
			},
			{
				label: "SPOTLIGHT",
				value: LightTypes.SPOT
			},
			{
				label: "POINT_LIGHT",
				value: LightTypes.POINT
			},

			{
				label: "SPHERE_AREA",
				value: LightTypes.SPHERE
			},
			{
				label: "DISK_AREA",
				value: LightTypes.DISK
			},
			{
				label: "PLANE_AREA",
				value: LightTypes.PLANE
			}
		]),
	]),

	group("AREA_LIGHT", [
		number("RADIUS", "areaRadius", undefined, 0, undefined,undefined,undefined,comp => (<LightComponent>comp).type === LightTypes.PLANE),

		number("WIDTH", "planeAreaWidth", undefined, 0, undefined,undefined,undefined,comp => (<LightComponent>comp).type !== LightTypes.PLANE),
		number("HEIGHT", "planeAreaHeight", undefined, 0, undefined,undefined,undefined,comp => (<LightComponent>comp).type !== LightTypes.PLANE)
	], comp => (<LightComponent>comp).type !== LightTypes.SPHERE && (<LightComponent>comp).type !== LightTypes.DISK && (<LightComponent>comp).type !== LightTypes.PLANE),

	group("INTENSITY_COLOR", [
		color("COLOR", "color"),
		number("INTENSITY", "intensity", 100, 0),
	]),

	group("ATTENUATION", [
		array(["DISTANCE", "DISTANCE_SQUARED"], "attenuation",   undefined, undefined, 0),
	], comp => (<LightComponent>comp).type === LightTypes.DIRECTIONAL),

	group("CUTOFF", [
		number("SMOOTHING", "smoothing", 1, 0, .01),
		number("MAX_DISTANCE", "cutoff", 100, 1, .1),
		number("RADIUS", "radius", 180, 1, .01, undefined, undefined, comp => (<LightComponent>comp).type !== LightTypes.SPOT),
	], comp => (<LightComponent>comp).type === LightTypes.DIRECTIONAL),

	group("SHADOWS", [
		boolean("ENABLED", "shadowMap"),
		number("SIZE", "size", undefined, 1, undefined, false, false, comp => !(<LightComponent>comp).shadowMap || (<LightComponent>comp).type !== LightTypes.DIRECTIONAL),
		number("FAR", "zFar", undefined, undefined, .001, false, false, checkShadows),
		number("NEAR", "zNear", undefined, undefined, .001, false, false,checkShadows),
		number("BIAS", "shadowBias", undefined, undefined, .00001, false, undefined, checkShadows),
		number("PCF_SAMPLES", "shadowSamples", 10, 1, 1, false, false, checkShadows),
		number("FALLOFF", "shadowAttenuationMinDistance", undefined, 1, .001, false, false, checkShadows),
		boolean("HAS_SSS", "hasSSS")

	]),



]
