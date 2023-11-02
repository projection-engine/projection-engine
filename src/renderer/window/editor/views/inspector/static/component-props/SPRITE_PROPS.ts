import {boolean, group, imageTexture} from "./prop-types";

export default [
	group("TEXTURE", [
		imageTexture("IMAGE", "imageID"),
	]),
	group("TRANSFORMATION", [
		boolean("ALWAYS_FACE_CAMERA", "alwaysFaceCamera"),
		boolean("KEEP_SAME_SIZE", "keepSameSize"),
	])
]
