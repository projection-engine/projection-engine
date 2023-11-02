import {group, number} from "./prop-types";

export default [
	group("SPECULAR_LIGHT", [
		number("LOD", "mipmaps", 10, 1, 1, false, true, "isDiffuse"),
	]),
	group("CULLING", [
		number("MAX_DISTANCE", "maxDistance",  undefined, 0),
	])
]
