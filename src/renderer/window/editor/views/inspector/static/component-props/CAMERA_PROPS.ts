import {boolean, group, number, options} from "./prop-types";

export default  [
	group("PROJECTION", [
		number("FOV", "fov", 150, 10, .01),
		number("FAR", "zFar", undefined,0, .01),
		number("NEAR", "zNear", undefined,0, .01),
		number("ORTHO_SIZE", "size", undefined,0, .01),
		boolean("ORTHO_PROJECTION", "ortho")
	]),

	group("DEPTH_OF_FIELD", [
		boolean("ENABLED", "enabledDOF"),
		group("QUALITY", [
			options("samplesDOF", [{label: "High", value: 150},{label: "Medium", value: 100}, {label: "Low", value: 50}]),
		]),
		number("FOCUS_DISTANCE", "focusDistanceDOF"),
		number("FOCAL_LENGTH", "focalLengthDOF", undefined, .001),
		number("APERTURE", "apertureDOF", 2, 0)
	]),

	group("MOTION_BLUR", [
		boolean("PER_OBJECTS", "motionBlurEnabled"),
		boolean("WORLD", "cameraMotionBlur"),
		number("SCALE", "mbVelocityScale", undefined,.0001),
		number("SAMPLES", "mbSamples", undefined,1, 1)
	]),

	group("ASPECT_RATIO", [
		boolean("DYNAMIC", "dynamicAspectRatio"),
		number("VALUE", "aspectRatio", undefined, undefined, undefined, false, true, "dynamicAspectRatio")
	]),


	group("VIGNETTE", [
		boolean("ENABLED", "vignette"),
		number("STRENGTH", "vignetteStrength", undefined,0, .0001),
	]),

	group("DISTORTION", [
		boolean("ENABLED", "distortion"),
		number("STRENGTH", "distortionStrength", undefined,0, .0001),
	]),

	group("CHROMATIC_ABERRATION", [
		boolean("ENABLED", "chromaticAberration"),
		number("STRENGTH", "chromaticAberrationStrength", undefined,0, .0001),
	]),

	group("FILM_GRAIN", [
		boolean("ENABLED", "filmGrain"),
		number("STRENGTH", "filmGrainStrength", undefined,0, .0001),
	]),

	group("BLOOM", [
		boolean("ENABLED", "bloom"),
		number("THRESHOLD", "bloomThreshold", undefined,0, .0001),
		number("SAMPLES", "bloomQuality", undefined,0,1),
		number("OFFSET", "bloomOffset", undefined,0),
	]),

	group("COLOR_CORRECTION", [
		number("GAMMA", "gamma", 10, .1, .001),
		number("EXPOSURE", "exposure", undefined, 0, .001),
	])
]
