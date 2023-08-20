import {AtmosphereTypes} from "@engine-core/engine.enum";
import {array, group, number, options} from "./prop-types";

export default [
	group("GLOBAL", [
		number("ELAPSED_TIME", "elapsedTime", undefined, 0),
		number("RAYLEIGH_HEIGHT", "rayleighHeight", undefined, 0, 1),
		number("MIE_HEIGHT", "mieHeight", undefined, 0, 1),
		number("SAMPLES", "maxSamples", undefined, 1, 1),
		number("INTENSITY", "intensity", undefined, 1, 1),
		number("THRESHOLD", "threshold", 0, undefined),
	]),
	group("RAYLEIGH_BETA_VALUES", [
		array(["R", "G", "B"], "betaRayleigh", .01, undefined, .01),
	]),
	group("MIE_BETA_VALUES", [
		array(["R", "G", "B"], "betaMie", .01, undefined, .01),
	]),
	group("RADII", [
		number("ATMOSPHERE", "atmosphereRadius", undefined, 0),
		number("PLANET", "planetRadius", undefined, 0),
	]),

	group("SCATTERING_FUNCTION", [
		options("renderingType", [
			{
				label: "MIE",
				value: AtmosphereTypes.MIE
			},
			{
				label: "RAYLEIGH",
				value: AtmosphereTypes.RAYLEIGH
			},
			{
				label: "COMBINED",
				value: AtmosphereTypes.COMBINED
			}
		]),
	])

]
