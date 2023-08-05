import Component from "../../components/Component"

function checkShadows(comp){
	return  !comp.shadowMap || comp.type !== LightTypes.DIRECTIONAL && comp.type !== LightTypes.POINT
}
export default [
	Component.group("TYPE", [
		Component.options("type", [
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

	Component.group("AREA_LIGHT", [
		Component.number("RADIUS", "areaRadius", undefined, 0, undefined,undefined,undefined,comp => comp.type === LightTypes.PLANE),

		Component.number("WIDTH", "planeAreaWidth", undefined, 0, undefined,undefined,undefined,comp => comp.type !== LightTypes.PLANE),
		Component.number("HEIGHT", "planeAreaHeight", undefined, 0, undefined,undefined,undefined,comp => comp.type !== LightTypes.PLANE)
	], comp => comp.type !== LightTypes.SPHERE && comp.type !== LightTypes.DISK && comp.type !== LightTypes.PLANE),

	Component.group("INTENSITY_COLOR", [
		Component.color("COLOR", "color"),
		Component.number("INTENSITY", "intensity", 100, 0),
	]),

	Component.group("ATTENUATION", [
		Component.array(["DISTANCE", "DISTANCE_SQUARED"], "attenuation",   undefined, undefined, 0),
	], comp => comp.type === LightTypes.DIRECTIONAL),

	Component.group("CUTOFF", [
		Component.number("SMOOTHING", "smoothing", 1, 0, .01),
		Component.number("MAX_DISTANCE", "cutoff", 100, 1, .1),
		Component.number("RADIUS", "radius", 180, 1, .01, undefined, undefined, comp => comp.type !== LightTypes.SPOT),
	], comp => comp.type === LightTypes.DIRECTIONAL),

	Component.group("SHADOWS", [
		Component.boolean("ENABLED", "shadowMap"),
		Component.number("SIZE", "size", undefined, 1, undefined, false, false, comp => !comp.shadowMap || comp.type !== LightTypes.DIRECTIONAL),
		Component.number("FAR", "zFar", undefined, undefined, .001, false, false, checkShadows),
		Component.number("NEAR", "zNear", undefined, undefined, .001, false, false,checkShadows),
		Component.number("BIAS", "shadowBias", undefined, undefined, .00001, false, undefined, checkShadows),
		Component.number("PCF_SAMPLES", "shadowSamples", 10, 1, 1, false, false, checkShadows),
		Component.number("FALLOFF", "shadowAttenuationMinDistance", undefined, 1, .001, false, false, checkShadows),
		Component.boolean("HAS_SSS", "hasSSS")

	]),



]
